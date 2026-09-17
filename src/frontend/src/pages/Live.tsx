import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { CalendarClock, Radio, Video } from "lucide-react";

export default function Live() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageHeader
        eyebrow="ไลฟ์สด"
        title="ไลฟ์สด"
        description="ติดตามการไลฟ์สดชมโครงการและบ้านจากตัวแทน"
      />

      <Card className="rounded-3xl border-border/60 shadow-subtle">
        <CardContent className="flex flex-col items-center p-12 text-center">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-accent">
            <Radio className="size-10 text-primary" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-semibold text-foreground">
            ยังไม่มีไลฟ์สดในขณะนี้
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            ไลฟ์สดชมโครงการและบ้านจะเริ่มเร็ว ๆ นี้
            ติดตามประกาศจากตัวแทนเพื่อไม่พลาดการไลฟ์สดครั้งต่อไป
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button type="button" asChild className="rounded-full">
              <Link to="/projects">
                <Video className="size-4" />
                ดูโครงการ
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              asChild
              className="rounded-full"
            >
              <Link to="/">
                <CalendarClock className="size-4" />
                กลับหน้าหลัก
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
