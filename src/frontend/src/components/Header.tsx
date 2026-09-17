import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Bell, LogIn, LogOut, Menu } from "lucide-react";

export default function Header({ onMenuOpen }: { onMenuOpen: () => void }) {
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
  };

  return (
    <header className="glass sticky top-0 z-40 border-b border-border/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onMenuOpen}
          aria-label="เปิดเมนู"
          data-ocid="header.menu_button"
          className="rounded-full"
        >
          <Menu className="size-5" />
        </Button>

        <Link
          to="/"
          className="flex flex-col items-center leading-none"
          data-ocid="header.logo"
        >
          <span className="font-display text-xl font-semibold tracking-tight text-gradient-gold">
            OURHOME
          </span>
          <span className="text-[10px] font-medium tracking-wide text-muted-foreground">
            บ้านที่ทุกคนใฝ่ฝัน
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            asChild
            aria-label="การแจ้งเตือน"
            data-ocid="header.notifications"
            className="rounded-full"
          >
            <Link to="/notifications">
              <Bell className="size-5" />
            </Link>
          </Button>
          <Button
            type="button"
            variant={isAuthenticated ? "ghost" : "default"}
            size="sm"
            onClick={handleAuth}
            disabled={isInitializing || isLoggingIn}
            className="rounded-full"
            data-ocid="header.auth"
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
          <Avatar className="size-9 border border-border">
            <AvatarFallback className="bg-accent text-accent-foreground font-display text-sm font-semibold">
              OH
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
