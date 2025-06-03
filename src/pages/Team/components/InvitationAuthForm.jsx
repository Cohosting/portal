import { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

const InvitationAuthForm = ({
  invitationData,
  isExistingUser,
  email,
  password,
  onPasswordChange,
  onSubmit,
  onBack,
  isProcessing,
  children,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Email Field (disabled) */}
      <div>
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <div className="mt-1">
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            disabled
            className="w-full"
          />
        </div>
      </div>

      {/* Password Field with Visibility Toggle */}
      <div>
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Password
        </Label>
        <div className="relative mt-1">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={onPasswordChange}
            required
            className="w-full pr-10"
          />
          <Button
            type="button"
            variant="ghost"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0 h-8 w-8"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
          </Button>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <Button
          type="submit"
          disabled={isProcessing}
          className="w-full bg-black text-white hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          {isProcessing ? (
            <>
                <Loader className="animate-spin" size={20} />
              Processing...
            </>
          ) : (
            isExistingUser ? "Log In" : "Sign Up"
          )}
        </Button>
      </div>

      {children}

      {/* Back Button */}
      <div>
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="w-full flex items-center justify-center border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          <ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />
          Back
        </Button>
      </div>
    </form>
  );
};

export default InvitationAuthForm;
