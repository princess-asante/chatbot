"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { CreateChatInput } from "./CreateChatInput";

interface Chat {
  id: string;
  chat_title: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export function ChatSidebar() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chats");
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch chats");

      setChats(data.chats || []);
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChatClick = (chatId: string) => {
    router.push(`/chats/${chatId}`);
  };

  const handleDeleteChat = async (
    chatId: string,
    chatTitle: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Prevent navigation when clicking delete

    const result = await Swal.fire({
      title: "Delete Chat?",
      text: `Are you sure you want to delete "${chatTitle}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`/api/chats/${chatId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Failed to delete chat");
        }

        Swal.fire({
          title: "Deleted!",
          text: "Your chat has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // Refresh the sidebar
        fetchChats();
      } catch (error) {
        console.error("Error deleting chat:", error);
        Swal.fire({
          title: "Error",
          text: "Failed to delete chat. Please try again.",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    }
  };

  const formatChatTime = (updatedAt: string) => {
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
  };

  return (
    <div className="relative">
      <div
        className={`${
          isCollapsed ? "w-0" : "w-64"
        } h-screen sticky top-0 bg-gray-100 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 overflow-hidden transition-all duration-300`}
      >
        <div
          className={`${
            isCollapsed ? "hidden" : "block"
          } p-4 h-full overflow-y-auto`}
        >
          {isLoading ? (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Loading chats...
            </div>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">
                Your Chats
              </h2>
              {chats.length === 0 ? (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No chats yet. Create one to get started!
                  </p>
                  <CreateChatInput />
                </div>
              ) : (
                <ul className="space-y-2">
                  {chats.map((chat) => (
                    <li key={chat.id}>
                      <div
                        className="group relative w-full text-left px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        onClick={() => handleChatClick(chat.id)}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate dark:text-gray-100">
                              {chat.chat_title}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {formatChatTime(chat.updated_at)}
                            </div>
                          </div>
                          <button
                            onClick={(e) =>
                              handleDeleteChat(chat.id, chat.chat_title, e)
                            }
                            className="opacity-0 group-hover:opacity-100 p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-opacity"
                            aria-label="Delete chat"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-4 -right-3 z-10 p-1.5 rounded-full bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors shadow-md"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  );
}
