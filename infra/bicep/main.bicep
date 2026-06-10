@description('Environment name')
param environment string = 'dev'

@description('Azure region')
param location string = resourceGroup().location

@description('Container registry name')
param acrName string = 'aiopsportalacr${environment}'

resource acr 'Microsoft.ContainerRegistry/registries@2023-01-01-preview' = {
  name: acrName
  location: location
  sku: { name: 'Basic' }
  properties: { adminUserEnabled: true }
}

resource keyVault 'Microsoft.KeyVault/vaults@2023-02-01' = {
  name: 'aiops-kv-${environment}'
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: { family: 'A', name: 'standard' }
    accessPolicies: []
  }
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: 'aiops${environment}storage'
  location: location
  sku: { name: 'Standard_LRS' }
  kind: 'StorageV2'
}

resource apiContainer 'Microsoft.ContainerInstance/containerGroups@2023-05-01' = {
  name: 'aiops-api-${environment}'
  location: location
  properties: {
    containers: [{
      name: 'api'
      properties: {
        image: '${acr.properties.loginServer}/api:latest'
        ports: [{ port: 3001, protocol: 'TCP' }]
        resources: { requests: { cpu: 1, memoryInGB: 2 } }
        environmentVariables: [
          { name: 'NODE_ENV', value: 'production' }
          { name: 'PORT', value: '3001' }
        ]
      }
    }]
    osType: 'Linux'
    ipAddress: {
      type: 'Public'
      ports: [{ port: 3001, protocol: 'TCP' }]
    }
    imageRegistryCredentials: [{
      server: acr.properties.loginServer
      username: acr.listCredentials().username
      password: acr.listCredentials().passwords[0].value
    }]
  }
}

output acrLoginServer string = acr.properties.loginServer
output apiContainerIp string = apiContainer.properties.ipAddress.ip
