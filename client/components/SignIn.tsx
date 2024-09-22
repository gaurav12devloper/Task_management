"use client"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { signInFailure, signInStart, signInSuccess } from '@/lib/redux/user/userSlice';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const dispatch = useDispatch();
  //@ts-ignore
  const { loading, error } = useSelector((state) => state.user);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    try {
      dispatch(signInStart());
      const credentials = { email, password };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign in');
      }

      dispatch(signInSuccess(data));
      toast({
        title: "Success",
        description: "You have successfully signed in.",
      });
      router.push('/');
    } catch (err: any) {
      dispatch(signInFailure(err.message || 'Failed to sign in'));
      toast({
        title: "Error",
        description: err.message || "An unexpected error occurred",
        variant: "destructive",
      });
      console.error('Login error:', err);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <BackgroundBeamsWithCollision className="absolute inset-0">
        <div className="absolute inset-0" />
      </BackgroundBeamsWithCollision>
      <Card className="w-[350px] backdrop-blur-md bg-blue-500/40 shadow-lg shadow-blue-600/5 border border-blue-300/10">
        <CardHeader>
          <CardTitle className="text-white">Sign In</CardTitle>
          <CardDescription className="text-blue-100">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="bg-blue-100 text-blue-900"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="bg-blue-100 text-blue-900"
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>
            <Button className="w-full mt-6 bg-blue-700 text-white hover:bg-blue-800" type="submit" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-blue-200">
            Don't have an account?{" "}
            <a
              className="text-blue-300 hover:underline cursor-pointer"
              onClick={() => router.push('/sign-up')}
            >
              Sign up
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
