"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { SignInButton, UserButton, ClerkProvider} from "@clerk/nextjs";


export default function Home() {
  const [loading, setLoading] = useState(false);

  const createChat = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chats", {
        method: "POST",
      });
      const data = await res.json();
      console.log("New chat:", data);
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const getChats = async () => {
    try {
      const res = await fetch("/api/chats", {
        method: "GET",
      });
      const data = await res.json();
      console.log("Chats:", data);
    } catch (error) {
      console.error("Error getting chat:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ClerkProvider>
      <UserButton />
      <SignInButton />
      <br />
    <Button 
      variant="secondary" 
      size="sm"
      onClick={createChat}
      disabled={loading}
    >
      {loading ? "Creating..." : "Create New Chat"}
    </Button>

    <Button 
      variant="secondary" 
      size="sm"
      onClick={getChats}
      disabled={loading}
    >
    Get All Chats
    </Button>

    </ClerkProvider>
  );
}



// todo: Clean Up the UI and abstract components. 
// Implement error handling and user feedback mechanisms.
// Clean up the console logs and ensure secure handling of user data.