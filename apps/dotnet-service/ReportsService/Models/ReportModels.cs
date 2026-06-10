namespace ReportsService.Models;

public record ProjectStatusReport(
    string ProjectId,
    string ProjectName,
    string ClientName,
    string Status,
    decimal BudgetUtilization,
    int TotalTasks,
    int CompletedTasks,
    int OverdueTasks,
    DateTime GeneratedAt
);

public record GenerateReportRequest(
    string ProjectId,
    string ReportType,
    string? RequestedBy
);

public record SprintSummary(
    string ProjectId,
    int SprintNumber,
    int Velocity,
    int CompletedPoints,
    int CarryOverPoints,
    List<string> CompletedStories,
    DateTime StartDate,
    DateTime EndDate
);
