"use client";

import { ChatSidebar } from "@/components/molecules/ChatSidebar/ChatSidebar";
import type { Chat } from "@/types";
import { Navbar } from "../../molecules/Navbar/Navbar";
import { SendMessageInput } from "@/components/molecules/SendMessageInput/SendMessageInput";

interface ChatPageProps {
  chat: Chat;
  userEmail: string;
}

export function ChatPage({ chat, userEmail }: ChatPageProps) {
  const handleSendMessage = (message: string) => {
    console.log("Message sent:", message);

    const sendMessage = async (message: string) => {
      try {
        const response = await fetch(`/api/chats/${chat.id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        });

        if (!response.ok) {
          throw new Error("Failed to send message");
        }

        const data = await response.json();
        console.log("Message sent successfully:", data);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    };

    sendMessage(message);
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
            </ul>
          </div>
          <SendMessageInput onSend={handleSendMessage} />
        </main>
      </div>
    </div>
  );
}
