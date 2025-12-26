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
          <div className="flex-1 overflow-y-auto">
            <h1 className="text-xl font-bold">{chat.chat_title}</h1>
            <ul>
              {chat.messages?.map((message) => (
                <li key={message.id}>
                  <strong>{message.role}:</strong> {message.content}
                </li>
              ))}
              {/* Show streaming message */}
              {streamingMessage && (
                <li>
                  <strong>bot:</strong> {streamingMessage}
                </li>
              )}
            </ul>
          </div>
          <SendMessageInput onSend={handleSendMessage} />
        </main>
      </div>
    </div>
  );
}
