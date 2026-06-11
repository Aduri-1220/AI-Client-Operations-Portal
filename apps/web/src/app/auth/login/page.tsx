'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Bot } from 'lucide-react';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    await new Promise(r => setTimeout(r, 800));
    localStorage.setItem('token', 'mock-jwt-token');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Bot className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AI Ops Portal</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Email address" id="email" type="email" placeholder="admin@company.com" {...register('email')} error={errors.email?.message} />
          <Input label="Password" id="password" type="password" placeholder="••••••••" {...register('password')} error={errors.password?.message} />

          <Button type="submit" loading={isSubmitting} className="w-full mt-2">
            Sign In
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl text-xs text-blue-700">
          <p className="font-semibold mb-1">Demo credentials</p>
          <p>Email: admin@company.com</p>
          <p>Password: any password</p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Secured with Azure AD B2C · JWT Authentication
        </p>
      </div>
    </div>
  );
}
