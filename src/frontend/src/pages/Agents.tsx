import PageHeader from "@/components/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAgents } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { BadgeCheck, MapPin, Star, Users } from "lucide-react";

export default function Agents() {
  const { data: agents, isLoading } = useAgents();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <PageHeader
        eyebrow="ตัวแทน"
        title="ตัวแทนของเรา"
        description="พบกับตัวแทนที่ได้รับการรับรอง พร้อมช่วยคุณค้นหาบ้านในฝัน"
        action={
          <Button
            type="button"
            asChild
            className="rounded-full bg-primary text-primary-foreground shadow-gold"
            data-ocid="agents.apply_button"
          >
            <Link to="/agents/apply">ร่วมเป็นตัวแทน</Link>
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map((id) => (
            <Skeleton key={id} className="h-56 w-full rounded-3xl" />
          ))}
        </div>
      ) : agents && agents.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Link
              key={agent.id.toString()}
              to="/agents/$agentId"
              params={{ agentId: String(agent.id) }}
              className="group"
              data-ocid={`agents.item.${agent.id.toString()}`}
            >
              <Card className="h-full rounded-3xl border-border/60 p-0 shadow-subtle transition-smooth group-hover:-translate-y-1 group-hover:shadow-elevated">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div className="relative">
                    <Avatar className="size-20 rounded-3xl">
                      {agent.photo ? (
                        <AvatarImage
                          src={agent.photo}
                          alt={`รูปของ ${agent.name}`}
                        />
                      ) : null}
                      <AvatarFallback className="bg-accent font-display text-2xl font-semibold text-accent-foreground">
                        {agent.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {agent.verified && (
                      <Badge
                        className="absolute -right-2 -top-2 rounded-full border-primary/30 bg-primary/10 px-1.5 py-0.5 text-primary"
                        data-ocid="agents.verified_badge"
                      >
                        <BadgeCheck className="size-3.5" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <h3 className="mt-4 font-display text-xl font-semibold text-foreground">
                    {agent.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="size-3.5 text-primary" />
                    {agent.serviceArea}
                  </p>

                  <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                    <span className="flex items-center gap-1 font-medium text-foreground">
                      <Star className="size-4 fill-primary text-primary" />
                      {agent.rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({agent.reviewCount.toString()} รีวิว)
                    </span>
                  </div>

                  <div className="mt-4 flex w-full items-center justify-center gap-6 border-t border-border/60 pt-4 text-center">
                    <div>
                      <p className="font-display text-lg font-semibold text-foreground">
                        {agent.experience.toString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ปีประสบการณ์
                      </p>
                    </div>
                    <div className="h-8 w-px bg-border/60" />
                    <div>
                      <p className="flex items-center justify-center gap-1 font-display text-lg font-semibold text-foreground">
                        <Users className="size-4 text-primary" />
                        {agent.customerCount.toString()}
                      </p>
                      <p className="text-xs text-muted-foreground">ลูกค้า</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div
          className="rounded-3xl border border-dashed border-border bg-card p-12 text-center"
          data-ocid="agents.empty_state"
        >
          <Users className="mx-auto size-8 text-primary" />
          <p className="mt-3 font-medium text-foreground">ยังไม่มีตัวแทน</p>
          <p className="mt-1 text-sm text-muted-foreground">
            ตัวแทนจะปรากฏที่นี่เมื่อพร้อม
          </p>
        </div>
      )}
    </div>
  );
}
