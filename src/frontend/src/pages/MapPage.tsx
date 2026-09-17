import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/hooks/useQueries";
import { formatBaht } from "@/types";
import { Link } from "@tanstack/react-router";
import { MapPin, Search, Star } from "lucide-react";
import { useMemo, useState } from "react";

export default function MapPage() {
  const { data: projects, isLoading } = useProjects();
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("all");
  const [selectedId, setSelectedId] = useState<bigint | null>(null);

  const provinces = useMemo(
    () =>
      Array.from(
        new Set((projects ?? []).map((p) => p.location.province)),
      ).sort(),
    [projects],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (projects ?? []).filter((p) => {
      if (province !== "all" && p.location.province !== province) return false;
      if (!q) return true;
      const haystack = [
        p.name,
        p.location.province,
        p.location.district,
        p.location.subDistrict,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [projects, query, province]);

  const selected = filtered.find((p) => p.id === selectedId) ?? null;

  const positions = useMemo(() => {
    if (filtered.length === 0) return [];
    const lats = filtered.map((p) => p.coordinates.lat);
    const lngs = filtered.map((p) => p.coordinates.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const latSpan = maxLat - minLat || 1;
    const lngSpan = maxLng - minLng || 1;
    return filtered.map((p) => ({
      project: p,
      x: ((p.coordinates.lng - minLng) / lngSpan) * 84 + 8,
      y: 90 - ((p.coordinates.lat - minLat) / latSpan) * 80,
    }));
  }, [filtered]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        eyebrow="แผนที่"
        title="ค้นหาโครงการตามทำเล"
        description="ค้นหาจากจังหวัด อำเภอ ตำบล สถานที่สำคัญ ถนน โรงเรียน โรงพยาบาล หรือห้างสรรพสินค้า"
      />

      <Card className="rounded-2xl border-border/60 shadow-subtle">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหา จังหวัด อำเภอ ตำบล สถานที่สำคัญ ถนน..."
                className="h-11 rounded-full pl-9"
                data-ocid="map.search_input"
              />
            </div>
            <Select value={province} onValueChange={setProvince}>
              <SelectTrigger
                className="h-11 w-full rounded-full sm:w-48"
                data-ocid="map.province_select"
              >
                <SelectValue placeholder="ทุกจังหวัด" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกจังหวัด</SelectItem>
                {provinces.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            พบ {filtered.length} โครงการ
          </p>
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton className="mt-6 aspect-[4/3] w-full rounded-3xl" />
      ) : filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-5">
          <Card className="overflow-hidden rounded-3xl border-border/60 shadow-subtle lg:col-span-3">
            <div className="relative aspect-[4/3] w-full bg-gradient-subtle">
              <svg
                viewBox="0 0 100 100"
                className="size-full"
                role="img"
                aria-label="แผนที่แสดงตำแหน่งโครงการ"
              >
                {Array.from({ length: 9 }, (_, i) => `grid-v-${i}`).map(
                  (id, i) => (
                    <line
                      key={id}
                      x1={i * 12.5}
                      y1="0"
                      x2={i * 12.5}
                      y2="100"
                      stroke="oklch(0.9 0.025 85)"
                      strokeWidth="0.3"
                    />
                  ),
                )}
                {Array.from({ length: 9 }, (_, i) => `grid-h-${i}`).map(
                  (id, i) => (
                    <line
                      key={id}
                      x1="0"
                      y1={i * 12.5}
                      x2="100"
                      y2={i * 12.5}
                      stroke="oklch(0.9 0.025 85)"
                      strokeWidth="0.3"
                    />
                  ),
                )}
                <path
                  d="M0 30 C 20 25, 40 40, 60 30 S 90 20, 100 25"
                  fill="none"
                  stroke="oklch(0.85 0.03 85)"
                  strokeWidth="1.2"
                />
                <path
                  d="M0 70 C 25 65, 45 78, 70 70 S 95 60, 100 65"
                  fill="none"
                  stroke="oklch(0.85 0.03 85)"
                  strokeWidth="1.2"
                />
                <path
                  d="M25 0 C 30 30, 20 60, 30 100"
                  fill="none"
                  stroke="oklch(0.85 0.03 85)"
                  strokeWidth="1.2"
                />
                <path
                  d="M70 0 C 65 35, 80 65, 72 100"
                  fill="none"
                  stroke="oklch(0.85 0.03 85)"
                  strokeWidth="1.2"
                />
              </svg>
              {positions.map(({ project, x, y }, i) => {
                const isSelected = selected?.id === project.id;
                return (
                  <button
                    key={project.id.toString()}
                    type="button"
                    onClick={() => setSelectedId(project.id)}
                    aria-label={`${project.name} ราคาเริ่มต้น ${formatBaht(project.startingPrice)}`}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}%`, top: `${y}%` }}
                    data-ocid={`map.marker.${i + 1}`}
                  >
                    <span
                      className={`block rounded-full transition-transform ${
                        isSelected ? "scale-125" : "hover:scale-110"
                      }`}
                    >
                      <span
                        className={`block rounded-full ${
                          isSelected
                            ? "bg-primary ring-4 ring-primary/25"
                            : "bg-primary/80"
                        }`}
                        style={{ width: 18, height: 18 }}
                      />
                    </span>
                  </button>
                );
              })}
              {selected && (
                <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-72">
                  <Card className="rounded-2xl border-border/60 shadow-elevated">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-display text-base font-semibold text-foreground">
                            {selected.name}
                          </h3>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="size-3 text-primary" />
                            {selected.location.district} ·{" "}
                            {selected.location.province}
                          </p>
                        </div>
                        <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                          <Star className="size-3.5 fill-primary text-primary" />
                          {selected.reviewRating.toFixed(1)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary">
                          เริ่มต้น {formatBaht(selected.startingPrice)}
                        </span>
                        <Button
                          type="button"
                          asChild
                          size="sm"
                          className="rounded-full bg-primary text-primary-foreground shadow-gold"
                          data-ocid="map.view_details"
                        >
                          <Link
                            to="/projects/$projectId"
                            params={{ projectId: String(selected.id) }}
                          >
                            ดูรายละเอียด
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </Card>

          <div className="lg:col-span-2">
            <h2 className="font-display text-lg font-semibold text-foreground">
              โครงการในผลการค้นหา
            </h2>
            <div className="mt-3 space-y-3">
              {filtered.map((project, i) => (
                <button
                  key={project.id.toString()}
                  type="button"
                  onClick={() => setSelectedId(project.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition-smooth ${
                    selected?.id === project.id
                      ? "border-primary bg-accent/40"
                      : "border-border/60 bg-card hover:border-primary/40"
                  }`}
                  data-ocid={`map.result.${i + 1}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {project.name}
                    </h3>
                    <span className="text-sm font-semibold text-primary">
                      {formatBaht(project.startingPrice)}
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3 text-primary" />
                    {project.location.subDistrict} · {project.location.district}{" "}
                    · {project.location.province}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div
          className="mt-6 rounded-2xl border border-dashed border-border bg-card p-12 text-center"
          data-ocid="map.empty_state"
        >
          <MapPin className="mx-auto size-8 text-primary" />
          <p className="mt-3 font-medium text-foreground">ไม่พบโครงการ</p>
          <p className="mt-1 text-sm text-muted-foreground">
            ลองเปลี่ยนคำค้นหาหรือเลือกจังหวัดอื่น
          </p>
        </div>
      )}
    </div>
  );
}
