import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2";
import { getCurrentChatId } from "@/lib/utils";
import type { Chat, GetChatsResponse } from "@/types";

export function useChatSidebar() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chats");
      const data: GetChatsResponse = await response.json();

      if (!response.ok) throw new Error("Failed to fetch chats");

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
    e.stopPropagation();

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

        // Check if the deleted chat is the current one
        const currentChatId = getCurrentChatId(pathname);

        if (currentChatId && String(currentChatId) === String(chatId)) {
          router.push("/");
        } else {
          fetchChats();
        }
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

  return {
    chats,
    isLoading,
    handleChatClick,
    handleDeleteChat,
  };
}
