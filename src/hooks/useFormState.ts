'use client';

import { useState } from "react";

/**
 * Custom hook for managing form state including loading, error, and submission handling.
 * Provides a consistent pattern for handling async form submissions across the application.
 *
 * @example
 * ```tsx
 * const { isLoading, error, setError, handleSubmit } = useFormState();
 *
 * const onSubmit = async (e: React.FormEvent) => {
 *   e.preventDefault();
 *   await handleSubmit(async () => {
 *     // Your async logic here
 *     const result = await api.call();
 *     if (result.error) throw new Error(result.error);
 *   });
 * };
 * ```
 *
 * @returns Object containing:
 * - isLoading: Boolean indicating if the form is currently submitting
 * - error: String containing error message if submission failed, null otherwise
 * - setError: Function to manually set error state (useful for validation)
 * - handleSubmit: Function that wraps async submission logic with error/loading handling
 */
export function useFormState() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Wraps form submission logic with automatic loading and error state management
   * @param callback - Async function containing the form submission logic
   */
  const handleSubmit = async (callback: () => Promise<void>) => {
    setIsLoading(true);
    setError(null);
    try {
      await callback();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, setError, handleSubmit };
}