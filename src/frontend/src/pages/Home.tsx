import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddSavedPost,
  useAgents,
  useHouses,
  useLikePost,
  usePosts,
  useProjects,
  useSharePost,
  useSmartSearch,
} from "@/hooks/useQueries";
import type { Agent, House, Post, Project } from "@/types";
import {
  HouseStatus,
  ProjectStatus,
  formatBaht,
  timestampToDate,
} from "@/types";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bath,
  BedDouble,
  Car,
  Heart,
  MapPin,
  MessageCircle,
  Ruler,
  Search,
  Share2,
  Star,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const FEED_FALLBACKS = [
  "/assets/generated/feed-garden-home.dim_800x600.jpg",
  "/assets/generated/feed-townhome.dim_800x600.jpg",
  "/assets/generated/feed-luxury-villa.dim_800x600.jpg",
];

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          {eyebrow}
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

function FeedPostCard({
  post,
  project,
  agent,
  fallbackImage,
  onLike,
  onShare,
  onSave,
}: {
  post: Post;
  project?: Project;
  agent?: Agent;
  fallbackImage: string;
  onLike: (id: bigint) => void;
  onShare: (id: bigint) => void;
  onSave: (id: bigint) => void;
}) {
  const [imgSrc, setImgSrc] = useState(post.image ?? fallbackImage);
  const location = post.location ?? project?.location;
  const price = post.price ?? project?.startingPrice;

  return (
    <Card className="overflow-hidden rounded-3xl border-border/60 p-0 shadow-subtle transition-smooth hover:shadow-elevated">
      <Link
        to="/posts/$postId"
        params={{ postId: String(post.id) }}
        className="block"
        data-ocid={`home.post.${post.id.toString()}`}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={imgSrc}
            alt={project?.name ?? "โพสต์โครงการ"}
            onError={() => setImgSrc(fallbackImage)}
            className="size-full object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            {project?.projectStatus === ProjectStatus.new_ && (
              <Badge className="bg-primary text-primary-foreground shadow-gold">
                ใหม่
              </Badge>
            )}
            {project?.verificationStatus === "verified" && (
              <Badge className="bg-card/90 text-foreground">Verified</Badge>
            )}
          </div>
          {price !== undefined && (
            <div className="absolute bottom-3 right-3 rounded-full bg-card/90 px-3 py-1 text-sm font-semibold text-foreground shadow-subtle">
              {formatBaht(price)}
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-5">
        <Link
          to="/posts/$postId"
          params={{ postId: String(post.id) }}
          className="block"
        >
          <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
            {project?.name ?? "โพสต์จากตัวแทน"}
          </h3>
          {location && (
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-3.5 text-primary" />
              {location.district} · {location.province}
            </p>
          )}
        </Link>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {agent && (
            <span className="flex items-center gap-1">
              <Users className="size-3.5 text-primary" />
              {agent.name}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Star className="size-3.5 fill-primary text-primary" />
            {post.interestedCount.toString()} สนใจ
          </span>
          <span className="text-xs">
            {post.createdAt
              ? timestampToDate(post.createdAt)?.toLocaleDateString("th-TH")
              : ""}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="ถูกใจ"
              data-ocid={`home.post.like.${post.id.toString()}`}
              className="rounded-full text-muted-foreground hover:text-primary"
              onClick={() => onLike(post.id)}
            >
              <Heart className="size-5" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {post.likeCount.toString()}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              asChild
              aria-label="แสดงความคิดเห็น"
              data-ocid={`home.post.comment.${post.id.toString()}`}
              className="rounded-full text-muted-foreground hover:text-primary"
            >
              <Link to="/posts/$postId" params={{ postId: String(post.id) }}>
                <MessageCircle className="size-5" />
              </Link>
            </Button>
            <span className="text-xs text-muted-foreground">
              {post.commentCount.toString()}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="แชร์"
              data-ocid={`home.post.share.${post.id.toString()}`}
              className="rounded-full text-muted-foreground hover:text-primary"
              onClick={() => onShare(post.id)}
            >
              <Share2 className="size-5" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {post.shareCount.toString()}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="บันทึก"
              data-ocid={`home.post.save.${post.id.toString()}`}
              className="rounded-full text-muted-foreground hover:text-primary"
              onClick={() => onSave(post.id)}
            >
              <Star className="size-5" />
            </Button>
          </div>
          <Button
            type="button"
            asChild
            className="h-9 rounded-full bg-primary px-4 text-sm text-primary-foreground shadow-gold"
            data-ocid={`home.post.contact.${post.id.toString()}`}
          >
            <Link to="/posts/$postId" params={{ postId: String(post.id) }}>
              ติดต่อทันที
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function HouseCard({
  house,
  project,
  fallbackImage,
}: {
  house: House;
  project?: Project;
  fallbackImage: string;
}) {
  const [imgSrc, setImgSrc] = useState(house.gallery[0] ?? fallbackImage);
  const ready = house.status === HouseStatus.readyToMove;

  return (
    <Card className="group overflow-hidden rounded-2xl border-border/60 p-0 shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imgSrc}
          alt={house.houseType}
          onError={() => setImgSrc(fallbackImage)}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute left-3 top-3">
          <Badge
            className={
              ready
                ? "bg-primary text-primary-foreground shadow-gold"
                : "bg-card/90 text-foreground"
            }
          >
            {ready ? "พร้อมอยู่" : "กำลังก่อสร้าง"}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3 rounded-full bg-card/90 px-3 py-1 text-sm font-semibold text-foreground shadow-subtle">
          {formatBaht(house.price)}
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
          {house.houseType}
        </h3>
        {project && (
          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="size-3.5 text-primary" />
            {project.name}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Ruler className="size-3.5 text-primary" />
            {house.usableArea.toString()} ตร.ม.
          </span>
          <span className="flex items-center gap-1">
            <BedDouble className="size-3.5 text-primary" />
            {house.bedrooms.toString()} ห้องนอน
          </span>
          <span className="flex items-center gap-1">
            <Bath className="size-3.5 text-primary" />
            {house.bathrooms.toString()} ห้องน้ำ
          </span>
          <span className="flex items-center gap-1">
            <Car className="size-3.5 text-primary" />
            {house.parking.toString()} คัน
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: agents, isLoading: agentsLoading } = useAgents();
  const { data: houses, isLoading: housesLoading } = useHouses();

  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const { data: searchResults, isLoading: searchLoading } =
    useSmartSearch(submittedQuery);

  const likePost = useLikePost();
  const sharePost = useSharePost();
  const savePost = useAddSavedPost();

  const handleSearch = () => {
    setSubmittedQuery(searchQuery.trim());
  };

  const projectById = useMemo(
    () => new Map((projects ?? []).map((p) => [p.id, p])),
    [projects],
  );
  const agentById = useMemo(
    () => new Map((agents ?? []).map((a) => [a.id, a])),
    [agents],
  );

  const featuredHouses = houses ?? [];
  const specialPriceHouses = [...featuredHouses].sort((a, b) =>
    a.price < b.price ? -1 : a.price > b.price ? 1 : 0,
  );
  const readyHouses = featuredHouses.filter(
    (h) => h.status === HouseStatus.readyToMove,
  );
  const promotions = (projects ?? []).filter((p) => p.promotions.length > 0);
  const houseTypes = Array.from(
    new Set((projects ?? []).flatMap((p) => p.houseTypes)),
  );

  const handleLike = (id: bigint) =>
    likePost.mutate(id, {
      onSuccess: () => toast.success("ถูกใจโพสต์แล้ว"),
    });
  const handleShare = (id: bigint) =>
    sharePost.mutate(id, {
      onSuccess: () => toast.success("แชร์โพสต์แล้ว"),
    });
  const handleSave = (id: bigint) =>
    savePost.mutate(id, {
      onSuccess: () => toast.success("บันทึกโพสต์แล้ว"),
    });

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Hero */}
      <section className="py-10 md:py-16">
        <div className="relative overflow-hidden rounded-3xl">
          <img
            src="/assets/generated/hero-home.dim_1200x800.jpg"
            alt="บ้านพักอาศัยหรูสไตล์โมเดิร์นในยามเย็น"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="relative p-8 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              OURHOME · บ้านที่ทุกคนใฝ่ฝัน
            </p>
            <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl">
              ค้นหาบ้านในฝันของคุณ{" "}
              <span className="text-gradient-gold">ได้ในที่เดียว</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              รวมโครงการบ้านและคอนโดคุณภาพจากตัวแทนที่ได้รับการรับรอง ทั่วประเทศไทย
              พร้อมข้อมูลครบถ้วนและนัดหมายชมโครงการได้ทันที
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                  placeholder="ค้นหาโครงการหรือทำเลที่ต้องการ เช่น บ้านเดี่ยวกาญจนบุรี งบไม่เกิน 3 ล้าน"
                  className="h-12 rounded-full border-border bg-card pl-10 shadow-subtle"
                  data-ocid="home.search_input"
                />
              </div>
              <Button
                type="button"
                onClick={handleSearch}
                className="h-12 rounded-full bg-primary px-6 text-primary-foreground shadow-gold"
                data-ocid="home.search_button"
              >
                ค้นหา
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Smart search results */}
      {submittedQuery && (
        <section className="py-8">
          <SectionHeader
            eyebrow="ผลการค้นหา"
            title={`ผลลัพธ์สำหรับ "${submittedQuery}"`}
          />
          {searchLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }, (_, i) => `search-skeleton-${i}`).map(
                (id) => (
                  <Skeleton key={id} className="h-72 w-full rounded-2xl" />
                ),
              )}
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((project) => (
                <Link
                  key={project.id.toString()}
                  to="/projects/$projectId"
                  params={{ projectId: String(project.id) }}
                >
                  <Card className="group overflow-hidden rounded-2xl border-border/60 p-0 shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={
                          project.images[0] ??
                          FEED_FALLBACKS[
                            Number(project.id) % FEED_FALLBACKS.length
                          ]
                        }
                        alt={project.name}
                        onError={(e) => {
                          e.currentTarget.src =
                            FEED_FALLBACKS[
                              Number(project.id) % FEED_FALLBACKS.length
                            ];
                        }}
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute bottom-3 right-3 rounded-full bg-card/90 px-3 py-1 text-sm font-semibold text-foreground shadow-subtle">
                        {formatBaht(project.startingPrice)}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                        {project.name}
                      </h3>
                      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="size-3.5 text-primary" />
                        {project.location.district} ·{" "}
                        {project.location.province}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                          <Star className="size-4 fill-primary text-primary" />
                          {project.reviewRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {project.unitCount.toString()} ยูนิต
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div
              className="rounded-2xl border border-dashed border-border bg-card p-10 text-center"
              data-ocid="home.search_empty"
            >
              <Search className="mx-auto size-8 text-primary" />
              <p className="mt-3 font-medium text-foreground">
                ไม่พบโครงการที่ตรงกับคำค้นหา
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                ลองปรับคำค้นหา เช่น เปลี่ยนทำเลหรือช่วงงบประมาณ
              </p>
            </div>
          )}
        </section>
      )}

      {/* Featured projects */}
      <section className="py-8">
        <SectionHeader
          eyebrow="โครงการแนะนำ"
          title="โครงการเด่น"
          action={
            <Button
              type="button"
              variant="ghost"
              asChild
              className="rounded-full text-primary"
              data-ocid="home.view_all_projects"
            >
              <Link to="/projects">
                ดูทั้งหมด
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />
        {projectsLoading ? (
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
            {projects.slice(0, 6).map((project) => (
              <Link
                key={project.id.toString()}
                to="/projects/$projectId"
                params={{ projectId: String(project.id) }}
              >
                <Card className="group overflow-hidden rounded-2xl border-border/60 p-0 shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={
                        project.images[0] ??
                        FEED_FALLBACKS[
                          Number(project.id) % FEED_FALLBACKS.length
                        ]
                      }
                      alt={project.name}
                      onError={(e) => {
                        e.currentTarget.src =
                          FEED_FALLBACKS[
                            Number(project.id) % FEED_FALLBACKS.length
                          ];
                      }}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute left-3 top-3 flex gap-2">
                      {project.verificationStatus === "verified" && (
                        <Badge className="bg-primary text-primary-foreground shadow-gold">
                          Verified
                        </Badge>
                      )}
                      {project.projectStatus === ProjectStatus.new_ && (
                        <Badge className="bg-card/90 text-foreground">
                          ใหม่
                        </Badge>
                      )}
                    </div>
                    <div className="absolute bottom-3 right-3 rounded-full bg-card/90 px-3 py-1 text-sm font-semibold text-foreground shadow-subtle">
                      {formatBaht(project.startingPrice)}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                      {project.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 text-primary" />
                      {project.location.district} · {project.location.province}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-sm font-medium text-foreground">
                        <Star className="size-4 fill-primary text-primary" />
                        {project.reviewRating.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {project.unitCount.toString()} ยูนิต
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl border border-dashed border-border bg-card p-10 text-center"
            data-ocid="home.projects_empty"
          >
            <MapPin className="mx-auto size-8 text-primary" />
            <p className="mt-3 font-medium text-foreground">ยังไม่มีโครงการ</p>
            <p className="mt-1 text-sm text-muted-foreground">
              โครงการใหม่จะปรากฏที่นี่เมื่อพร้อม
            </p>
          </div>
        )}
      </section>

      {/* New project posts feed */}
      <section className="py-8">
        <SectionHeader eyebrow="ฟีด" title="โพสต์ล่าสุด" />
        {postsLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => `post-skeleton-${i}`).map(
              (id) => (
                <Skeleton key={id} className="h-80 w-full rounded-3xl" />
              ),
            )}
          </div>
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <FeedPostCard
                key={post.id.toString()}
                post={post}
                project={
                  post.projectId !== undefined
                    ? projectById.get(post.projectId)
                    : undefined
                }
                agent={
                  post.agentId !== undefined
                    ? agentById.get(post.agentId)
                    : undefined
                }
                fallbackImage={FEED_FALLBACKS[index % FEED_FALLBACKS.length]}
                onLike={handleLike}
                onShare={handleShare}
                onSave={handleSave}
              />
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl border border-dashed border-border bg-card p-10 text-center"
            data-ocid="home.posts_empty"
          >
            <MessageCircle className="mx-auto size-8 text-primary" />
            <p className="mt-3 font-medium text-foreground">ยังไม่มีโพสต์</p>
            <p className="mt-1 text-sm text-muted-foreground">
              โพสต์จากตัวแทนจะปรากฏที่นี่
            </p>
          </div>
        )}
      </section>

      {/* Featured homes */}
      <section className="py-8">
        <SectionHeader eyebrow="บ้านเด่น" title="บ้านแนะนำ" />
        {housesLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => `house-skeleton-${i}`).map(
              (id) => (
                <Skeleton key={id} className="h-72 w-full rounded-2xl" />
              ),
            )}
          </div>
        ) : featuredHouses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredHouses.slice(0, 3).map((house, index) => (
              <HouseCard
                key={house.id.toString()}
                house={house}
                project={projectById.get(house.projectId)}
                fallbackImage={FEED_FALLBACKS[index % FEED_FALLBACKS.length]}
              />
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl border border-dashed border-border bg-card p-10 text-center"
            data-ocid="home.houses_empty"
          >
            <BedDouble className="mx-auto size-8 text-primary" />
            <p className="mt-3 font-medium text-foreground">ยังไม่มีบ้านแนะนำ</p>
          </div>
        )}
      </section>

      {/* Special price homes */}
      {specialPriceHouses.length > 0 && (
        <section className="py-8">
          <SectionHeader eyebrow="ราคาพิเศษ" title="บ้านราคาพิเศษ" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {specialPriceHouses.slice(0, 3).map((house, index) => (
              <HouseCard
                key={house.id.toString()}
                house={house}
                project={projectById.get(house.projectId)}
                fallbackImage={
                  FEED_FALLBACKS[(index + 1) % FEED_FALLBACKS.length]
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* Promotions */}
      {promotions.length > 0 && (
        <section className="py-8">
          <SectionHeader eyebrow="โปรโมชั่น" title="โปรโมชั่นพิเศษ" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promotions.slice(0, 3).map((project) => (
              <Link
                key={project.id.toString()}
                to="/projects/$projectId"
                params={{ projectId: String(project.id) }}
              >
                <Card className="group overflow-hidden rounded-2xl border-border/60 p-0 shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={
                        project.images[0] ??
                        FEED_FALLBACKS[
                          Number(project.id) % FEED_FALLBACKS.length
                        ]
                      }
                      alt={project.name}
                      onError={(e) => {
                        e.currentTarget.src =
                          FEED_FALLBACKS[
                            Number(project.id) % FEED_FALLBACKS.length
                          ];
                      }}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute bottom-3 right-3 rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground shadow-gold">
                      {formatBaht(project.startingPrice)}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                      {project.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 text-primary" />
                      {project.location.district} · {project.location.province}
                    </p>
                    <div className="mt-3 space-y-1">
                      {project.promotions.slice(0, 2).map((promo) => (
                        <p
                          key={promo}
                          className="flex items-center gap-1.5 text-sm font-medium text-primary"
                        >
                          <Star className="size-3.5 fill-primary text-primary" />
                          {promo}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Ready-to-move homes */}
      {readyHouses.length > 0 && (
        <section className="py-8">
          <SectionHeader eyebrow="พร้อมอยู่" title="บ้านพร้อมอยู่" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {readyHouses.slice(0, 3).map((house, index) => (
              <HouseCard
                key={house.id.toString()}
                house={house}
                project={projectById.get(house.projectId)}
                fallbackImage={
                  FEED_FALLBACKS[(index + 2) % FEED_FALLBACKS.length]
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* Popular house types */}
      {houseTypes.length > 0 && (
        <section className="py-8">
          <SectionHeader eyebrow="แบบบ้าน" title="แบบบ้านยอดนิยม" />
          <div className="flex flex-wrap gap-3">
            {houseTypes.map((houseType) => (
              <Link
                key={houseType}
                to="/house-types"
                className="rounded-full border border-border/60 bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-subtle transition-smooth hover:border-primary hover:text-primary"
                data-ocid={`home.house_type.${houseType}`}
              >
                {houseType}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recommended agents */}
      <section className="py-8">
        <SectionHeader
          eyebrow="ตัวแทน"
          title="ตัวแทนแนะนำ"
          action={
            <Button
              type="button"
              variant="ghost"
              asChild
              className="rounded-full text-primary"
              data-ocid="home.view_all_agents"
            >
              <Link to="/agents">
                ดูทั้งหมด
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          }
        />
        {agentsLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => `agent-skeleton-${i}`).map(
              (id) => (
                <Skeleton key={id} className="h-28 w-full rounded-2xl" />
              ),
            )}
          </div>
        ) : agents && agents.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {agents.slice(0, 3).map((agent) => (
              <Link
                key={agent.id.toString()}
                to="/agents/$agentId"
                params={{ agentId: String(agent.id) }}
              >
                <Card className="rounded-2xl border-border/60 p-0 shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated">
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent font-display text-lg font-semibold text-accent-foreground">
                      {agent.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="truncate font-display text-base font-semibold text-foreground">
                          {agent.name}
                        </h3>
                        {agent.verified && (
                          <Star className="size-4 shrink-0 fill-primary text-primary" />
                        )}
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {agent.serviceArea}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="size-3.5 fill-primary text-primary" />
                        {agent.rating.toFixed(1)} ·{" "}
                        {agent.customerCount.toString()} ลูกค้า
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div
            className="rounded-2xl border border-dashed border-border bg-card p-10 text-center"
            data-ocid="home.agents_empty"
          >
            <Users className="mx-auto size-8 text-primary" />
            <p className="mt-3 font-medium text-foreground">ยังไม่มีตัวแทนแนะนำ</p>
          </div>
        )}
      </section>

      {/* Real-estate news */}
      <section className="py-8">
        <SectionHeader eyebrow="ข่าวสาร" title="ข่าวอสังหาริมทรัพย์" />
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((post, index) => {
              const project = projectById.get(post.projectId ?? -1n);
              return (
                <Link
                  key={post.id.toString()}
                  to="/posts/$postId"
                  params={{ postId: String(post.id) }}
                  className="rounded-2xl border border-border/60 bg-card p-5 shadow-subtle transition-smooth hover:shadow-elevated"
                  data-ocid={`home.news.${post.id.toString()}`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        post.image ??
                        FEED_FALLBACKS[index % FEED_FALLBACKS.length]
                      }
                      alt=""
                      onError={(e) => {
                        e.currentTarget.src =
                          FEED_FALLBACKS[index % FEED_FALLBACKS.length];
                      }}
                      className="size-14 shrink-0 rounded-xl object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-foreground">
                        {project?.name ?? "ข่าวโครงการใหม่"}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {post.createdAt
                          ? timestampToDate(post.createdAt)?.toLocaleDateString(
                              "th-TH",
                            )
                          : ""}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div
            className="rounded-2xl border border-dashed border-border bg-card p-10 text-center"
            data-ocid="home.news_empty"
          >
            <p className="font-medium text-foreground">ยังไม่มีข่าวสาร</p>
          </div>
        )}
      </section>
    </div>
  );
}
