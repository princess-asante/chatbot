// src/app/page.tsx
import { AuthButton } from "@/components/atoms/auth-button";
import { ThemeSwitcher } from "@/components/atoms/theme-switcher";
import { CreateChatComponent } from "@/components/molecules/create-chat-component";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  // If no auth token/session → redirect to login
  if (!user) {
    redirect("/auth/login");
  }

  // If user exists → show dashboard
  return (
    <div className="flex h-screen w-full flex-col">
      <nav className="flex items-center justify-between border-b border-border px-6 py-4">
        <h1 className="text-xl font-bold">Chat App</h1>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <AuthButton />
        </div>
      </nav>

      <main className="flex flex-1 flex-col items-center justify-center gap-6">
        <h2 className="text-3xl font-bold">Welcome!</h2>
        <p className="text-muted-foreground">You are logged in.</p>
        <CreateChatComponent chatName="New Chat" />
      </main>
    </div>
  );
}