"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ChatItem } from "./ChatItem";
import { EmptyChatList } from "./EmptyChatList";
import { useChatSidebar } from "./useChatSidebar";
import { formatChatTime } from "@/lib/utils";

export function ChatSidebar() {
  const { chats, isLoading, handleChatClick, handleDeleteChat } =
    useChatSidebar();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
              <h2 className="text-lg font-semibold mb-2 px-3 dark:text-gray-100">
                Your Chats
              </h2>
              {chats.length === 0 ? (
                <EmptyChatList />
              ) : (
                <ul className="space-y-2">
                  {chats.map((chat) => (
                    <ChatItem
                      key={chat.id}
                      chat={chat}
                      onChatClick={handleChatClick}
                      onDelete={handleDeleteChat}
                      formatTime={formatChatTime}
                    />
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
