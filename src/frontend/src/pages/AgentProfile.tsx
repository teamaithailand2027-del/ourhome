import type { Agent } from "@/backend";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useAddReview,
  useAgent,
  useReportReview,
  useReviews,
} from "@/hooks/useQueries";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BadgeCheck,
  Building2,
  CalendarClock,
  Home,
  MapPin,
  Phone,
  Send,
  ShieldAlert,
  Star,
  Users,
} from "lucide-react";
import { useState } from "react";

const CATEGORY_LABELS: {
  key: keyof Agent["ratingCategories"];
  label: string;
}[] = [
  { key: "trust", label: "ความน่าเชื่อถือ" },
  { key: "info", label: "การให้ข้อมูล" },
  { key: "service", label: "การบริการ" },
  { key: "followUp", label: "การติดตามลูกค้า" },
  { key: "politeness", label: "ความสุภาพ" },
  { key: "speed", label: "ความรวดเร็ว" },
];

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 ${className ?? ""}`}>
      {Array.from({ length: 5 }, (_, i) => i).map((i) => (
        <Star
          key={`star-${i}`}
          className={`size-4 ${
            i < value ? "fill-primary text-primary" : "text-border"
          }`}
        />
      ))}
    </div>
  );
}

export default function AgentProfile() {
  const { agentId } = useParams({ from: "/agents/$agentId" });
  const id = BigInt(agentId);
  const { data: agent, isLoading } = useAgent(id);
  const { data: reviews } = useReviews(id);
  const addReview = useAddReview();
  const reportReview = useReportReview();
  const { identity } = useInternetIdentity();

  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-6 h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="font-display text-2xl font-semibold text-foreground">
          ไม่พบตัวแทน
        </p>
        <Button type="button" asChild className="mt-6 rounded-full">
          <Link to="/agents">กลับไปยังตัวแทน</Link>
        </Button>
      </div>
    );
  }

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !identity) return;
    const ratingValue = BigInt(rating);
    addReview.mutate({
      id: 0n,
      categories: {
        service: ratingValue,
        trust: ratingValue,
        info: ratingValue,
        followUp: ratingValue,
        speed: ratingValue,
        politeness: ratingValue,
      },
      createdAt: 0n,
      agentId: id,
      reviewerId: identity.getPrincipal(),
      comment: comment.trim(),
      rating: ratingValue,
      reported: false,
    });
    setComment("");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Button
        type="button"
        variant="ghost"
        asChild
        className="mb-6 rounded-full text-muted-foreground"
        data-ocid="agent_profile.back"
      >
        <Link to="/agents">
          <ArrowLeft className="size-4" />
          กลับ
        </Link>
      </Button>

      {/* Header */}
      <Card className="rounded-3xl border-border/60 shadow-subtle">
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
            <div className="relative">
              <Avatar className="size-24 rounded-3xl">
                {agent.photo ? (
                  <AvatarImage src={agent.photo} alt={`รูปของ ${agent.name}`} />
                ) : null}
                <AvatarFallback className="bg-accent font-display text-4xl font-semibold text-accent-foreground">
                  {agent.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {agent.verified && (
                <Badge
                  className="absolute -right-2 -top-2 rounded-full border-primary/30 bg-primary/10 px-1.5 py-0.5 text-primary"
                  data-ocid="agent_profile.verified_badge"
                >
                  <BadgeCheck className="size-3.5" />
                  Verified
                </Badge>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                {agent.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                รหัสตัวแทน: {agent.agentCode}
              </p>
              <p className="mt-1 flex items-center justify-center gap-1 text-muted-foreground sm:justify-start">
                <MapPin className="size-4 text-primary" />
                {agent.serviceArea}
              </p>
              <div className="mt-2 flex items-center justify-center gap-2 sm:justify-start">
                <Stars value={Math.round(agent.rating)} />
                <span className="text-sm font-medium text-foreground">
                  {agent.rating.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({agent.reviewCount.toString()} รีวิว)
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border/60 pt-6 sm:grid-cols-4">
            <div className="text-center">
              <p className="font-display text-2xl font-semibold text-foreground">
                {agent.experience.toString()}
              </p>
              <p className="text-xs text-muted-foreground">ปีประสบการณ์</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-semibold text-foreground">
                {agent.managedProjects.length}
              </p>
              <p className="text-xs text-muted-foreground">โครงการที่ดูแล</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-semibold text-foreground">
                {agent.listedHomes.length}
              </p>
              <p className="text-xs text-muted-foreground">บ้านที่ลงขาย</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-semibold text-foreground">
                {agent.customerCount.toString()}
              </p>
              <p className="text-xs text-muted-foreground">ลูกค้า</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Button
              type="button"
              asChild
              variant="outline"
              className="rounded-full"
              data-ocid="agent_profile.contact"
            >
              <Link to="/contact">
                <Send className="size-4" />
                ติดต่อ
              </Link>
            </Button>
            <Button
              type="button"
              asChild
              variant="outline"
              className="rounded-full"
              data-ocid="agent_profile.call"
            >
              <a href="tel:+66000000000">
                <Phone className="size-4" />
                โทร
              </a>
            </Button>
            <Button
              type="button"
              asChild
              variant="outline"
              className="rounded-full"
              data-ocid="agent_profile.book"
            >
              <Link to="/booking">
                <CalendarClock className="size-4" />
                นัดหมาย
              </Link>
            </Button>
            <Button
              type="button"
              asChild
              className="rounded-full bg-primary text-primary-foreground shadow-gold"
              data-ocid="agent_profile.projects"
            >
              <Link to="/projects">
                <Building2 className="size-4" />
                ดูโครงการที่ดูแล
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Rating transparency */}
      <Card className="mt-6 rounded-3xl border-border/60 shadow-subtle">
        <CardContent className="p-8">
          <h2 className="font-display text-xl font-semibold text-foreground">
            คะแนนความน่าเชื่อถือ
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            คะแนนเฉลี่ยจากลูกค้าที่เคยใช้บริการ
          </p>
          <div className="mt-6 space-y-4">
            {CATEGORY_LABELS.map(({ key, label }) => {
              const value = Number(agent.ratingCategories[key]);
              return (
                <div key={key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-foreground">{label}</span>
                    <span className="font-medium text-foreground">
                      {value.toFixed(1)}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${(value / 5) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio */}
      {agent.portfolio.length > 0 && (
        <Card className="mt-6 rounded-3xl border-border/60 shadow-subtle">
          <CardContent className="p-8">
            <h2 className="font-display text-xl font-semibold text-foreground">
              ผลงาน
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {agent.portfolio.map((item) => (
                <Badge key={item} variant="secondary" className="rounded-full">
                  {item}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reviews */}
      <Card className="mt-6 rounded-3xl border-border/60 shadow-subtle">
        <CardContent className="p-8">
          <h2 className="font-display text-xl font-semibold text-foreground">
            รีวิวจากลูกค้า
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {agent.reviewCount.toString()} รีวิว
          </p>

          {/* Add review */}
          <form
            onSubmit={handleAddReview}
            className="mt-6 rounded-2xl border border-border/60 bg-muted/40 p-4"
          >
            <Label htmlFor="review-rating">ให้คะแนน</Label>
            <div className="mt-2 flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => `rate-${i}`).map((id, i) => (
                <button
                  key={id}
                  type="button"
                  aria-label={`${i + 1} ดาว`}
                  onClick={() => setRating(i + 1)}
                  className="p-0.5"
                >
                  <Star
                    className={`size-6 transition-smooth ${
                      i < rating
                        ? "fill-primary text-primary"
                        : "text-border hover:text-primary/40"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="mt-3 space-y-2">
              <Label htmlFor="review-comment">ความคิดเห็น</Label>
              <Textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="แบ่งปันประสบการณ์ของคุณกับตัวแทน"
                rows={3}
                data-ocid="agent_profile.review_input"
              />
            </div>
            <Button
              type="submit"
              className="mt-4 rounded-full bg-primary text-primary-foreground shadow-gold"
              disabled={addReview.isPending || !comment.trim() || !identity}
              data-ocid="agent_profile.review_submit"
            >
              {addReview.isPending ? "กำลังส่ง..." : "ส่งรีวิว"}
            </Button>
            {!identity && (
              <p className="mt-2 text-sm text-muted-foreground">
                กรุณาเข้าสู่ระบบเพื่อส่งรีวิว
              </p>
            )}
            {addReview.isError && (
              <p className="mt-2 text-sm text-destructive">
                ไม่สามารถส่งรีวิวได้ กรุณาลองอีกครั้ง
              </p>
            )}
          </form>

          {/* Review list */}
          <div className="mt-6 space-y-5">
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id.toString()}
                  className="rounded-2xl border border-border/60 p-5"
                  data-ocid={`agent_profile.review.${review.id.toString()}`}
                >
                  <div className="flex items-center justify-between">
                    <Stars value={Number(review.rating)} />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-full text-muted-foreground"
                      onClick={() => reportReview.mutate(review.id)}
                      disabled={review.reported || reportReview.isPending}
                      data-ocid="agent_profile.report_review"
                    >
                      <ShieldAlert className="size-4" />
                      {review.reported ? "รายงานแล้ว" : "รายงาน"}
                    </Button>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <div
                className="rounded-2xl border border-dashed border-border p-8 text-center"
                data-ocid="agent_profile.reviews_empty"
              >
                <Home className="mx-auto size-6 text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">
                  ยังไม่มีรีวิว เป็นคนแรกที่รีวิวตัวแทนนี้
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
