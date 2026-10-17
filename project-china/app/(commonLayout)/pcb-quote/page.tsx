"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Award,
  Box,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Cpu,
  CreditCard,
  Download,
  ExternalLink,
  Eye,
  FileArchive,
  FileText,
  HelpCircle,
  Info,
  Layers,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plane,
  Plus,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  UploadCloud,
  Wallet,
  Wrench,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GerberService } from "@/services/gerber.service";
import { OrderService } from "@/services/order.service";
import { PaymentService } from "@/services/payment.service";
import { useAuthStore } from "@/store/authStore";

// ============================================================================
// PCBWay Configurator Master Specifications & Data Sets
// ============================================================================

const categoryTabs = [
  { id: "standard", name: "Standard PCB", badge: "", icon: Cpu },
  { id: "advanced", name: "Advanced PCB", badge: "HOT", icon: Layers },
  { id: "fpc", name: "FPC / Rigid-Flex", badge: "", icon: Wrench },
  { id: "assembly", name: "Assembly (PCBA)", badge: "SMT", icon: Box },
  { id: "stencil", name: "SMD-Stencil", badge: "", icon: FileText },
  { id: "cnc", name: "CNC | 3D", badge: "", icon: Sparkles },
];

const boardTypeOptions = [
  { id: "Single piece", label: "Single piece" },
  { id: "Panel by Customer", label: "Panel by Customer" },
  { id: "Panel by Supplier", label: "Panel by Supplier" },
];

const designCounts = ["1", "2", "3", "4", "5", "6"];

const quantityOptions = ["5", "10", "15", "20", "25", "30", "50", "75", "100", "200", "500", "1000"];

const layerOptions = [
  "1 Layer",
  "2 Layers",
  "4 Layers",
  "6 Layers",
  "8 Layers",
  "10 Layers",
  "12 Layers",
  "14 Layers",
];

const materialOptions = [
  { id: "FR-4", label: "FR-4 Standard", desc: "TG150 S1000H High Temp" },
  { id: "Aluminum", label: "Aluminum", desc: "LED & Thermal dissipation" },
  { id: "Rogers", label: "Rogers (High Freq)", desc: "RO4350B / RO4003C" },
  { id: "HDI", label: "HDI (Buried/Blind)", desc: "1+N+1 Laser Microvias" },
  { id: "Copper Base", label: "Copper Base", desc: "Heavy power electronics" },
];

const tgOptions = ["TG 130-140", "TG 150-160 (Free Upgrade)", "TG 170-180"];

const thicknessOptions = [
  "0.4",
  "0.6",
  "0.8",
  "1.0",
  "1.2",
  "1.6",
  "2.0",
  "2.4",
  "2.6",
  "3.0",
  "3.2",
];

const minTrackSpacingOptions = ["3/3mil", "4/4mil", "5/5mil", "6/6mil", "8/8mil"];

const minHoleSizeOptions = ["0.15mm", "0.2mm", "0.25mm", "0.3mm", "0.8mm", "No Drill"];

const solderMaskColors = [
  { id: "Green", label: "Green", hex: "#15803d", border: "#166534" },
  { id: "Red", label: "Red", hex: "#b91c1c", border: "#991b1b" },
  { id: "Yellow", label: "Yellow", hex: "#ca8a04", border: "#a16207" },
  { id: "Blue", label: "Blue", hex: "#1d4ed8", border: "#1e40af" },
  { id: "White", label: "White", hex: "#f8fafc", border: "#cbd5e1" },
  { id: "Black", label: "Black", hex: "#18181b", border: "#27272a" },
  { id: "Purple", label: "Purple", hex: "#7e22ce", border: "#6b21a8" },
  { id: "Matte Black", label: "Matte Black", hex: "#09090b", border: "#3f3f46" },
  { id: "Matte Green", label: "Matte Green", hex: "#14532d", border: "#166534" },
  { id: "None", label: "None", hex: "transparent", border: "#94a3b8" },
];

const silkscreenColors = ["White", "Black", "Yellow", "None"];

const surfaceFinishOptions = [
  { id: "HASL", label: "HASL with lead", sub: "Economic standard" },
  { id: "HASL-RoHS", label: "HASL lead free", sub: "RoHS Compliant" },
  { id: "ENIG", label: "Immersion gold (ENIG)", sub: "Flat surface for BGA" },
  { id: "OSP", label: "OSP", sub: "Organic preservative" },
  { id: "Hard Gold", label: "Hard gold (Finger)", sub: "High abrasion" },
  { id: "Immersion Silver", label: "Immersion silver (Ag)", sub: "High speed RF" },
  { id: "Immersion Tin", label: "Immersion Tin", sub: "Press-fit standard" },
];

const viaProcessOptions = [
  { id: "Tenting vias", label: "Tenting vias", desc: "Covered by solder mask" },
  { id: "Plugged vias", label: "Plugged vias & solder mask", desc: "Filled with resin" },
  { id: "Vias not covered", label: "Vias not covered", desc: "Exposed copper ring" },
];

const finishedCopperOptions = ["0.5oz Cu", "1oz Cu", "2oz Cu", "3oz Cu"];

const shippingCountries = [
  { code: "US", name: "United States", fee: 19, carrier: "DHL Express (3-5 Days)" },
  { code: "DE", name: "Germany", fee: 21, carrier: "DHL Express (3-4 Days)" },
  { code: "GB", name: "United Kingdom", fee: 20, carrier: "FedEx Priority (3-5 Days)" },
  { code: "FR", name: "France", fee: 21, carrier: "DHL Express (3-4 Days)" },
  { code: "CA", name: "Canada", fee: 22, carrier: "FedEx Priority (4-6 Days)" },
  { code: "AU", name: "Australia", fee: 24, carrier: "DHL Express (4-6 Days)" },
  { code: "JP", name: "Japan", fee: 15, carrier: "EMS / SF Express (2-3 Days)" },
  { code: "BD", name: "Bangladesh", fee: 18, carrier: "DHL Express (3-5 Days)" },
  { code: "IN", name: "India", fee: 19, carrier: "FedEx Express (4-6 Days)" },
  { code: "IT", name: "Italy", fee: 22, carrier: "DHL Express (3-5 Days)" },
];

function PayPalIcon({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.78.78 0 0 1 .77-.65h6.643c3.27 0 5.433 1.554 5.034 4.793-.34 2.766-2.215 4.316-4.912 4.316h-2.15l-1.396 7.644a.64.64 0 0 1-.633.514h-1.234z"
        fill="#003087"
      />
      <path
        d="M19.167 7.863c-.34 2.766-2.215 4.316-4.912 4.316h-2.15l-1.15 6.295h3.045c.57 0 1.05-.41 1.144-.972l.044-.236.916-5.02.059-.28a1.16 1.16 0 0 1 1.144-.972h.724c2.81 0 5.01-1.14 5.653-4.43.34-1.74-.035-3.08-1.023-3.95a4.897 4.897 0 0 0-2.445-.75"
        fill="#0079C1"
      />
      <path
        d="M9.13 13.18h2.15c2.697 0 4.572-1.55 4.912-4.316.399-3.24-1.764-4.793-5.034-4.793H4.515a.78.78 0 0 0-.77.65L1.837 20.597a.641.641 0 0 0 .633.74h4.606l1.234-7.643a.64.64 0 0 1 .633-.514h.187z"
        fill="#003087"
        opacity="0.2"
      />
    </svg>
  );
}

function PCBQuoteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentUser = useAuthStore((state) => state.user);

  // Workflow Step: 1 = Online Quote, 2 = Upload Gerber, 3 = Payment Method, 4 = Fabrication Confirmed
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Active Category
  const [activeCategory, setActiveCategory] = useState("standard");

  // PCB Specifications State
  const [boardType, setBoardType] = useState("Single piece");
  const [designCount, setDesignCount] = useState("1");
  const [length, setLength] = useState("100");
  const [width, setWidth] = useState("100");
  const [quantity, setQuantity] = useState("5");
  const [customQty, setCustomQty] = useState("");
  const [layers, setLayers] = useState("2 Layers");
  const [material, setMaterial] = useState("FR-4");
  const [fr4Tg, setFr4Tg] = useState("TG 150-160 (Free Upgrade)");
  const [thickness, setThickness] = useState("1.6");
  const [minTrack, setMinTrack] = useState("5/5mil");
  const [minHole, setMinHole] = useState("0.3mm");
  const [solderMask, setSolderMask] = useState("Green");
  const [silkscreen, setSilkscreen] = useState("White");
  const [edgeConnector, setEdgeConnector] = useState("No");
  const [surfaceFinish, setSurfaceFinish] = useState("HASL-RoHS");
  const [viaProcess, setViaProcess] = useState("Tenting vias");
  const [finishedCopper, setFinishedCopper] = useState("1oz Cu");
  const [removeProductNo, setRemoveProductNo] = useState("No");

  // Advanced Options (Expandable)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [castellatedHoles, setCastellatedHoles] = useState("No");
  const [edgePlating, setEdgePlating] = useState("No");
  const [impedanceControl, setImpedanceControl] = useState("No");
  const [peelableMask, setPeelableMask] = useState("No");

  // Build Time Selection
  const [buildTime, setBuildTime] = useState<"24h" | "48h" | "normal">("24h");

  // Shipping
  const [selectedCountry, setSelectedCountry] = useState("US");

  // Customer Contact Info
  const [contactName, setContactName] = useState(currentUser?.name || "");
  const [contactEmail, setContactEmail] = useState(currentUser?.email || "");
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || "");
  const [shippingAddress, setShippingAddress] = useState(
    currentUser?.address || "Wuping High-Tech Zone, Direct Delivery"
  );

  // File Upload State
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [stagedFileNames, setStagedFileNames] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Order & Payment State
  const [createdOrder, setCreatedOrder] = useState<{
    id: string;
    totalAmount: number;
    status: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGateway, setSelectedGateway] = useState<"stripe" | "paypal" | "bank_tt">("stripe");
  const [submittingGateway, setSubmittingGateway] = useState<"stripe" | "paypal" | "bank_tt" | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [restoredFromSession, setRestoredFromSession] = useState(false);
  const isResumingRef = useRef(false);

  // Key for session quote persistence
  const QUOTE_SESSION_KEY = "FT_PCB_PENDING_QUOTE";

  // Sync contact fields with logged-in user when user loads
  useEffect(() => {
    if (currentUser) {
      if (!contactName && currentUser.name) setContactName(currentUser.name);
      if (!contactEmail && currentUser.email) setContactEmail(currentUser.email);
      if (!contactPhone && currentUser.phone) setContactPhone(currentUser.phone);
      if (currentUser.address) setShippingAddress(currentUser.address);
    }
  }, [currentUser]);

  // Restore quote specifications from sessionStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const rawSaved = sessionStorage.getItem(QUOTE_SESSION_KEY);
      if (!rawSaved) return;

      const saved = JSON.parse(rawSaved);
      if (saved && saved.specs) {
        if (saved.specs.boardType) setBoardType(saved.specs.boardType);
        if (saved.specs.designCount) setDesignCount(saved.specs.designCount);
        if (saved.specs.length) setLength(saved.specs.length);
        if (saved.specs.width) setWidth(saved.specs.width);
        if (saved.specs.quantity) setQuantity(saved.specs.quantity);
        if (saved.specs.customQty) setCustomQty(saved.specs.customQty);
        if (saved.specs.layers) setLayers(saved.specs.layers);
        if (saved.specs.material) setMaterial(saved.specs.material);
        if (saved.specs.fr4Tg) setFr4Tg(saved.specs.fr4Tg);
        if (saved.specs.thickness) setThickness(saved.specs.thickness);
        if (saved.specs.minTrack) setMinTrack(saved.specs.minTrack);
        if (saved.specs.minHole) setMinHole(saved.specs.minHole);
        if (saved.specs.solderMask) setSolderMask(saved.specs.solderMask);
        if (saved.specs.silkscreen) setSilkscreen(saved.specs.silkscreen);
        if (saved.specs.edgeConnector) setEdgeConnector(saved.specs.edgeConnector);
        if (saved.specs.surfaceFinish) setSurfaceFinish(saved.specs.surfaceFinish);
        if (saved.specs.viaProcess) setViaProcess(saved.specs.viaProcess);
        if (saved.specs.finishedCopper) setFinishedCopper(saved.specs.finishedCopper);
        if (saved.specs.removeProductNo) setRemoveProductNo(saved.specs.removeProductNo);
        if (saved.specs.castellatedHoles) setCastellatedHoles(saved.specs.castellatedHoles);
        if (saved.specs.edgePlating) setEdgePlating(saved.specs.edgePlating);
        if (saved.specs.impedanceControl) setImpedanceControl(saved.specs.impedanceControl);
        if (saved.specs.peelableMask) setPeelableMask(saved.specs.peelableMask);
        if (saved.specs.buildTime) setBuildTime(saved.specs.buildTime);
        if (saved.specs.selectedCountry) setSelectedCountry(saved.specs.selectedCountry);
        if (saved.selectedGateway) setSelectedGateway(saved.selectedGateway);
        if (saved.specs.contactName) setContactName(saved.specs.contactName);
        if (saved.specs.contactEmail) setContactEmail(saved.specs.contactEmail);
        if (saved.specs.contactPhone) setContactPhone(saved.specs.contactPhone);
        if (saved.specs.shippingAddress) setShippingAddress(saved.specs.shippingAddress);

        setRestoredFromSession(true);
      }
    } catch (e) {
      console.warn("Could not restore saved quote from sessionStorage:", e);
    }
  }, []);

  // Initialize from search query parameters if coming from hero calculator
  useEffect(() => {
    const qLayers = searchParams.get("layers");
    if (qLayers) setLayers(`${qLayers} Layers`);

    const qQty = searchParams.get("qty");
    if (qQty) setQuantity(qQty);

    const qLength = searchParams.get("length");
    if (qLength) setLength(qLength);

    const qWidth = searchParams.get("width");
    if (qWidth) setWidth(qWidth);

    const qColor = searchParams.get("color");
    if (qColor) setSolderMask(qColor);

    const qFinish = searchParams.get("finish");
    if (qFinish) setSurfaceFinish(qFinish);

    const qEmail = searchParams.get("email");
    if (qEmail) setContactEmail(qEmail);

    const qPhone = searchParams.get("phone");
    if (qPhone) setContactPhone(qPhone);

    const qOrderId = searchParams.get("orderId");
    if (qOrderId) {
      setCreatedOrder({
        id: qOrderId,
        totalAmount: Number(searchParams.get("price")) || 17.0,
        status: "PENDING",
      });
      // If order already created from hero, skip straight to payment review!
      setCurrentStep(3);
    }
  }, [searchParams]);

  // Dynamic Price Calculation Engine
  const effectiveQty = Number(customQty) || Number(quantity) || 5;
  const numLayers = parseInt(layers) || 2;
  const boardAreaCm2 = (Number(length) * Number(width)) / 100;

  const pricing = useMemo(() => {
    let base = 5.0; // Rapid prototype introductory baseline (PCBWay $5 for 5pcs 2L)

    // Layer multipliers
    if (numLayers === 1) base = 4.5;
    else if (numLayers === 2) base = 5.0;
    else if (numLayers === 4) base = 28.0;
    else if (numLayers === 6) base = 65.0;
    else if (numLayers === 8) base = 120.0;
    else base = 220.0;

    // Quantity scaling
    const qtyMultiplier = effectiveQty <= 5 ? 1 : 1 + (effectiveQty - 5) * 0.12;
    let pcbFabrication = base * qtyMultiplier;

    // Dimension scaling for larger boards
    if (boardAreaCm2 > 100) {
      pcbFabrication += ((boardAreaCm2 - 100) / 50) * 4 * (effectiveQty / 5);
    }

    // Material additions
    if (material === "Aluminum") pcbFabrication += 12.0;
    if (material === "Rogers") pcbFabrication += 85.0;
    if (material === "HDI") pcbFabrication += 45.0;

    // Surface finish additions
    if (surfaceFinish === "ENIG") pcbFabrication += 18.0;
    if (surfaceFinish === "Hard Gold") pcbFabrication += 35.0;
    if (surfaceFinish === "Immersion Silver") pcbFabrication += 25.0;

    // Special options
    if (castellatedHoles === "Yes") pcbFabrication += 15.0;
    if (edgePlating === "Yes") pcbFabrication += 16.0;
    if (impedanceControl === "Yes") pcbFabrication += 10.0;

    // Build Time speed fee
    let speedFee = 0;
    if (buildTime === "24h") speedFee = 0; // Free 24h rapid build promotion!
    else if (buildTime === "48h") speedFee = 0;
    else speedFee = 0;

    // Shipping fee
    const country = shippingCountries.find((c) => c.code === selectedCountry) || shippingCountries[0];
    const shippingFee = country.fee;

    const total = pcbFabrication + speedFee + shippingFee;

    return {
      pcbFabrication: Math.max(5.0, Number(pcbFabrication.toFixed(2))),
      engineeringFee: 0.0, // Waived CAM Check
      eTestFee: 0.0, // 100% Free E-Test
      shippingFee,
      carrier: country.carrier,
      total: Number(total.toFixed(2)),
      weightKg: Number((0.08 * (effectiveQty / 5) * (numLayers / 2) * (boardAreaCm2 / 100)).toFixed(2)),
    };
  }, [
    effectiveQty,
    numLayers,
    boardAreaCm2,
    material,
    surfaceFinish,
    castellatedHoles,
    edgePlating,
    impedanceControl,
    buildTime,
    selectedCountry,
  ]);

  // Handle Gerber upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
    setStagedFileNames((prev) => [...prev, ...files.map((f) => f.name)]);
    toast.success(`✓ ${files.length} design file(s) attached and staged for CAM engineering check!`);
  };

  const removeFile = (idx: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== idx));
    setStagedFileNames((prev) => prev.filter((_, i) => i !== idx));
  };

  // Reset to default standard specs
  const handleReset = () => {
    setBoardType("Single piece");
    setDesignCount("1");
    setLength("100");
    setWidth("100");
    setQuantity("5");
    setCustomQty("");
    setLayers("2 Layers");
    setMaterial("FR-4");
    setFr4Tg("TG 150-160 (Free Upgrade)");
    setThickness("1.6");
    setMinTrack("5/5mil");
    setMinHole("0.3mm");
    setSolderMask("Green");
    setSilkscreen("White");
    setEdgeConnector("No");
    setSurfaceFinish("HASL-RoHS");
    setViaProcess("Tenting vias");
    setFinishedCopper("1oz Cu");
    setBuildTime("24h");
    toast.info("Specification parameters reset to factory standard prototype defaults.");
  };

  // Save quote specifications to sessionStorage
  const saveQuoteToSession = (gateway: "stripe" | "paypal" | "bank_tt", autoProceed = false) => {
    if (typeof window === "undefined") return;
    try {
      const payload = {
        specs: {
          boardType,
          designCount,
          length,
          width,
          quantity,
          customQty,
          layers,
          material,
          fr4Tg,
          thickness,
          minTrack,
          minHole,
          solderMask,
          silkscreen,
          edgeConnector,
          surfaceFinish,
          viaProcess,
          finishedCopper,
          removeProductNo,
          castellatedHoles,
          edgePlating,
          impedanceControl,
          peelableMask,
          buildTime,
          selectedCountry,
          contactName: contactName || currentUser?.name || "",
          contactEmail: contactEmail || currentUser?.email || "",
          contactPhone: contactPhone || currentUser?.phone || "",
          shippingAddress,
        },
        selectedGateway: gateway,
        pricing: {
          pcbFabrication: pricing.pcbFabrication,
          shippingFee: pricing.shippingFee,
          total: pricing.total,
          carrier: pricing.carrier,
        },
        autoProceed,
        timestamp: Date.now(),
      };
      sessionStorage.setItem(QUOTE_SESSION_KEY, JSON.stringify(payload));
    } catch (err) {
      console.warn("Could not save quote to sessionStorage:", err);
    }
  };

  // ORDER NOW & REDIRECT TO OFFICIAL CHECKOUT (STRIPE OR PAYPAL OR BANK TT)
  const handleProceedToPayment = async (
    targetGateway: "stripe" | "paypal" | "bank_tt" = selectedGateway
  ) => {
    // 1. If customer is not logged in, save all quote specs to sessionStorage and redirect to login/register
    if (!currentUser) {
      saveQuoteToSession(targetGateway, true);
      toast.info("Please sign in or create an account to proceed to checkout. Your quote has been safely saved!");
      router.push(`/login?redirect=${encodeURIComponent("/pcb-quote?resumeQuote=true")}`);
      return;
    }

    const email = contactEmail.trim() || currentUser?.email || "customer@syspcb.com";
    const name = contactName.trim() || currentUser?.name || email.split("@")[0];

    try {
      setIsSubmitting(true);
      setSubmittingGateway(targetGateway);

      const gatewayLabel =
        targetGateway === "paypal"
          ? "PayPal Express Checkout"
          : targetGateway === "bank_tt"
          ? "Bank Wire Transfer (TT)"
          : "Stripe Full Page Checkout";

      toast.info(`Generating manufacturing order & connecting to ${gatewayLabel}...`);

      const description = [
        `CAM Build: ${boardType}, ${layers}, ${effectiveQty}pcs, ${length}x${width}mm`,
        `Material: ${material} (${fr4Tg}), Thickness: ${thickness}mm`,
        `Finish: ${surfaceFinish}, Solder Mask: ${solderMask}, Silkscreen: ${silkscreen}`,
        `Copper: ${finishedCopper}, Via: ${viaProcess}`,
        `Turnaround: ${buildTime === "24h" ? "24H Rapid" : "Standard"} • Destination: ${selectedCountry}`,
      ].join(" | ");

      const result = await GerberService.uploadPublicInquiry(uploadedFiles, {
        fullName: name,
        email,
        phone: contactPhone.trim(),
        boardType: `${material} ${layers} PCB (${boardType})`,
        length: Number(length),
        width: Number(width),
        layers: numLayers,
        quantity: effectiveQty,
        thickness: Number(thickness),
        material,
        surfaceFinish,
        solderMaskColor: solderMask,
        totalAmount: pricing.total,
        description,
      });

      const targetOrderId = result.order?.id || result.inquiry?.id;
      if (!targetOrderId) {
        throw new Error("Could not initialize order reference.");
      }

      setCreatedOrder({
        id: targetOrderId,
        totalAmount: pricing.total,
        status: result.order?.status || "PENDING",
      });

      // Clear the autoProceed flag after order reference is generated
      try {
        const rawSaved = sessionStorage.getItem(QUOTE_SESSION_KEY);
        if (rawSaved) {
          const parsed = JSON.parse(rawSaved);
          parsed.autoProceed = false;
          sessionStorage.setItem(QUOTE_SESSION_KEY, JSON.stringify(parsed));
        }
      } catch {
        // ignore
      }

      // 1. If user chose PAYPAL
      if (targetGateway === "paypal") {
        toast.info("Connecting to official PayPal Checkout...");
        try {
          const checkout = await PaymentService.createPayPalOrder(targetOrderId);
          if (checkout.checkoutUrl) {
            toast.success("Redirecting to PayPal Checkout...");
            window.location.href = checkout.checkoutUrl;
            return;
          }
        } catch (paypalErr) {
          console.warn("Direct PayPal order fallback:", paypalErr);
        }

        // Fallback to webhook gateway with PayPal preselected
        router.push(
          `/checkout/webhook?orderId=${encodeURIComponent(targetOrderId)}&amount=${pricing.total.toFixed(2)}&provider=paypal&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
        );
        return;
      }

      // 2. If user chose BANK WIRE TRANSFER (TT)
      if (targetGateway === "bank_tt") {
        router.push(
          `/checkout/webhook?orderId=${encodeURIComponent(targetOrderId)}&amount=${pricing.total.toFixed(2)}&provider=bank_tt&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
        );
        return;
      }

      // 3. If user chose STRIPE (Cards, Apple Pay, Google Pay)
      toast.info("Connecting to official Stripe Checkout page...");
      try {
        const checkout = await PaymentService.createStripeCheckout(targetOrderId);
        if (checkout.checkoutUrl) {
          toast.success("Redirecting to official Stripe Checkout page...");
          window.location.href = checkout.checkoutUrl;
          return;
        }
      } catch (stripeErr) {
        console.warn("Direct Stripe session creation fallback:", stripeErr);
      }

      // Fallback redirect if direct Stripe session had an issue
      router.push(
        `/checkout/webhook?orderId=${encodeURIComponent(targetOrderId)}&amount=${pricing.total.toFixed(2)}&provider=stripe&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`
      );
    } catch (err) {
      console.error("Order creation failed:", err);
      toast.error(err instanceof Error ? err.message : "Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
      setSubmittingGateway(null);
    }
  };

  // Auto-resume order and payment when user returns authenticated with resumeQuote
  useEffect(() => {
    if (typeof window === "undefined" || !currentUser || isResumingRef.current) return;

    try {
      const rawSaved = sessionStorage.getItem(QUOTE_SESSION_KEY);
      if (!rawSaved) return;

      const saved = JSON.parse(rawSaved);
      if (saved && saved.autoProceed) {
        isResumingRef.current = true;
        // Disarm autoProceed immediately so it doesn't loop
        saved.autoProceed = false;
        sessionStorage.setItem(QUOTE_SESSION_KEY, JSON.stringify(saved));

        const targetGateway = saved.selectedGateway || selectedGateway || "stripe";
        const gatewayLabel =
          targetGateway === "paypal"
            ? "PayPal Express"
            : targetGateway === "bank_tt"
            ? "Bank Wire Transfer"
            : "Stripe Full Page Checkout";

        toast.success(
          `Welcome back, ${currentUser.name || currentUser.email}! Quote restored. Continuing directly to ${gatewayLabel}...`
        );

        const timer = setTimeout(() => {
          handleProceedToPayment(targetGateway);
        }, 700);

        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn("Error auto-resuming payment from session:", e);
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-[#f5f7fa] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans pb-24">
      {/* ===================================================================== */}
      {/* Top Banner & Breadcrumb Step Indicator (PCBWay Style)                */}
      {/* ===================================================================== */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 py-3 px-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center size-8 rounded-lg bg-emerald-600 text-white font-black text-sm">
              FT
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-gray-900 dark:text-white">
                  Feitian Technology (SYS-PCB)
                </h1>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                  Direct Factory Turnaround
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">
                PCB Prototype the Easy Way • IPC Class 2/3 Quality Standard • 24H Rapid Build
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
            <span className="flex items-center gap-1 text-emerald-600">
              <ShieldCheck className="size-4" /> 100% Free E-Test
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600">
              <Clock className="size-4" /> 24H Shipping
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-600">
              <Award className="size-4" /> ISO 9001:2015
            </span>
          </div>
        </div>
      </div>

      {/* 6-Step Workflow Progress Bar (PCBWay Header) */}
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 py-2.5 px-4 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto overflow-x-auto">
          <div className="flex items-center min-w-[720px] justify-between text-xs font-extrabold text-gray-400">
            {[
              { num: 1, label: "Online Quote", desc: "Select Board Specs" },
              { num: 2, label: "Upload Gerber File", desc: "Attach Design / CAM" },
              { num: 3, label: "Payment", desc: "Card / PayPal / Wire" },
              { num: 4, label: "Fabrication", desc: "SMT & CAM Queue" },
              { num: 5, label: "Shipment", desc: "DHL / FedEx Priority" },
              { num: 6, label: "Confirm & Review", desc: "Delivered & Inspection" },
            ].map((st, i) => {
              const isActive = currentStep === st.num;
              const isPassed = currentStep > st.num;

              return (
                <div key={st.num} className="flex items-center gap-2">
                  <div
                    className={`flex size-6 items-center justify-center rounded-full text-[11px] font-black transition-all ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-2 ring-emerald-300 dark:ring-emerald-700"
                        : isPassed
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-gray-100 text-gray-500 dark:bg-slate-800"
                    }`}
                  >
                    {isPassed ? <Check className="size-3 stroke-[3]" /> : st.num}
                  </div>
                  <div className="leading-tight">
                    <span
                      className={`block font-extrabold ${
                        isActive
                          ? "text-emerald-700 dark:text-emerald-400 text-xs font-black"
                          : isPassed
                          ? "text-gray-800 dark:text-slate-200"
                          : "text-gray-400"
                      }`}
                    >
                      {st.label}
                    </span>
                    <span className="text-[10px] text-gray-400 font-normal hidden sm:block">
                      {st.desc}
                    </span>
                  </div>
                  {i < 5 && <ChevronRight className="size-3.5 text-gray-300 dark:text-slate-700 mx-1 shrink-0" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        {/* =================================================================== */}
        {/* STEP 4: ORDER CONFIRMED & PAID SUCCESS SCREEN                       */}
        {/* =================================================================== */}
        {currentStep === 4 && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-emerald-300 dark:border-emerald-800 p-8 shadow-xl max-w-3xl mx-auto text-center space-y-6">
            <div className="size-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-md">
              <CheckCircle2 className="size-12 animate-pulse" />
            </div>

            <div>
              <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-300">
                Payment Received & Fabrication Queue Active
              </span>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-3">
                Order Confirmed Successfully!
              </h2>
              <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                Thank you, <strong className="text-gray-800 dark:text-white">{contactName || "Customer"}</strong>. Your PCB parameters and files have been forwarded to our CAM engineering desk in Fujian, China.
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800/60 rounded-2xl p-5 border border-gray-200 dark:border-slate-700 text-left grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block font-semibold text-[10px] uppercase">Order Reference</span>
                <span className="font-mono text-base font-black text-emerald-700 dark:text-emerald-400">
                  #{createdOrder?.id.slice(0, 8).toUpperCase() || "ORD-COMPLETE"}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold text-[10px] uppercase">Amount Paid</span>
                <span className="text-base font-black text-gray-900 dark:text-white">
                  ${pricing.total.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold text-[10px] uppercase">Build Turnaround</span>
                <span className="font-extrabold text-gray-900 dark:text-white">24H Rapid Build</span>
              </div>
              <div>
                <span className="text-gray-400 block font-semibold text-[10px] uppercase">Shipping Route</span>
                <span className="font-extrabold text-gray-900 dark:text-white">{pricing.carrier.split(" ")[0]} Express</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={`/api/download?type=specs&orderId=${createdOrder?.id || "N/A"}&customer=${encodeURIComponent(contactName || "Customer")}&boardType=${encodeURIComponent(material + " " + layers)}&layers=${numLayers}&qty=${effectiveQty}&dims=${length}x${width}mm&finish=${encodeURIComponent(surfaceFinish)}&mask=${encodeURIComponent(solderMask)}&total=${pricing.total.toFixed(2)}`}
                download={`CAM_Specs_Order_${createdOrder?.id.slice(0, 8).toUpperCase()}.txt`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-3 shadow-md transition active:scale-95"
              >
                <Download className="size-4" />
                <span>Download CAM Spec Sheet (.txt)</span>
              </a>

              <Link
                href="/admin/orders"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-white font-bold text-xs px-5 py-3 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
              >
                <Eye className="size-4 text-emerald-600" />
                <span>View in Admin Orders</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  handleReset();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 dark:hover:text-slate-300 underline font-semibold px-3 py-2"
              >
                <RotateCcw className="size-3.5" />
                Place Another Quote
              </button>
            </div>
          </div>
        )}



        {/* =================================================================== */}
        {/* STEP 1 & 2: THE AUTHENTIC PCBWAY ONLINE INSTANT QUOTE CONFIGURATOR  */}
        {/* =================================================================== */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
            {/* LEFT MAIN SPECIFICATION COLUMN */}
            <div className="space-y-4">
              {/* Product Category Selector Tabs */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xs">
                {categoryTabs.map((cat) => {
                  const active = activeCategory === cat.id;
                  const Icon = cat.icon;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat.id);
                        if (cat.id === "fpc") setMaterial("Rogers");
                        else if (cat.id === "advanced") setLayers("4 Layers");
                        else setMaterial("FR-4");
                      }}
                      className={`relative flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-black transition-all ${
                        active
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                          : "text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      {cat.badge && (
                        <span className="absolute -top-1 -right-1 text-[9px] font-black bg-rose-500 text-white px-1.5 py-0.2 rounded-full uppercase tracking-tighter shadow-xs">
                          {cat.badge}
                        </span>
                      )}
                      <Icon className="size-4 mb-1" />
                      <span className="text-[11px] truncate max-w-full">{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Toolbar & Speed Info Banner */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xs">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="h-8 gap-1 rounded-xl text-xs font-bold text-gray-600 dark:text-slate-300"
                  >
                    <RotateCcw className="size-3" />
                    Reset Defaults
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => toast.success(`✓ Live Price Recalculated: $${pricing.total.toFixed(2)}`)}
                    className="h-8 gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs"
                  >
                    <RefreshCw className="size-3" />
                    Quote Now
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-600">
                    <Zap className="size-3.5 fill-emerald-600" />
                    Speed Turnaround:
                  </span>
                  <span>24H Express Normal • IPC Class 2 Standard</span>
                </div>
              </div>

              {/* Main PCB Specification Form (The PCBWay Core Spec Table) */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-5 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="size-4 text-emerald-600" />
                    <h2 className="text-sm font-black text-gray-900 dark:text-white">
                      PCB Specification Selection
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <label className="inline-flex items-center gap-1 text-emerald-600 font-bold hover:underline cursor-pointer">
                      <Plus className="size-3.5" />
                      + Add Gerber File
                      <input
                        type="file"
                        className="sr-only"
                        multiple
                        accept=".zip,.rar,.7z,.tar,.gz,.txt,.pdf"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-400 font-medium">CAM Online Checker</span>
                  </div>
                </div>

                {/* File Attachment List if files added */}
                {uploadedFiles.length > 0 && (
                  <div className="bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl p-3 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <span className="text-[11px] font-black text-emerald-800 dark:text-emerald-300 block">
                      ✓ Attached Gerber Files ({uploadedFiles.length}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={file.name + idx}
                          className="flex items-center gap-1.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 px-2 py-1 text-xs text-gray-700 dark:text-slate-200"
                        >
                          <FileArchive className="size-3.5 text-emerald-600" />
                          <span className="font-mono text-[11px] truncate max-w-[180px]">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="text-gray-400 hover:text-red-500 ml-1"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 1. Board type */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start gap-2.5 text-xs">
                  <span className="font-bold text-gray-600 dark:text-slate-400 pt-1.5">
                    Board type:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {boardTypeOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setBoardType(opt.id)}
                        className={`rounded-lg px-3 py-1.5 font-bold transition-all border ${
                          boardType === opt.id
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                            : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-emerald-500"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Different design in panel */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-center gap-2.5 text-xs">
                  <span className="font-bold text-gray-600 dark:text-slate-400">
                    Different design in panel:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {designCounts.map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setDesignCount(cnt)}
                        className={`size-8 rounded-lg font-bold border transition ${
                          designCount === cnt
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-emerald-500"
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Size (single) */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-center gap-2.5 text-xs">
                  <span className="font-bold text-gray-600 dark:text-slate-400">
                    Size (single):
                  </span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      className="h-8 w-20 text-xs text-center font-bold"
                    />
                    <span className="text-gray-400 font-bold">×</span>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="h-8 w-20 text-xs text-center font-bold"
                    />
                    <span className="font-bold text-gray-600 dark:text-slate-300">mm</span>
                    <span className="text-[11px] text-gray-400 ml-2">
                      ({((Number(length) * Number(width)) / 100).toFixed(1)} cm²)
                    </span>
                  </div>
                </div>

                {/* 4. Quantity (single) */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-center gap-2.5 text-xs">
                  <span className="font-bold text-gray-600 dark:text-slate-400">
                    Quantity (single):
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {quantityOptions.map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => {
                          setQuantity(qty);
                          setCustomQty("");
                        }}
                        className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                          quantity === qty && !customQty
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                            : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-emerald-500"
                        }`}
                      >
                        {qty}
                      </button>
                    ))}
                    <div className="flex items-center gap-1 ml-1">
                      <Input
                        type="number"
                        placeholder="Other"
                        value={customQty}
                        onChange={(e) => {
                          setCustomQty(e.target.value);
                          if (e.target.value) setQuantity(e.target.value);
                        }}
                        className="h-7 w-16 text-xs text-center"
                      />
                      <span className="text-gray-400">pcs</span>
                    </div>
                  </div>
                </div>

                {/* 5. Layers */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-center gap-2.5 text-xs">
                  <span className="font-bold text-gray-600 dark:text-slate-400">
                    Layers:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {layerOptions.map((lay) => (
                      <button
                        key={lay}
                        type="button"
                        onClick={() => setLayers(lay)}
                        className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                          layers === lay
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                            : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-emerald-500"
                        }`}
                      >
                        {lay}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 6. Material */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start gap-2.5 text-xs">
                  <span className="font-bold text-gray-600 dark:text-slate-400 pt-1.5">
                    Material:
                  </span>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {materialOptions.map((mat) => (
                        <button
                          key={mat.id}
                          type="button"
                          onClick={() => setMaterial(mat.id)}
                          className={`px-3 py-1.5 rounded-lg font-bold border transition text-left ${
                            material === mat.id
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                              : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-emerald-500"
                          }`}
                        >
                          <span>{mat.label}</span>
                        </button>
                      ))}
                    </div>
                    {/* Free TG upgrade notice */}
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                      <Sparkles className="size-3 shrink-0" />
                      <span>The base material of 24h PCBs is automatically upgraded to S1000H TG150 for FREE.</span>
                    </div>
                  </div>
                </div>

                {/* 7. FR4-TG */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-center gap-2.5 text-xs">
                  <span className="font-bold text-gray-600 dark:text-slate-400">
                    FR4-TG:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {tgOptions.map((tg) => (
                      <button
                        key={tg}
                        type="button"
                        onClick={() => setFr4Tg(tg)}
                        className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                          fr4Tg === tg
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-emerald-500"
                        }`}
                      >
                        {tg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 8. Thickness */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-center gap-2.5 text-xs">
                  <span className="font-bold text-gray-600 dark:text-slate-400">
                    Thickness:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {thicknessOptions.map((th) => (
                      <button
                        key={th}
                        type="button"
                        onClick={() => setThickness(th)}
                        className={`px-2.5 py-1 rounded-lg font-bold border transition ${
                          thickness === th
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-emerald-500"
                        }`}
                      >
                        {th}
                      </button>
                    ))}
                    <span className="text-gray-400 self-center font-bold ml-1">mm</span>
                  </div>
                </div>

                {/* 9. Min track / spacing */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-center gap-2.5 text-xs">
                  <span className="font-bold text-gray-600 dark:text-slate-400">
                    Min track/spacing:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {minTrackSpacingOptions.map((tr) => (
                      <button
                        key={tr}
                        type="button"
                        onClick={() => setMinTrack(tr)}
                        className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                          minTrack === tr
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-emerald-500"
                        }`}
                      >
                        {tr}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 10. Min hole size */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-center gap-2.5 text-xs">
                  <span className="font-bold text-gray-600 dark:text-slate-400">
                    Min hole size:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {minHoleSizeOptions.map((hole) => (
                      <button
                        key={hole}
                        type="button"
                        onClick={() => setMinHole(hole)}
                        className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                          minHole === hole
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-emerald-500"
                        }`}
                      >
                        {hole}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 11. Solder Mask Color (With visual color chips) */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start gap-2.5 text-xs">
                  <span className="font-bold text-gray-600 dark:text-slate-400 pt-1.5">
                    Solder mask:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {solderMaskColors.map((clr) => {
                      const selected = solderMask === clr.id;

                      return (
                        <button
                          key={clr.id}
                          type="button"
                          onClick={() => setSolderMask(clr.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold border transition ${
                            selected
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                              : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-emerald-500"
                          }`}
                        >
                          <span
                            className="size-3.5 rounded-xs shrink-0 border"
                            style={{ backgroundColor: clr.hex, borderColor: clr.border }}
                          />
                          <span>{clr.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 12. Silkscreen */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-center gap-2.5 text-xs">
                  <span className="font-bold text-gray-600 dark:text-slate-400">
                    Silkscreen:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {silkscreenColors.map((silk) => (
                      <button
                        key={silk}
                        type="button"
                        onClick={() => setSilkscreen(silk)}
                        className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                          silkscreen === silk
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-emerald-500"
                        }`}
                      >
                        {silk}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 13. Surface finish */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-start gap-2.5 text-xs">
                  <span className="font-bold text-gray-600 dark:text-slate-400 pt-1.5">
                    Surface finish:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {surfaceFinishOptions.map((sf) => (
                      <button
                        key={sf.id}
                        type="button"
                        onClick={() => setSurfaceFinish(sf.id)}
                        className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                          surfaceFinish === sf.id
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                            : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-emerald-500"
                        }`}
                      >
                        <span>{sf.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 14. Via process */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-center gap-2.5 text-xs">
                  <span className="font-bold text-gray-600 dark:text-slate-400">
                    Via process:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {viaProcessOptions.map((via) => (
                      <button
                        key={via.id}
                        type="button"
                        onClick={() => setViaProcess(via.id)}
                        className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                          viaProcess === via.id
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-emerald-500"
                        }`}
                      >
                        {via.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 15. Finished copper */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-center gap-2.5 text-xs">
                  <span className="font-bold text-gray-600 dark:text-slate-400">
                    Finished copper:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {finishedCopperOptions.map((cu) => (
                      <button
                        key={cu}
                        type="button"
                        onClick={() => setFinishedCopper(cu)}
                        className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                          finishedCopper === cu
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-emerald-500"
                        }`}
                      >
                        {cu}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 16. Remove product no. */}
                <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] items-center gap-2.5 text-xs">
                  <span className="font-bold text-gray-600 dark:text-slate-400">
                    Remove product no.:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["No", "Yes", "Specify location"].map((rem) => (
                      <button
                        key={rem}
                        type="button"
                        onClick={() => setRemoveProductNo(rem)}
                        className={`px-3 py-1.5 rounded-lg font-bold border transition ${
                          removeProductNo === rem
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:border-emerald-500"
                        }`}
                      >
                        {rem}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Expandable Customized Services & Advanced Options */}
                <div className="border-t border-gray-100 dark:border-slate-800 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>+ Customized Services and Advanced Options (Castellated holes, Edge plating, Impedance control...)</span>
                    <ChevronDown className={`size-3.5 transition-transform ${showAdvanced ? "rotate-180" : ""}`} />
                  </button>

                  {showAdvanced && (
                    <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 text-xs">
                      <div>
                        <Label className="text-gray-500 font-bold block mb-1">Castellated holes</Label>
                        <div className="flex gap-2">
                          {["No", "Yes"].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setCastellatedHoles(val)}
                              className={`px-3 py-1 rounded-md font-bold border ${
                                castellatedHoles === val
                                  ? "bg-emerald-600 text-white border-emerald-600"
                                  : "bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-500 font-bold block mb-1">Edge plating</Label>
                        <div className="flex gap-2">
                          {["No", "Yes"].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setEdgePlating(val)}
                              className={`px-3 py-1 rounded-md font-bold border ${
                                edgePlating === val
                                  ? "bg-emerald-600 text-white border-emerald-600"
                                  : "bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-500 font-bold block mb-1">Impedance control</Label>
                        <div className="flex gap-2">
                          {["No", "Yes"].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setImpedanceControl(val)}
                              className={`px-3 py-1 rounded-md font-bold border ${
                                impedanceControl === val
                                  ? "bg-emerald-600 text-white border-emerald-600"
                                  : "bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-500 font-bold block mb-1">Peelable mask</Label>
                        <div className="flex gap-2">
                          {["No", "Yes"].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setPeelableMask(val)}
                              className={`px-3 py-1 rounded-md font-bold border ${
                                peelableMask === val
                                  ? "bg-emerald-600 text-white border-emerald-600"
                                  : "bg-white dark:bg-slate-900 border-gray-300 dark:border-slate-700"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR: "Pricing And Build Time" STICKY CARD (PCBWay Style) */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-5 shadow-lg sticky top-16">
                <div className="border-b border-gray-100 dark:border-slate-800 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-4 text-emerald-600" />
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                      Pricing And Build Time
                    </h3>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Instant Quote
                  </span>
                </div>

                {/* Build Time Table Radio Options */}
                <div className="mt-3.5 space-y-2 text-xs">
                  <span className="text-[11px] font-bold text-gray-500 block">
                    Manufacturing Turnaround:
                  </span>

                  {[
                    { id: "24h" as const, time: "24hours Rapid", qty: `${effectiveQty}pcs`, cost: `$${pricing.pcbFabrication.toFixed(2)}`, badge: "Popular" },
                    { id: "48h" as const, time: "48hours Fast Turn", qty: `${effectiveQty}pcs`, cost: `$${pricing.pcbFabrication.toFixed(2)}`, badge: "Standard" },
                    { id: "normal" as const, time: "Economy 3-4 Days", qty: `${effectiveQty}pcs`, cost: `$${pricing.pcbFabrication.toFixed(2)}`, badge: "Economy" },
                  ].map((bt) => {
                    const active = buildTime === bt.id;

                    return (
                      <div
                        key={bt.id}
                        onClick={() => setBuildTime(bt.id)}
                        className={`cursor-pointer rounded-xl border p-2.5 flex items-center justify-between transition ${
                          active
                            ? "border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                            : "border-gray-200 dark:border-slate-800 hover:border-gray-300 text-gray-700 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                              active
                                ? "border-emerald-600 bg-emerald-600 text-white"
                                : "border-gray-300 dark:border-slate-700"
                            }`}
                          >
                            {active && <Check className="size-2.5 stroke-[3]" />}
                          </div>
                          <div>
                            <span className="font-extrabold block text-xs">{bt.time}</span>
                            <span className="text-[10px] text-gray-400">{bt.qty}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-xs">{bt.cost}</span>
                          <span className="block text-[9px] text-emerald-600 font-bold uppercase">{bt.badge}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Shipping Selector & Cost */}
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-600 dark:text-slate-400 flex items-center gap-1">
                      <Truck className="size-3.5 text-emerald-600" />
                      Ship to Destination:
                    </span>
                    <span className="font-black text-emerald-600">${pricing.shippingFee.toFixed(2)}</span>
                  </div>

                  <Select value={selectedCountry} onValueChange={(val) => setSelectedCountry(val)}>
                    <SelectTrigger className="h-8 text-xs rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {shippingCountries.map((c) => (
                        <SelectItem key={c.code} value={c.code} className="text-xs">
                          {c.name} (${c.fee}.00)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                    <span>Carrier: {pricing.carrier}</span>
                    <span>~{pricing.weightKg} kg</span>
                  </div>
                </div>

                {/* Itemized breakdown */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>PCB Fabrication:</span>
                    <span>${pricing.pcbFabrication.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>CAM DFM Review:</span>
                    <span className="text-emerald-600 font-bold">$0.00 (FREE)</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>100% E-Test Inspection:</span>
                    <span className="text-emerald-600 font-bold">$0.00 (FREE)</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Express Air Freight:</span>
                    <span>${pricing.shippingFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-gray-200 dark:border-slate-800 text-sm font-black">
                    <span className="text-gray-900 dark:text-white">Total Amount:</span>
                    <span className="text-2xl text-emerald-600 dark:text-emerald-400 font-black">
                      ${pricing.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Payment Gateway Selection (PCBWay Style) */}
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-700 dark:text-slate-300">
                      Payment Method:
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="size-3" />
                      100% Secure Checkout
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* Option 1: Credit / Debit Card (Stripe) */}
                    <button
                      type="button"
                      onClick={() => setSelectedGateway("stripe")}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                        selectedGateway === "stripe"
                          ? "border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-600 shadow-2xs"
                          : "border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <CreditCard className={`size-4 ${selectedGateway === "stripe" ? "text-emerald-600" : "text-gray-400"}`} />
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                          Stripe
                        </span>
                      </div>
                      <span className="font-extrabold text-[11px] block text-gray-900 dark:text-white">Credit / Debit Card</span>
                      <span className="text-[10px] text-gray-500 dark:text-slate-400">Visa, MC, Apple/GPay</span>
                    </button>

                    {/* Option 2: PayPal Express */}
                    <button
                      type="button"
                      onClick={() => setSelectedGateway("paypal")}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                        selectedGateway === "paypal"
                          ? "border-[#003087] bg-amber-50/70 dark:bg-amber-950/30 text-[#003087] dark:text-amber-200 ring-1 ring-[#003087] shadow-2xs"
                          : "border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <PayPalIcon className="size-4" />
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FFC439]/40 text-[#003087] dark:text-[#FFC439]">
                          PayPal
                        </span>
                      </div>
                      <span className="font-extrabold text-[11px] block text-gray-900 dark:text-white">PayPal Express</span>
                      <span className="text-[10px] text-gray-500 dark:text-slate-400">Global Buyer Protection</span>
                    </button>
                  </div>
                </div>

                {/* Restored Session Banner */}
                {restoredFromSession && (
                  <div className="mt-3 flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300">
                    <span className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                      Quote specifications restored!
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          sessionStorage.removeItem(QUOTE_SESSION_KEY);
                        }
                        setRestoredFromSession(false);
                        toast.info("Saved quote session cleared.");
                      }}
                      className="text-[10px] underline hover:text-emerald-950 dark:hover:text-white cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* Guest user notice */}
                {!currentUser && (
                  <div className="mt-3 flex items-start gap-2 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-[11px] text-blue-800 dark:text-blue-300">
                    <Lock className="size-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Account required for checkout:</strong> Your quote is saved in session. You will be prompted to sign in or create an account, then automatically redirected to payment.
                    </span>
                  </div>
                )}

                {/* Main Action Buttons */}
                <div className="mt-4 space-y-2.5">
                  {/* Dynamic Primary Button based on selected payment gateway */}
                  {selectedGateway === "paypal" ? (
                    <Button
                      onClick={() => handleProceedToPayment("paypal")}
                      disabled={isSubmitting}
                      className="w-full h-11 bg-[#FFC439] hover:bg-[#F4B400] text-gray-950 font-black text-sm rounded-xl gap-2 shadow-lg shadow-amber-500/20 transition active:scale-95 cursor-pointer border border-amber-400/50"
                    >
                      {isSubmitting && submittingGateway === "paypal" ? (
                        <Loader2 className="size-4 animate-spin text-gray-900" />
                      ) : (
                        <PayPalIcon className="size-4" />
                      )}
                      <span>Pay with PayPal (${pricing.total.toFixed(2)})</span>
                      <ArrowRight className="size-4 text-gray-900" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleProceedToPayment("stripe")}
                      disabled={isSubmitting}
                      className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl gap-2 shadow-lg shadow-emerald-600/30 transition active:scale-95 cursor-pointer"
                    >
                      {isSubmitting && submittingGateway === "stripe" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <CreditCard className="size-4" />
                      )}
                      <span>Pay with Card / Stripe (${pricing.total.toFixed(2)})</span>
                      <ArrowRight className="size-4" />
                    </Button>
                  )}

                  {/* Dual Alternative Fast Checkout Button */}
                  {selectedGateway === "stripe" ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleProceedToPayment("paypal")}
                      disabled={isSubmitting}
                      className="w-full h-10 border-amber-300 dark:border-amber-700/60 bg-amber-50/60 dark:bg-amber-950/20 hover:bg-amber-100/70 text-gray-800 dark:text-amber-200 font-bold text-xs rounded-xl gap-2 transition cursor-pointer"
                    >
                      {isSubmitting && submittingGateway === "paypal" ? (
                        <Loader2 className="size-3.5 animate-spin text-amber-600" />
                      ) : (
                        <PayPalIcon className="size-3.5" />
                      )}
                      <span>Or Express Checkout with PayPal</span>
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleProceedToPayment("stripe")}
                      disabled={isSubmitting}
                      className="w-full h-10 border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/60 dark:bg-emerald-950/20 hover:bg-emerald-100/70 text-emerald-800 dark:text-emerald-200 font-bold text-xs rounded-xl gap-2 transition cursor-pointer"
                    >
                      {isSubmitting && submittingGateway === "stripe" ? (
                        <Loader2 className="size-3.5 animate-spin text-emerald-600" />
                      ) : (
                        <CreditCard className="size-3.5" />
                      )}
                      <span>Or Pay with Credit/Debit Card (Stripe)</span>
                    </Button>
                  )}

                  {/* Bank Wire Option Link */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => handleProceedToPayment("bank_tt")}
                      disabled={isSubmitting}
                      className="text-[11px] font-semibold text-gray-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Building2 className="size-3" />
                      Corporate / Volume Order? Pay via Bank Wire Transfer (T/T)
                    </button>
                  </div>

                  <p className="text-[10px] text-center text-gray-400 pt-0.5">
                    Instant proforma generation • 100% Secure Checkout • CAM review in 2 hours
                  </p>
                </div>

                {/* Supported Payment Badges & Trust Seals */}
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block text-center">
                    Accepted Payment Methods
                  </span>
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500 flex-wrap">
                    <span className="bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded font-mono text-[11px] flex items-center gap-1">
                      <PayPalIcon className="size-3" />
                      PayPal
                    </span>
                    <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-[11px]">VISA</span>
                    <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-[11px]">MasterCard</span>
                    <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-[11px]">Apple Pay</span>
                    <span className="bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-[11px]">Wire TT</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PCBQuotePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f7fa] dark:bg-slate-950 flex flex-col items-center justify-center text-center p-6">
          <Loader2 className="size-8 animate-spin text-emerald-600 mb-3" />
          <h2 className="text-base font-black text-gray-800 dark:text-slate-200">
            Loading Feitian PCB Instant Quote Configurator...
          </h2>
          <p className="text-xs text-gray-500 mt-1">Connecting to factory pricing engine...</p>
        </div>
      }
    >
      <PCBQuoteContent />
    </Suspense>
  );
}
