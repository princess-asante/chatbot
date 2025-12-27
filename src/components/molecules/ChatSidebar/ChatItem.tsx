import { Trash2 } from "lucide-react";
import type { Chat } from "@/types";

interface ChatItemProps {
  chat: Chat;
  onChatClick: (chatId: string) => void;
  onDelete: (chatId: string, chatTitle: string, e: React.MouseEvent) => void;
  formatTime: (updatedAt: string) => string;
}

export function ChatItem({
  chat,
  onChatClick,
  onDelete,
  formatTime,
}: ChatItemProps) {
  return (
    <li>
      <div
        className="group relative w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        onClick={() => onChatClick(chat.id)}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm truncate dark:text-gray-100">
              {chat.chat_title}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {formatTime(chat.updated_at)}
            </div>
          </div>
          <button
            onClick={(e) => onDelete(chat.id, chat.chat_title, e)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-opacity"
            aria-label="Delete chat"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </li>
  );
}
