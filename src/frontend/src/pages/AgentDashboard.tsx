import PageHeader from "@/components/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useAgents,
  useAppointments,
  useNotifications,
  useProjects,
  useReviews,
} from "@/hooks/useQueries";
import { AppointmentStatus, formatBaht, timestampToDate } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Home,
  Presentation,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  [AppointmentStatus.pending]: "รออนุมัติ",
  [AppointmentStatus.confirmed]: "ยืนยันแล้ว",
  [AppointmentStatus.completed]: "เสร็จสิ้น",
  [AppointmentStatus.cancelled]: "ยกเลิก",
};

const STATUS_VARIANT: Record<
  AppointmentStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  [AppointmentStatus.pending]: "secondary",
  [AppointmentStatus.confirmed]: "default",
  [AppointmentStatus.completed]: "outline",
  [AppointmentStatus.cancelled]: "destructive",
};

export default function AgentDashboard() {
  const { data: agents, isLoading: agentsLoading } = useAgents();
  const { data: projects } = useProjects();
  const { data: appointments } = useAppointments();
  const { data: notifications } = useNotifications();

  const currentAgent = agents?.[0];
  const currentAgentId = currentAgent?.id ?? 0n;
  const { data: reviews } = useReviews(currentAgentId);

  const managedProjects = (projects ?? []).filter((p) =>
    currentAgent?.managedProjects.includes(p.id),
  );

  const newLeads = (appointments ?? []).filter(
    (a) => a.status === AppointmentStatus.pending,
  );
  const presentations = (appointments ?? []).filter(
    (a) =>
      a.status === AppointmentStatus.confirmed ||
      a.status === AppointmentStatus.completed,
  );
  const followUps = (notifications ?? []).filter((n) => !n.read);

  const latestReviews = (reviews ?? []).slice(0, 3);
  const avgRating =
    (reviews ?? []).length > 0
      ? (reviews ?? []).reduce((sum, r) => sum + Number(r.rating), 0) /
        (reviews ?? []).length
      : 0;

  const stats = [
    {
      label: "ลีดใหม่",
      value: newLeads.length,
      icon: Users,
      hint: "การนัดหมายที่รออนุมัติ",
    },
    {
      label: "การนำเสนอ",
      value: presentations.length,
      icon: Presentation,
      hint: "ยืนยันและเสร็จสิ้น",
    },
    {
      label: "งานติดตาม",
      value: followUps.length,
      icon: ClipboardList,
      hint: "การแจ้งเตือนที่ยังไม่อ่าน",
    },
    {
      label: "โครงการที่ดูแล",
      value: managedProjects.length,
      icon: Home,
      hint: currentAgent?.name ?? "ตัวแทน",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        eyebrow="แดชบอร์ดตัวแทน"
        title="ภาพรวมกิจกรรมของคุณ"
        description="ติดตามลีด การนัดหมาย และผลงานการขายของคุณ"
        action={
          <Button
            asChild
            variant="outline"
            data-ocid="agent_dashboard.view_projects_button"
          >
            <Link to="/projects">ดูโครงการทั้งหมด</Link>
          </Button>
        }
      />

      {/* Agent profile strip */}
      <Card className="mb-8 rounded-2xl border-border/60 shadow-subtle">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              {currentAgent?.photo ? (
                <AvatarImage src={currentAgent.photo} alt={currentAgent.name} />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-primary">
                {(currentAgent?.name ?? "A").slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-xl font-semibold text-foreground">
                  {currentAgent?.name ?? "ตัวแทน"}
                </p>
                {currentAgent?.verified ? (
                  <BadgeCheck className="size-5 text-primary" />
                ) : null}
              </div>
              <p className="text-sm text-muted-foreground">
                {currentAgent?.agentCode ?? "—"} · ประสบการณ์{" "}
                {currentAgent ? `${currentAgent.experience} ปี` : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-display text-2xl font-semibold text-foreground">
                {currentAgent ? currentAgent.customerCount.toString() : "—"}
              </p>
              <p className="text-xs text-muted-foreground">ลูกค้า</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-semibold text-foreground">
                {currentAgent ? currentAgent.rating.toFixed(1) : "—"}
              </p>
              <p className="text-xs text-muted-foreground">คะแนนรีวิว</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="rounded-2xl border-border/60 shadow-subtle"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <Icon className="size-6 text-primary" />
                  <TrendingUp className="size-4 text-muted-foreground/50" />
                </div>
                <p className="mt-4 font-display text-3xl font-semibold text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {stat.label}
                </p>
                <p className="text-xs text-muted-foreground">{stat.hint}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue / commission per entitlement */}
      <Card className="mt-6 rounded-2xl border-border/60 shadow-subtle">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="size-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                ค่าคอมมิชชันโดยประมาณ (ตามสิทธิ์ระบบ)
              </p>
              <p className="font-display text-3xl font-semibold text-foreground">
                {formatBaht(BigInt(presentations.length) * 50_000n)}
              </p>
            </div>
          </div>
          <p className="max-w-xs text-xs text-muted-foreground">
            คำนวณจากการนำเสนอที่ยืนยันและเสร็จสิ้น ตามสิทธิ์การใช้งานระบบของคุณ
          </p>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Appointments */}
        <Card className="rounded-2xl border-border/60 shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <CalendarClock className="size-5 text-primary" />
              การนัดหมาย
            </CardTitle>
            <Badge
              variant="secondary"
              data-ocid="agent_dashboard.appointments_count"
            >
              {(appointments ?? []).length} รายการ
            </Badge>
          </CardHeader>
          <CardContent>
            {agentsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }, (_, i) => `skeleton-${i}`).map(
                  (id) => (
                    <Skeleton key={id} className="h-12 w-full" />
                  ),
                )}
              </div>
            ) : (appointments ?? []).length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                ยังไม่มีการนัดหมาย
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>วันที่</TableHead>
                    <TableHead>สถานะ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(appointments ?? []).slice(0, 5).map((appt, i) => {
                    const date = timestampToDate(appt.date);
                    return (
                      <TableRow
                        key={appt.id}
                        data-ocid={`agent_dashboard.appointment.${i}`}
                      >
                        <TableCell>
                          {date
                            ? date.toLocaleDateString("th-TH", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={STATUS_VARIANT[appt.status]}
                            data-ocid={`agent_dashboard.appointment_status.${i}`}
                          >
                            {STATUS_LABEL[appt.status]}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Follow-up tasks */}
        <Card className="rounded-2xl border-border/60 shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <ClipboardList className="size-5 text-primary" />
              งานติดตาม
            </CardTitle>
            <Badge
              variant="secondary"
              data-ocid="agent_dashboard.followups_count"
            >
              {followUps.length} รายการ
            </Badge>
          </CardHeader>
          <CardContent>
            {followUps.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                ไม่มีงานติดตามที่ค้างอยู่
              </p>
            ) : (
              <ul className="space-y-3">
                {followUps.slice(0, 5).map((note, i) => {
                  const date = timestampToDate(note.createdAt);
                  return (
                    <li
                      key={note.id}
                      data-ocid={`agent_dashboard.followup.${i}`}
                      className="flex items-start gap-3 rounded-xl border border-border/60 p-3"
                    >
                      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {note.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {date
                            ? date.toLocaleDateString("th-TH", {
                                day: "numeric",
                                month: "short",
                              })
                            : "—"}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Managed projects */}
        <Card className="rounded-2xl border-border/60 shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Home className="size-5 text-primary" />
              โครงการที่ดูแล
            </CardTitle>
            <Badge
              variant="secondary"
              data-ocid="agent_dashboard.managed_projects_count"
            >
              {managedProjects.length} โครงการ
            </Badge>
          </CardHeader>
          <CardContent>
            {managedProjects.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                ยังไม่มีโครงการที่ดูแล
              </p>
            ) : (
              <ul className="space-y-3">
                {managedProjects.slice(0, 5).map((project, i) => (
                  <li
                    key={project.id}
                    data-ocid={`agent_dashboard.managed_project.${i}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/60 p-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {project.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {project.location.province} ·{" "}
                        {project.location.district}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {formatBaht(project.startingPrice)}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Latest reviews */}
        <Card className="rounded-2xl border-border/60 shadow-subtle">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Star className="size-5 text-primary" />
              รีวิวล่าสุด
            </CardTitle>
            <Badge
              variant="secondary"
              data-ocid="agent_dashboard.reviews_count"
            >
              {avgRating > 0 ? avgRating.toFixed(1) : "—"} / 5
            </Badge>
          </CardHeader>
          <CardContent>
            {latestReviews.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                ยังไม่มีรีวิว
              </p>
            ) : (
              <ul className="space-y-3">
                {latestReviews.map((review, i) => (
                  <li
                    key={review.id}
                    data-ocid={`agent_dashboard.review.${i}`}
                    className="rounded-xl border border-border/60 p-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, s) => s).map((s) => (
                          <Star
                            key={s}
                            className={`size-4 ${
                              s < Number(review.rating)
                                ? "fill-primary text-primary"
                                : "text-muted-foreground/40"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {timestampToDate(review.createdAt)?.toLocaleDateString(
                          "th-TH",
                          { day: "numeric", month: "short" },
                        ) ?? "—"}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {review.comment}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
