import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMarkNotificationRead, useNotifications } from "@/hooks/useQueries";
import { timestampToDate } from "@/types";
import { Bell, CheckCheck } from "lucide-react";

export default function Notifications() {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();

  const unreadCount = (notifications ?? []).filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    for (const n of notifications ?? []) {
      if (!n.read) markRead.mutate(n.id);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader
        eyebrow="การแจ้งเตือน"
        title="การแจ้งเตือน"
        description="ข่าวสารและอัปเดตล่าสุดสำหรับคุณ"
        action={
          unreadCount > 0 ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={handleMarkAllRead}
              data-ocid="notifications.mark_all_read"
            >
              <CheckCheck className="size-4" />
              อ่านทั้งหมด
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((id) => (
            <Skeleton key={id} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <button
              key={notification.id.toString()}
              type="button"
              onClick={() => {
                if (!notification.read) markRead.mutate(notification.id);
              }}
              className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-smooth ${
                notification.read
                  ? "border-border/40 bg-card/60"
                  : "border-border/60 bg-card shadow-subtle"
              }`}
              data-ocid={`notifications.item.${notification.id.toString()}`}
            >
              <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                <Bell className="size-5" />
                {!notification.read && (
                  <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-primary" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm ${
                    notification.read
                      ? "text-muted-foreground"
                      : "font-medium text-foreground"
                  }`}
                >
                  {notification.message}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {notification.createdAt
                    ? timestampToDate(notification.createdAt)?.toLocaleString(
                        "th-TH",
                      )
                    : ""}
                </p>
              </div>
              {!notification.read && (
                <span className="mt-1 shrink-0 rounded-full bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
                  ใหม่
                </span>
              )}
            </button>
          ))}
        </div>
      ) : (
        <div
          className="rounded-2xl border border-dashed border-border bg-card p-12 text-center"
          data-ocid="notifications.empty_state"
        >
          <Bell className="mx-auto size-8 text-primary" />
          <p className="mt-3 font-medium text-foreground">ไม่มีการแจ้งเตือน</p>
          <p className="mt-1 text-sm text-muted-foreground">
            การแจ้งเตือนใหม่จะปรากฏที่นี่
          </p>
        </div>
      )}
    </div>
  );
}
