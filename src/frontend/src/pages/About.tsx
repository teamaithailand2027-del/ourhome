import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  Building2,
  Compass,
  Heart,
  Home,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "ความน่าเชื่อถือ",
    description: "ทุกโครงการและตัวแทนผ่านการตรวจสอบเพื่อความมั่นใจของคุณ",
  },
  {
    icon: Heart,
    title: "ใส่ใจทุกความฝัน",
    description: "เราเชื่อว่าทุกคนมีบ้านในฝัน และพร้อมช่วยให้เป็นจริง",
  },
  {
    icon: Users,
    title: "ทีมมืออาชีพ",
    description: "ตัวแทนที่ได้รับการรับรองพร้อมดูแลคุณทุกขั้นตอน",
  },
  {
    icon: Building2,
    title: "โครงการคุณภาพ",
    description: "คัดสรรโครงการบ้านและคอนโดคุณภาพทั่วประเทศไทย",
  },
];

const steps = [
  {
    icon: Compass,
    title: "ค้นหา (Find)",
    description: "ค้นหาโครงการบ้านและคอนโดที่ตรงกับความต้องการของคุณ",
  },
  {
    icon: Users,
    title: "เชื่อมต่อ (Connect)",
    description: "เชื่อมต่อกับตัวแทนที่ได้รับการรับรองเพื่อขอข้อมูลเพิ่มเติม",
  },
  {
    icon: Home,
    title: "เยี่ยมชม (Visit)",
    description: "นัดหมายชมโครงการจริง เพื่อสัมผัสบรรยากาศด้วยตัวเอง",
  },
  {
    icon: KeyRound,
    title: "เป็นเจ้าของ (Own)",
    description: "ตัดสินใจและก้าวสู่การเป็นเจ้าของบ้านในฝันของคุณ",
  },
];

const company = [
  {
    icon: Building2,
    label: "ชื่อบริษัท",
    value: "NIC GROUP 95 (THAILAND)",
  },
  {
    icon: ShieldCheck,
    label: "เลขประจำตัวผู้เสียภาษี",
    value: "0715569002913",
  },
  {
    icon: MapPin,
    label: "ที่อยู่สำนักงานใหญ่",
    value: "95/3 ม.3 ต.จรเข้เผือก อ.ด่านมะขามเตี้ย จ.กาญจนบุรี 71260",
  },
  {
    icon: Phone,
    label: "โทรศัพท์",
    value: "062-5244591",
  },
  {
    icon: Mail,
    label: "อีเมล",
    value: "Nicgroup.2024@gmail.com",
  },
];

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <PageHeader
        eyebrow="เกี่ยวกับ OurHome"
        title="บ้านที่ทุกคนใฝ่ฝัน"
        description="OurHome คือแพลตฟอร์มอสังหาริมทรัพย์ที่รวมโครงการบ้านและคอนโดคุณภาพจากทั่วประเทศไทยไว้ในที่เดียว"
      />

      <div className="rounded-3xl bg-gradient-subtle p-8 md:p-10">
        <p className="text-base leading-relaxed text-foreground">
          OurHome ก่อตั้งขึ้นด้วยความเชื่อที่ว่า "บ้าน" ไม่ใช่แค่ที่อยู่อาศัย
          แต่คือรากฐานของความสุขและความมั่นคงของครอบครัว
          เราจึงรวบรวมโครงการบ้านและคอนโดคุณภาพจากตัวแทนที่ได้รับการรับรอง พร้อมข้อมูลครบถ้วน
          เพื่อให้คุณค้นหาและตัดสินใจได้อย่างมั่นใจ
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          บริหารและสนับสนุนโดย NIC GROUP 95 (THAILAND)
        </p>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          แนวคิดของเรา
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          จากความฝันสู่บ้านที่คุณเป็นเจ้าของ ใน 4 ขั้นตอนง่าย ๆ
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.title}
                className="rounded-2xl border-border/60 shadow-subtle"
              >
                <CardContent className="p-6">
                  <Icon className="size-7 text-primary" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          คุณค่าที่เรายึดมั่น
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <Card
                key={value.title}
                className="rounded-2xl border-border/60 shadow-subtle"
              >
                <CardContent className="p-6">
                  <Icon className="size-7 text-primary" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          ข้อมูลบริษัท
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          NIC GROUP 95 (THAILAND) ผู้บริหารและสนับสนุนแพลตฟอร์ม OurHome
        </p>
        <div className="mt-6 rounded-3xl bg-gradient-subtle p-6 md:p-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {company.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
