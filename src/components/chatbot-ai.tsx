"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Send, MessageCircle, X, Loader2, Settings } from "lucide-react";
import { useCompanyStore } from "@/stores/company-store";
import { askChatbot, ChatTurn } from "@/lib/api/chabot-ai";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// ---- util kecil
const now = () => Date.now();
const nid = () => Math.random().toString(36).slice(2);

export function ChatbotAI() {
  const { currentCompany } = useCompanyStore();
  const companyKey = currentCompany?.uuid ?? "no-company";

  // UI state
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // history per company
  const storageKey = useMemo(() => `chatbot_history::${companyKey}`, [companyKey]);
  const modelKey = "chatbot_model";

  const [history, setHistory] = useState<ChatTurn[]>([]);

  // load persisted
  useEffect(() => {
    try {
      const savedHist = localStorage.getItem(storageKey);
      if (savedHist) setHistory(JSON.parse(savedHist));
    } catch {}
  }, [storageKey]);

  // persist on change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(history));
    } catch {}
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

    // push user turn
    const userTurn: ChatTurn = { id: nid(), role: "user", content: msg, ts: now() };
    setHistory((h) => [...h, userTurn]);

    setLoading(true);
    try {
      const reply = await askChatbot({ message: msg});
      const botTurn: ChatTurn = { id: nid(), role: "assistant", content: reply || "(no reply)", ts: now() };
      setHistory((h) => [...h, botTurn]);
    } catch (e: any) {
      toast.error(e?.message || "Chat failed");
      // rollback input so user can edit
      setInput(msg);
      // add system error bubble (optional)
      setHistory((h) => [
        ...h,
        { id: nid(), role: "assistant", content: "⚠️ Sorry, I couldn’t process that request.", ts: now() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setHistory([]);
    try { localStorage.removeItem(storageKey); } catch {}
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
        {!open ? (
          <Button
            size="lg"
            className="rounded-full shadow-lg h-14 w-14 p-0 bg-gradient-to-br from-orange-500 to-red-500"
            onClick={() => setOpen(true)}
            aria-label="Open Chatbot"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
        ) : null}
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
                {/* Model picker
                <Select value={model} onValueChange={(v) => setModel(v as ChatModel)}>
                  <SelectTrigger className="h-8 w-[150px] rounded-xl text-xs">
                    <SelectValue placeholder="Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                    <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                    <SelectItem value="claude-3-haiku">claude-3-haiku</SelectItem>
                    <SelectItem value="local-dev">local-dev</SelectItem>
                  </SelectContent>
                </Select> */}
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl" onClick={clearChat} title="Clear">
                  <Settings className="h-4 w-4" />
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
                <div key={t.id} className={`flex ${t.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${
                      t.role === "user"
                        ? "bg-gradient-to-br from-orange-500 to-red-500 text-white"
                        : "bg-gray-50 border"
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
