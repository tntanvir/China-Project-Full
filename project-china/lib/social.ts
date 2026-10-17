export interface SocialLink {
  id: "facebook" | "whatsapp" | "youtube" | "twitter" | "instagram" | "linkedin";
  name: string;
  url: string;
  color: string;
  handle: string;
  badge: string;
}

export const FT_SOCIAL_LINKS: SocialLink[] = [
  {
    id: "facebook",
    name: "Facebook",
    url: "https://www.facebook.com/share/1NVhe31dM7",
    color: "#1877F2",
    handle: "Feitian PCB Official",
    badge: "Official Page",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    url: "https://wa.me/message/KOW2GMXJ7DKHG1",
    color: "#25D366",
    handle: "Fast Engineering Chat",
    badge: "24/7 Online",
  },
  {
    id: "youtube",
    name: "YouTube",
    url: "https://www.youtube.com/@WupingFeitianElectronicTech",
    color: "#FF0000",
    handle: "@WupingFeitianElectronicTech",
    badge: "Factory Video Tour",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    url: "https://x.com/Jiamingpan101",
    color: "#0f1419",
    handle: "@Jiamingpan101",
    badge: "Hardware Updates",
  },
  {
    id: "instagram",
    name: "Instagram",
    url: "https://www.instagram.com/feitianpcb?igsh=MW43cmV2dWpienJ3cA==",
    color: "#E1306C",
    handle: "@feitianpcb",
    badge: "PCB Visual Showcase",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/wiping-feitian-electronic-tech-3009503a2?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    color: "#0A66C2",
    handle: "Wuping Feitian Electronic Tech",
    badge: "Enterprise Network",
  },
];
