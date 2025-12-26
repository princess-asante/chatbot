import { ChatPage } from "@/components/organisms/ChatPage/ChatPage";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { PageProps, Chat } from "@/types";

export default async function Page({ params }: PageProps<{ id: string }>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    redirect("/auth/login");
  }

  const { id } = await params;

  // todo: convert this to use the API.
  // todo: work on the AI chatpt response handling
  const { data: chatData, error } = await supabase
    .from("chats")
    .select(
      `
      *,
      messages:messages (*)
    `
    )
    .eq("id", id);

  if (!chatData || chatData.length === 0) {
    console.error("No chat data found or messages are empty.");
  }

  if (error || !chatData) {
    redirect("/");
  }

  return (
    <ChatPage chat={chatData[0] as unknown as Chat} userEmail={user.email!} />
  );
}
