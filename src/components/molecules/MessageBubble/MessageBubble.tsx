import ReactMarkdown from "react-markdown";
import type { Message } from "@/types";

interface MessageBubbleProps {
  message?: Message;
  content?: string;
  role: "user" | "bot";
  isStreaming?: boolean;
}

export function MessageBubble({
  message,
  content,
  role,
  isStreaming = false,
}: MessageBubbleProps) {
  const displayContent = message?.content || content || "";
  const isUser = role === "user";

  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        }`}
      >
        <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown>{displayContent}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
