import { useState } from "react";
import { useRouter } from "next/navigation";

export function useChatMessage(chatId: string) {
  const router = useRouter();
  const [streamingMessage, setStreamingMessage] = useState("");

  const handleSendMessage = async (message: string) => {
    try {
      await fetch(`/api/chats/${chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const botResponse = await fetch(`/api/chats/${chatId}/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, role: "bot" }),
      });

      if (!botResponse.ok) {
        throw new Error("Failed to get bot response");
      }

      // If it's a streaming response, we need to consume it
      if (botResponse.body) {
        const reader = botResponse.body.getReader();
        const decoder = new TextDecoder();

        setStreamingMessage("");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          setStreamingMessage((prev) => prev + chunk);
        }
        setStreamingMessage("");
        router.refresh();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return {
    streamingMessage,
    handleSendMessage,
  };
}
