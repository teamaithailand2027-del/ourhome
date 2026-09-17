import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAgent,
  useHouses,
  useLikePost,
  usePost,
  useProject,
  useSharePost,
} from "@/hooks/useQueries";
import { ProjectStatus, formatBaht, timestampToDate } from "@/types";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Car,
  Heart,
  MapPin,
  Ruler,
  Share2,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FALLBACK_IMAGE = "/assets/generated/feed-garden-home.dim_800x600.jpg";

export default function PostDetail() {
  const { postId } = useParams({ from: "/posts/$postId" });
  const id = BigInt(postId);
  const { data: post, isLoading } = usePost(id);

  const projectId = post?.projectId;
  const { data: project } = useProject(projectId ?? -1n);
  const { data: agent } = useAgent(post?.agentId ?? -1n);
  const { data: houses } = useHouses(projectId ?? null);

  const likePost = useLikePost();
  const sharePost = useSharePost();

  const [imgSrc, setImgSrc] = useState<string | undefined>(undefined);

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

  if (!post) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="font-display text-2xl font-semibold text-foreground">
          ไม่พบโพสต์
        </p>
        <Button type="button" asChild className="mt-6 rounded-full">
          <Link to="/">กลับหน้าหลัก</Link>
        </Button>
      </div>
    );
  }

  const location = post.location ?? project?.location;
  const price = post.price ?? project?.startingPrice;
  const image = imgSrc ?? post.image ?? FALLBACK_IMAGE;
  const featuredHouse = houses && houses.length > 0 ? houses[0] : undefined;

  const mapSrc = project
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${(
        project.coordinates.lng - 0.02
      ).toFixed(4)}%2C${(project.coordinates.lat - 0.02).toFixed(4)}%2C${(
        project.coordinates.lng + 0.02
      ).toFixed(4)}%2C${(project.coordinates.lat + 0.02).toFixed(
        4,
      )}&layer=mapnik&marker=${project.coordinates.lat.toFixed(
        4,
      )}%2C${project.coordinates.lng.toFixed(4)}`
    : null;

  const handleLike = () =>
    likePost.mutate(post.id, {
      onSuccess: () => toast.success("ถูกใจโพสต์แล้ว"),
    });
  const handleShare = () =>
    sharePost.mutate(post.id, {
      onSuccess: () => toast.success("แชร์โพสต์แล้ว"),
    });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Button
        type="button"
        variant="ghost"
        asChild
        className="mb-6 rounded-full text-muted-foreground"
        data-ocid="post_detail.back"
      >
        <Link to="/">
          <ArrowLeft className="size-4" />
          กลับ
        </Link>
      </Button>

      {/* Media */}
      <div className="relative overflow-hidden rounded-3xl">
        <img
          src={image}
          alt={project?.name ?? "โพสต์โครงการ"}
          onError={() => setImgSrc(FALLBACK_IMAGE)}
          className="aspect-video w-full object-cover"
        />
        <div className="absolute left-4 top-4 flex gap-2">
          {project?.projectStatus === ProjectStatus.new_ && (
            <Badge className="bg-primary text-primary-foreground shadow-gold">
              ใหม่
            </Badge>
          )}
          {project?.verificationStatus === "verified" && (
            <Badge className="bg-card/90 text-foreground">Verified</Badge>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {project?.name ?? "โพสต์จากตัวแทน"}
          </h1>
          {location && (
            <p className="mt-2 flex items-center gap-1 text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              {location.subDistrict} · {location.district} · {location.province}
            </p>
          )}
          <p className="mt-1 text-sm text-muted-foreground">
            {post.createdAt
              ? `โพสต์เมื่อ ${timestampToDate(post.createdAt)?.toLocaleDateString(
                  "th-TH",
                )}`
              : ""}
          </p>
        </div>
        {price !== undefined && (
          <div className="rounded-2xl bg-card px-5 py-3 shadow-subtle">
            <p className="text-xs text-muted-foreground">ราคาเริ่มต้น</p>
            <p className="font-display text-2xl font-semibold text-primary">
              {formatBaht(price)}
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      {project && (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          โครงการ {project.name} ตั้งอยู่ที่ {project.location.subDistrict}{" "}
          {project.location.district} {project.location.province} นำเสนอแบบบ้าน{" "}
          {project.houseTypes.join(" และ ")} พร้อมสิ่งอำนวยความสะดวกครบครัน
          เหมาะสำหรับครอบครัวที่มองหาบ้านคุณภาพในทำเลที่เดินทางสะดวก
        </p>
      )}

      {/* Stats */}
      <div className="mt-6 flex flex-wrap items-center gap-6 text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Heart className="size-5 text-primary" />
          {post.likeCount.toString()} ถูกใจ
        </span>
        <span className="flex items-center gap-1.5">
          <Star className="size-5 fill-primary text-primary" />
          {post.interestedCount.toString()} สนใจ
        </span>
        <span className="flex items-center gap-1.5">
          <Share2 className="size-5 text-primary" />
          {post.shareCount.toString()} แชร์
        </span>
      </div>

      {/* House specs */}
      {featuredHouse && (
        <Card className="mt-8 rounded-2xl border-border/60 shadow-subtle">
          <CardContent className="p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              รายละเอียดบ้าน
            </p>
            <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-5">
              <div>
                <p className="text-xs text-muted-foreground">แบบบ้าน</p>
                <p className="mt-1 font-semibold text-foreground">
                  {featuredHouse.houseType}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">พื้นที่ใช้สอย</p>
                <p className="mt-1 flex items-center gap-1 font-semibold text-foreground">
                  <Ruler className="size-4 text-primary" />
                  {featuredHouse.usableArea.toString()} ตร.ม.
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ห้องนอน</p>
                <p className="mt-1 flex items-center gap-1 font-semibold text-foreground">
                  <BedDouble className="size-4 text-primary" />
                  {featuredHouse.bedrooms.toString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ห้องน้ำ</p>
                <p className="mt-1 flex items-center gap-1 font-semibold text-foreground">
                  <Bath className="size-4 text-primary" />
                  {featuredHouse.bathrooms.toString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">ที่จอดรถ</p>
                <p className="mt-1 flex items-center gap-1 font-semibold text-foreground">
                  <Car className="size-4 text-primary" />
                  {featuredHouse.parking.toString()} คัน
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Promotions */}
      {project && project.promotions.length > 0 && (
        <Card className="mt-6 rounded-2xl border-border/60 shadow-subtle">
          <CardContent className="p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              โปรโมชั่น
            </p>
            <div className="mt-3 space-y-2">
              {project.promotions.map((promo) => (
                <p
                  key={promo}
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <Star className="size-4 shrink-0 fill-primary text-primary" />
                  {promo}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map */}
      {mapSrc && (
        <Card className="mt-6 overflow-hidden rounded-2xl border-border/60 p-0 shadow-subtle">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 border-b border-border/60 px-6 py-4">
              <MapPin className="size-5 text-primary" />
              <p className="font-medium text-foreground">ทำเลที่ตั้งโครงการ</p>
            </div>
            <iframe
              title="แผนที่โครงการ"
              src={mapSrc}
              className="h-72 w-full border-0"
              loading="lazy"
              data-ocid="post_detail.map"
            />
          </CardContent>
        </Card>
      )}

      {/* Managing agent */}
      {agent && (
        <Card className="mt-6 rounded-2xl border-border/60 shadow-subtle">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-accent font-display text-xl font-semibold text-accent-foreground">
              {agent.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">ตัวแทนผู้ดูแลโครงการ</p>
              <div className="flex items-center gap-1.5">
                <h3 className="truncate font-display text-lg font-semibold text-foreground">
                  {agent.name}
                </h3>
                {agent.verified && (
                  <Star className="size-4 shrink-0 fill-primary text-primary" />
                )}
              </div>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Users className="size-3.5 text-primary" />
                {agent.rating.toFixed(1)} · {agent.customerCount.toString()}{" "}
                ลูกค้า
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTAs */}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          type="button"
          className="h-12 rounded-full bg-primary text-primary-foreground shadow-gold"
          data-ocid="post_detail.interested"
          onClick={handleLike}
        >
          <Heart className="size-4" />
          สนใจโครงการนี้
        </Button>
        <Button
          type="button"
          variant="outline"
          asChild
          className="h-12 rounded-full"
          data-ocid="post_detail.contact"
        >
          <Link
            to={agent ? "/agents/$agentId" : "/contact"}
            params={agent ? { agentId: String(agent.id) } : undefined}
          >
            <Users className="size-4" />
            ติดต่อผู้ขาย
          </Link>
        </Button>
        <Button
          type="button"
          asChild
          className="h-12 rounded-full bg-primary text-primary-foreground shadow-gold"
          data-ocid="post_detail.book"
        >
          <Link to="/booking">นัดชมบ้าน</Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-full"
          data-ocid="post_detail.share"
          onClick={handleShare}
        >
          <Share2 className="size-4" />
          ส่งต่อให้เพื่อน
        </Button>
      </div>
    </div>
  );
}
