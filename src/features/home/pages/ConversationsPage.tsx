import { ButtonGroup, ButtonGroupSeparator } from "@/shared/ui/button-group";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { useNavigate } from "react-router-dom";
import BottomNav  from "@/shared/ui/BottomNav"

type Conversation = {
  id: string,
  user1: string,
  user2: string,
  avatarPicture: string,
  lastMessage: string,
  updatedAt: string,
  unreadCount: number,
};

const dummyConversations: Conversation[] = [
  {
    id: "1dabb9f4-5c77-49e8-9634-4b02d2a4de54",
    user1: "niko",
    user2: "you",
    avatarPicture: "./assets/default.png",
    lastMessage: "Hey, man, this is Jalen trying to test the messages page",
    updatedAt: "2min ago",
    unreadCount: 1,
  },
  {
    id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx1",
    user1: "alyx",
    user2: "you",
    avatarPicture: "./assets/druski.png",
    lastMessage: "Did you finish the UI for our profile page?",
    updatedAt: "2m ago",
    unreadCount: 2,
  },
  {
    id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx2",
    user1: "karkaton",
    user2: "you",
    avatarPicture: "./assets/default.png",
    lastMessage: "Let me know when you push your branch.",
    updatedAt: "15m ago",
    unreadCount: 0,
  },
  {
    id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx3",
    user1: "Followed User",
    user2: "you",
    avatarPicture: "./assets/default.png",
    lastMessage: "This demake is looking awesome so far.",
    updatedAt: "1h ago",
    unreadCount: 1,
  },
  {
    id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxx4",
    user1: "Dev Team",
    user2: "you",
    avatarPicture: "./assets/default.png",
    lastMessage: "Next, gotta link this page to the DB. But I also wanna see what happens if you just have a really long message. I think what's going to happen is that the button will be extremely stretched. And so the next step would be to essentially cut off part of the message and replace it with elipses. That's all I've got for now, thanks for sticking with me up to this point. jalen out. Ok so I just tested this out and it already does all that stuff I just mentioned, so that's awesome.",
    updatedAt: "Yesterday",
    unreadCount: 0,
  },
];

export default function ConversationsPage() {
  const navigate = useNavigate();

  return (
    <>
    <div className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-3xl font-semibold">Messages</h1>

        <ul
          role="list"
          className="m-0 mt-6 grid w-full list-none grid-cols-1 gap-3 p-0 pl-0"
        >
          {dummyConversations.map((conversation) => (
            <li key={conversation.id} className="min-w-0 list-none pl-0">
              <ButtonGroup
                orientation="horizontal"
                className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm"
              >
                <Button
                  type="button"
                  variant="outline"
                  className="h-auto min-h-[4.5rem] min-w-0 flex-1 items-center justify-start gap-3 px-4 py-3 text-left text-sm font-normal whitespace-normal hover:bg-muted/60"
                  //onClick={() => navigate(`/conversation/${conversation.id}?with=${encodeURIComponent(conversation.user1)}`)}
                >
                  <Avatar size="default" className="shrink-0">
                    <AvatarImage src={conversation.avatarPicture} />
                    <AvatarFallback>{conversation.user1[0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="w-full text-base font-semibold">
                      {conversation.user1}
                    </span>
                    <span className="line-clamp-2 w-full text-muted-foreground">
                      {conversation.lastMessage}
                    </span>
                  </div>
                </Button>

                <ButtonGroupSeparator orientation="vertical" />

                <Button
                  type="button"
                  variant="outline"
                  className="h-auto min-h-[4.5rem] min-w-[5rem] shrink-0 flex-col items-end justify-center gap-2 bg-muted/40 px-4 py-3 font-normal whitespace-normal hover:bg-muted/60"
                >
                  <span className="text-xs text-muted-foreground">
                    {conversation.updatedAt}
                  </span>
                  {conversation.unreadCount > 0 ? (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                      {conversation.unreadCount}
                    </span>
                  ) : null}
                </Button>
              </ButtonGroup>
            </li>
          ))}
        </ul>
      </div>
    </div>
    {/* bottom nav bar */}
    <BottomNav />
    </>
  )
}
