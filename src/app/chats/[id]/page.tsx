import { ChatPage } from "@/components/organisms/ChatPage/ChatPage";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { PageProps } from "@/types";

export default async function Page({ params }: PageProps<{ id: string }>) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    redirect("/auth/login");
  }

  const { id } = await params;

  return <ChatPage chatId={id} />;
}
