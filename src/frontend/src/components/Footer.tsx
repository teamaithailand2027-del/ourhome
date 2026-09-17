import { Link } from "@tanstack/react-router";

const linkGroups: { title: string; links: { label: string; to: string }[] }[] =
  [
    {
      title: "บริษัท",
      links: [
        { label: "เกี่ยวกับเรา", to: "/about" },
        { label: "ติดต่อเรา", to: "/contact" },
        { label: "ศูนย์ช่วยเหลือ", to: "/help" },
      ],
    },
    {
      title: "ร่วมงานกับเรา",
      links: [
        { label: "สมัครเป็นตัวแทน", to: "/agents/apply" },
        { label: "ลงทะเบียนโครงการ", to: "/" },
      ],
    },
    {
      title: "ข้อกำหนด",
      links: [
        { label: "นโยบายความเป็นส่วนตัว", to: "/privacy" },
        { label: "ข้อกำหนดการใช้งาน", to: "/terms" },
      ],
    },
  ];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/60 bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col items-start gap-1">
          <span className="font-display text-2xl font-semibold tracking-tight text-gradient-gold">
            OURHOME
          </span>
          <span className="text-sm text-muted-foreground">บ้านที่ทุกคนใฝ่ฝัน</span>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {linkGroups.map((group) => (
            <div key={group.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground">
                {group.title}
              </h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-muted-foreground transition-smooth hover:text-primary"
                      data-ocid={`footer.${link.label}`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-border/60 pt-6">
          <p className="text-xs text-muted-foreground">
            บริหารและสนับสนุนโดย NIC GROUP 95 (THAILAND)
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            © {year}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
