import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../../hooks/useSignup";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function SignupForm({ className, ...props }) {
  const navigate = useNavigate();
  const { handleChange, signup, email, password, error, isLoading } =
    useSignup();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    signup();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create a new account</CardTitle>
          <CardDescription>
            Sign up to get started with our service
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                {/* Email Field */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="m@example.com"
                    required
                    className="bg-white"
                  />
                </div>

                {/* Password Field with Visibility Toggle */}
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
 
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handleChange}
                      required
                      className="bg-white pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0 h-8 w-8"
                      aria-label={showPassword ? "Hide password" : "Show password"}
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
                  {isLoading ? "Loading..." : "Sign up"}
                </Button>
              </div>

              {/* Redirect to Login */}
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a
                   className="text-primary cursor-pointer underline underline-offset-4 hover:text-gray-800"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/login");
                  }}
                >
                  Log in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground max-w-xs mx-auto [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-gray-800">
        By signing up, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}

export default SignupForm;
