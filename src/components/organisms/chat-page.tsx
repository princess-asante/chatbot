import { AuthButton } from "@/components/atoms/auth-button";
import { ThemeSwitcher } from "@/components/atoms/theme-switcher";
import { ChatSideBar } from "@/components/molecules/chat-side-bar";

interface ChatPageProps {
  chatId: string;
}

export function ChatPage({ chatId }: ChatPageProps) {


  return (
    <div className="flex h-screen w-full flex-col">
      <nav className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-xl font-bold">Chat App</h1>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <AuthButton />
        </div>
      </nav>
      <div className="flex flex-1 overflow-hidden">
        <ChatSideBar />
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
