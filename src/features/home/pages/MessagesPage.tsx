import { ButtonGroup, ButtonGroupSeparator } from "@/shared/ui/button-group";
import { Button } from "@/shared/ui/button";

type Conversation = {
  id: number,
  user1: string,
  user2: string,
  lastMessage: string,
  updatedAt: string,
  unreadCount: number,
};

const dummyConversations: Conversation[] = [
  {
    id: 1,
    user1: "alyx",
    user2: "you",
    lastMessage: "Did you finish the UI for our profile page?",
    updatedAt: "2m ago",
    unreadCount: 2,
  },
  {
    id: 2,
    user1: "karkaton",
    user2: "you",
    lastMessage: "Let me know when you push your branch.",
    updatedAt: "15m ago",
    unreadCount: 0,
  },
  {
    id: 3,
    user1: "Followed User",
    user2: "you",
    lastMessage: "This demake is looking awesome so far.",
    updatedAt: "1h ago",
    unreadCount: 1,
  },
  {
    id: 4,
    user1: "Dev Team",
    user2: "you",
    lastMessage: "Next, gotta this page to the DB.",
    updatedAt: "Yesterday",
    unreadCount: 0,
  },
];

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-muted p-8 text-foreground">
      <div className="mx-auto w-full max-w-2xl">
        <h1 className="text-3xl font-semibold">Messages</h1>
        <p className="mt-2 text-gray-600">
          Conversations you are currently part of.
        </p>

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
                  className="h-auto min-h-[4.5rem] min-w-0 flex-1 flex-col items-start justify-start gap-1 px-4 py-3 text-left text-sm font-normal whitespace-normal hover:bg-muted/60"
                >
                  <span className="w-full text-base font-semibold">
                    {conversation.user1}
                  </span>
                  <span className="line-clamp-2 w-full text-muted-foreground">
                    {conversation.lastMessage}
                  </span>
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
  );
}
