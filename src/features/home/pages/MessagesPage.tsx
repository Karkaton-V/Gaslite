import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/shared/lib/supabase/client";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/shared/ui/button";
import { ArrowLeftIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react";

type Message = {
  id: string;
  conversation_id: string;
  sender: string;
  receiver: string;
  content: string;
  image: string | null;
  created_at: string;
};

export default function MessagesPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const partnerName = searchParams.get("with");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error("fetch messages error:", error);
        if (data) setMessages(data);
      });

    if (partnerName) {
      supabase
        .from("profiles")
        .select("id")
        .eq("display_name", partnerName)
        .single()
        .then(({ data, error }) => {
          if (error) console.error("fetch receiver error:", error);
          if (data) setReceiverId(data.id);
        });
    }

    const channel = supabase
      .channel(`messages:${id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${id}`,
        },
        (newInsertion) => {
          setMessages((prev) => [...prev, newInsertion.new as Message]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || !user || !id) return;

    setInput("");
    await supabase.from("messages").insert({
      conversation_id: id,
      sender: user.id,
      receiver: receiverId,
      content: trimmed,
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      <div className="flex h-screen flex-col bg-background text-foreground">
        <div className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeftIcon size={20} />
          </Button>
          <span className="font-semibold">{partnerName}</span>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto p-4 pb-36">
          {messages.length === 0 && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              No messages yet. Say hello!
            </p>
          )}
          {messages.map((msg) => {
            const isMe = msg.sender === user?.id;
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                    isMe
                      ? "rounded-br-sm bg-primary text-primary-foreground"
                      : "rounded-bl-sm bg-muted text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="fixed inset-x-0 bottom-16 border-t border-border bg-background px-4 py-3">
          <div className="mx-auto flex max-w-2xl items-end gap-2">
            <textarea
              className="max-h-32 flex-1 resize-none rounded-xl border border-border bg-muted/40 px-4 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-primary"
              rows={1}
              placeholder="Write a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              type="button"
              onClick={sendMessage}
              disabled={!input.trim()}
              size="icon"
              className="mb-0.5 shrink-0"
            >
              <PaperPlaneTiltIcon size={18} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
