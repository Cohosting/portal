// LoginPreview.jsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye } from 'lucide-react';

const LoginPreview = ({
  brandSettings,
  computedColors,
  usePortalBackground = false
}) => {
  const {
    sidebarBgColor,
    backgroundColor: defaultBg,
    loginFormTextColor,
    loginButtonColor,
    loginButtonTextColor,
    accentColor
  } = computedColors;

  const { assets, poweredByCopilot } = brandSettings;
  const fullLogo = assets.fullLogo || '';
  const squareLoginImage = assets.squareLoginImage || '';

  const bgColor = usePortalBackground
    ? sidebarBgColor
    : defaultBg;

  const smallInputCls = 'w-full bg-white text-sm pointer-events-none h-6 py-1';
  const smallPwdCls = 'w-full pr-8 bg-white text-sm pointer-events-none h-6 py-1';

  return (
    <div
      className="flex bg-white relative h-full w-full overflow-hidden rounded-md border border-gray-200   "
      style={{ maxHeight: '500px' }}
    >
      {/* Left: form */}
      <div
        className="flex flex-1 flex-col justify-center p-4"
        style={{ backgroundColor: bgColor }}
      >
        <div className="mx-auto w-full max-w-full" style={{ color: loginFormTextColor }}>
          <img alt="Company Logo" src={fullLogo} className="h-12 w-auto" />
          <h2 className="mt-4 text-lg font-bold leading-tight tracking-tight">
            Sign in to your account
          </h2>

          <form className="mt-4 space-y-4" onSubmit={e => e.preventDefault()}>
            <div className="space-y-1">
              <Label htmlFor="preview-email" className="text-xs font-medium">
                Email address
              </Label>
              <Input
                id="preview-email"
                name="email"
                type="email"
                readOnly
                className={smallInputCls}
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
                  className={smallPwdCls}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <Eye size={16} className="text-gray-500" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Checkbox id="preview-remember-me" checked readOnly />
                <Label htmlFor="preview-remember-me" className="text-xs">
                  Remember me
                </Label>
              </div>
              <a
                href="#"
                className="font-semibold hover:underline"
                style={{ color: accentColor }}
              >
                Forgot password?
              </a>
            </div>

            <Button
              className="w-full text-white text-sm h-8"
              style={{
                backgroundColor: loginButtonColor,
                color: loginButtonTextColor
              }}
            >
              Sign in
            </Button>
          </form>

          {poweredByCopilot && (
            <div className="text-center text-xs opacity-60 mt-6">
              Powered by Copilot
            </div>
          )}
        </div>
      </div>

      {/* Right: image */}
      <div className="relative hidden w-0 flex-1 md:block" style={{ maxWidth: '40%' }}>
        <img
          alt="Login background"
          src={squareLoginImage}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPreview;
