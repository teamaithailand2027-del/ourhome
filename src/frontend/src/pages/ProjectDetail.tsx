import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAgents,
  useBookAppointment,
  useHouses,
  useProject,
} from "@/hooks/useQueries";
import { AppointmentStatus, ProjectStatus, formatBaht } from "@/types";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  Bath,
  BedDouble,
  CalendarClock,
  Car,
  MapPin,
  Ruler,
  Share2,
  Star,
  Tag,
  UserRound,
} from "lucide-react";
import { useMemo, useState } from "react";

const FALLBACK_IMAGE = "/assets/generated/hero-home.dim_1200x800.jpg";

const statusLabel: Record<string, string> = {
  new: "ใหม่",
  ongoing: "กำลังดำเนินการ",
  completed: "แล้วเสร็จ",
};

export default function ProjectDetail() {
  const { projectId } = useParams({ from: "/projects/$projectId" });
  const id = BigInt(projectId);
  const { data: project, isLoading } = useProject(id);
  const { data: houses } = useHouses(id);
  const { data: agents } = useAgents();
  const { identity } = useInternetIdentity();
  const bookAppointment = useBookAppointment();

  const [bookingOpen, setBookingOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [visitors, setVisitors] = useState("1");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const managingAgent = useMemo(
    () => (agents ?? []).find((a) => a.managedProjects.some((p) => p === id)),
    [agents, id],
  );

  const specs = useMemo(() => {
    const list = houses ?? [];
    return {
      usableArea: list.length
        ? Math.max(...list.map((h) => Number(h.usableArea)))
        : null,
      bedrooms: list.length
        ? Math.max(...list.map((h) => Number(h.bedrooms)))
        : null,
      bathrooms: list.length
        ? Math.max(...list.map((h) => Number(h.bathrooms)))
        : null,
      parking: list.length
        ? Math.max(...list.map((h) => Number(h.parking)))
        : null,
    };
  }, [houses]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-6 aspect-video w-full rounded-3xl" />
        <Skeleton className="mt-6 h-8 w-2/3" />
        <Skeleton className="mt-3 h-4 w-1/2" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="font-display text-2xl font-semibold text-foreground">
          ไม่พบโครงการ
        </p>
        <Button type="button" asChild className="mt-6 rounded-full">
          <Link to="/projects">กลับไปยังโครงการ</Link>
        </Button>
      </div>
    );
  }

  const images = project.images.length
    ? project.images
    : ["/assets/images/placeholder.svg"];
  const imageThumbs = images.map((src, i) => ({
    src,
    id: `thumb-${i}`,
    index: i,
  }));

  const description = [
    `โครงการ ${project.name} ตั้งอยู่ในทำเล ${project.location.subDistrict} อำเภอ${project.location.district} จังหวัด${project.location.province}`,
    `นำเสนอแบบบ้านหลากหลาย ได้แก่ ${project.houseTypes.join(", ")} จำนวน ${project.unitCount.toString()} ยูนิต`,
    project.projectStatus === ProjectStatus.new_
      ? "เป็นโครงการใหม่ที่เพิ่งเปิดตัว พร้อมโปรโมชันพิเศษสำหรับผู้สนใจ"
      : project.projectStatus === "ongoing"
        ? "กำลังดำเนินการก่อสร้าง พร้อมนัดหมายชมโครงการได้"
        : "โครงการแล้วเสร็จ พร้อมเข้าอยู่ได้ทันที",
  ].join(" ");

  function openBooking() {
    setBookingOpen(true);
  }

  function submitBooking() {
    if (!identity || !date || !time || !name || !phone) return;
    const dateTime = new Date(`${date}T${time}:00`);
    const ns = BigInt(dateTime.getTime()) * 1_000_000n;
    bookAppointment.mutate(
      {
        id: 0n,
        projectId: id,
        userId: identity.getPrincipal(),
        date: ns,
        time: ns,
        visitors: BigInt(visitors || "1"),
        status: AppointmentStatus.pending,
        agentId: managingAgent?.id,
        name,
        phone,
      },
      {
        onSuccess: () => {
          setBookingOpen(false);
          setDate("");
          setTime("");
          setVisitors("1");
          setName("");
          setPhone("");
        },
      },
    );
  }

  async function shareProject() {
    const url = window.location.href;
    const shareName = project?.name ?? "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareName,
          text: `ชมโครงการ ${shareName} บน OURHOME`,
          url,
        });
        return;
      } catch {
        // fall through to copy
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      window.setTimeout(() => setShareCopied(false), 2000);
    } catch {
      // ignore clipboard failures
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Button
        type="button"
        variant="ghost"
        asChild
        className="mb-6 rounded-full text-muted-foreground"
        data-ocid="project_detail.back"
      >
        <Link to="/projects">
          <ArrowLeft className="size-4" />
          กลับ
        </Link>
      </Button>

      {/* Media gallery */}
      <div className="overflow-hidden rounded-3xl">
        <img
          src={images[activeImage]}
          alt={project.name}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="aspect-video w-full object-cover"
        />
        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {imageThumbs.map((thumb) => (
              <button
                key={thumb.id}
                type="button"
                onClick={() => setActiveImage(thumb.index)}
                className={`size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-smooth ${
                  thumb.index === activeImage
                    ? "border-primary"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
                aria-label={`ดูรูปที่ ${thumb.index + 1}`}
                data-ocid={`project_detail.thumb.${thumb.index + 1}`}
              >
                <img
                  src={thumb.src}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.src = FALLBACK_IMAGE;
                  }}
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Title + badges */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {project.verificationStatus === "verified" && (
              <Badge className="bg-primary text-primary-foreground shadow-gold">
                Verified
              </Badge>
            )}
            {project.projectStatus === ProjectStatus.new_ && (
              <Badge className="bg-card text-foreground">ใหม่</Badge>
            )}
            <Badge
              variant="secondary"
              className="bg-accent text-accent-foreground"
            >
              {statusLabel[project.projectStatus] ?? project.projectStatus}
            </Badge>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {project.name}
          </h1>
          <p className="mt-2 flex items-center gap-1 text-muted-foreground">
            <MapPin className="size-4 text-primary" />
            {project.location.subDistrict} · {project.location.district} ·{" "}
            {project.location.province}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-2xl bg-card px-4 py-3 shadow-subtle">
          <Star className="size-5 fill-primary text-primary" />
          <span className="font-display text-xl font-semibold text-foreground">
            {project.reviewRating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-5 leading-relaxed text-muted-foreground">
        {description}
      </p>

      {/* Key specs */}
      <Card className="mt-6 rounded-2xl border-border/60 shadow-subtle">
        <CardContent className="grid grid-cols-2 gap-6 p-6 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted-foreground">ราคาเริ่มต้น</p>
            <p className="mt-1 font-semibold text-foreground">
              {formatBaht(project.startingPrice)}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">จำนวนยูนิต</p>
            <p className="mt-1 font-semibold text-foreground">
              {project.unitCount.toString()} ยูนิต
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">แบบบ้าน</p>
            <p className="mt-1 font-semibold text-foreground">
              {project.houseTypes.length} แบบ
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">สถานะ</p>
            <p className="mt-1 font-semibold text-foreground">
              {statusLabel[project.projectStatus] ?? project.projectStatus}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* House specs */}
      <Card className="mt-4 rounded-2xl border-border/60 shadow-subtle">
        <CardContent className="grid grid-cols-2 gap-6 p-6 sm:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
              <Ruler className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">พื้นที่ใช้สอย</p>
              <p className="mt-0.5 font-semibold text-foreground">
                {specs.usableArea ? `${specs.usableArea} ตร.ม.` : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
              <BedDouble className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ห้องนอน</p>
              <p className="mt-0.5 font-semibold text-foreground">
                {specs.bedrooms ? `${specs.bedrooms} ห้อง` : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
              <Bath className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ห้องน้ำ</p>
              <p className="mt-0.5 font-semibold text-foreground">
                {specs.bathrooms ? `${specs.bathrooms} ห้อง` : "—"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-primary">
              <Car className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ที่จอดรถ</p>
              <p className="mt-0.5 font-semibold text-foreground">
                {specs.parking ? `${specs.parking} คัน` : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* House types */}
      <div className="mt-8">
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
          แบบบ้านในโครงการ
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {project.houseTypes.map((t) => (
            <Badge
              key={t}
              variant="outline"
              className="rounded-full border-border bg-card px-4 py-1.5 text-sm"
            >
              {t}
            </Badge>
          ))}
        </div>
      </div>

      {/* Promotions */}
      {project.promotions.length > 0 && (
        <div className="mt-8">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight text-foreground">
            <Tag className="size-5 text-primary" />
            โปรโมชัน
          </h2>
          <div className="mt-3 space-y-2">
            {project.promotions.map((p) => (
              <div
                key={p}
                className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-subtle"
                data-ocid="project_detail.promotion"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                  <Tag className="size-4" />
                </span>
                <p className="text-sm text-foreground">{p}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      <div className="mt-8">
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
          ทำเลที่ตั้ง
        </h2>
        <div
          className="mt-3 flex aspect-[16/7] w-full flex-col items-center justify-center rounded-2xl border border-border/60 bg-gradient-subtle text-center shadow-subtle"
          data-ocid="project_detail.map"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-gold">
            <MapPin className="size-6" />
          </div>
          <p className="mt-3 font-medium text-foreground">
            {project.location.subDistrict} · {project.location.district} ·{" "}
            {project.location.province}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            ละติจูด {project.coordinates.lat.toFixed(4)} · ลองจิจูด{" "}
            {project.coordinates.lng.toFixed(4)}
          </p>
        </div>
      </div>

      {/* Managing agent */}
      <div className="mt-8">
        <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
          ตัวแทนผู้ดูแลโครงการ
        </h2>
        {managingAgent ? (
          <Link
            to="/agents/$agentId"
            params={{ agentId: String(managingAgent.id) }}
            className="mt-3 block rounded-2xl border border-border/60 bg-card p-5 shadow-subtle transition-smooth hover:shadow-elevated"
            data-ocid="project_detail.agent"
          >
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-accent font-display text-2xl font-semibold text-accent-foreground">
                {managingAgent.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-foreground">
                    {managingAgent.name}
                  </p>
                  {managingAgent.verified && (
                    <BadgeCheck className="size-4 shrink-0 text-primary" />
                  )}
                </div>
                <p className="truncate text-sm text-muted-foreground">
                  {managingAgent.serviceArea}
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm text-foreground">
                  <Star className="size-3.5 fill-primary text-primary" />
                  {managingAgent.rating.toFixed(1)} ·{" "}
                  {managingAgent.experience.toString()} ปี
                </p>
              </div>
            </div>
          </Link>
        ) : (
          <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-subtle">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-accent text-primary">
              <UserRound className="size-6" />
            </div>
            <div>
              <p className="font-medium text-foreground">ติดต่อทีมขาย OURHOME</p>
              <p className="text-sm text-muted-foreground">
                ทีมงานพร้อมให้คำปรึกษาเกี่ยวกับโครงการนี้
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CTAs */}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          type="button"
          onClick={openBooking}
          className="h-12 rounded-full bg-primary text-primary-foreground shadow-gold"
          data-ocid="project_detail.interest"
        >
          สนใจโครงการนี้
        </Button>
        <Button
          type="button"
          variant="outline"
          asChild
          className="h-12 rounded-full border-border bg-card"
          data-ocid="project_detail.contact"
        >
          <Link
            to={managingAgent ? "/agents/$agentId" : "/contact"}
            params={
              managingAgent ? { agentId: String(managingAgent.id) } : undefined
            }
          >
            <UserRound className="size-4" />
            ติดต่อผู้ขาย
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={openBooking}
          className="h-12 rounded-full border-border bg-card"
          data-ocid="project_detail.book"
        >
          <CalendarClock className="size-4" />
          นัดชมบ้าน
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={shareProject}
          className="h-12 rounded-full border-border bg-card"
          data-ocid="project_detail.share"
        >
          <Share2 className="size-4" />
          {shareCopied ? "คัดลอกลิงก์แล้ว" : "ส่งต่อให้เพื่อน"}
        </Button>
      </div>

      {/* Booking dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              นัดชมโครงการ {project.name}
            </DialogTitle>
            <DialogDescription>
              เลือกวันและเวลาที่สะดวก ทีมขายจะติดต่อกลับเพื่อยืนยันการนัดหมาย
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="booking-name">ชื่อ-นามสกุล</Label>
              <Input
                id="booking-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="เช่น สมชาย ใจดี"
                className="rounded-xl border-border bg-background"
                data-ocid="project_detail.booking_name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="booking-phone">เบอร์โทรศัพท์</Label>
              <Input
                id="booking-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="เช่น 081-234-5678"
                className="rounded-xl border-border bg-background"
                data-ocid="project_detail.booking_phone"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="booking-date">วันที่</Label>
              <Input
                id="booking-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl border-border bg-background"
                data-ocid="project_detail.booking_date"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="booking-time">เวลา</Label>
              <Input
                id="booking-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="rounded-xl border-border bg-background"
                data-ocid="project_detail.booking_time"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="booking-visitors">จำนวนผู้เข้าชม</Label>
              <Input
                id="booking-visitors"
                type="number"
                min={1}
                value={visitors}
                onChange={(e) => setVisitors(e.target.value)}
                className="rounded-xl border-border bg-background"
                data-ocid="project_detail.booking_visitors"
              />
            </div>

            {!identity && (
              <p className="rounded-xl bg-accent p-3 text-sm text-accent-foreground">
                กรุณาเข้าสู่ระบบเพื่อยืนยันการนัดหมาย
              </p>
            )}

            {bookAppointment.isError && (
              <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                ไม่สามารถบันทึกการนัดหมายได้ กรุณาลองใหม่อีกครั้ง
              </p>
            )}

            <Button
              type="button"
              onClick={submitBooking}
              disabled={
                !identity ||
                !date ||
                !time ||
                !name ||
                !phone ||
                bookAppointment.isPending
              }
              className="h-12 w-full rounded-full bg-primary text-primary-foreground shadow-gold"
              data-ocid="project_detail.booking_submit"
            >
              {bookAppointment.isPending ? "กำลังบันทึก..." : "ยืนยันการนัดหมาย"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
