import { House, UsersThree, UserCircle } from "@phosphor-icons/react"

export type NavTab = "home" |"feed" | "communities" | "profile"

type BottomNavProps = {
  activeTab: NavTab
  onChange: (tab: NavTab) => void
}

const navItems = [
  {
    key: "feed" as const,
    label: "Feed",
    icon: (active: boolean) => (
      <House size={22} weight={active ? "fill" : "regular"} />
    ),
  },
  {
    key: "communities" as const,
    label: "Communities",
    icon: (active: boolean) => (
      <UsersThree size={22} weight={active ? "fill" : "regular"} />
    ),
  },
  {
    key: "profile" as const,
    label: "Profile",
    icon: (active: boolean) => (
      <UserCircle size={22} weight={active ? "fill" : "regular"} />
    ),
  },
]

export default function BottomNav({
  activeTab,
  onChange,
}: BottomNavProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      aria-label="Bottom navigation"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.key

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
              className={`flex min-w-24 flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {item.icon(isActive)}
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}