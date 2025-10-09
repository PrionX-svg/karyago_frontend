// export type ChatModel = "gpt-4o-mini" | "gpt-4o" | "claude-3-haiku" | "local-dev";
export type ChatRole = "user" | "assistant";

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
  const res = await fetch("http://127.0.0.1:8080/api/v1/chatbot/ask", {
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
