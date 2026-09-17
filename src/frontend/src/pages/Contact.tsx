import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

const contacts = [
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
  {
    icon: MapPin,
    label: "ที่อยู่",
    value: "95/3 ม.3 ต.จรเข้เผือก อ.ด่านมะขามเตี้ย จ.กาญจนบุรี 71260",
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <CheckCircle2 className="mx-auto size-12 text-primary" />
        <h1 className="mt-4 font-display text-3xl font-semibold text-foreground">
          รับทราบข้อความของคุณ
        </h1>
        <p className="mt-2 text-muted-foreground">
          ทีมงานของเราจะติดต่อกลับโดยเร็วที่สุด
        </p>
        <Button
          type="button"
          className="mt-8 rounded-full"
          onClick={() => setSubmitted(false)}
          data-ocid="contact.reset"
        >
          ส่งข้อความอีกครั้ง
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <PageHeader
        eyebrow="ติดต่อเรา"
        title="ติดต่อ OurHome"
        description="เรายินดีให้บริการและตอบทุกคำถามของคุณ"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {contacts.map((contact) => {
          const Icon = contact.icon;
          return (
            <Card
              key={contact.label}
              className="rounded-2xl border-border/60 shadow-subtle"
            >
              <CardContent className="p-6 text-center">
                <Icon className="mx-auto size-6 text-primary" />
                <p className="mt-3 text-sm font-medium text-foreground">
                  {contact.label}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {contact.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          ส่งข้อความถึงเรา
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          กรอกข้อมูลด้านล่าง แล้วทีมงานของเราจะติดต่อกลับโดยเร็วที่สุด
        </p>
        <Card className="mt-6 rounded-2xl border-border/60 shadow-subtle">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ชื่อของคุณ"
                    required
                    data-ocid="contact.name"
                  />
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
                    data-ocid="contact.email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="เช่น 062-5244591"
                  data-ocid="contact.phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">ข้อความ</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="กรุณาระบุรายละเอียดที่ต้องการสอบถาม"
                  rows={5}
                  required
                  data-ocid="contact.message"
                />
              </div>
              <Button
                type="submit"
                className="h-12 w-full rounded-full bg-primary text-primary-foreground shadow-gold"
                data-ocid="contact.submit_button"
              >
                ส่งข้อความ
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
