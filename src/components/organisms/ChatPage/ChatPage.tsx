"use client";

import { ChatSidebar } from "@/components/molecules/ChatSidebar/ChatSidebar";
import type { Chat } from "@/types";
import { Navbar } from "../../molecules/Navbar/Navbar";
import { SendMessageInput } from "@/components/molecules/SendMessageInput/SendMessageInput";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ChatPageProps {
  chat: Chat;
  userEmail: string;
}

export function ChatPage({ chat, userEmail }: ChatPageProps) {
  const router = useRouter();
  const [streamingMessage, setStreamingMessage] = useState(""); // Add this

  const handleSendMessage = async (message: string) => {
    try {
      await fetch(`/api/chats/${chat.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const botResponse = await fetch(`/api/chats/${chat.id}/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, role: "bot" }),
      });

      if (!botResponse.ok) {
        throw new Error("Failed to get bot response");
      }

      // If it's a streaming response, we need to consume it
      if (botResponse.body) {
        const reader = botResponse.body.getReader();
        const decoder = new TextDecoder();

        setStreamingMessage("");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          setStreamingMessage((prev) => prev + chunk);
        }
        setStreamingMessage("");
        router.refresh();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <Navbar userEmail={userEmail} />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar />
        <main className="flex flex-1 flex-col p-6">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <h1 className="text-xl font-bold mb-4">{chat.chat_title}</h1>

            {chat.messages?.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}

            {/* Streaming message */}
            {streamingMessage && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-lg px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <p className="text-sm">{streamingMessage}</p>
                </div>
              </div>
            )}
          </div>
          <SendMessageInput onSend={handleSendMessage} />
        </main>
      </div>
    </div>
  );
}
