/**
 * Core type definitions for the chatbot application.
 * This file serves as the single source of truth for all shared types.
 */

// ============================================================================
// Database Models
// ============================================================================

/**
 * Represents a chat conversation in the database, including its messages
 */
export interface Chat {
  id: string;
  chat_title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  messages?: Message[]; // Added messages as an optional property
}

export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'bot';
  content: string;
  created_at: string;
}

/**
 * Represents a user in the application database
 */
export interface User {
  id: string;
  supabase_id: string;
  email?: string;
  created_at?: string;
}

/**
 * Represents the authenticated user from Supabase Auth
 */
export interface AuthUser {
  id: string;
  email?: string;
  created_at?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Generic API response wrapper for successful responses
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * Generic API response wrapper for error responses
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  status: number;
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Standard error response from API routes
 */
export interface ErrorResponse {
  error: string;
}

/**
 * Response from GET /api/chats
 */
export interface GetChatsResponse {
  chats: Chat[];
}

/**
 * Response from POST /api/chats
 */
export type CreateChatResponse = Chat;

/**
 * Response from DELETE /api/chats/[id]
 */
export interface DeleteChatResponse {
  message: string;
}

// ============================================================================
// Request Body Types
// ============================================================================

/**
 * Request body for creating a new chat
 */
export interface CreateChatRequest {
  name?: string;
}

/**
 * Request body for updating a chat
 */
export interface UpdateChatRequest {
  chat_title?: string;
}

// ============================================================================
// Authentication Types
// ============================================================================

/**
 * Successful authentication result
 */
export interface AuthSuccess {
  supabase: any; // TODO: Type this properly with SupabaseClient
  user: User;
  authUser: AuthUser;
}

/**
 * Failed authentication result
 */
export interface AuthError {
  error: string;
  status: number;
}

/**
 * Union type for authentication results
 */
export type AuthResult = AuthSuccess | AuthError;

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Props for the ChatPage component
 */
export interface ChatPageProps {
  chat: Chat;
  userEmail: string;
}

/**
 * Props for Next.js page components with dynamic routes
 */
export interface PageProps<T = Record<string, string>> {
  params: Promise<T>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if an auth result is an error
 */
export function isAuthError(result: AuthResult): result is AuthError {
  return 'error' in result;
}

/**
 * Type guard to check if an API response is an error
 */
export function isApiError<T>(response: ApiResponse<T>): response is ApiErrorResponse {
  return !response.success;
}