export interface LegalSection {
  id: string;
  number: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  highlight?: {
    title: string;
    body: string;
  };
}

export interface LegalDocumentData {
  slug: "privacy-policy" | "terms-of-service";
  badge: string;
  title: string;
  subtitle: string;
  effectiveDate: string;
  lastUpdated: string;
  breadcrumbParent?: { label: string; href: string };
  companionLink: { label: string; href: string; description: string };
  sections: LegalSection[];
}

export const COMPANY_LEGAL_INFO = {
  legalName: "Wuping Feitian Electronic Technology Co., Ltd.",
  chineseName: "武平飞天电子科技有限公司",
  brandName: "Feitian PCB (FT PCB)",
  foundedYear: "1997",
  registeredCapital: "30 Million RMB",
  icpRecord: "Min ICP Bei No. 20012937-1",
  factoryAddress:
    "No. 4, No. 5, and No. 6 Xingfu 2nd Road, Yanqian Park (Building A10-A11-A17, Yanqian Industrial Concentration Zone), High-Tech Zone, Wuping County, Longyan City, Fujian Province, China",
  shenzhenAddress: "Fenghuang Zhi Gu, Baoan District, Shenzhen, China",
  emails: ["ft-osr@feitianpcb.com", "overseasales@feitianpcb.com", "lcy@feitianpcb.com"],
  phones: ["+86 189 2742 6587", "+86 185-9802-7134", "0597-4587858"],
  certifications: "ISO 9001:2015, IATF 16949, UL (UL 94V-0), CQC, ISO 14001, RoHS & REACH, IPC-A-600/610 Class 2/3",
  couriers: "DHL Express, FedEx International Priority, UPS Worldwide Saver, SF Express International, Deppon",
} as const;

export const privacyPolicyData: LegalDocumentData = {
  slug: "privacy-policy",
  badge: "Legal & Data Protection",
  title: "Privacy Policy",
  subtitle:
    "How Wuping Feitian Electronic Technology Co., Ltd. (Feitian PCB / FT PCB) collects, safeguards, and processes your personal details, business information, Gerber files, and BOM archives.",
  effectiveDate: "November 28, 2026",
  lastUpdated: "November 28, 2026",
  breadcrumbParent: { label: "About FT PCB", href: "/about-ft-pcb" },
  companionLink: {
    label: "Read Terms of Service",
    href: "/terms-of-service",
    description: "Review our manufacturing terms, tolerances, IP rules, and shipping conditions.",
  },
  sections: [
    {
      id: "scope",
      number: "01",
      title: "Who We Are & Scope of This Policy",
      paragraphs: [
        `This Privacy Policy explains how ${COMPANY_LEGAL_INFO.legalName} (${COMPANY_LEGAL_INFO.chineseName}), operating globally as ${COMPANY_LEGAL_INFO.brandName} ("Feitian PCB", "we", "our", or "us"), collects, stores, uses, and protects information submitted through our online quotation console, Gerber viewer, customer dashboard, and direct sales inquiries.`,
        "Headquartered in the Wuping County High-Tech Zone, Fujian Province, China (with a Shenzhen engineering and export coordination center), we serve electronics engineering teams across China, Europe, North America, Japan, South Korea, and Southeast Asia.",
      ],
    },
    {
      id: "data-collected",
      number: "02",
      title: "Information & Engineering Files We Collect",
      paragraphs: [
        "We collect only the information required to quote, review (DFM), manufacture, inspect, and deliver your custom printed circuit boards (PCBs) and turnkey assemblies (PCBA):",
      ],
      bullets: [
        "Account & Contact Details: Full name, company or institution name, business email address, telephone/WhatsApp number, and shipping/billing addresses.",
        "Engineering & CAD Archives: RS-274X Gerber files, ODB++, Excellon drill files, stackup notes, impedance requirements, Bills of Materials (BOM), centroid/pick-and-place coordinates, and schematic/assembly drawings.",
        "Order & Transaction Metadata: Board parameters (layer count, copper weight, surface finish, solder mask, quantity), order status, invoice records, and payment confirmation references (processed securely via Stripe, PayPal, Wise, SEPA, or bank wire; we never store raw card numbers on our servers).",
        "Technical & Security Telemetry: Browser session cookies for authentication, IP address for rate limiting and audit logging, and language/theme preferences.",
      ],
    },
    {
      id: "ip-nda",
      number: "03",
      title: "Intellectual Property & Gerber File Confidentiality",
      paragraphs: [
        "Every CAD archive, Gerber package, BOM, and custom specification uploaded to our platform remains the exclusive intellectual property of you or your organization.",
      ],
      bullets: [
        "Access Control: Uploaded engineering files are encrypted in transit (TLS 1.2/1.3) and restricted strictly to authorized CAM engineers, DFM reviewers, and production tooling personnel assigned to your order.",
        "Zero Third-Party Disclosure: We never sell, publish, redistribute, reverse-engineer, or reuse customer circuit designs for internal products or competing clients.",
        "Dedicated NDA Support: Enterprise, automotive (IATF 16949), medical, telecom, and aerospace clients may request a signed mutual Non-Disclosure Agreement (NDA) prior to uploading production packages.",
      ],
      highlight: {
        title: "Strict Engineering NDA Protection",
        body: "Gerber files, ODB++ archives, and BOM data are used exclusively for DFM engineering validation, phototooling, electrical netlist testing, and fabrication of your authorized purchase order.",
      },
    },
    {
      id: "how-we-use",
      number: "04",
      title: "How We Use Your Information",
      paragraphs: ["We process collected data solely for legitimate manufacturing and service operations:"],
      bullets: [
        "Generating instant PCB/PCBA quotations and performing pre-production CAM Design for Manufacturing (DFM) reviews.",
        "Fabricating bare boards, sourcing genuine electronic components, executing SMT/THT assembly, and running AOI, Flying Probe, TDR impedance, and X-Ray QA checks.",
        "Issuing invoices, verifying payments, preparing commercial customs declarations (RoHS, REACH, UL 94V-0 compliance), and dispatching shipments via DHL, FedEx, UPS, or SF Express.",
        "Providing customer support, order milestone alerts, and warranty/remake resolution.",
      ],
    },
    {
      id: "sharing",
      number: "05",
      title: "Data Sharing & Trusted Sub-Processors",
      paragraphs: [
        "We do not sell or rent personal or corporate contact data to advertisers or data brokers. We share minimum necessary data only with operational partners essential to fulfill your order:",
      ],
      bullets: [
        "Authorized Logistics Carriers: DHL Express, FedEx International, UPS, SF Express International, and domestic couriers receive consignee name, address, phone number, and customs valuation solely for delivery.",
        "Payment Processors: Stripe, PayPal, and banking partners process payments under PCI-DSS compliant security controls.",
        "Authorized Component Distributors: Where turnkey PCBA sourcing is ordered, part numbers (MPNs) and quantities are queried with verified component suppliers without revealing your design schematics.",
        "Legal Compliance: Only when required by applicable law, customs inspection authorities, or valid judicial order.",
      ],
    },
    {
      id: "retention-security",
      number: "06",
      title: "Data Security, Cookies & Retention",
      paragraphs: [
        "We employ HTTPS/TLS transport encryption, hashed password storage, role-based access control (RBAC) across admin/engineering desks, automated audit logs, and isolated Docker network boundaries.",
        "Essential session cookies keep you signed in and preserve your shopping cart and language selection. Engineering archives and QA inspection records (AOI/Flying Probe/microsection reports) are retained to support reorders and quality traceability unless you request earlier deletion.",
      ],
    },
    {
      id: "your-rights",
      number: "07",
      title: "Your Privacy Rights & File Deletion Requests",
      paragraphs: [
        "Regardless of your region (including EU/EEA under GDPR, UK, North America, or Asia-Pacific), you may contact us at any time to:",
      ],
      bullets: [
        "Access, export, or update your account profile and company billing details.",
        "Request permanent deletion of uploaded Gerber, ODB++, or BOM archives once active fabrication and warranty obligations are complete.",
        "Withdraw marketing consent or close your platform account.",
      ],
    },
    {
      id: "contact",
      number: "08",
      title: "Privacy & Data Protection Contact",
      paragraphs: [
        `For privacy questions, NDA execution, or data deletion requests, please reach out directly to ${COMPANY_LEGAL_INFO.legalName}:`,
      ],
      bullets: [
        `Primary Emails: ${COMPANY_LEGAL_INFO.emails.join(" / ")}`,
        `Telephone / WhatsApp: ${COMPANY_LEGAL_INFO.phones.join(" | ")}`,
        `Factory Address: ${COMPANY_LEGAL_INFO.factoryAddress}`,
        `Registration Record: ${COMPANY_LEGAL_INFO.icpRecord}`,
      ],
    },
  ],
};

export const termsOfServiceData: LegalDocumentData = {
  slug: "terms-of-service",
  badge: "Commercial & Manufacturing Terms",
  title: "Terms of Service",
  subtitle:
    "Standard terms governing online PCB/PCBA quotations, CAM engineering DFM approvals, production tolerances, intellectual property, international shipping, and quality warranty with Wuping Feitian Electronic Technology Co., Ltd.",
  effectiveDate: "November 28, 2026",
  lastUpdated: "November 28, 2026",
  breadcrumbParent: { label: "About FT PCB", href: "/about-ft-pcb" },
  companionLink: {
    label: "Read Privacy Policy",
    href: "/privacy-policy",
    description: "Learn how we protect your Gerber files, BOMs, and account data.",
  },
  sections: [
    {
      id: "acceptance",
      number: "01",
      title: "Agreement & Contracting Entity",
      paragraphs: [
        `By creating an account, uploading Gerber/BOM files, requesting a quote, or placing an order on this website, you agree to these Terms of Service with ${COMPANY_LEGAL_INFO.legalName} (${COMPANY_LEGAL_INFO.chineseName}), operating as ${COMPANY_LEGAL_INFO.brandName}.`,
        "If you place an order on behalf of a company, university, or organization, you represent that you have authority to bind that entity to these terms.",
      ],
    },
    {
      id: "quotes-dfm",
      number: "02",
      title: "Quotations, Pricing & CAM DFM Review",
      paragraphs: [
        "Online instant calculator estimates are based on standard FR-4, aluminum core, flex/rigid-flex, or RF/PTFE parameters you enter. Final production pricing is confirmed after our CAM engineers inspect your uploaded Gerber, ODB++, drill, and BOM files.",
      ],
      bullets: [
        "Pre-Production Engineering Hold: If our DFM review detects design rule violations (insufficient trace spacing, annular ring issues, missing drill files, impedance stackup mismatches, or BOM package conflicts), we place the order on engineering hold and contact you for confirmation before tooling.",
        "Customer Specification Accuracy: You are responsible for verifying netlists, layer order, board outline, drill tolerances, impedance targets, and component polarity/orientation in your submitted CAD/BOM files.",
        "Lead Time Start: Production turnaround times (such as 24h/48h quick-turn) begin once both payment confirmation and final CAM/DFM engineering sign-off are completed.",
      ],
    },
    {
      id: "quality-standards",
      number: "03",
      title: "Manufacturing Standards & Quality Tolerances",
      paragraphs: [
        `Unless explicitly agreed otherwise in a written engineering specification, all bare circuit boards and SMT/THT assemblies are manufactured under our certified ${COMPANY_LEGAL_INFO.certifications} quality management systems.`,
      ],
      bullets: [
        "Default Inspection Standard: Bare boards are fabricated to IPC-A-600 Class 2 by default (Class 3 available upon specification during quotation) and undergo 100% flying-probe or fixture electrical netlist testing plus AOI optical inspection.",
        "Assembly Workmanship: Turnkey PCBA orders follow IPC-A-610 Class 2/3 workmanship standards, with 3D AOI and X-Ray verification for BGA/QFN components where applicable.",
        "Panelization & X-Outs: Multi-up delivery panels may include standard breakaway rails and tooling holes unless custom panel drawings are supplied.",
      ],
    },
    {
      id: "payments",
      number: "04",
      title: "Orders, Payments & Cancellations",
      paragraphs: [
        "Production tooling and material allocation commence upon verified payment or approved enterprise credit terms.",
      ],
      bullets: [
        "Accepted Payment Methods: Major credit/debit cards (Stripe), PayPal, Wise, SEPA, and direct corporate wire/TT bank transfer.",
        "Order Modifications & Cancellations: Orders may be cancelled or modified for a full refund prior to CAM tooling release and material cutting. Once inner-layer imaging, drilling, lamination, or custom BOM procurement has started, cancellation refunds are reduced by verified material and engineering costs already incurred.",
      ],
    },
    {
      id: "shipping-customs",
      number: "05",
      title: "Global Express Delivery, Risk & Customs",
      paragraphs: [
        `Finished boards are vacuum-sealed in moisture-barrier ESD packaging with desiccant and shipped worldwide via ${COMPANY_LEGAL_INFO.couriers}.`,
      ],
      bullets: [
        "Incoterms & Customs: Unless DDP (Delivered Duty Paid) is explicitly selected on your invoice, international shipments are dispatched DAP/EXW. Import duties, VAT, and local customs brokerage fees in the destination country remain the buyer's responsibility.",
        "Transit Delays: Estimated air courier transit times (typically 2–4 business days for DHL/FedEx Priority) exclude customs holds, severe weather, or carrier force majeure events.",
        "Visible Transit Damage: Please inspect outer cartons upon delivery and report courier damage with photos within 48 hours so we can file an insured carrier claim immediately.",
      ],
    },
    {
      id: "warranty-remake",
      number: "06",
      title: "Quality Warranty, Remake & Liability Limits",
      paragraphs: [
        "We stand behind every circuit board leaving our Wuping campus with a straightforward manufacturing defect warranty.",
      ],
      highlight: {
        title: "Zero-Defect Remake & Credit Guarantee",
        body: "If fabricated PCBs or turnkey assemblies fail to match your approved Gerber/BOM files or IPC Class 2/3 tolerances, notify us within 30 days of receipt with photos and test logs. Verified manufacturing defects are remade via expedited priority line at zero charge or credited/refunded in full.",
      },
      bullets: [
        "Exclusions: This warranty does not cover circuit design errors present in the customer's submitted Gerber/schematic/BOM files, improper soldering or ESD damage by third parties, or customer-consigned components that arrive defective or counterfeit.",
        "Limitation of Liability: To the maximum extent permitted by law, Wuping Feitian Electronic Technology Co., Ltd.'s total aggregate liability for any order shall not exceed the total invoice amount paid for that specific production batch, excluding indirect, incidental, or consequential damages.",
      ],
    },
    {
      id: "ip-export-compliance",
      number: "07",
      title: "Customer IP & Export Compliance",
      paragraphs: [
        "You warrant that all uploaded Gerber files, trademarks, silkscreens, and firmware binaries do not infringe third-party intellectual property rights and comply with applicable export control, RoHS, and sanctions regulations.",
        "You retain 100% ownership of your hardware designs. We grant no license to ourselves except the limited right to fabricate and test your authorized production order.",
      ],
    },
    {
      id: "governing-law",
      number: "08",
      title: "Governing Law & Corporate Contact",
      paragraphs: [
        "These Terms of Service are governed by the laws of the People's Republic of China, without prejudice to mandatory consumer or commercial protections applicable in international trade agreements. Parties agree to seek good-faith engineering and commercial resolution before formal dispute proceedings.",
      ],
      bullets: [
        `Company: ${COMPANY_LEGAL_INFO.legalName} (${COMPANY_LEGAL_INFO.chineseName})`,
        `Factory Campus: ${COMPANY_LEGAL_INFO.factoryAddress}`,
        `Support & Legal Desk: ${COMPANY_LEGAL_INFO.emails.join(" / ")}`,
        `Telephone: ${COMPANY_LEGAL_INFO.phones.join(" | ")}`,
      ],
    },
  ],
};
