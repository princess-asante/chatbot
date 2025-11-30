export interface Chat {
  id: string;
  chat_title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface User {
  id: string;
  supabase_id: string;
}

export type ApiResponse<T> = 
  | { success: true; data: T }
  | { success: false; error: string; status: number };