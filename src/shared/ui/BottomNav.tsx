import { House, UsersThree, UserCircle } from "@phosphor-icons/react"
import { Link, useLocation } from "react-router-dom"

const navItems = [
  {
    path: "/dashboard",
    label: "Home",
    icon: House,
  },
  {
    path: "/recommended",
    label: "Feed",
    icon: UsersThree,
  },
  {
    path: "/communities",
    label: "Communities",
    icon: UsersThree,
  },
  {
    path: "/profile",
    label: "Profile",
    icon: UserCircle,
  },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      aria-label="Bottom navigation"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          const Icon = item.icon

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex min-w-20 flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium transition ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon size={22} weight={isActive ? "fill" : "regular"} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}