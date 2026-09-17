import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/ProjectCard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAgents,
  useFavorites,
  useHouses,
  usePosts,
  useProjects,
  useRemoveFavoriteAgent,
  useRemoveFavoriteHouse,
  useRemoveFavoriteHouseType,
  useRemoveFavoriteProject,
  useRemoveSavedPost,
} from "@/hooks/useQueries";
import { formatBaht, timestampToDate } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Bath,
  BedDouble,
  Heart,
  Home,
  type LucideIcon,
  Star,
  Trash2,
  Users,
} from "lucide-react";

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div
      className="rounded-2xl border border-dashed border-border bg-card p-12 text-center"
      data-ocid="favorites.empty_state"
    >
      <Icon className="mx-auto size-8 text-primary" />
      <p className="mt-3 font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default function Favorites() {
  const { data: favorites, isLoading } = useFavorites();
  const { data: projects } = useProjects();
  const { data: houses } = useHouses();
  const { data: agents } = useAgents();
  const { data: posts } = usePosts();

  const removeProject = useRemoveFavoriteProject();
  const removeHouse = useRemoveFavoriteHouse();
  const removeHouseType = useRemoveFavoriteHouseType();
  const removeAgent = useRemoveFavoriteAgent();
  const removePost = useRemoveSavedPost();

  const favoriteProjects = (projects ?? []).filter((p) =>
    (favorites?.projects ?? []).includes(p.id),
  );
  const favoriteHouses = (houses ?? []).filter((h) =>
    (favorites?.houses ?? []).includes(h.id),
  );
  const favoriteHouseTypes = favorites?.houseTypes ?? [];
  const favoriteAgents = (agents ?? []).filter((a) =>
    (favorites?.agents ?? []).includes(a.id),
  );
  const favoritePosts = (posts ?? []).filter((p) =>
    (favorites?.savedPosts ?? []).includes(p.id),
  );

  const counts = {
    projects: favoriteProjects.length,
    houses: favoriteHouses.length,
    houseTypes: favoriteHouseTypes.length,
    agents: favoriteAgents.length,
    posts: favoritePosts.length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        eyebrow="รายการโปรด"
        title="รายการโปรดของคุณ"
        description="โครงการ บ้าน ตัวแทน และโพสต์ที่คุณบันทึกไว้"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map((id) => (
            <Skeleton key={id} className="aspect-[4/3] w-full rounded-2xl" />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="mb-6 h-auto flex-wrap gap-1 rounded-2xl p-1.5">
            <TabsTrigger value="projects" data-ocid="favorites.tab.projects">
              โครงการ ({counts.projects})
            </TabsTrigger>
            <TabsTrigger value="houses" data-ocid="favorites.tab.houses">
              บ้าน ({counts.houses})
            </TabsTrigger>
            <TabsTrigger
              value="houseTypes"
              data-ocid="favorites.tab.house_types"
            >
              แบบบ้าน ({counts.houseTypes})
            </TabsTrigger>
            <TabsTrigger value="agents" data-ocid="favorites.tab.agents">
              ตัวแทน ({counts.agents})
            </TabsTrigger>
            <TabsTrigger value="posts" data-ocid="favorites.tab.posts">
              โพสต์ ({counts.posts})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="projects">
            {favoriteProjects.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteProjects.map((project) => (
                  <div key={project.id.toString()} className="relative">
                    <ProjectCard project={project} />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute right-3 top-3 rounded-full shadow-subtle"
                      aria-label="ลบโครงการออกจากรายการโปรด"
                      onClick={() => removeProject.mutate(project.id)}
                      data-ocid={`favorites.remove_project.${project.id.toString()}`}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Heart}
                title="ยังไม่มีโครงการที่บันทึก"
                description="กดหัวใจบนโครงการเพื่อบันทึกไว้ที่นี่"
              />
            )}
          </TabsContent>

          <TabsContent value="houses">
            {favoriteHouses.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteHouses.map((house) => (
                  <Card
                    key={house.id.toString()}
                    className="rounded-2xl border-border/60 shadow-subtle"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link
                            to="/house-types/$houseType"
                            params={{ houseType: house.houseType }}
                          >
                            <h3 className="font-display text-lg font-semibold text-foreground transition-colors hover:text-primary">
                              {house.houseType}
                            </h3>
                          </Link>
                          <p className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BedDouble className="size-3.5 text-primary" />
                              {house.bedrooms.toString()} ห้องนอน
                            </span>
                            <span className="flex items-center gap-1">
                              <Bath className="size-3.5 text-primary" />
                              {house.bathrooms.toString()} ห้องน้ำ
                            </span>
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="ลบบ้านออกจากรายการโปรด"
                          onClick={() => removeHouse.mutate(house.id)}
                          data-ocid={`favorites.remove_house.${house.id.toString()}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-semibold text-primary">
                          {formatBaht(house.price)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {house.usableArea.toString()} ตร.ม.
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Home}
                title="ยังไม่มีบ้านที่บันทึก"
                description="บันทึกบ้านที่คุณชื่นชอบเพื่อดูที่นี่"
              />
            )}
          </TabsContent>

          <TabsContent value="houseTypes">
            {favoriteHouseTypes.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteHouseTypes.map((type) => (
                  <Card
                    key={type}
                    className="rounded-2xl border-border/60 shadow-subtle"
                  >
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
                        <Home className="size-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          to="/house-types/$houseType"
                          params={{ houseType: type }}
                        >
                          <h3 className="font-display text-lg font-semibold text-foreground transition-colors hover:text-primary">
                            {type}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          แบบบ้านที่คุณชื่นชอบ
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="ลบแบบบ้านออกจากรายการโปรด"
                        onClick={() => removeHouseType.mutate(type)}
                        data-ocid={`favorites.remove_house_type.${type}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Home}
                title="ยังไม่มีแบบบ้านที่บันทึก"
                description="บันทึกแบบบ้านที่คุณชื่นชอบเพื่อดูที่นี่"
              />
            )}
          </TabsContent>

          <TabsContent value="agents">
            {favoriteAgents.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favoriteAgents.map((agent) => (
                  <Card
                    key={agent.id.toString()}
                    className="rounded-2xl border-border/60 shadow-subtle"
                  >
                    <CardContent className="flex items-center gap-4 p-6">
                      <Avatar className="size-14">
                        <AvatarFallback className="bg-accent font-display text-lg font-semibold text-accent-foreground">
                          {agent.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <Link
                          to="/agents/$agentId"
                          params={{ agentId: String(agent.id) }}
                        >
                          <div className="flex items-center gap-1.5">
                            <h3 className="truncate font-display text-lg font-semibold text-foreground transition-colors hover:text-primary">
                              {agent.name}
                            </h3>
                            {agent.verified && (
                              <BadgeCheck className="size-4 shrink-0 text-primary" />
                            )}
                          </div>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {agent.serviceArea}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="size-3.5 fill-primary text-primary" />
                            {agent.rating.toFixed(1)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="size-3.5 text-primary" />
                            {agent.customerCount.toString()} ลูกค้า
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="ลบตัวแทนออกจากรายการโปรด"
                        onClick={() => removeAgent.mutate(agent.id)}
                        data-ocid={`favorites.remove_agent.${agent.id.toString()}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Users}
                title="ยังไม่มีตัวแทนที่บันทึก"
                description="บันทึกตัวแทนที่คุณไว้วางใจเพื่อดูที่นี่"
              />
            )}
          </TabsContent>

          <TabsContent value="posts">
            {favoritePosts.length > 0 ? (
              <div className="space-y-3">
                {favoritePosts.map((post) => (
                  <Card
                    key={post.id.toString()}
                    className="rounded-2xl border-border/60 shadow-subtle"
                  >
                    <CardContent className="flex items-center justify-between gap-4 p-5">
                      <Link
                        to="/posts/$postId"
                        params={{ postId: String(post.id) }}
                        className="min-w-0"
                      >
                        <p className="truncate text-sm font-medium text-foreground transition-colors hover:text-primary">
                          {post.location
                            ? `${post.location.district} · ${post.location.province}`
                            : "โพสต์จากตัวแทน"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {post.createdAt
                            ? timestampToDate(
                                post.createdAt,
                              )?.toLocaleDateString("th-TH")
                            : ""}
                        </p>
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="ลบโพสต์ออกจากรายการโปรด"
                        onClick={() => removePost.mutate(post.id)}
                        data-ocid={`favorites.remove_post.${post.id.toString()}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Heart}
                title="ยังไม่มีโพสต์ที่บันทึก"
                description="บันทึกโพสต์ที่คุณชื่นชอบเพื่อดูที่นี่"
              />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
