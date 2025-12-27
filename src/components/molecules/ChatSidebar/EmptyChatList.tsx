import { CreateChatInput } from "../CreateChatInput/CreateChatInput";

export function EmptyChatList() {
  return (
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        No chats yet. Create one to get started!
      </p>
      <CreateChatInput />
    </div>
  );
}
