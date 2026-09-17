import { Link } from "@tanstack/react-router";
import {
  Building2,
  Home,
  type LucideIcon,
  Newspaper,
  Radio,
  User,
} from "lucide-react";

type Tab = {
  label: string;
  to: string;
  icon: LucideIcon;
};

const tabs: Tab[] = [
  { label: "ฟีด", to: "/", icon: Home },
  { label: "โพสต์", to: "/posts", icon: Newspaper },
  { label: "ไลฟ์สด", to: "/live", icon: Radio },
  { label: "โครงการ", to: "/projects", icon: Building2 },
  { label: "โปรไฟล์", to: "/profile", icon: User },
];

export default function BottomNav() {
  return (
    <nav
      className="glass fixed inset-x-0 bottom-0 z-40 border-t border-border/60 md:hidden"
      data-ocid="bottom_nav"
      aria-label="เมนูหลัก"
    >
      <div className="mx-auto grid max-w-md grid-cols-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.label}
              to={tab.to}
              className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground transition-smooth hover:text-primary"
              data-ocid={`bottom_nav.${tab.label}`}
            >
              <Icon className="size-5" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
