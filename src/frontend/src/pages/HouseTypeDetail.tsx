import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddFavoriteHouseType,
  useHouses,
  useProjects,
} from "@/hooks/useQueries";
import { formatBaht } from "@/types";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Car,
  Heart,
  Home,
  LayoutGrid,
  MapPin,
  Play,
  Ruler,
} from "lucide-react";
import { toast } from "sonner";

const FALLBACK_IMAGE = "/assets/generated/feed-garden-home.dim_800x600.jpg";

export default function HouseTypeDetail() {
  const { houseType } = useParams({ from: "/house-types/$houseType" });
  const { data: projects, isLoading } = useProjects();
  const { data: houses } = useHouses();
  const addFavoriteHouseType = useAddFavoriteHouseType();
  const navigate = useNavigate();

  const project = (projects ?? []).find((p) =>
    p.houseTypes.includes(houseType),
  );
  const matchingHouses = (houses ?? []).filter(
    (h) => h.houseType === houseType,
  );
  const featured = matchingHouses[0];

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

  const heroImage =
    featured?.gallery[0] ??
    featured?.floorPlan ??
    project?.images[0] ??
    "/assets/images/placeholder.svg";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <Button
        type="button"
        variant="ghost"
        asChild
        className="mb-6 rounded-full text-muted-foreground"
        data-ocid="house_type_detail.back"
      >
        <Link to="/house-types">
          <ArrowLeft className="size-4" />
          กลับ
        </Link>
      </Button>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            แบบบ้าน
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {houseType}
          </h1>
          {project && (
            <p className="mt-2 flex items-center gap-1 text-muted-foreground">
              <MapPin className="size-4 text-primary" />
              มีในโครงการ {project.name} · {project.location.district} ·{" "}
              {project.location.province}
            </p>
          )}
        </div>
        {featured && (
          <div className="rounded-2xl bg-card px-4 py-3 shadow-subtle">
            <p className="text-xs text-muted-foreground">ราคาเริ่มต้น</p>
            <p className="font-display text-xl font-semibold text-primary">
              {formatBaht(featured.price)}
            </p>
          </div>
        )}
      </div>

      {matchingHouses.length > 0 ? (
        <>
          <div className="relative mt-6 overflow-hidden rounded-3xl">
            <img
              src={heroImage}
              alt={houseType}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE;
              }}
              className="aspect-video w-full object-cover"
            />
            {featured?.video && (
              <a
                href={featured.video}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 flex items-center justify-center"
                aria-label="ดูวิดีโอแบบบ้าน"
              >
                <span className="flex size-16 items-center justify-center rounded-full bg-card/90 shadow-elevated transition-transform hover:scale-105">
                  <Play className="size-7 fill-primary text-primary" />
                </span>
              </a>
            )}
          </div>

          {featured && (
            <Card className="mt-6 rounded-2xl border-border/60 shadow-subtle">
              <CardContent className="grid grid-cols-2 gap-6 p-6 sm:grid-cols-4">
                <div>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Ruler className="size-4 text-primary" /> พื้นที่ใช้สอย
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    {featured.usableArea.toString()} ตร.ม.
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <BedDouble className="size-4 text-primary" /> ห้องนอน
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    {featured.bedrooms.toString()} ห้อง
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Bath className="size-4 text-primary" /> ห้องน้ำ
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    {featured.bathrooms.toString()} ห้อง
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Car className="size-4 text-primary" /> ที่จอดรถ
                  </p>
                  <p className="mt-1 font-semibold text-foreground">
                    {featured.parking.toString()} คัน
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {featured?.floorPlan && (
            <div className="mt-8">
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                <LayoutGrid className="size-5 text-primary" />
                แบบแปลน
              </h2>
              <img
                src={featured.floorPlan}
                alt={`แบบแปลน ${houseType}`}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
                className="mt-4 w-full rounded-2xl border border-border/60 bg-card object-cover shadow-subtle"
              />
            </div>
          )}

          {featured && featured.gallery.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-xl font-semibold text-foreground">
                แกลเลอรี
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {featured.gallery.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${houseType} แกลเลอรี`}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="aspect-[4/3] w-full rounded-2xl object-cover shadow-subtle"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}

          {matchingHouses.length > 1 && (
            <div className="mt-8">
              <h2 className="font-display text-xl font-semibold text-foreground">
                แบบบ้านอื่นในหมวดนี้
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {matchingHouses.slice(1).map((house) => (
                  <Card
                    key={house.id.toString()}
                    className="rounded-2xl border-border/60 shadow-subtle"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {house.houseType}
                        </h3>
                        <span className="font-semibold text-primary">
                          {formatBaht(house.price)}
                        </span>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <BedDouble className="size-4 text-primary" />
                          {house.bedrooms.toString()} ห้องนอน
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Bath className="size-4 text-primary" />
                          {house.bathrooms.toString()} ห้องน้ำ
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Ruler className="size-4 text-primary" />
                          {house.usableArea.toString()} ตร.ม.
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Car className="size-4 text-primary" />
                          {house.parking.toString()} คัน
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              asChild
              className="h-12 flex-1 rounded-full bg-primary text-primary-foreground shadow-gold"
              data-ocid="house_type_detail.book"
            >
              <Link to="/booking">นัดหมายชมโครงการ</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="h-12 flex-1 rounded-full"
              disabled={addFavoriteHouseType.isPending}
              onClick={() =>
                addFavoriteHouseType.mutate(houseType, {
                  onSuccess: () => {
                    toast.success("เพิ่มแบบบ้านในรายการโปรดแล้ว");
                    void navigate({ to: "/favorites" });
                  },
                })
              }
              data-ocid="house_type_detail.favorite"
            >
              <Heart className="size-4" />
              {addFavoriteHouseType.isPending ? "กำลังเพิ่ม..." : "เพิ่มรายการโปรด"}
            </Button>
          </div>
        </>
      ) : (
        <div
          className="mt-8 rounded-2xl border border-dashed border-border bg-card p-12 text-center"
          data-ocid="house_type_detail.empty_state"
        >
          <Home className="mx-auto size-8 text-primary" />
          <p className="mt-3 font-medium text-foreground">ยังไม่มีบ้านในแบบนี้</p>
          <p className="mt-1 text-sm text-muted-foreground">
            บ้านในแบบ {houseType} จะปรากฏที่นี่เมื่อพร้อม
          </p>
        </div>
      )}
    </div>
  );
}
