import React from 'react';
import { User, LogIn } from 'lucide-react';

interface LoginMethodsProps {
  loginMethod: 'account' | 'passwordless';
  setLoginMethod: (method: 'account' | 'passwordless') => void;
}

const LoginMethods: React.FC<LoginMethodsProps> = ({ loginMethod, setLoginMethod }) => {
  return (
    <div className="flex justify-center space-x-4 mb-8">
      <button
        onClick={() => setLoginMethod('account')}
        className={`flex items-center px-4 py-2 rounded-md ${
          loginMethod === 'account'
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <User className="h-5 w-5 mr-2" />
        Account ID
      </button>
      <button
        onClick={() => setLoginMethod('passwordless')}
        className={`flex items-center px-4 py-2 rounded-md ${
          loginMethod === 'passwordless'
            ? 'bg-blue-50 text-blue-700'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <LogIn className="h-5 w-5 mr-2" />
        Passwordless
      </button>
    </div>
  );
};

export default LoginMethods;