import { GoogleGenAI } from "@google/genai";
import { authenticateUser } from "@/lib/auth";
import { NextResponse } from "next/server";

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
    const { message, role } = await req.json();
    const ai = new GoogleGenAI({});

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    console.log("AI Response:", response.text);

    const { data, error } = await supabase.from("messages").insert({
      chat_id: id,
      content: response?.text,
      role: role || "bot",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Message added successfully", data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add message" },
      { status: 500 }
    );
  }
}
