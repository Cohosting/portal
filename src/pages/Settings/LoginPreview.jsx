import React from 'react';
import { darken } from 'polished';
// Import shadcn components
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
// Import icons for password visibility toggle
import { Eye } from 'lucide-react';

const LoginPreview = ({ brandSettings }) => {
  // Destructure and set default values for brand settings
  const {
    fullLogo = "https://fakeimg.pl/800x400",
    squareLoginImage = "https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1908&q=80",
    sidebarBgColor = "#ffffff", 
    sidebarTextColor = 'rgb(79, 70, 229)',
    accentColor = 'rgb(79, 70, 229)',
    textColor = '#000000',
    loginFormTextColor = '#000000',
    loginButtonColor = '#000000',
    loginButtonTextColor = '#ffffff',
  } = brandSettings || {};

  // Apply color processing as in the original component
  const processedSidebarTextColor = darken(0.4, sidebarTextColor);

  // Custom styles for smaller inputs
  const smallInputClass = "w-full bg-white text-sm pointer-events-none h-6 py-1";
  const smallPasswordInputClass = "w-full pr-8 bg-white text-sm pointer-events-none h-6 py-1";

  return (
    <div className="flex bg-white relative top-[-150px] right-[-60px] h-full w-full overflow-hidden rounded-md border border-gray-500" style={{ maxHeight: '500px' }}>
      {/* Left side - Login form */}
      <div className="flex flex-1 flex-col justify-center p-4" style={{ backgroundColor: sidebarBgColor }}>
        <div className="mx-auto w-full max-w-full" style={{ color: loginFormTextColor }}>
          <div>
            <img
              alt="Company Logo"
              src={fullLogo}
              className="h-12 w-auto"
            />
            <h2 className="mt-4 text-lg font-bold leading-tight tracking-tight">
              Sign in to your account
            </h2>
          </div>
          <div className="mt-4">
            <form className="space-y-4" onClick={(e) => e.preventDefault()}>
              <div className="space-y-1">
                <Label htmlFor="preview-email" className="text-xs font-medium">
                  Email address
                </Label>
                <Input
                  id="preview-email"
                  name="email"
                  type="email"
                   readOnly
                  className={smallInputClass}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="preview-password" className="text-xs font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="preview-password"
                    name="password"
                    type="password"
                     readOnly
                    className={smallPasswordInputClass}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <Eye size={16} className="text-gray-500" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Checkbox id="preview-remember-me" checked />
                  <Label
                    htmlFor="preview-remember-me"
                    className="text-xs"
   
                   >
                    Remember me
                  </Label>
                </div>
                <div>
                  <a href="#" className="font-semibold hover:underline">
                    Forgot password?
                  </a>
                </div>
              </div>
              <Button
                className="w-full text-white text-sm h-8"
                style={{ backgroundColor: `${loginButtonColor}`, color: loginButtonTextColor }}
              >
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="relative hidden w-0 flex-1 md:block" style={{ maxWidth: '40%' }}>
      </div>
    </div>
  );
};

export default LoginPreview;