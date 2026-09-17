import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  Building2,
  CalendarClock,
  Heart,
  Home,
  Info,
  LifeBuoy,
  LogIn,
  LogOut,
  type LucideIcon,
  MessageSquare,
  Newspaper,
  Radio,
  Users,
} from "lucide-react";

type MenuItem = {
  label: string;
  to: string;
  icon: LucideIcon;
};

const menuItems: MenuItem[] = [
  { label: "หน้าหลัก", to: "/", icon: Home },
  { label: "โครงการ", to: "/projects", icon: Building2 },
  { label: "แบบบ้าน", to: "/house-types", icon: Home },
  { label: "ตัวแทน", to: "/agents", icon: Users },
  { label: "โพสต์", to: "/", icon: Newspaper },
  { label: "ไลฟ์สด", to: "/", icon: Radio },
  { label: "รายการโปรด", to: "/favorites", icon: Heart },
  { label: "การนัดหมาย", to: "/booking", icon: CalendarClock },
  { label: "ข้อความ", to: "/", icon: MessageSquare },
  { label: "การแจ้งเตือน", to: "/notifications", icon: Bell },
  { label: "ศูนย์ช่วยเหลือ", to: "/help", icon: LifeBuoy },
  { label: "เกี่ยวกับ OurHome", to: "/about", icon: Info },
];

export default function SideMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { login, clear, isAuthenticated, isInitializing, isLoggingIn } =
    useInternetIdentity();
  const queryClient = useQueryClient();

  const handleAuth = () => {
    if (isAuthenticated) {
      clear();
      queryClient.clear();
    } else {
      login();
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0 sm:max-w-xs">
        <SheetHeader className="border-b border-border/60 px-5 py-5">
          <SheetTitle className="font-display text-2xl font-semibold tracking-tight text-gradient-gold">
            OURHOME
          </SheetTitle>
          <p className="text-xs font-medium text-muted-foreground">
            บ้านที่ทุกคนใฝ่ฝัน
          </p>
        </SheetHeader>
        <div className="border-b border-border/60 p-3">
          <Button
            type="button"
            variant={isAuthenticated ? "outline" : "default"}
            onClick={handleAuth}
            disabled={isInitializing || isLoggingIn}
            className="w-full rounded-full"
            data-ocid="side_menu.auth"
          >
            {isInitializing ? (
              "กำลังโหลด..."
            ) : isAuthenticated ? (
              <>
                <LogOut className="size-4" />
                ออกจากระบบ
              </>
            ) : (
              <>
                <LogIn className="size-4" />
                เข้าสู่ระบบ
              </>
            )}
          </Button>
        </div>
        <nav
          className="flex flex-col gap-1 overflow-y-auto p-3"
          data-ocid="side_menu"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-smooth hover:bg-accent hover:text-accent-foreground"
                data-ocid={`side_menu.${item.label}`}
              >
                <Icon className="size-5 text-primary" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
