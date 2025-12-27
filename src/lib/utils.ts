import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Formats a chat's update timestamp into a human-readable relative time string
 */
export function formatChatTime(updatedAt: string): string {
  const now = new Date();
  const chatDate = new Date(updatedAt);
  const diffMs = now.getTime() - chatDate.getTime();
  const minutesDiff = Math.floor(diffMs / (1000 * 60));
  const hoursDiff = Math.floor(diffMs / (1000 * 60 * 60));

  if (hoursDiff < 24) {
    if (minutesDiff < 1) return "Just now";
    if (minutesDiff < 60) {
      if (minutesDiff === 1) return "1 minute ago";
      return `${minutesDiff} minutes ago`;
    }
    if (hoursDiff === 1) return "1 hour ago";
    return `${hoursDiff} hours ago`;
  }

  return chatDate.toLocaleDateString();
}

/**
 * Extracts the chat ID from the current pathname
 * Example: "/chats/abc-123" => "abc-123"
 */
export function getCurrentChatId(pathname: string | null): string | null {
  if (!pathname) return null;

  const chatId = pathname.split("/chats/")[1]?.split("?")[0];
  return chatId || null;
}
