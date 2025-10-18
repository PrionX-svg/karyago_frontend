"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Send, MessageCircle, X, Loader2, Trash } from "lucide-react";
import { useCompanyStore } from "@/stores/company-store";
import { useUserStore } from "@/stores/user-store";
import { askChatbot, ChatTurn, ChatRole } from "@/lib/api/chabot-ai";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const now = () => Date.now();
const nid = () => crypto.randomUUID();

export function ChatbotAI() {
  const { currentCompany } = useCompanyStore();
  const { user } = useUserStore();

  // ambil info user
  const userUUID = user?.userUuid || "";
  const userRole = (user?.role?.name?.toLowerCase() as ChatRole) || "employee";

  // key unik per company & user
  const companyKey = currentCompany?.uuid ?? "no-company";
  const storageKey = useMemo(
    () => `chatbot_history::${companyKey}::${userUUID}`,
    [companyKey, userUUID]
  );

  // state
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatTurn[]>([]);

  // load history
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setHistory(JSON.parse(saved));
    } catch { }
  }, [storageKey]);

  // simpan history setiap berubah
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(history));
    } catch { }
  }, [history, storageKey]);

  // autoscroll
  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, open]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");

    const userTurn: ChatTurn = {
      id: nid(),
      role: userRole,
      content: msg,
      ts: now(),
    };
    setHistory((h) => [...h, userTurn]);

    setLoading(true);
    try {
      const reply = await askChatbot({ message: msg });
      const botTurn: ChatTurn = {
        id: nid(),
        role: "assistant",
        content: reply || "(no reply)",
        ts: now(),
      };
      setHistory((h) => [...h, botTurn]);
    } catch (e) {
      const errMsg =
        e instanceof Error
          ? e.message
          : typeof e === "string"
            ? e
            : "Chat failed";

      toast.error(errMsg);
      setInput(msg);
      setHistory((h) => [
        ...h,
        {
          id: nid(),
          role: "assistant",
          content: "⚠️ Sorry, I couldn’t process that request.",
          ts: now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setHistory([]);
    try {
      localStorage.removeItem(storageKey);
    } catch { }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!open && (
          <Button
            size="lg"
            className="rounded-full shadow-lg h-14 w-14 p-0 bg-gradient-to-br from-orange-500 to-red-500"
            onClick={() => setOpen(true)}
            aria-label="Open Chatbot"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        )}
      </div>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[min(88vw,420px)]">
          <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-orange-600" />
                <div className="font-semibold">Chatbot</div>
                <span className="text-xs text-muted-foreground ml-2">
                  {currentCompany?.name ? `• ${currentCompany.name}` : ""}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={clearChat} title="Clear">
                  <Trash className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="max-h-[50vh] overflow-y-auto p-4 space-y-3">
              {history.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-6">
                  Ask anything about company policies, attendance, or HR workflows.
                </div>
              )}
              {history.map((t) => (
                <div key={t.id} className={`flex ${t.role === "assistant" ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${t.role === "assistant"
                      ? "bg-gray-50 border"
                      : "bg-gradient-to-br from-orange-500 to-red-500 text-white"
                      }`}
                  >
                    {t.content}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            {/* Composer */}
            <div className="p-3 border-t bg-white flex items-end gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
                className="min-h-[44px] max-h-[160px] rounded-2xl resize-y"
              />
              <Button
                onClick={send}
                disabled={!input.trim() || loading}
                className="rounded-2xl h-10 px-4 bg-gradient-to-br from-orange-500 to-red-500"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatbotAI;
