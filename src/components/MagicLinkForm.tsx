import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const magicLinkSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type MagicLinkForm = z.infer<typeof magicLinkSchema>;

interface MagicLinkFormProps {
  onSubmit: (data: MagicLinkForm) => void;
}

const MagicLinkForm: React.FC<MagicLinkFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<MagicLinkForm>({
    resolver: zodResolver(magicLinkSchema),
  });

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
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Send Magic Link
        </button>
      </div>
    </form>
  );
};

export default MagicLinkForm;