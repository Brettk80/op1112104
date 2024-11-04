import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { passwordlessSignIn } from '../config/supertokens';

const passwordlessSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type PasswordlessForm = z.infer<typeof passwordlessSchema>;

interface PasswordlessFormProps {
  onSuccess: () => void;
}

const PasswordlessForm: React.FC<PasswordlessFormProps> = ({ onSuccess }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<PasswordlessForm>({
    resolver: zodResolver(passwordlessSchema),
  });

  const onSubmit = async (data: PasswordlessForm) => {
    try {
      await passwordlessSignIn(data.email);
      onSuccess();
    } catch (err) {
      setError('email', {
        type: 'manual',
        message: 'Failed to send login link. Please try again.',
      });
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            {...register('email')}
            type="email"
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send Login Link'}
        </button>
      </div>
    </form>
  );
};

export default PasswordlessForm;