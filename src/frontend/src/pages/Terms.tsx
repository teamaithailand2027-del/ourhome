import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

const sections = [
  {
    title: "การใช้งานแพลตฟอร์ม",
    body: "การใช้งาน OurHome ต้องเป็นไปเพื่อการค้นหาและเปรียบเทียบโครงการบ้านและคอนโดเท่านั้น ห้ามใช้ข้อมูลเพื่อวัตถุประสงค์อื่นโดยไม่ได้รับอนุญาต",
  },
  {
    title: "ข้อมูลโครงการ",
    body: "ข้อมูลโครงการและราคาเป็นข้อมูลเบื้องต้น อาจมีการเปลี่ยนแปลงได้ โปรดยืนยันรายละเอียดกับตัวแทนก่อนตัดสินใจ",
  },
  {
    title: "การนัดหมาย",
    body: "การนัดหมายชมโครงการต้องเป็นไปตามเวลาที่กำหนด หากไม่สามารถมาได้กรุณาแจ้งล่วงหน้าเพื่อเลื่อนหรือยกเลิก",
  },
  {
    title: "ความรับผิดชอบ",
    body: "OurHome ทำหน้าที่เป็นแพลตฟอร์มเชื่อมต่อระหว่างผู้ซื้อและตัวแทน ไม่รับผิดชอบต่อข้อตกลงระหว่างผู้ซื้อและผู้ขายโดยตรง",
  },
  {
    title: "ทรัพย์สินทางปัญญา",
    body: "เนื้อหา รูปภาพ และเครื่องหมายการค้าบนแพลตฟอร์มเป็นของ OurHome และพันธมิตร ห้ามนำไปใช้โดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร",
  },
  {
    title: "การระงับการใช้งาน",
    body: "เราอาจระงับหรือยุติการใช้งานของคุณ หากพบว่ามีการละเมิดข้อกำหนดเหล่านี้ หรือกระทำการที่อาจเป็นอันตรายต่อผู้ใช้รายอื่น",
  },
];

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader
        eyebrow="ข้อกำหนด"
        title="ข้อกำหนดการใช้งาน"
        description="ข้อกำหนดและเงื่อนไขในการใช้บริการ OurHome"
      />

      <div className="space-y-4">
        {sections.map((section) => (
          <Card
            key={section.title}
            className="rounded-2xl border-border/60 shadow-subtle"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-primary" />
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
        การใช้บริการ OurHome ถือว่าคุณยอมรับข้อกำหนดและเงื่อนไขเหล่านี้ทั้งหมด
      </p>
    </div>
  );
}
