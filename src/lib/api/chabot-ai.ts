// export type ChatModel = "gpt-4o-mini" | "gpt-4o" | "claude-3-haiku" | "local-dev";
export type ChatRole = "owner" | "admin" | "employee" | "assistant";

export interface ChatTurn {
  id: string;
  role: ChatRole;
  content: string;
  ts: number;
}

export async function askChatbot({
  message,
}: {
  message: string;
}) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_URL}/api/v1/chatbot/ask`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const json = await res.json();
  if (!res.ok || json?.status === "error") {
    throw new Error(json?.message || "Failed to ask chatbot");
  }
  // backend reply shape: { reply: string } di field data
  const reply: string = json?.data?.reply ?? json?.reply ?? "";
  return reply;
}
