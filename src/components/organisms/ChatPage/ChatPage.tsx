"use client";

import { ChatSidebar } from "@/components/molecules/ChatSidebar/ChatSidebar";
import type { Chat } from "@/types";
import { Navbar } from "../../molecules/Navbar/Navbar";
import { SendMessageInput } from "@/components/molecules/SendMessageInput/SendMessageInput";
import { MessageBubble } from "@/components/molecules/MessageBubble/MessageBubble";
import { useChatMessage } from "./useChatMessage";

interface ChatPageProps {
  chat: Chat;
  userEmail: string;
}

export function ChatPage({ chat, userEmail }: ChatPageProps) {
  const { streamingMessage, handleSendMessage } = useChatMessage(chat.id);

  return (
    <div className="flex h-screen w-full flex-col">
      <Navbar userEmail={userEmail} />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar />
        <main className="flex flex-1 flex-col p-6">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <h1 className="text-xl font-bold mb-4">{chat.chat_title}</h1>

            {chat.messages?.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                role={message.role}
              />
            ))}

            {/* Streaming message */}
            {streamingMessage && (
              <MessageBubble
                content={streamingMessage}
                role="bot"
                isStreaming
              />
            )}
          </div>
          <SendMessageInput onSend={handleSendMessage} />
        </main>
      </div>
    </div>
  );
}
