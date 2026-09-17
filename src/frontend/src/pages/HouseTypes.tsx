import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHouses, useProjects } from "@/hooks/useQueries";
import { formatBaht } from "@/types";
import { Link } from "@tanstack/react-router";
import { Home, MapPin } from "lucide-react";

const FALLBACK_IMAGE = "/assets/generated/feed-townhome.dim_800x600.jpg";

export default function HouseTypes() {
  const { data: projects, isLoading } = useProjects();
  const { data: houses } = useHouses();

  const houseTypes = Array.from(
    new Set((projects ?? []).flatMap((p) => p.houseTypes)),
  );

  const typeStats = houseTypes.map((type) => {
    const typeHouses = (houses ?? []).filter((h) => h.houseType === type);
    const minPrice = typeHouses.length
      ? typeHouses.reduce(
          (min, h) => (h.price < min ? h.price : min),
          typeHouses[0].price,
        )
      : null;
    const image =
      typeHouses[0]?.gallery[0] ??
      typeHouses[0]?.floorPlan ??
      (projects ?? []).find((p) => p.houseTypes.includes(type))?.images[0] ??
      "/assets/images/placeholder.svg";
    return { type, count: typeHouses.length, minPrice, image };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        eyebrow="แบบบ้าน"
        title="แบบบ้านทั้งหมด"
        description="เลือกแบบบ้านที่เหมาะกับไลฟ์สไตล์ของคุณ"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map((id) => (
            <div key={id} className="space-y-3">
              <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : houseTypes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {typeStats.map(({ type, count, minPrice, image }) => (
            <Link
              key={type}
              to="/house-types/$houseType"
              params={{ houseType: type }}
            >
              <Card className="group overflow-hidden rounded-2xl border-border/60 p-0 shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={image}
                    alt={type}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute left-3 top-3">
                    <Badge className="bg-card/90 text-foreground shadow-subtle">
                      {count} หลัง
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                    {type}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {minPrice
                        ? `เริ่มต้น ${formatBaht(minPrice)}`
                        : "ดูรายละเอียด"}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3.5 text-primary" />
                      ดูแบบบ้าน
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div
          className="rounded-2xl border border-dashed border-border bg-card p-12 text-center"
          data-ocid="house_types.empty_state"
        >
          <Home className="mx-auto size-8 text-primary" />
          <p className="mt-3 font-medium text-foreground">ยังไม่มีแบบบ้าน</p>
          <p className="mt-1 text-sm text-muted-foreground">
            แบบบ้านจะปรากฏที่นี่เมื่อมีโครงการ
          </p>
        </div>
      )}
    </div>
  );
}
