import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAgents,
  useAppointments,
  useBookAppointment,
  useProjects,
} from "@/hooks/useQueries";
import { AppointmentStatus, timestampToDate } from "@/types";
import type { Appointment } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { CalendarClock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const statusLabel: Record<string, string> = {
  pending: "รอการยืนยัน",
  confirmed: "ยืนยันแล้ว",
  completed: "เสร็จสิ้น",
  cancelled: "ยกเลิก",
};

export default function Booking() {
  const { data: appointments, isLoading: appointmentsLoading } =
    useAppointments();
  const { data: projects } = useProjects();
  const { data: agents } = useAgents();
  const bookAppointment = useBookAppointment();
  const { identity } = useInternetIdentity();

  const [projectId, setProjectId] = useState("");
  const [houseType, setHouseType] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [visitors, setVisitors] = useState("1");
  const [agentId, setAgentId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedProject = (projects ?? []).find(
    (p) => p.id.toString() === projectId,
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity || !projectId || !date || !time || !name || !phone) return;

    const dateTime = new Date(`${date}T${time}`);
    const timestamp = BigInt(dateTime.getTime()) * 1_000_000n;

    const appointment: Appointment = {
      id: 0n,
      userId: identity.getPrincipal(),
      projectId: BigInt(projectId),
      houseType: houseType || undefined,
      date: timestamp,
      time: timestamp,
      visitors: BigInt(visitors || "1"),
      agentId: agentId ? BigInt(agentId) : undefined,
      name,
      phone,
      status: AppointmentStatus.pending,
    };

    bookAppointment.mutate(appointment, {
      onSuccess: () => setSubmitted(true),
    });
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto size-12 text-primary" />
        <h1 className="mt-4 font-display text-3xl font-semibold text-foreground">
          ส่งคำขอนัดหมายแล้ว
        </h1>
        <p className="mt-2 text-muted-foreground">
          ตัวแทนของเราจะติดต่อกลับเพื่อยืนยันการนัดหมายชมโครงการ
        </p>
        <Button
          type="button"
          className="mt-8 rounded-full"
          onClick={() => {
            setSubmitted(false);
            setProjectId("");
            setHouseType("");
            setDate("");
            setTime("");
            setVisitors("1");
            setAgentId("");
            setName("");
            setPhone("");
          }}
          data-ocid="booking.book_again"
        >
          นัดหมายอีกครั้ง
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader
        eyebrow="การนัดหมาย"
        title="นัดหมายชมโครงการ"
        description="เลือกโครงการ วันเวลา และตัวแทน เพื่อนัดหมายชมบ้านในฝันของคุณ"
      />

      <Card className="rounded-2xl border-border/60 shadow-subtle">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="project">โครงการ</Label>
              <Select
                value={projectId}
                onValueChange={(v) => {
                  setProjectId(v);
                  setHouseType("");
                }}
              >
                <SelectTrigger
                  id="project"
                  className="w-full"
                  data-ocid="booking.project"
                >
                  <SelectValue placeholder="เลือกโครงการ" />
                </SelectTrigger>
                <SelectContent>
                  {(projects ?? []).map((project) => (
                    <SelectItem
                      key={project.id.toString()}
                      value={project.id.toString()}
                    >
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="houseType">แบบบ้าน (ไม่บังคับ)</Label>
              <Select value={houseType} onValueChange={setHouseType}>
                <SelectTrigger
                  id="houseType"
                  className="w-full"
                  data-ocid="booking.house_type"
                >
                  <SelectValue placeholder="เลือกแบบบ้าน" />
                </SelectTrigger>
                <SelectContent>
                  {(selectedProject?.houseTypes ?? []).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="เช่น สมชาย ใจดี"
                  required
                  data-ocid="booking.name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="เช่น 081-234-5678"
                  required
                  data-ocid="booking.phone"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">วันที่</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  data-ocid="booking.date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">เวลา</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  data-ocid="booking.time"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="visitors">จำนวนผู้เข้าชม</Label>
                <Input
                  id="visitors"
                  type="number"
                  min="1"
                  value={visitors}
                  onChange={(e) => setVisitors(e.target.value)}
                  required
                  data-ocid="booking.visitors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent">ตัวแทน (ไม่บังคับ)</Label>
                <Select value={agentId} onValueChange={setAgentId}>
                  <SelectTrigger
                    id="agent"
                    className="w-full"
                    data-ocid="booking.agent"
                  >
                    <SelectValue placeholder="เลือกตัวแทน" />
                  </SelectTrigger>
                  <SelectContent>
                    {(agents ?? []).map((agent) => (
                      <SelectItem
                        key={agent.id.toString()}
                        value={agent.id.toString()}
                      >
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!identity && (
              <p className="rounded-xl bg-accent p-3 text-sm text-accent-foreground">
                กรุณาเข้าสู่ระบบเพื่อยืนยันการนัดหมาย
              </p>
            )}

            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-primary text-primary-foreground shadow-gold"
              disabled={!identity || bookAppointment.isPending}
              data-ocid="booking.submit_button"
            >
              {bookAppointment.isPending ? "กำลังส่ง..." : "ยืนยันการนัดหมาย"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-10">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          การนัดหมายของฉัน
        </h2>

        {appointmentsLoading ? (
          <div className="mt-4 space-y-4">
            {Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((id) => (
              <Skeleton key={id} className="h-24 w-full rounded-2xl" />
            ))}
          </div>
        ) : appointments && appointments.length > 0 ? (
          <div className="mt-4 space-y-4">
            {appointments.map((appointment) => (
              <Card
                key={appointment.id.toString()}
                className="rounded-2xl border-border/60 shadow-subtle"
              >
                <CardContent className="flex items-center justify-between gap-4 p-6">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
                      <CalendarClock className="size-6" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        โครงการ #{appointment.projectId.toString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.date
                          ? timestampToDate(
                              appointment.date,
                            )?.toLocaleDateString("th-TH")
                          : ""}
                        {" · "}
                        {appointment.visitors.toString()} คน
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                    {statusLabel[appointment.status] ?? appointment.status}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div
            className="mt-4 rounded-2xl border border-dashed border-border bg-card p-12 text-center"
            data-ocid="booking.empty_state"
          >
            <CalendarClock className="mx-auto size-8 text-primary" />
            <p className="mt-3 font-medium text-foreground">ยังไม่มีการนัดหมาย</p>
            <p className="mt-1 text-sm text-muted-foreground">
              นัดหมายชมโครงการเพื่อเริ่มต้นค้นหาบ้านในฝันของคุณ
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
