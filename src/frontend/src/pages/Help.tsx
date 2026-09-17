import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { LifeBuoy } from "lucide-react";

const faqs = [
  {
    q: "จะค้นหาโครงการได้อย่างไร?",
    a: "ไปที่หน้าโครงการ เพื่อดูโครงการทั้งหมด หรือใช้ช่องค้นหาเพื่อกรองตามทำเลและงบประมาณ",
  },
  {
    q: "จะนัดหมายชมโครงการได้อย่างไร?",
    a: "เลือกโครงการที่สนใจ แล้วกดปุ่มนัดหมายชมโครงการ เพื่อเลือกวันและเวลาที่สะดวก",
  },
  {
    q: "รายการโปรดคืออะไร?",
    a: "คุณสามารถบันทึกโครงการที่ชื่นชอบไว้ในรายการโปรด เพื่อกลับมาดูได้ในภายหลัง",
  },
  {
    q: "จะติดต่อตัวแทนได้อย่างไร?",
    a: "ไปที่หน้าตัวแทน เลือกตัวแทนที่สนใจ แล้วกดนัดหมายเพื่อติดต่อ",
  },
  {
    q: "ข้อมูลโครงการเชื่อถือได้หรือไม่?",
    a: "โครงการและตัวแทนบน OurHome ผ่านการตรวจสอบเพื่อความมั่นใจของคุณ อย่างไรก็ตาม โปรดยืนยันรายละเอียดกับตัวแทนก่อนตัดสินใจ",
  },
];

export default function Help() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader
        eyebrow="ศูนย์ช่วยเหลือ"
        title="ศูนย์ช่วยเหลือ"
        description="คำถามที่พบบ่อยและวิธีใช้งาน OurHome"
      />

      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card
            key={faq.q}
            className="rounded-2xl border-border/60 shadow-subtle"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <LifeBuoy className="size-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {faq.q}
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {faq.a}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-gradient-subtle p-8 text-center">
        <p className="font-display text-xl font-semibold text-foreground">
          ยังมีคำถาม?
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          ทีมงานของเราพร้อมช่วยเหลือคุณ
        </p>
        <Link
          to="/contact"
          className="mt-4 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-gold transition-smooth hover:bg-primary/90"
          data-ocid="help.contact"
        >
          ติดต่อเรา
        </Link>
      </div>
    </div>
  );
}
