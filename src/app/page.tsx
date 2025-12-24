import { ChatSidebar } from "@/components/molecules/ChatSidebar/ChatSidebar";
import { CreateChatInput } from "@/components/molecules/CreateChatInput/CreateChatInput";
import { Navbar } from "@/components/molecules/Navbar/Navbar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <Navbar userEmail={user.email!} />
      <div className="flex flex-1 overflow-hidden">
        <ChatSidebar />
        <main className="flex flex-1 flex-col items-center justify-center gap-6">
          <h2 className="text-3xl font-bold">Welcome!</h2>
          <p className="text-muted-foreground">You are logged in.</p>
          <CreateChatInput />
        </main>
      </div>
    </div>
  );
}
