"use client";

import { Button } from "@/components/atoms/Button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../atoms/input";
import { Label } from "../atoms/label";
import Swal from "sweetalert2";

export function CreateChatComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [chatName, setChatName] = useState("");
  const router = useRouter();

  const handleCreateChat = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: chatName }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to create chat");

      Swal.fire({
        title: "Chat Created!",
        text: `Your new chat "${chatName}" has been successfully created.`,
        icon: "success",
        confirmButtonText: "Okay",
      });


      // todo: navigate to the newly created chat when that route is ready
      // router.push(`/chats/${data.id}`);
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="chatName">Chat Name</Label>
        <Input
          id="chatName"
          type="text"
          placeholder="Enter chat name"
          required
          value={chatName}
          onChange={(e) => setChatName(e.target.value)}
        />
      </div>
      <Button onClick={handleCreateChat} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create New Chat"}
      </Button>
    </div>
  );
}
