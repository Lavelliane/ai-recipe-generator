'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@heroui/react';
import { signUpNewUser } from '../_actions/auth';
import supabase from '@/lib/supabase/client';
import { checkUserPreferencesExist } from '@/actions/preferences/check-existing';

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    form: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      form: ''
    };

    if (!formState.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!formState.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      newErrors.email = 'Email is invalid';
      valid = false;
    }

    if (!formState.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formState.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      valid = false;
    }

    if (formState.password !== formState.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await signUpNewUser({
        email: formState.email,
        password: formState.password,
        name: formState.name
      });
      
      if (response.error) {
        setErrors(prev => ({
          ...prev,
          form: response.error
        }));
      } else {
        router.push('/onboarding');
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        form: 'Sign-up failed. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.form}</p>
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <div className="mt-1">
          <Input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={formState.name}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg border ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formState.email}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={formState.password}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <div className="mt-1">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={formState.confirmPassword}
            onChange={handleChange}
            className={`w-full p-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white ${isLoading ? 'bg-orange-300' : 'bg-primary hover:bg-orange-500'}`}
        >
          {isLoading ? 'Signing up...' : 'Sign up'}
        </button>
      </div>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link href="/sign-in" className="font-medium text-primary hover:text-orange-500">
          Sign in
        </Link>
      </div>
    </form>
  );
}
