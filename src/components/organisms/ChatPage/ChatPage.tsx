"use client";

import { ChatSidebar } from "@/components/molecules/ChatSidebar/ChatSidebar";
import type { Chat } from "@/types";
import { Navbar } from "../../molecules/Navbar/Navbar";
import { SendMessageInput } from "@/components/molecules/SendMessageInput/SendMessageInput";
import { useRouter } from "next/navigation";

interface ChatPageProps {
  chat: Chat;
  userEmail: string;
}

export function ChatPage({ chat, userEmail }: ChatPageProps) {
  const router = useRouter();

  const handleSendMessage = async (message: string) => {
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

      router.refresh();
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
            </ul>
          </div>
          <SendMessageInput onSend={handleSendMessage} />
        </main>
      </div>
    </div>
  );
}
