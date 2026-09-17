import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Project } from "@/types";
import { ProjectStatus, formatBaht } from "@/types";
import { Link } from "@tanstack/react-router";
import { MapPin, Star } from "lucide-react";
import { useState } from "react";

const FALLBACK_IMAGE = "/assets/generated/feed-garden-home.dim_800x600.jpg";

export default function ProjectCard({ project }: { project: Project }) {
  const [imgSrc, setImgSrc] = useState(project.images[0] ?? FALLBACK_IMAGE);

  return (
    <Link to="/projects/$projectId" params={{ projectId: String(project.id) }}>
      <Card className="group overflow-hidden rounded-2xl border-border/60 p-0 shadow-subtle transition-smooth hover:-translate-y-1 hover:shadow-elevated">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imgSrc}
            alt={project.name}
            onError={() => setImgSrc(FALLBACK_IMAGE)}
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
              <Badge className="bg-card/90 text-foreground">ใหม่</Badge>
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
              {project.unitCount} ยูนิต
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
