import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAdminMetrics,
  useAgents,
  useAppointments,
  useHouses,
  useNotifications,
  usePosts,
  useProjects,
  useReviews,
} from "@/hooks/useQueries";
import { AppointmentStatus, formatBaht, timestampToDate } from "@/types";
import {
  BadgeCheck,
  Building2,
  CalendarClock,
  Eye,
  Home,
  Megaphone,
  Newspaper,
  ShieldAlert,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";

const APPT_STATUS_LABEL: Record<AppointmentStatus, string> = {
  [AppointmentStatus.pending]: "รออนุมัติ",
  [AppointmentStatus.confirmed]: "ยืนยันแล้ว",
  [AppointmentStatus.completed]: "เสร็จสิ้น",
  [AppointmentStatus.cancelled]: "ยกเลิก",
};

export default function AdminDashboard() {
  const { data: metrics, isLoading: metricsLoading } = useAdminMetrics();
  const { data: agents } = useAgents();
  const { data: projects } = useProjects();
  const { data: houses } = useHouses();
  const { data: posts } = usePosts();
  const { data: appointments } = useAppointments();
  const { data: notifications } = useNotifications();
  const { data: reviews } = useReviews(0n);

  const leads = (appointments ?? []).filter(
    (a) => a.status === AppointmentStatus.pending,
  );
  const promotions = (projects ?? []).filter(
    (p) => (p.promotions ?? []).length > 0,
  );
  const reports = (reviews ?? []).filter((r) => r.reported);

  const metricCards = [
    { label: "สมาชิก", value: metrics?.members, icon: Users },
    { label: "ลูกค้า", value: metrics?.customers, icon: Users },
    { label: "ตัวแทน", value: metrics?.agents, icon: BadgeCheck },
    { label: "โครงการ", value: metrics?.projects, icon: Building2 },
    { label: "บ้าน", value: metrics?.houses, icon: Home },
    { label: "ลีด", value: metrics?.leads, icon: TrendingUp },
    { label: "การนัดหมาย", value: metrics?.appointments, icon: CalendarClock },
    { label: "โพสต์", value: metrics?.posts, icon: Newspaper },
    { label: "ผู้ชมสด", value: metrics?.liveViewers, icon: Eye },
    { label: "การแปลง", value: metrics?.conversions, icon: TrendingUp },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        eyebrow="NIC GROUP 95 (THAILAND)"
        title="แดชบอร์ดผู้ดูแลระบบ"
        description="ภาพรวมข้อมูลแพลตฟอร์ม OurHome ทั้งหมด"
      />

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.label}
              className="rounded-2xl border-border/60 shadow-subtle"
            >
              <CardContent className="p-5">
                <Icon className="size-5 text-primary" />
                <p className="mt-3 font-display text-2xl font-semibold text-foreground">
                  {metricsLoading ? (
                    <Skeleton className="h-7 w-12" />
                  ) : (
                    (card.value ?? 0n).toString()
                  )}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {card.label}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Management lists */}
      <Card className="mt-8 rounded-2xl border-border/60 shadow-subtle">
        <CardHeader>
          <CardTitle className="font-display text-xl">การจัดการข้อมูล</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="agents"
            data-ocid="admin_dashboard.management_tabs"
          >
            <TabsList className="flex w-full flex-wrap h-auto">
              <TabsTrigger
                value="agents"
                data-ocid="admin_dashboard.tab.agents"
              >
                ตัวแทน
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                data-ocid="admin_dashboard.tab.projects"
              >
                โครงการ
              </TabsTrigger>
              <TabsTrigger
                value="houses"
                data-ocid="admin_dashboard.tab.houses"
              >
                บ้าน
              </TabsTrigger>
              <TabsTrigger value="posts" data-ocid="admin_dashboard.tab.posts">
                โพสต์
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                data-ocid="admin_dashboard.tab.reviews"
              >
                รีวิว
              </TabsTrigger>
              <TabsTrigger
                value="appointments"
                data-ocid="admin_dashboard.tab.appointments"
              >
                การนัดหมาย
              </TabsTrigger>
              <TabsTrigger value="leads" data-ocid="admin_dashboard.tab.leads">
                ลีด
              </TabsTrigger>
              <TabsTrigger
                value="promotions"
                data-ocid="admin_dashboard.tab.promotions"
              >
                โปรโมชัน
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                data-ocid="admin_dashboard.tab.notifications"
              >
                การแจ้งเตือน
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                data-ocid="admin_dashboard.tab.reports"
              >
                รายงาน
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="agents"
              data-ocid="admin_dashboard.panel.agents"
            >
              <ManagementTable
                headers={["ชื่อ", "รหัส", "คะแนน", "ลูกค้า", "สถานะ"]}
                rows={(agents ?? []).map((a) => [
                  a.name,
                  a.agentCode,
                  a.rating.toFixed(1),
                  a.customerCount.toString(),
                  a.verified ? "ยืนยันแล้ว" : "ยังไม่ยืนยัน",
                ])}
                empty="ยังไม่มีตัวแทน"
              />
            </TabsContent>

            <TabsContent
              value="projects"
              data-ocid="admin_dashboard.panel.projects"
            >
              <ManagementTable
                headers={["ชื่อ", "จังหวัด", "ราคาเริ่มต้น", "จำนวนยูนิต"]}
                rows={(projects ?? []).map((p) => [
                  p.name,
                  p.location.province,
                  formatBaht(p.startingPrice),
                  p.unitCount.toString(),
                ])}
                empty="ยังไม่มีโครงการ"
              />
            </TabsContent>

            <TabsContent
              value="houses"
              data-ocid="admin_dashboard.panel.houses"
            >
              <ManagementTable
                headers={["แบบบ้าน", "ห้องนอน", "พื้นที่", "ราคา"]}
                rows={(houses ?? []).map((h) => [
                  h.houseType,
                  `${h.bedrooms} ห้อง`,
                  `${h.usableArea} ตร.ม.`,
                  formatBaht(h.price),
                ])}
                empty="ยังไม่มีบ้าน"
              />
            </TabsContent>

            <TabsContent value="posts" data-ocid="admin_dashboard.panel.posts">
              <ManagementTable
                headers={["โพสต์", "ไลก์", "คอมเมนต์", "แชร์"]}
                rows={(posts ?? []).map((p) => [
                  `โพสต์ #${p.id}`,
                  p.likeCount.toString(),
                  p.commentCount.toString(),
                  p.shareCount.toString(),
                ])}
                empty="ยังไม่มีโพสต์"
              />
            </TabsContent>

            <TabsContent
              value="reviews"
              data-ocid="admin_dashboard.panel.reviews"
            >
              <ManagementTable
                headers={["คะแนน", "ความคิดเห็น", "วันที่"]}
                rows={(reviews ?? []).map((r) => [
                  `${r.rating}/5`,
                  r.comment,
                  timestampToDate(r.createdAt)?.toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                  }) ?? "—",
                ])}
                empty="ยังไม่มีรีวิว"
              />
            </TabsContent>

            <TabsContent
              value="appointments"
              data-ocid="admin_dashboard.panel.appointments"
            >
              <ManagementTable
                headers={["วันที่", "สถานะ", "ผู้เข้าชม"]}
                rows={(appointments ?? []).map((a) => [
                  timestampToDate(a.date)?.toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }) ?? "—",
                  APPT_STATUS_LABEL[a.status],
                  a.visitors.toString(),
                ])}
                empty="ยังไม่มีการนัดหมาย"
              />
            </TabsContent>

            <TabsContent value="leads" data-ocid="admin_dashboard.panel.leads">
              <ManagementTable
                headers={["วันที่", "สถานะ", "ผู้เข้าชม"]}
                rows={leads.map((a) => [
                  timestampToDate(a.date)?.toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                  }) ?? "—",
                  "รออนุมัติ",
                  a.visitors.toString(),
                ])}
                empty="ไม่มีลีดที่รออนุมัติ"
              />
            </TabsContent>

            <TabsContent
              value="promotions"
              data-ocid="admin_dashboard.panel.promotions"
            >
              <ManagementTable
                headers={["โครงการ", "โปรโมชัน"]}
                rows={promotions.map((p) => [
                  p.name,
                  (p.promotions ?? []).join(", "),
                ])}
                empty="ไม่มีโปรโมชันที่ใช้งาน"
              />
            </TabsContent>

            <TabsContent
              value="notifications"
              data-ocid="admin_dashboard.panel.notifications"
            >
              <ManagementTable
                headers={["ข้อความ", "สถานะ", "วันที่"]}
                rows={(notifications ?? []).map((n) => [
                  n.message,
                  n.read ? "อ่านแล้ว" : "ยังไม่อ่าน",
                  timestampToDate(n.createdAt)?.toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "short",
                  }) ?? "—",
                ])}
                empty="ยังไม่มีการแจ้งเตือน"
              />
            </TabsContent>

            <TabsContent
              value="reports"
              data-ocid="admin_dashboard.panel.reports"
            >
              <ManagementTable
                headers={["คะแนน", "ความคิดเห็น", "สถานะ"]}
                rows={reports.map((r) => [
                  `${r.rating}/5`,
                  r.comment,
                  "ถูกรายงาน",
                ])}
                empty="ไม่มีรายงานที่ค้างตรวจสอบ"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function ManagementTable({
  headers,
  rows,
  empty,
}: {
  headers: string[];
  rows: string[][];
  empty: string;
}) {
  if (rows.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-2 py-10 text-center"
        data-ocid="admin_dashboard.empty_state"
      >
        <ShieldAlert className="size-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">{empty}</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((h) => (
            <TableHead key={h}>{h}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows
          .slice(0, 8)
          .map((row, i) => ({
            row: row.map((cell, j) => ({ cell, id: `cell-${j}` })),
            id: `admin-row-${i}`,
          }))
          .map(({ row, id }) => (
            <TableRow key={id} data-ocid={`admin_dashboard.row.${id}`}>
              {row.map(({ cell, id: cellId }) => (
                <TableCell
                  key={`${id}-${cellId}`}
                  className="max-w-[16rem] truncate"
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
