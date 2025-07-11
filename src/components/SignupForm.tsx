'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { saveAuthToLocalStorage, signupUser } from '@/api/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

type Inputs = {
  name: string;
  email: string;
  password: string;
};

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { register, handleSubmit } = useForm<Inputs>();
  const router = useRouter();
  const { login } = useAuth();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const result = await signupUser(data);
      const userData = {
        _id: result.user._id,
        email: result.user.email
      };
      saveAuthToLocalStorage(userData, result.token);
      login(userData, result.token);
      router.push('/');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message || error.message || 'Signup failed';
      alert(errorMsg);
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Signup to your account</CardTitle>
          <CardDescription>
            Enter your email below to signup to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="name"
                  placeholder="Jon Doe"
                  required
                  {...register('name')}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register('email')}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register('password')}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full cursor-pointer">
                  Signup
                </Button>
                <Button variant="outline" className="w-full" disabled={true}>
                  Signup with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account{' '}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
