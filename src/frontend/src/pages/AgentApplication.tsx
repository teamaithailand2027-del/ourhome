import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAddAgent } from "@/hooks/useQueries";
import { Principal } from "@icp-sdk/core/principal";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, LayoutDashboard, Upload } from "lucide-react";
import { useState } from "react";

const PROPERTY_TYPES = ["บ้านเดี่ยว", "ทาวน์เฮาส์", "คอนโดมิเนียม", "บ้านแฝด", "ที่ดิน"];

export default function AgentApplication() {
  const addAgent = useAddAgent();
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [experience, setExperience] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [photo, setPhoto] = useState("");
  const [documents, setDocuments] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAgent.mutate(
      {
        id: 0n,
        portfolio: [
          `จังหวัด: ${province}`,
          `สนใจ: ${propertyType}`,
          `เอกสาร: ${documents}`,
        ].filter((item) => !item.endsWith(": ")),
        serviceArea,
        ratingCategories: {
          service: 0n,
          trust: 0n,
          info: 0n,
          followUp: 0n,
          speed: 0n,
          politeness: 0n,
        },
        listedHomes: [],
        verified: false,
        userId: Principal.anonymous(),
        managedProjects: [],
        name,
        agentCode: "",
        experience: BigInt(experience || "0"),
        customerCount: 0n,
        rating: 0,
        photo: photo || undefined,
        reviewCount: 0n,
      },
      {
        onSuccess: () => setSubmitted(true),
      },
    );
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto size-14 text-primary" />
        <h1 className="mt-4 font-display text-3xl font-semibold text-foreground">
          รับทราบใบสมัครของคุณ
        </h1>
        <p className="mt-2 text-muted-foreground">
          ทีมงานของเราจะติดต่อกลับภายใน 3 วันทำการ เพื่อยืนยันข้อมูลและขั้นตอนถัดไป
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            type="button"
            asChild
            className="rounded-full bg-primary text-primary-foreground shadow-gold"
            data-ocid="agent_application.dashboard"
          >
            <Link to="/agent-dashboard">
              <LayoutDashboard className="size-4" />
              ไปยังแดชบอร์ดตัวแทน
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            onClick={() => setSubmitted(false)}
            data-ocid="agent_application.reset"
          >
            สมัครอีกครั้ง
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <PageHeader
        eyebrow="ร่วมงานกับเรา"
        title="ร่วมเป็นตัวแทน OurHome"
        description="กรอกข้อมูลด้านล่างเพื่อสมัครเป็นตัวแทนที่ได้รับการรับรองของ OurHome"
      />

      <Card className="rounded-3xl border-border/60 shadow-subtle">
        <CardContent className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ชื่อของคุณ"
                  required
                  data-ocid="agent_application.name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08X-XXX-XXXX"
                  required
                  data-ocid="agent_application.phone"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">อีเมล</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                data-ocid="agent_application.email"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="province">จังหวัด</Label>
                <Input
                  id="province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  placeholder="เช่น กรุงเทพมหานคร"
                  required
                  data-ocid="agent_application.province"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serviceArea">พื้นที่ให้บริการ</Label>
                <Input
                  id="serviceArea"
                  value={serviceArea}
                  onChange={(e) => setServiceArea(e.target.value)}
                  placeholder="เช่น เขตบางนา"
                  required
                  data-ocid="agent_application.service_area"
                />
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experience">ประสบการณ์ (ปี)</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="0"
                  required
                  data-ocid="agent_application.experience"
                />
              </div>
              <div className="space-y-2">
                <Label>ประเภทอสังหาฯ ที่สนใจ</Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger
                    className="w-full"
                    data-ocid="agent_application.property_type"
                  >
                    <SelectValue placeholder="เลือกประเภท" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="photo">รูปโปรไฟล์ (URL)</Label>
              <Input
                id="photo"
                value={photo}
                onChange={(e) => setPhoto(e.target.value)}
                placeholder="https://..."
                data-ocid="agent_application.photo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="documents">เอกสารยืนยันตัวตน</Label>
              <Textarea
                id="documents"
                value={documents}
                onChange={(e) => setDocuments(e.target.value)}
                placeholder="ระบุเอกสารที่เตรียมไว้ เช่น บัตรประชาชน, ทะเบียนบ้าน"
                rows={3}
                data-ocid="agent_application.documents"
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-primary text-primary-foreground shadow-gold"
              disabled={addAgent.isPending}
              data-ocid="agent_application.submit_button"
            >
              <Upload className="size-4" />
              {addAgent.isPending ? "กำลังส่ง..." : "ส่งใบสมัคร"}
            </Button>
            {addAgent.isError && (
              <p className="text-sm text-destructive">
                ไม่สามารถส่งใบสมัครได้ กรุณาลองอีกครั้ง
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
