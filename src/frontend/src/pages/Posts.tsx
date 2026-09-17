import PageHeader from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAgents,
  useLikePost,
  usePosts,
  useProjects,
  useSharePost,
} from "@/hooks/useQueries";
import type { Agent, Post, Project } from "@/types";
import { ProjectStatus, formatBaht, timestampToDate } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  Heart,
  MapPin,
  MessageCircle,
  Share2,
  Star,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

const FALLBACKS = [
  "/assets/generated/feed-garden-home.dim_800x600.jpg",
  "/assets/generated/feed-townhome.dim_800x600.jpg",
  "/assets/generated/feed-luxury-villa.dim_800x600.jpg",
];

function PostCard({
  post,
  project,
  agent,
  fallbackImage,
  onLike,
  onShare,
}: {
  post: Post;
  project?: Project;
  agent?: Agent;
  fallbackImage: string;
  onLike: (id: bigint) => void;
  onShare: (id: bigint) => void;
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
        data-ocid={`posts.card.${post.id.toString()}`}
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
              className="rounded-full text-muted-foreground hover:text-primary"
              onClick={() => onShare(post.id)}
            >
              <Share2 className="size-5" />
            </Button>
            <span className="text-xs text-muted-foreground">
              {post.shareCount.toString()}
            </span>
          </div>
          <Button
            type="button"
            asChild
            className="h-9 rounded-full bg-primary px-4 text-sm text-primary-foreground shadow-gold"
          >
            <Link to="/posts/$postId" params={{ postId: String(post.id) }}>
              ดูรายละเอียด
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Posts() {
  const { data: posts, isLoading } = usePosts();
  const { data: projects } = useProjects();
  const { data: agents } = useAgents();

  const likePost = useLikePost();
  const sharePost = useSharePost();

  const projectById = useMemo(
    () => new Map((projects ?? []).map((p) => [p.id, p])),
    [projects],
  );
  const agentById = useMemo(
    () => new Map((agents ?? []).map((a) => [a.id, a])),
    [agents],
  );

  const handleLike = (id: bigint) =>
    likePost.mutate(id, { onSuccess: () => toast.success("ถูกใจโพสต์แล้ว") });
  const handleShare = (id: bigint) =>
    sharePost.mutate(id, { onSuccess: () => toast.success("แชร์โพสต์แล้ว") });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        eyebrow="โพสต์"
        title="โพสต์ทั้งหมด"
        description="โพสต์โครงการและบ้านจากตัวแทนที่ได้รับการรับรอง"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => `post-skeleton-${i}`).map(
            (id) => (
              <Skeleton key={id} className="h-80 w-full rounded-3xl" />
            ),
          )}
        </div>
      ) : posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <PostCard
              key={post.id.toString()}
              post={post}
              project={projectById.get(post.projectId ?? -1n)}
              agent={agentById.get(post.agentId ?? -1n)}
              fallbackImage={FALLBACKS[index % FALLBACKS.length]}
              onLike={handleLike}
              onShare={handleShare}
            />
          ))}
        </div>
      ) : (
        <div
          className="rounded-2xl border border-dashed border-border bg-card p-12 text-center"
          data-ocid="posts.empty_state"
        >
          <MessageCircle className="mx-auto size-8 text-primary" />
          <p className="mt-3 font-medium text-foreground">ยังไม่มีโพสต์</p>
          <p className="mt-1 text-sm text-muted-foreground">
            โพสต์จากตัวแทนจะปรากฏที่นี่
          </p>
        </div>
      )}
    </div>
  );
}
