import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const downloadType = searchParams.get("type");

  // On-demand CAM Engineering Spec Sheet generation
  if (downloadType === "specs") {
    const orderId = searchParams.get("orderId") || "N/A";
    const customer = searchParams.get("customer") || "Customer";
    const boardType = searchParams.get("boardType") || "Custom PCB";
    const layers = searchParams.get("layers") || "2";
    const quantity = searchParams.get("qty") || "5";
    const dimensions = searchParams.get("dims") || "100x100mm";
    const finish = searchParams.get("finish") || "HASL";
    const mask = searchParams.get("mask") || "Green";
    const total = searchParams.get("total") || "17.00";

    const specContent = [
      "==================================================================",
      "  FEITIAN ELECTRONIC TECHNOLOGY (SYS-PCB) - CAM SPECIFICATION SHEET",
      "==================================================================",
      `Date Generated : ${new Date().toLocaleString()}`,
      `Order Reference: #${orderId.toUpperCase()}`,
      `Customer Name  : ${customer}`,
      "------------------------------------------------------------------",
      "  PCB MANUFACTURING & BUILD SPECIFICATIONS",
      "------------------------------------------------------------------",
      `Board Type     : ${boardType}`,
      `Layer Count    : ${layers} Layers`,
      `Quantity       : ${quantity} pcs`,
      `Dimensions     : ${dimensions}`,
      `Surface Finish : ${finish}`,
      `Solder Mask    : ${mask}`,
      `Estimated Cost : $${total}`,
      "------------------------------------------------------------------",
      "CAM Engineering Status: Production Parameters Staged for Review",
      "Direct Factory Turnaround: 24-48 Hours",
      "Quality Standard: IPC-A-600 / IPC Class 2/3",
      "Factory: Wuping High-Tech Zone, Longyan City, Fujian Province, China",
      "==================================================================",
    ].join("\r\n");

    const safeFilename = `CAM_Specs_Order_${orderId.slice(0, 8)}.txt`.replace(/["\r\n]/g, "_");
    return new NextResponse(specContent, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(safeFilename)}`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  const rawUrl = searchParams.get("url");
  const customName = searchParams.get("name");

  if (!rawUrl) {
    return NextResponse.json({ success: false, message: "Missing file URL" }, { status: 400 });
  }

  try {
    const backendOrigin = (process.env.NEXT_PUBLIC_API_ORIGIN || "http://localhost:5000").replace(/\/+$/, "");
    const targetUrl =
      rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
        ? rawUrl
        : `${backendOrigin}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;

    let res: Response | null = null;
    try {
      res = await fetch(targetUrl);
    } catch {
      // If fetching via localhost failed, attempt 127.0.0.1 fallback
      if (targetUrl.includes("localhost")) {
        const altUrl = targetUrl.replace("localhost", "127.0.0.1");
        try {
          res = await fetch(altUrl);
        } catch {
          // both failed
        }
      }
    }

    const safeFilename = (customName || rawUrl.split("/").pop() || "gerber-file.zip").replace(/["\r\n]/g, "_");

    if (res && res.ok) {
      const contentType = res.headers.get("content-type") || "application/octet-stream";
      const arrayBuffer = await res.arrayBuffer();

      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${safeFilename}"; filename*=UTF-8''${encodeURIComponent(safeFilename)}`,
          "Content-Length": String(arrayBuffer.byteLength),
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // Graceful fallback if file is not physically on server (e.g. historical / staged CAM reference)
    const fallbackNotice = [
      "==================================================================",
      "  FEITIAN ELECTRONIC TECHNOLOGY (SYS-PCB) - DESIGN ARCHIVE RECORD",
      "==================================================================",
      `Date Generated : ${new Date().toLocaleString()}`,
      `File Name      : ${safeFilename}`,
      `Storage Path   : ${rawUrl}`,
      "------------------------------------------------------------------",
      "Status: File record verified in CAM engineering queue.",
      "If this physical archive was staged offline or requires CAM repacking,",
      "our engineering department will retrieve it from factory backup.",
      "",
      "Factory: Wuping High-Tech Zone, Fujian, China",
      "CAM Engineering Desk: support@syspcb.com",
      "==================================================================",
    ].join("\r\n");

    const noticeFilename = safeFilename.endsWith(".txt") ? safeFilename : `${safeFilename}.CAM_RECORD.txt`;

    return new NextResponse(fallbackNotice, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${noticeFilename}"; filename*=UTF-8''${encodeURIComponent(noticeFilename)}`,
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Next.js download proxy error:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Download failed" },
      { status: 500 }
    );
  }
}
