
import { cn } from "@/lib/utils";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated } from '../../store/slices/authSlice';
import { handleSupabaseError } from '../../utils/firebase';
import { supabase } from '../../lib/supabase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Layout } from "./Layout";

export function LoginForm({
  className,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [userCredentials, setUserCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handles input change and updates state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserCredentials({ ...userCredentials, [name]: value });
  };

  // Handles the login process
  const handleEmailPasswordLogin = async (e) => {
    e.preventDefault();
    const { email, password } = userCredentials;
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }

    setIsLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      dispatch(setIsAuthenticated(true))
      navigate('/'); // Redirect to home page
    } catch (error) {
      handleSupabaseError(error, setError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>

    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Sign in to your account</CardTitle>
          <CardDescription>
            Welcome back to our service
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailPasswordLogin}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={userCredentials.email}
                    onChange={handleChange}
                    placeholder="m@example.com"
                    required
                    className="bg-white"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm text-primary underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    value={userCredentials.password}
                    onChange={handleChange}
                    required
                    className="bg-white"
                  />
                </div>
                {error && (
                  <div className="text-sm text-red-600">
                    {error}
                  </div>
                )}
                <Button 
                  type="submit" 
                  className="w-full bg-black text-white hover:bg-gray-800"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Log in'}
                </Button>
              </div>
              <div className="text-center text-sm">
                New to copilot?{" "}
                <a 
                  href="#" 
                  className="text-primary underline underline-offset-4 hover:text-gray-800"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/signup');
                  }}
                >
                  Sign up
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground max-w-xs mx-auto [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-gray-800">
        By logging in, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
    </Layout>

  );
}

 