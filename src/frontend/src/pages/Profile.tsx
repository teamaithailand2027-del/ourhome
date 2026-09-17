import PageHeader from "@/components/PageHeader";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Fingerprint,
  Heart,
  LogIn,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";

export default function Profile() {
  const {
    identity,
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
  } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleAuth = () => {
    if (isAuthenticated) {
      clear();
      queryClient.clear();
    } else {
      login();
    }
  };

  const principal = identity?.getPrincipal().toString();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader
        eyebrow="โปรไฟล์"
        title="โปรไฟล์ของฉัน"
        description="ข้อมูลบัญชีผู้ใช้ของคุณ"
      />

      <Card className="rounded-3xl border-border/60 shadow-subtle">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <Avatar className="size-20 border border-border">
            <AvatarFallback className="bg-accent font-display text-2xl font-semibold text-accent-foreground">
              OH
            </AvatarFallback>
          </Avatar>

          {isInitializing ? (
            <p className="mt-4 text-sm text-muted-foreground">กำลังโหลด...</p>
          ) : isAuthenticated && principal ? (
            <>
              <h2 className="mt-4 font-display text-2xl font-semibold text-foreground">
                ผู้ใช้ที่เข้าสู่ระบบ
              </h2>
              <div className="mt-4 w-full max-w-md rounded-2xl bg-gradient-subtle p-5 text-left">
                <div className="flex items-start gap-3">
                  <Fingerprint className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Principal ID
                    </p>
                    <p className="mt-1 break-all font-mono text-sm text-foreground">
                      {principal}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="rounded-full"
                >
                  <Link to="/favorites">
                    <Heart className="size-4" />
                    รายการโปรดของฉัน
                  </Link>
                </Button>
                <Button
                  type="button"
                  onClick={handleAuth}
                  className="rounded-full"
                >
                  <LogOut className="size-4" />
                  ออกจากระบบ
                </Button>
              </div>
            </>
          ) : (
            <>
              <h2 className="mt-4 font-display text-2xl font-semibold text-foreground">
                ยังไม่ได้เข้าสู่ระบบ
              </h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                เข้าสู่ระบบเพื่อบันทึกรายการโปรดและจัดการบัญชีของคุณ
              </p>
              <Button
                type="button"
                onClick={handleAuth}
                disabled={isLoggingIn}
                className="mt-6 rounded-full"
              >
                <LogIn className="size-4" />
                เข้าสู่ระบบ
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="rounded-2xl border-border/60 shadow-subtle">
          <CardContent className="flex items-start gap-3 p-6">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h3 className="font-display text-base font-semibold text-foreground">
                ความปลอดภัย
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                บัญชีของคุณได้รับการยืนยันตัวตนอย่างปลอดภัยผ่าน Internet Identity
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/60 shadow-subtle">
          <CardContent className="flex items-start gap-3 p-6">
            <User className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <h3 className="font-display text-base font-semibold text-foreground">
                ข้อมูลส่วนตัว
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                ข้อมูลบัญชีของคุณถูกจัดเก็บอย่างปลอดภัยและเป็นส่วนตัว
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
