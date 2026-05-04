import { ButtonGroup, ButtonGroupSeparator } from "@/shared/ui/button-group";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { useNavigate } from "react-router-dom";
import BottomNav from "@/shared/ui/BottomNav";

type Conversation = {
  id: number;
  user1: string;
  user2: string;
  avatarPicture: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount: number;
};

const dummyConversations: Conversation[] = [
  {
    id: 1,
    user1: "alyx",
    user2: "you",
    avatarPicture: "/druski.png",
    lastMessage: "Did you finish the UI for our profile page?",
    updatedAt: "2m ago",
    unreadCount: 2,
  },
  {
    id: 2,
    user1: "karkaton",
    user2: "you",
    avatarPicture: "/default-avatar.png",
    lastMessage: "Let me know when you push your branch.",
    updatedAt: "15m ago",
    unreadCount: 0,
  },
  {
    id: 3,
    user1: "Followed User",
    user2: "you",
    avatarPicture: "/default-avatar.png",
    lastMessage: "This demake is looking awesome so far.",
    updatedAt: "1h ago",
    unreadCount: 1,
  },
  {
    id: 4,
    user1: "Dev Team",
    user2: "you",
    avatarPicture: "/default-avatar.png",
    lastMessage:
      "Next, gotta link this page to the DB. But I also wanna see what happens if you just have a really long message...",
    updatedAt: "Yesterday",
    unreadCount: 0,
  },
];

export default function MessagesPage() {
  return (
    <>
      <div className="min-h-screen bg-background p-8 text-foreground">
        <div className="mx-auto w-full max-w-2xl">
          <h1 className="text-3xl font-semibold">Messages</h1>

          <ul className="mt-6 grid gap-3">
            {dummyConversations.map((conversation) => (
              <li key={conversation.id}>
                <ButtonGroup className="w-full rounded-xl border bg-card shadow-sm">
                  <Button
                    variant="outline"
                    className="flex flex-1 items-center gap-3 px-4 py-3 text-left"
                  >
                    <Avatar>
                      <AvatarImage
                        src={
                          conversation.avatarPicture.startsWith("/")
                            ? conversation.avatarPicture
                            : "/default-avatar.png"
                        }
                        onError={(e) =>
                          (e.currentTarget.src = "/default-avatar.png")
                        }
                      />
                      <AvatarFallback>
                        {conversation.user1[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-base">
                        {conversation.user1}
                      </span>
                      <span className="text-muted-foreground line-clamp-2">
                        {conversation.lastMessage}
                      </span>
                    </div>
                  </Button>

                  <ButtonGroupSeparator orientation="vertical" />

                  <Button
                    variant="outline"
                    className="min-w-[5rem] flex flex-col items-end justify-center gap-2 bg-muted/40 px-4 py-3"
                  >
                    <span className="text-xs text-muted-foreground">
                      {conversation.updatedAt}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                        {conversation.unreadCount}
                      </span>
                    )}
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
