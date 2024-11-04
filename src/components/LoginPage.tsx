import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package2, ArrowLeft, LogIn } from 'lucide-react';
import LoginMethods from './LoginMethods';
import PasswordlessForm from './PasswordlessForm';

const loginSchema = z.object({
  identifier: z.string().min(1, 'Required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const twoFactorSchema = z.object({
  code: z.string().length(6, 'Code must be 6 digits'),
});

const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, 'Required'),
});

type LoginForm = z.infer<typeof loginSchema>;
type TwoFactorForm = z.infer<typeof twoFactorSchema>;
type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

interface LoginPageProps {
  onLogin: (userData: { name: string; email: string }) => void;
  mockUser: { name: string; email: string; has2FAEnabled: boolean };
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, mockUser }) => {
  const [loginMethod, setLoginMethod] = useState<'account' | 'passwordless'>('account');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [passwordlessLinkSent, setPasswordlessLinkSent] = useState(false);
  
  const { register: loginRegister, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { register: twoFactorRegister, handleSubmit: handle2FASubmit, formState: { errors: twoFactorErrors } } = useForm<TwoFactorForm>({
    resolver: zodResolver(twoFactorSchema),
  });

  const { register: forgotPasswordRegister, handleSubmit: handleForgotSubmit, formState: { errors: forgotErrors } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onLoginSubmit = (data: LoginForm) => {
    if (mockUser.has2FAEnabled) {
      setShow2FA(true);
    } else {
      onLogin(mockUser);
    }
  };

  const on2FASubmit = (data: TwoFactorForm) => {
    onLogin(mockUser);
  };

  const onForgotPasswordSubmit = (data: ForgotPasswordForm) => {
    alert(`Password reset link sent to ${data.identifier}`);
    setShowForgotPassword(false);
  };

  const handlePasswordlessSuccess = () => {
    setPasswordlessLinkSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Package2 className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {show2FA ? 'Two-Factor Authentication' : 
             showForgotPassword ? 'Reset Password' :
             passwordlessLinkSent ? 'Check Your Email' :
             'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {show2FA ? 'Enter the verification code from your authenticator app' :
             showForgotPassword ? "Enter your account ID and we'll send you a reset link" :
             passwordlessLinkSent ? "We've sent you a secure login link" :
             'Sign in to access your account'}
          </p>
        </div>

        <div className="mt-8 bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          {show2FA ? (
            <form className="space-y-6" onSubmit={handle2FASubmit(on2FASubmit)}>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <div className="mt-1">
                  <input
                    {...twoFactorRegister('code')}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123456"
                  />
                  {twoFactorErrors.code && (
                    <p className="mt-1 text-sm text-red-600">{twoFactorErrors.code.message}</p>
                  )}
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Verify
                </button>
              </div>
            </form>
          ) : showForgotPassword ? (
            <>
              <button
                onClick={() => setShowForgotPassword(false)}
                className="flex items-center text-blue-600 hover:text-blue-500 mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to login
              </button>
              <form className="space-y-6" onSubmit={handleForgotSubmit(onForgotPasswordSubmit)}>
                <div>
                  <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                    Account ID
                  </label>
                  <div className="mt-1">
                    <input
                      {...forgotPasswordRegister('identifier')}
                      type="text"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="123456789"
                    />
                    {forgotErrors.identifier && (
                      <p className="mt-1 text-sm text-red-600">{forgotErrors.identifier.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Send Reset Link
                  </button>
                </div>
              </form>
            </>
          ) : passwordlessLinkSent ? (
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Click the link in your email to sign in. If you don't see it, check your spam folder.
              </p>
              <button
                onClick={() => {
                  setPasswordlessLinkSent(false);
                  setLoginMethod('account');
                }}
                className="text-blue-600 hover:text-blue-500 text-sm font-medium"
              >
                Try another method
              </button>
            </div>
          ) : (
            <>
              <LoginMethods loginMethod={loginMethod} setLoginMethod={setLoginMethod} />

              {loginMethod === 'passwordless' ? (
                <PasswordlessForm onSuccess={handlePasswordlessSuccess} />
              ) : (
                <form className="space-y-6" onSubmit={handleLoginSubmit(onLoginSubmit)}>
                  <div>
                    <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                      Account ID
                    </label>
                    <div className="mt-1">
                      <input
                        {...loginRegister('identifier')}
                        type="text"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="123456789"
                      />
                      {loginErrors.identifier && (
                        <p className="mt-1 text-sm text-red-600">{loginErrors.identifier.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        {...loginRegister('password')}
                        type="password"
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                      {loginErrors.password && (
                        <p className="mt-1 text-sm text-red-600">{loginErrors.password.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="font-medium text-blue-600 hover:text-blue-500"
                      >
                        Forgot your password?
                      </button>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Sign in
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;