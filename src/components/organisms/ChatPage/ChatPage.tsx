import { AuthButton } from "@/components/atoms/auth-button";
import { ThemeSwitcher } from "@/components/atoms/theme-switcher";
import { ChatSidebar } from "@/components/molecules/ChatSidebar/ChatSidebar";
import type { ChatPageProps } from "@/types";
import Link from "next/link";
import { Navbar } from "../../molecules/Navbar/Navbar";

export function ChatPage({ chatId }: ChatPageProps) {

  

  return (
    <div className="flex h-screen w-full flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar />
        <main className="flex flex-1 flex-col p-6">
          <div className="flex-1 overflow-y-auto">
            <p className="text-muted-foreground">Chat ID: {chatId}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Chat interface coming soon...
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
