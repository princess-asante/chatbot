import { GoogleGenAI } from "@google/genai";
import { authenticateUser } from "@/lib/auth";
import type { Message } from "@/types";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authenticateUser();

  if ("error" in auth) {
    return new Response(JSON.stringify({ error: auth.error }), {
      status: auth.status,
    });
  }

  const { supabase } = auth;
  const { id } = await params;

  try {
    const { data: chatHistory } = await supabase
      .from("chats")
      .select(`*, messages:messages (*)`)
      .eq("id", id);

    const formattedHistory = chatHistory[0].messages.map((msg: Message) => ({
      role: msg.role === "bot" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const { message } = await req.json();
    const ai = new GoogleGenAI({});

    const chat = ai.chats.create({
      model: "gemini-2.5-flash-lite",
      history: formattedHistory,
    });

    const aiStream = await chat.sendMessageStream({
      message: message,
    });

    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of aiStream) {
            fullResponse += chunk.text;
            controller.enqueue(encoder.encode(chunk.text));
          }

          await supabase.from("messages").insert({
            chat_id: id,
            content: fullResponse,
            role: "bot",
          });

          controller.close();
        } catch (error) {
          return new Response(JSON.stringify({ error: "Failed to stream" }), {
            status: 500,
          });
        }
      },
    });

    return new Response(stream);
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to stream" }), {
      status: 500,
    });
  }
}
