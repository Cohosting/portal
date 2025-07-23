import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsAuthenticated } from "../../store/slices/authSlice";
import { handleSupabaseError } from "../../utils/firebase";
import { supabase } from "../../lib/supabase";
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
import { Eye, EyeOff } from "lucide-react";

export function LoginForm({ className, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

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
      setError("Email and password are required.");
      return;
    }
  
    if (!navigator.onLine) {
      setError("You appear to be offline. Please check your internet connection.");
      return;
    }
  
    setIsLoading(true);
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.signInWithPassword({ email, password });
  
      if (error) {
        throw error;
      }
  
      dispatch(setIsAuthenticated(true));
      navigate("/");
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
            <CardDescription>Welcome back to our service</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailPasswordLogin}>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  {/* Email Field */}
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

                  {/* Password Field with Visibility Toggle */}
                  <div className="grid gap-0">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Button
                        onClick={() => navigate("/forgot-password")}
                        className="ml-auto text-sm text-primary underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={userCredentials.password}
                        onChange={handleChange}
                        required
                        className="bg-white pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-0 h-8 w-8"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-500" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-500" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && <div className="text-sm text-red-600">{error}</div>}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-black text-white hover:bg-gray-800"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Log in"}
                  </Button>
                </div>

                {/* Redirect to Signup */}
                <div className="text-center text-sm">
                  New to HueHQ?{" "}
                  <a
                    href="#"
                    className="text-primary underline underline-offset-4 hover:text-gray-800"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/signup");
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
          By logging in, you agree to our <a href="#">Terms of Service</a> and{" "}
          <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </Layout>
  );
}
