import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/ProjectCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { useProjects } from "@/hooks/useQueries";
import type { ProjectFilter } from "@/types";
import { MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

interface FilterState {
  name?: string;
  province?: string;
  district?: string;
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  houseType?: string;
  bedrooms?: string;
  usableArea?: string;
  readyToMove?: string;
  newProject?: string;
  promotion?: string;
}

const FILTER_KEYS: (keyof FilterState)[] = [
  "name",
  "province",
  "district",
  "location",
  "minPrice",
  "maxPrice",
  "houseType",
  "bedrooms",
  "usableArea",
  "readyToMove",
  "newProject",
  "promotion",
];

function readInitial(): FilterState {
  const params = new URLSearchParams(window.location.search);
  const state: FilterState = {};
  for (const key of FILTER_KEYS) {
    const value = params.get(key);
    if (value) state[key] = value;
  }
  return state;
}

function writeUrl(state: FilterState) {
  const params = new URLSearchParams();
  for (const key of FILTER_KEYS) {
    const value = state[key];
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  window.history.replaceState(
    null,
    "",
    qs ? `${window.location.pathname}?${qs}` : window.location.pathname,
  );
}

const PRICE_RANGES = [
  { label: "ต่ำกว่า 2 ล้าน", min: "0", max: "2000000" },
  { label: "2 – 5 ล้าน", min: "2000000", max: "5000000" },
  { label: "5 – 10 ล้าน", min: "5000000", max: "10000000" },
  { label: "10 – 20 ล้าน", min: "10000000", max: "20000000" },
  { label: "มากกว่า 20 ล้าน", min: "20000000", max: "" },
];

const BEDROOM_OPTIONS = ["1", "2", "3", "4", "5"];
const AREA_OPTIONS = ["50", "100", "150", "200", "300"];

export default function Projects() {
  const [state, setState] = useState<FilterState>(readInitial);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Unfiltered list used to derive filter options (provinces, districts, types).
  const { data: allProjects } = useProjects();
  const filter: ProjectFilter = useMemo(() => {
    const f: ProjectFilter = {};
    if (state.name) f.name = state.name;
    if (state.province) f.province = state.province;
    if (state.district) f.district = state.district;
    if (state.location) f.location = state.location;
    if (state.minPrice) f.minPrice = BigInt(state.minPrice);
    if (state.maxPrice) f.maxPrice = BigInt(state.maxPrice);
    if (state.houseType) f.houseType = state.houseType;
    if (state.bedrooms) f.bedrooms = BigInt(state.bedrooms);
    if (state.usableArea) f.usableArea = BigInt(state.usableArea);
    if (state.readyToMove === "1") f.readyToMove = true;
    if (state.newProject === "1") f.newProject = true;
    if (state.promotion === "1") f.promotion = true;
    return f;
  }, [state]);

  const { data: projects, isLoading } = useProjects(filter);

  const provinces = useMemo(
    () =>
      Array.from(
        new Set((allProjects ?? []).map((p) => p.location.province)),
      ).sort(),
    [allProjects],
  );
  const districts = useMemo(
    () =>
      Array.from(
        new Set((allProjects ?? []).map((p) => p.location.district)),
      ).sort(),
    [allProjects],
  );
  const houseTypes = useMemo(
    () =>
      Array.from(
        new Set((allProjects ?? []).flatMap((p) => p.houseTypes)),
      ).sort(),
    [allProjects],
  );

  const activeCount = FILTER_KEYS.filter((k) => state[k]).length;

  function update(patch: Partial<FilterState>) {
    const next = { ...state, ...patch };
    setState(next);
    writeUrl(next);
  }

  function clearAll() {
    setState({});
    writeUrl({});
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        eyebrow="โครงการ"
        title="โครงการทั้งหมด"
        description="ค้นหาโครงการบ้านและคอนโดคุณภาพจากทั่วประเทศไทย พร้อมกรองตามทำเล ราคา และแบบบ้าน"
      />

      {/* Search + filter toggle */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={state.name ?? ""}
            onChange={(e) => update({ name: e.target.value || undefined })}
            placeholder="ค้นหาโครงการตามชื่อ"
            className="h-12 rounded-full border-border bg-card pl-10 shadow-subtle"
            data-ocid="projects.search_input"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setFiltersOpen((v) => !v)}
          className="h-12 rounded-full border-border bg-card px-5 shadow-subtle"
          data-ocid="projects.filter_toggle"
        >
          <SlidersHorizontal className="size-4" />
          ตัวกรอง
          {activeCount > 0 && (
            <Badge className="ml-1 rounded-full bg-primary text-primary-foreground">
              {activeCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters */}
      {filtersOpen && (
        <div
          className="mb-8 rounded-2xl border border-border/60 bg-card p-5 shadow-subtle"
          data-ocid="projects.filter_panel"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-lg font-semibold text-foreground">
              ตัวกรองโครงการ
            </p>
            {activeCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                onClick={clearAll}
                className="h-8 rounded-full text-muted-foreground"
                data-ocid="projects.filter_clear"
              >
                <X className="size-4" />
                ล้างทั้งหมด
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="province">จังหวัด</Label>
              <Select
                value={state.province ?? ""}
                onValueChange={(v) => update({ province: v || undefined })}
              >
                <SelectTrigger id="province" className="w-full">
                  <SelectValue placeholder="ทุกจังหวัด" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="district">อำเภอ</Label>
              <Select
                value={state.district ?? ""}
                onValueChange={(v) => update({ district: v || undefined })}
              >
                <SelectTrigger id="district" className="w-full">
                  <SelectValue placeholder="ทุกอำเภอ" />
                </SelectTrigger>
                <SelectContent>
                  {districts.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location">ทำเล / ตำบล</Label>
              <Input
                id="location"
                value={state.location ?? ""}
                onChange={(e) =>
                  update({ location: e.target.value || undefined })
                }
                placeholder="เช่น สุขุมวิท, บางนา"
                className="rounded-xl border-border bg-background"
                data-ocid="projects.location_input"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="price">ช่วงราคา</Label>
              <Select
                value={
                  state.minPrice
                    ? `${state.minPrice}-${state.maxPrice ?? ""}`
                    : ""
                }
                onValueChange={(v) => {
                  const range = PRICE_RANGES.find(
                    (r) => `${r.min}-${r.max}` === v,
                  );
                  update({
                    minPrice: range?.min || undefined,
                    maxPrice: range?.max || undefined,
                  });
                }}
              >
                <SelectTrigger id="price" className="w-full">
                  <SelectValue placeholder="ทุกราคา" />
                </SelectTrigger>
                <SelectContent>
                  {PRICE_RANGES.map((r) => (
                    <SelectItem key={r.label} value={`${r.min}-${r.max}`}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="houseType">แบบบ้าน</Label>
              <Select
                value={state.houseType ?? ""}
                onValueChange={(v) => update({ houseType: v || undefined })}
              >
                <SelectTrigger id="houseType" className="w-full">
                  <SelectValue placeholder="ทุกแบบ" />
                </SelectTrigger>
                <SelectContent>
                  {houseTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bedrooms">ห้องนอน</Label>
              <Select
                value={state.bedrooms ?? ""}
                onValueChange={(v) => update({ bedrooms: v || undefined })}
              >
                <SelectTrigger id="bedrooms" className="w-full">
                  <SelectValue placeholder="ทุกจำนวน" />
                </SelectTrigger>
                <SelectContent>
                  {BEDROOM_OPTIONS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b} ห้องนอนขึ้นไป
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="usableArea">พื้นที่ใช้สอย</Label>
              <Select
                value={state.usableArea ?? ""}
                onValueChange={(v) => update({ usableArea: v || undefined })}
              >
                <SelectTrigger id="usableArea" className="w-full">
                  <SelectValue placeholder="ทุกขนาด" />
                </SelectTrigger>
                <SelectContent>
                  {AREA_OPTIONS.map((a) => (
                    <SelectItem key={a} value={a}>
                      ตั้งแต่ {a} ตร.ม.
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>สถานะโครงการ</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant={state.readyToMove === "1" ? "default" : "outline"}
                  onClick={() =>
                    update({
                      readyToMove: state.readyToMove === "1" ? undefined : "1",
                    })
                  }
                  className="h-9 rounded-full"
                  data-ocid="projects.ready_toggle"
                >
                  พร้อมอยู่
                </Button>
                <Button
                  type="button"
                  variant={state.newProject === "1" ? "default" : "outline"}
                  onClick={() =>
                    update({
                      newProject: state.newProject === "1" ? undefined : "1",
                    })
                  }
                  className="h-9 rounded-full"
                  data-ocid="projects.new_toggle"
                >
                  โครงการใหม่
                </Button>
                <Button
                  type="button"
                  variant={state.promotion === "1" ? "default" : "outline"}
                  onClick={() =>
                    update({
                      promotion: state.promotion === "1" ? undefined : "1",
                    })
                  }
                  className="h-9 rounded-full"
                  data-ocid="projects.promotion_toggle"
                >
                  มีโปรโมชัน
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
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
      ) : projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id.toString()} project={project} />
          ))}
        </div>
      ) : (
        <div
          className="rounded-2xl border border-dashed border-border bg-card p-12 text-center"
          data-ocid="projects.empty_state"
        >
          <MapPin className="mx-auto size-8 text-primary" />
          <p className="mt-3 font-medium text-foreground">
            ไม่พบโครงการที่ตรงกับเงื่อนไข
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            ลองปรับตัวกรองหรือค้นหาด้วยคำอื่น
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={clearAll}
            className="mt-6 rounded-full"
            data-ocid="projects.empty_reset"
          >
            ล้างตัวกรองทั้งหมด
          </Button>
        </div>
      )}
    </div>
  );
}
