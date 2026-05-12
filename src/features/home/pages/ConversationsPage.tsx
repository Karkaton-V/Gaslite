import { useEffect, useState } from "react";
import { ButtonGroup, ButtonGroupSeparator } from "@/shared/ui/button-group";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/shared/ui/BottomNav";
import { supabase } from "@/shared/lib/supabase/client";
import { useAuth } from "@/features/auth/hooks/useAuth";

type Conversation = {
  id: string;
  handle: string;
  displayName: string;
  avatar: string | null;
  lastMessage: string;
};

export default function ConversationsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchConversations() {
      // fetches messages that the current user is a part of
      const { data: msgs, error } = await supabase
        .from("messages")
        .select("conversation_id, sender, receiver, content, created_at")
        .or(`sender.eq.${user!.id},receiver.eq.${user!.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("fetch conversations error:", error);
        setLoading(false);
        return;
      }

      // returns the last message from each unique conversationID
      const seen = new Set<string>();
      const latest = (msgs ?? []).filter((message) => {
        if (seen.has(message.conversation_id)) return false;
        seen.add(message.conversation_id);
        return true;
      });

      // creates a list of partners' IDs for each conversation
      const partnerIds: string[] = [];
      for (const message of latest) {
        const partnerId = message.sender === user!.id ? message.receiver : message.sender;
        if (partnerId) partnerIds.push(partnerId);
      }

      // searches profiles tables where id = partnerIds to fetch their related info
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, handle, display_name, profile_pic")
        .in("id", partnerIds);

      // builds the final conversation list by combining message data with profile data
      const convList: Conversation[] = latest.map((message) => {
        const partnerId = message.sender === user!.id ? message.receiver : message.sender;
        const profile = (profiles ?? []).find((profile) => profile.id === partnerId);

        let avatarUrl: string | null = null;
        if (profile?.profile_pic) {
          const { data: urlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(profile.profile_pic);
          avatarUrl = urlData.publicUrl;
        }

        return {
          id: message.conversation_id,
          handle: profile?.handle ?? "Unknown",
          displayName: profile?.display_name ?? "Unknown",
          avatar: avatarUrl,
          lastMessage: message.content,
        };
      });

      setConversations(convList);
      setLoading(false);
    }

    fetchConversations();
  }, [user]);

  return (
    <>
      <div className="min-h-screen bg-background p-8 text-foreground">
        <div className="mx-auto w-full max-w-2xl">
          <h1 className="text-3xl font-semibold">Messages</h1>

          {loading && (
            <p className="mt-6 text-muted-foreground">Loading...</p>
          )}

          {!loading && conversations.length === 0 && (
            <p className="mt-6 text-muted-foreground">No conversations yet.</p>
          )}

          <ul
            role="list"
            className="m-0 mt-6 grid w-full list-none grid-cols-1 gap-3 p-0 pl-0"
          >
            {conversations.map((conv) => (
              <li key={conv.id} className="min-w-0 list-none pl-0">
                <ButtonGroup
                  orientation="horizontal"
                  className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto min-h-[4.5rem] min-w-0 flex-1 items-center justify-start gap-3 px-4 py-3 text-left text-sm font-normal whitespace-normal hover:bg-muted/60"
                    onClick={() =>
                      navigate(
                        `/conversation/${conv.id}?with=${encodeURIComponent(conv.displayName)}`
                      )
                    }
                  >
                    <Avatar size="default" className="shrink-0">
                      <AvatarImage src={conv.avatar ?? undefined} />
                      <AvatarFallback>
                        {conv.displayName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="w-full text-base font-semibold">
                        {conv.displayName}
                      </span>
                      <span className="line-clamp-2 w-full text-muted-foreground">
                        {conv.lastMessage}
                      </span>
                    </div>
                  </Button>

                  <ButtonGroupSeparator orientation="vertical" />

                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto min-h-[4.5rem] min-w-[5rem] shrink-0 flex-col items-end justify-center gap-2 bg-muted/40 px-4 py-3 font-normal whitespace-normal hover:bg-muted/60"
                  >
                  </Button>
                </ButtonGroup>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <BottomNav />
    </>
  );
}
