import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

const sections = [
  {
    title: "ข้อมูลที่เราเก็บ",
    body: "เราเก็บข้อมูลที่จำเป็นต่อการให้บริการ เช่น ข้อมูลการใช้งาน รายการโปรด และการนัดหมาย เพื่อมอบประสบการณ์ที่ดีที่สุดให้กับคุณ",
  },
  {
    title: "การใช้ข้อมูล",
    body: "ข้อมูลของคุณจะถูกใช้เพื่อปรับปรุงบริการ แสดงโครงการที่เกี่ยวข้อง และติดต่อเกี่ยวกับการนัดหมายเท่านั้น เราจะไม่ขายข้อมูลของคุณให้บุคคลที่สาม",
  },
  {
    title: "การเก็บรักษาข้อมูล",
    body: "เราจัดเก็บข้อมูลของคุณอย่างปลอดภัยและเก็บไว้เท่าที่จำเป็นต่อการให้บริการเท่านั้น เมื่อไม่จำเป็นแล้ว เราจะลบหรือทำให้ข้อมูลไม่สามารถระบุตัวตนได้",
  },
  {
    title: "ความปลอดภัย",
    body: "เราปกป้องข้อมูลของคุณด้วยมาตรฐานความปลอดภัยระดับสูง และเข้าถึงข้อมูลได้เฉพาะผู้ที่จำเป็นเท่านั้น",
  },
  {
    title: "สิทธิ์ของคุณ",
    body: "คุณสามารถขอเข้าถึง แก้ไข หรือลบข้อมูลส่วนบุคคลของคุณได้ทุกเมื่อ โดยติดต่อผ่านช่องทางในหน้าติดต่อเรา",
  },
];

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader
        eyebrow="ข้อกำหนด"
        title="นโยบายความเป็นส่วนตัว"
        description="เราให้ความสำคัญกับความเป็นส่วนตัวของคุณ"
      />

      <div className="space-y-4">
        {sections.map((section) => (
          <Card
            key={section.title}
            className="rounded-2xl border-border/60 shadow-subtle"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" />
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {section.title}
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {section.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="mt-8 text-xs text-muted-foreground">
        นโยบายนี้อาจมีการปรับปรุงเป็นระยะเพื่อให้สอดคล้องกับกฎหมายและแนวปฏิบัติที่ดีที่สุด
        เราจะแจ้งให้คุณทราบเมื่อมีการเปลี่ยนแปลงที่สำคัญ
      </p>
    </div>
  );
}
