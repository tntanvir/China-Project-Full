import type { Locale } from "./i18n";

export interface ProcessFlowchartDictionary {
  breadcrumb: {
    home: string;
    pcbManufacture: string;
    flowchart: string;
    quote: string;
  };
  header: {
    sopBadge: string;
    docRef: string;
    certBadge: string;
    companyZh: string;
    companyEn: string;
    title: string;
    subtitle: string;
    metaPeDept: string;
    metaPeDeptVal: string;
    metaCtoOffice: string;
    metaCtoOfficeVal: string;
    metaStatus: string;
    metaStatusVal: string;
    metaScope: string;
    metaScopeVal: string;
  };
  tabs: {
    all: string;
    multilayer: string;
    doublesided: string;
    spreadsheet: string;
    downloadXls: string;
  };
  xlsBanner: {
    badge: string;
    fileName: string;
    meta: string;
    desc: string;
    downloadBtn: string;
    tableBtn: string;
    scrollBtn: string;
  };
  flowchart: {
    mlTitle: string;
    dsTitle: string;
    mlSteps: string;
    dsSteps: string;
    mlDesc: string;
    dsDesc: string;
    chipMl: string;
    chipDs: string;
    zoomOut: string;
    zoomIn: string;
    reset: string;
    center: string;
    fit: string;
    whiteMood: string;
    darkMood: string;
    jumpTable: string;
    full: string;
    exit: string;
    print: string;
    canvasHint: string;
    dpadNav: string;
    dpadUp: string;
    dpadLeft: string;
    dpadReset: string;
    dpadRight: string;
    dpadDown: string;
    loading: string;
    loadingSub: string;
    renderException: string;
    reloadBtn: string;
    noDiagram: string;
  };
  spreadsheet: {
    title: string;
    fileTag: string;
    subtitle: string;
    downloadOriginal: string;
    exportCsv: string;
    print: string;
    sheetName: string;
    totalStations: string;
    factoryBase: string;
    searchPlaceholder: string;
    colSeq: string;
    colStation: string;
    colDept: string;
    colCode: string;
    colEquipment: string;
    colControls: string;
    colGate: string;
    colStandard: string;
    noResults: string;
    footerSummary: string;
    badgeIpc: string;
    badgeIatf: string;
    badgeMil: string;
  };
  cta: {
    title: string;
    desc: string;
    quoteBtn: string;
    contactBtn: string;
  };
  footer: {
    copyright: string;
    badge: string;
  };
}

const englishDictionary: ProcessFlowchartDictionary = {
  breadcrumb: {
    home: "Home",
    pcbManufacture: "PCB Manufacture",
    flowchart: "Production Process Flow Chart",
    quote: "Instant Quote",
  },
  header: {
    sopBadge: "Official SOP Standard Operation Procedure",
    docRef: "Doc Ref: FT-SOP-PCB-2026",
    certBadge: "IATF 16949 / ISO 9001 / UL Certified Factory",
    companyZh: "武平飞天电子科技有限公司",
    companyEn: "Wuping Feitian Electronic Technology Co.,Ltd",
    title: "PCB Production Process Flow Chart",
    subtitle: "PCB Production Process Flow Chart (Full Factory Manufacturing Sequence)",
    metaPeDept: "Compiled By:",
    metaPeDeptVal: "Process Engineering Dept / PE",
    metaCtoOffice: "Approved By:",
    metaCtoOfficeVal: "Chief Engineer Office / CTO",
    metaStatus: "Control Status:",
    metaStatusVal: "Controlled Document ★ Official Issue",
    metaScope: "Applicability:",
    metaScopeVal: "2–32 Layer Rigid & Special Multilayer Boards",
  },
  tabs: {
    all: "Panoramic View (Flowchart + XLS Table)",
    multilayer: "Multilayer Flow (Sheet 2)",
    doublesided: "Double-Sided Flow (Sheet 1)",
    spreadsheet: "Official XLS Parameter Table (24 Stations)",
    downloadXls: "Download Original .XLS File (1.3MB)",
  },
  xlsBanner: {
    badge: "Official XLS File Loaded",
    fileName: "生产工艺流程图（Production_Process_Flow_Chart）.xls",
    meta: "(1.3 MB • Multilayer & Double-Sided Flow • 24 Station SOP Table)",
    desc: "The original factory Excel file you uploaded has been fully integrated! You can interactively zoom and inspect the vector topology above, or review every process station's machine code, key control parameters, quality gates, and IPC standards in the spreadsheet table below.",
    downloadBtn: "Download .XLS File (1.3MB)",
    tableBtn: "Switch to XLS Table View",
    scrollBtn: "View Table Below ↓",
  },
  flowchart: {
    mlTitle: "Multilayer PCB Production Flow Chart (Sheet 2: Multilayer PCB Fabrication Flow)",
    dsTitle: "Double-Sided PCB Production Flow Chart (Sheet 1: Double-Sided PCB Fabrication Flow)",
    mlSteps: "22 Process Steps",
    dsSteps: "16 Process Steps",
    mlDesc: "Covers inner lithography imaging, acid etching, brown oxide roughening, vacuum hot lamination, vertical continuous plating (VCP), and outer imaging steps.",
    dsDesc: "Laminate cutting proceeds directly to CNC drilling and horizontal electroless copper PTH metallization, without inner imaging or lamination steps.",
    chipMl: "Multilayer (Sheet 2)",
    chipDs: "Double-Sided (Sheet 1)",
    zoomOut: "Zoom Out",
    zoomIn: "Zoom In",
    reset: "Reset",
    center: "Center",
    fit: "Fit",
    whiteMood: "White Mood",
    darkMood: "Dark Mood",
    jumpTable: "XLS Table ↓",
    full: "Full",
    exit: "Exit",
    print: "Print",
    canvasHint: "Drag to pan • Scroll to zoom up to 500% • Press C or 0 to center • Compass D-Pad on bottom right",
    dpadNav: "Pan Navigation",
    dpadUp: "Pan Up (Arrow Up)",
    dpadLeft: "Pan Left (Arrow Left)",
    dpadReset: "Center 100% (Reset)",
    dpadRight: "Pan Right (Arrow Right)",
    dpadDown: "Pan Down (Arrow Down)",
    loading: "Rendering PCB Process Flowchart...",
    loadingSub: "Generating crisp vector topology",
    renderException: "Rendering Exception",
    reloadBtn: "Reload Component",
    noDiagram: "No diagram generated yet.",
  },
  spreadsheet: {
    title: "SOP Standard Process Parameter Table (24 Full Stations)",
    fileTag: "Production_Process_Flow_Chart.xls",
    subtitle: "Wuping Feitian Electronic Technology Manufacturing Center • Strictly executes IPC-A-600 / IPC-6012 standards",
    downloadOriginal: "Download Original .XLS File (1.3MB)",
    exportCsv: "Export CSV Data",
    print: "Print Table",
    sheetName: "SHEET: SOP_FLOW_CHART",
    totalStations: "TOTAL STATIONS: 24",
    factoryBase: "FACTORY: WUPING BASE",
    searchPlaceholder: "Search station, equipment, or parameter in table...",
    colSeq: "Seq",
    colStation: "Process Station",
    colDept: "Dept",
    colCode: "Code",
    colEquipment: "Main Equipment Configuration",
    colControls: "Key Process Controls & Parameters",
    colGate: "Quality Gate",
    colStandard: "Standard",
    noResults: "No matching process records found.",
    footerSummary: "24 Full-Sequence Manufacturing Stations Covered",
    badgeIpc: "100% IPC-A-600 / IPC-6012 Class 2 & 3",
    badgeIatf: "IATF 16949 Automotive Quality Management",
    badgeMil: "MIL-STD-105E Sampling Acceptance",
  },
  cta: {
    title: "Wuping Feitian Electronic Technology • 2–32 Layer High-Multilayer Direct Factory Supply",
    desc: "Upload Gerber files to instantly receive automated DFM engineering verification, 2-hour engineering confirmation, supporting 24-hour quick-turn prototypes and medium-to-large mass production.",
    quoteBtn: "Online Instant Quote & Order",
    contactBtn: "Contact Technical Support",
  },
  footer: {
    copyright: "Wuping Feitian Electronic Technology Co.,Ltd • All Rights Reserved",
    badge: "PCB Production Process Flow Chart • Dual Display (Interactive Vector Topology + Official XLS Spreadsheet SOP)",
  },
};

export function getProcessFlowchartDictionary(locale: Locale): ProcessFlowchartDictionary {
  const dict: ProcessFlowchartDictionary = JSON.parse(JSON.stringify(englishDictionary));

  if (locale === "zh") {
    dict.breadcrumb = {
      home: "首页",
      pcbManufacture: "PCB 制造",
      flowchart: "PCB 生产工艺流程圖",
      quote: "立即报价",
    };
    dict.header = {
      sopBadge: "官方标准作业规程 SOP",
      docRef: "文件编号: FT-SOP-PCB-2026",
      certBadge: "IATF 16949 / ISO 9001 / UL 认证工厂",
      companyZh: "武平飞天电子科技有限公司",
      companyEn: "Wuping Feitian Electronic Technology Co.,Ltd",
      title: "PCB生产工艺流程圖",
      subtitle: "PCB生产工艺流程圖 (全制程制造工序总表)",
      metaPeDept: "编制部门:",
      metaPeDeptVal: "工艺工程部 / PE Dept",
      metaCtoOffice: "审核批准:",
      metaCtoOfficeVal: "总工程师室 / CTO Office",
      metaStatus: "受控状态:",
      metaStatusVal: "受控文件 ★ 正式发行",
      metaScope: "适用范围:",
      metaScopeVal: "2~32层刚性及特种多层板",
    };
    dict.tabs = {
      all: "全景展示 (流程图 + XLS 表格)",
      multilayer: "多层板流程 (Sheet 2)",
      doublesided: "双面板流程 (Sheet 1)",
      spreadsheet: "官方 XLS 参数表 (24道工序)",
      downloadXls: "下载原版 .XLS 文件 (1.3MB)",
    };
    dict.xlsBanner = {
      badge: "原厂 XLS 附件已载入",
      fileName: "生产工艺流程图（Production_Process_Flow_Chart）.xls",
      meta: "(1.3 MB • 双面/多层双流程 • 24道全工序参数表)",
      desc: "本页面已完整集成您上传的原版 Excel 文件！您可以在上方矢量图交互缩放浏览，也可以在下方电子表格中查阅每道工序的设备代号、控制要点、品质门与执行标准。",
      downloadBtn: "下载 .XLS 原始文件 (1.3MB)",
      tableBtn: "切换至 XLS 表格视图",
      scrollBtn: "查看下方表格 ↓",
    };
    dict.flowchart = {
      mlTitle: "多层PCB生产工艺流程圖 (Sheet 2: Multilayer PCB Fabrication Flow)",
      dsTitle: "双面PCB生产工艺流程圖 (Sheet 1: Double-Sided PCB Fabrication Flow)",
      mlSteps: "22 制造工步",
      dsSteps: "16 制造工步",
      mlDesc: "涵盖内层微影光刻、酸性蚀刻、棕化粗化、真空热压合、全板垂直连续电镀与外层微影全部工步。",
      dsDesc: "原材料开料后直接进入数控钻孔与水平沉铜孔壁金属化，无需内层微影与热压叠层工步。",
      chipMl: "多层板 (Sheet 2)",
      chipDs: "双面板 (Sheet 1)",
      zoomOut: "缩小 (Zoom Out)",
      zoomIn: "放大 (Zoom In)",
      reset: "复位 (Reset)",
      center: "居中 (Center)",
      fit: "适应",
      whiteMood: "浅色模式",
      darkMood: "深色模式",
      jumpTable: "XLS 表格 ↓",
      full: "全屏",
      exit: "退出全屏",
      print: "打印 / 存为PDF",
      canvasHint: "鼠标拖拽平移 • 滚轮缩放至500% • 按键盘 C 或 0 快速居中 • 右下角十字导航",
      dpadNav: "平移导航",
      dpadUp: "向上平移 (Arrow Up)",
      dpadLeft: "向左平移 (Arrow Left)",
      dpadReset: "复位居中 100% (Reset)",
      dpadRight: "向右平移 (Arrow Right)",
      dpadDown: "向下平移 (Arrow Down)",
      loading: "正在生成 PCB 工艺流程图...",
      loadingSub: "渲染超高清矢量拓扑结构",
      renderException: "图表渲染异常",
      reloadBtn: "重新加载组件",
      noDiagram: "尚未生成流程图。",
    };
    dict.spreadsheet = {
      title: "SOP 标准工序工艺参数对照表 (24道全工序)",
      fileTag: "生产工艺流程图.xls",
      subtitle: "武平飞天电子科技生产制造中心 • 严格执行 IPC-A-600 / IPC-6012 标准参数",
      downloadOriginal: "下载原版 .XLS 文件 (1.3MB)",
      exportCsv: "导出 CSV 数据",
      print: "打印表格",
      sheetName: "SHEET: SOP_FLOW_CHART",
      totalStations: "TOTAL STATIONS: 24",
      factoryBase: "FACTORY: WUPING BASE",
      searchPlaceholder: "在表格中快速检索工序或设备...",
      colSeq: "序号",
      colStation: "工序名称 (Process Station)",
      colDept: "责任部门 (Dept)",
      colCode: "工序代号",
      colEquipment: "主力设备配置 (Equipment)",
      colControls: "工艺控制关键要点与参数 (Key Controls)",
      colGate: "品质检验门 (Quality Gate)",
      colStandard: "执行标准 (Standard)",
      noResults: "没有找到符合条件的工序记录。",
      footerSummary: "24 道全流程工序覆盖",
      badgeIpc: "100% IPC-A-600 / IPC-6012 2/3级标准",
      badgeIatf: "IATF 16949 汽车级质量管理体系",
      badgeMil: "MIL-STD-105E 抽样放行",
    };
    dict.cta = {
      title: "武平飞天电子科技 • 2~32层高多层PCB实体工厂直供",
      desc: "上传 Gerber 文件立即获得全自动 DFM 工程审核，2小时工程确认，支持24小时加急打样与中小批量量产。",
      quoteBtn: "在线快速计价下单",
      contactBtn: "联系工程技术支持",
    };
    dict.footer = {
      copyright: "武平飞天电子科技有限公司 (Wuping Feitian Electronic Technology Co.,Ltd) • 版权所有",
      badge: "PCB生产工艺流程圖 • 双模显示 (交互拓扑图 + 官方 XLS 电子表格)",
    };
  } else if (locale === "de") {
    dict.breadcrumb = {
      home: "Startseite",
      pcbManufacture: "PCB Fertigung",
      flowchart: "Fertigungsprozess-Ablaufdiagramm",
      quote: "Sofortangebot",
    };
    dict.header = {
      sopBadge: "Offizieller SOP-Standardbetriebsablauf",
      docRef: "Dok.-Ref: FT-SOP-PCB-2026",
      certBadge: "IATF 16949 / ISO 9001 / UL zertifizierte Fabrik",
      companyZh: "武平飞天电子科技有限公司",
      companyEn: "Wuping Feitian Electronic Technology Co.,Ltd",
      title: "PCB Fertigungsprozess-Ablaufdiagramm",
      subtitle: "Vollständiger Fertigungsablauf für Multilayer- & Doppelseitige Leiterplatten",
      metaPeDept: "Erstellt von:",
      metaPeDeptVal: "Prozesstechnik / PE-Abteilung",
      metaCtoOffice: "Genehmigt von:",
      metaCtoOfficeVal: "Chefingenieurbüro / CTO",
      metaStatus: "Dokumentenstatus:",
      metaStatusVal: "Gesteuertes Dokument ★ Freigegeben",
      metaScope: "Geltungsbereich:",
      metaScopeVal: "2–32 Lagen starre & spezielle Multilayer-Leiterplatten",
    };
    dict.tabs = {
      all: "Gesamtansicht (Ablaufdiagramm + XLS-Tabelle)",
      multilayer: "Multilayer-Ablauf (Sheet 2)",
      doublesided: "Doppelseitiger Ablauf (Sheet 1)",
      spreadsheet: "Offizielle XLS-Parametertabelle (24 Stationen)",
      downloadXls: "Original .XLS-Datei herunterladen (1,3MB)",
    };
    dict.xlsBanner = {
      badge: "Offizielle XLS-Datei Geladen",
      fileName: "Production_Process_Flow_Chart.xls",
      meta: "(1,3 MB • Multilayer & Doppelseitig • 24 Stationen SOP)",
      desc: "Die von Ihnen hochgeladene Original-Excel-Datei ist vollständig integriert! Sie können das Diagramm oben interaktiv zoomen oder unten alle Parameter, Qualitätsprüfungen und IPC-Normen einsehen.",
      downloadBtn: "Original .XLS herunterladen (1,3MB)",
      tableBtn: "Zur XLS-Tabelle wechseln",
      scrollBtn: "Tabelle unten ansehen ↓",
    };
    dict.flowchart.zoomOut = "Verkleinern";
    dict.flowchart.zoomIn = "Vergrößern";
    dict.flowchart.reset = "Zurücksetzen";
    dict.flowchart.center = "Zentrieren";
    dict.flowchart.whiteMood = "Heller Modus";
    dict.flowchart.darkMood = "Dunkler Modus";
    dict.flowchart.jumpTable = "XLS-Tabelle ↓";
    dict.flowchart.print = "Drucken";
    dict.spreadsheet.downloadOriginal = "Original .XLS herunterladen (1,3MB)";
    dict.spreadsheet.exportCsv = "CSV-Daten exportieren";
    dict.spreadsheet.print = "Tabelle drucken";
    dict.spreadsheet.searchPlaceholder = "In Tabelle nach Station, Anlage oder Parameter suchen...";
  } else if (locale === "fr") {
    dict.breadcrumb = {
      home: "Accueil",
      pcbManufacture: "Fabrication PCB",
      flowchart: "Organigramme de fabrication PCB",
      quote: "Devis Immédiat",
    };
    dict.header = {
      sopBadge: "Procédure Opératoire Standard Officielle (SOP)",
      docRef: "Réf. Doc: FT-SOP-PCB-2026",
      certBadge: "Usine certifiée IATF 16949 / ISO 9001 / UL",
      companyZh: "武平飞天电子科技有限公司",
      companyEn: "Wuping Feitian Electronic Technology Co.,Ltd",
      title: "Organigramme du Processus de Production PCB",
      subtitle: "Séquence Complète de Fabrication en Usine (Multicouches & Double Face)",
      metaPeDept: "Établi par :",
      metaPeDeptVal: "Département Ingénierie Process / PE",
      metaCtoOffice: "Approuvé par :",
      metaCtoOfficeVal: "Direction Technique / CTO",
      metaStatus: "Statut :",
      metaStatusVal: "Document Contrôlé ★ Émission Officielle",
      metaScope: "Champ d'application :",
      metaScopeVal: "Circuits rigides multicouches de 2 à 32 couches",
    };
    dict.tabs = {
      all: "Vue Panoramique (Diagramme + Tableau XLS)",
      multilayer: "Flux Multicouches (Feuille 2)",
      doublesided: "Flux Double Face (Feuille 1)",
      spreadsheet: "Tableau de Paramètres XLS (24 Postes)",
      downloadXls: "Télécharger le fichier .XLS original (1,3 Mo)",
    };
    dict.xlsBanner = {
      badge: "Fichier XLS Officiel Chargé",
      fileName: "Production_Process_Flow_Chart.xls",
      meta: "(1,3 Mo • Double Face & Multicouche • 24 Postes SOP)",
      desc: "Le fichier Excel original de l'usine est entièrement intégré ! Vous pouvez zoomer sur le diagramme vectoriel ci-dessus ou consulter le tableau ci-dessous avec toutes les spécifications machines, contrôles et normes IPC.",
      downloadBtn: "Télécharger .XLS (1,3 Mo)",
      tableBtn: "Passer au tableau XLS",
      scrollBtn: "Voir le tableau ci-dessous ↓",
    };
    dict.flowchart.zoomOut = "Zoom Arrière";
    dict.flowchart.zoomIn = "Zoom Avant";
    dict.flowchart.reset = "Réinitialiser";
    dict.flowchart.center = "Centrer";
    dict.flowchart.whiteMood = "Mode Clair";
    dict.flowchart.darkMood = "Mode Sombre";
    dict.flowchart.jumpTable = "Tableau XLS ↓";
    dict.flowchart.print = "Imprimer";
    dict.spreadsheet.downloadOriginal = "Télécharger le fichier .XLS original (1,3 Mo)";
    dict.spreadsheet.exportCsv = "Exporter en CSV";
    dict.spreadsheet.print = "Imprimer le tableau";
    dict.spreadsheet.searchPlaceholder = "Rechercher un poste, équipement ou paramètre...";
  } else if (locale === "ja") {
    dict.breadcrumb = {
      home: "ホーム",
      pcbManufacture: "PCB製造",
      flowchart: "製造工程フローチャート",
      quote: "即時見積もり",
    };
    dict.header = {
      sopBadge: "公式標準作業手順書 (SOP)",
      docRef: "文書番号: FT-SOP-PCB-2026",
      certBadge: "IATF 16949 / ISO 9001 / UL 認証取得工場",
      companyZh: "武平飞天电子科技有限公司",
      companyEn: "Wuping Feitian Electronic Technology Co.,Ltd",
      title: "PCB製造工程フローチャート",
      subtitle: "多層基板・両面基板の全製造工程・パラメータ管理基準",
      metaPeDept: "作成部門:",
      metaPeDeptVal: "工程技術部 / PE Dept",
      metaCtoOffice: "承認:",
      metaCtoOfficeVal: "最高技術責任者室 / CTO Office",
      metaStatus: "管理状態:",
      metaStatusVal: "管理文書 ★ 正式発行",
      metaScope: "適用範囲:",
      metaScopeVal: "2〜32層リジッドおよび特殊多層プリント基板",
    };
    dict.tabs = {
      all: "全体表示 (フロー図 + XLS表)",
      multilayer: "多層基板フロー (Sheet 2)",
      doublesided: "両面基板フロー (Sheet 1)",
      spreadsheet: "公式 XLS パラメータ表 (24工程)",
      downloadXls: "原版 .XLS ファイルをダウンロード (1.3MB)",
    };
    dict.xlsBanner = {
      badge: "工場公式 XLS ファイル読込完了",
      fileName: "Production_Process_Flow_Chart.xls",
      meta: "(1.3 MB • 両面/多層2シート • 24工程パラメータ完備)",
      desc: "アップロードされた原版 Excel ファイルを完全に再現しました。上部のベクターフロー図で自由に拡大縮小・移動しながら確認でき、下部の表で全設備の規格とIPC基準を閲覧できます。",
      downloadBtn: "原版 .XLS をダウンロード (1.3MB)",
      tableBtn: "XLS 表ビューに切り替え",
      scrollBtn: "下部の表へスクロール ↓",
    };
    dict.flowchart.zoomOut = "縮小";
    dict.flowchart.zoomIn = "拡大";
    dict.flowchart.reset = "リセット";
    dict.flowchart.center = "中央配置";
    dict.flowchart.whiteMood = "ライトモード";
    dict.flowchart.darkMood = "ダークモード";
    dict.flowchart.jumpTable = "XLS表 ↓";
    dict.flowchart.print = "印刷";
    dict.spreadsheet.downloadOriginal = "原版 .XLS をダウンロード (1.3MB)";
    dict.spreadsheet.exportCsv = "CSV 出力";
    dict.spreadsheet.print = "表を印刷";
    dict.spreadsheet.searchPlaceholder = "工程名、設備、パラメータを検索...";
  } else if (locale === "ko") {
    dict.breadcrumb = {
      home: "홈",
      pcbManufacture: "PCB 제조",
      flowchart: "생산 공정 플로우차트",
      quote: "즉시 견적",
    };
    dict.header = {
      sopBadge: "공식 표준작업절차서 (SOP)",
      docRef: "문서번호: FT-SOP-PCB-2026",
      certBadge: "IATF 16949 / ISO 9001 / UL 인증 공장",
      companyZh: "武平飞天电子科技有限公司",
      companyEn: "Wuping Feitian Electronic Technology Co.,Ltd",
      title: "PCB 생산 공정 플로우차트",
      subtitle: "다층 및 양면 PCB 전 제조 공정 및 SOP 파라미터 표준",
      metaPeDept: "작성부서:",
      metaPeDeptVal: "공정기술부 / PE Dept",
      metaCtoOffice: "승인:",
      metaCtoOfficeVal: "최고기술책임자실 / CTO Office",
      metaStatus: "관리상태:",
      metaStatusVal: "관리문서 ★ 공식 발행",
      metaScope: "적용범위:",
      metaScopeVal: "2~32층 고신뢰성 다층 및 특수 기판",
    };
    dict.tabs = {
      all: "전체 보기 (플로우차트 + XLS 표)",
      multilayer: "다층 기판 공정 (Sheet 2)",
      doublesided: "양면 기판 공정 (Sheet 1)",
      spreadsheet: "공식 XLS 파라미터 표 (24개 공정)",
      downloadXls: "원본 .XLS 파일 다운로드 (1.3MB)",
    };
    dict.xlsBanner = {
      badge: "공식 XLS 파일 탑재 완료",
      fileName: "Production_Process_Flow_Chart.xls",
      meta: "(1.3 MB • 양면/다층 2개 시트 • 24개 공정 SOP)",
      desc: "업로드하신 원본 Excel 공정표가 웹페이지에 완벽히 통합되었습니다! 상단에서 벡터 차트를 자유롭게 확대/이동하거나, 하단 표에서 설비 및 IPC 품질 검사 기준을 확인하실 수 있습니다.",
      downloadBtn: "원본 .XLS 다운로드 (1.3MB)",
      tableBtn: "XLS 표 보기로 전환",
      scrollBtn: "하단 표로 이동 ↓",
    };
    dict.flowchart.zoomOut = "축소";
    dict.flowchart.zoomIn = "확대";
    dict.flowchart.reset = "초기화";
    dict.flowchart.center = "중앙 정렬";
    dict.flowchart.whiteMood = "화이트 모드";
    dict.flowchart.darkMood = "다크 모드";
    dict.flowchart.jumpTable = "XLS 표 ↓";
    dict.flowchart.print = "인쇄";
    dict.spreadsheet.downloadOriginal = "원본 .XLS 다운로드 (1.3MB)";
    dict.spreadsheet.exportCsv = "CSV 데이터 내보내기";
    dict.spreadsheet.print = "표 인쇄";
    dict.spreadsheet.searchPlaceholder = "공정명, 설비, 파라미터 검색...";
  } else if (locale === "es") {
    dict.breadcrumb = {
      home: "Inicio",
      pcbManufacture: "Fabricación PCB",
      flowchart: "Diagrama de Flujo de Producción PCB",
      quote: "Cotización Inmediata",
    };
    dict.header = {
      sopBadge: "Procedimiento Operativo Estándar Oficial (SOP)",
      docRef: "Ref. Doc: FT-SOP-PCB-2026",
      certBadge: "Fábrica certificada IATF 16949 / ISO 9001 / UL",
      companyZh: "武平飞天电子科技有限公司",
      companyEn: "Wuping Feitian Electronic Technology Co.,Ltd",
      title: "Diagrama de Flujo del Proceso de Fabricación PCB",
      subtitle: "Secuencia Completa de Producción en Fábrica (Multicapa y Doble Cara)",
      metaPeDept: "Elaborado por:",
      metaPeDeptVal: "Dpto. de Ingeniería de Procesos / PE",
      metaCtoOffice: "Aprobado por:",
      metaCtoOfficeVal: "Oficina del Director Técnico / CTO",
      metaStatus: "Estado:",
      metaStatusVal: "Documento Controlado ★ Emisión Oficial",
      metaScope: "Alcance:",
      metaScopeVal: "Placas rígidas multicapa de 2 a 32 capas",
    };
    dict.tabs = {
      all: "Vista Panorámica (Diagrama + Tabla XLS)",
      multilayer: "Flujo Multicapa (Hoja 2)",
      doublesided: "Flujo Doble Cara (Hoja 1)",
      spreadsheet: "Tabla de Parámetros XLS (24 Estaciones)",
      downloadXls: "Descargar archivo .XLS original (1.3MB)",
    };
    dict.xlsBanner = {
      badge: "Archivo XLS Oficial Cargado",
      fileName: "Production_Process_Flow_Chart.xls",
      meta: "(1.3 MB • Doble Cara y Multicapa • 24 Estaciones SOP)",
      desc: "¡El archivo Excel original de fábrica ha sido integrado por completo! Puede hacer zoom interactivo en el diagrama vectorial superior o consultar en la tabla inferior todos los equipos, controles e inspecciones según normas IPC.",
      downloadBtn: "Descargar archivo .XLS (1.3MB)",
      tableBtn: "Cambiar a vista de tabla XLS",
      scrollBtn: "Ver tabla debajo ↓",
    };
    dict.flowchart.zoomOut = "Reducir";
    dict.flowchart.zoomIn = "Ampliar";
    dict.flowchart.reset = "Restablecer";
    dict.flowchart.center = "Centrar";
    dict.flowchart.whiteMood = "Modo Claro";
    dict.flowchart.darkMood = "Modo Oscuro";
    dict.flowchart.jumpTable = "Tabla XLS ↓";
    dict.flowchart.print = "Imprimir";
    dict.spreadsheet.downloadOriginal = "Descargar .XLS original (1.3MB)";
    dict.spreadsheet.exportCsv = "Exportar datos CSV";
    dict.spreadsheet.print = "Imprimir tabla";
    dict.spreadsheet.searchPlaceholder = "Buscar estación, equipo o parámetro...";
  } else if (locale === "ru") {
    dict.breadcrumb = {
      home: "Главная",
      pcbManufacture: "Производство печатных плат",
      flowchart: "Технологическая карта производства",
      quote: "Мгновенный расчет",
    };
    dict.header = {
      sopBadge: "Официальный регламент техпроцесса (SOP)",
      docRef: "Док. №: FT-SOP-PCB-2026",
      certBadge: "Сертификация IATF 16949 / ISO 9001 / UL",
      companyZh: "武平飞天电子科技有限公司",
      companyEn: "Wuping Feitian Electronic Technology Co.,Ltd",
      title: "Технологическая карта производства печатных плат",
      subtitle: "Полная производственная последовательность (многослойные и 2-сторонние платы)",
      metaPeDept: "Разработано:",
      metaPeDeptVal: "Технологический отдел / PE Dept",
      metaCtoOffice: "Утверждено:",
      metaCtoOfficeVal: "Служба главного инженера / CTO",
      metaStatus: "Статус документа:",
      metaStatusVal: "Контролируемый документ ★ Официальный выпуск",
      metaScope: "Область применения:",
      metaScopeVal: "Жесткие многослойные платы от 2 до 32 слоев",
    };
    dict.tabs = {
      all: "Полный обзор (Блок-схема + Таблица XLS)",
      multilayer: "Многослойные платы (Лист 2)",
      doublesided: "Двусторонние платы (Лист 1)",
      spreadsheet: "Технологическая таблица XLS (24 станции)",
      downloadXls: "Скачать оригинал .XLS файла (1.3 МБ)",
    };
    dict.flowchart.zoomOut = "Уменьшить";
    dict.flowchart.zoomIn = "Увеличить";
    dict.flowchart.reset = "Сброс";
    dict.flowchart.center = "По центру";
    dict.flowchart.whiteMood = "Светлая тема";
    dict.flowchart.darkMood = "Темная тема";
    dict.flowchart.jumpTable = "Таблица XLS ↓";
    dict.flowchart.print = "Печать";
    dict.spreadsheet.downloadOriginal = "Скачать оригинал .XLS (1.3 МБ)";
    dict.spreadsheet.exportCsv = "Экспорт в CSV";
    dict.spreadsheet.print = "Печать таблицы";
    dict.spreadsheet.searchPlaceholder = "Поиск по станции, станку или параметру...";
  } else if (locale === "it") {
    dict.breadcrumb = {
      home: "Home",
      pcbManufacture: "Produzione PCB",
      flowchart: "Diagramma di Flusso di Produzione PCB",
      quote: "Preventivo Immediato",
    };
    dict.header.sopBadge = "Procedura Operativa Standard Ufficiale (SOP)";
    dict.header.title = "Diagramma di Flusso del Processo Produttivo PCB";
    dict.tabs.all = "Vista Panoramica (Diagramma + Tabella XLS)";
    dict.tabs.downloadXls = "Scarica file .XLS originale (1.3MB)";
    dict.flowchart.center = "Centra";
    dict.flowchart.zoomIn = "Ingrandisci";
    dict.flowchart.zoomOut = "Riduci";
    dict.spreadsheet.searchPlaceholder = "Cerca stazione, macchinario o parametro...";
  } else if (locale === "pt") {
    dict.breadcrumb = {
      home: "Início",
      pcbManufacture: "Fabricação de PCB",
      flowchart: "Fluxograma do Processo de Produção PCB",
      quote: "Orçamento Imediato",
    };
    dict.header.sopBadge = "Procedimento Operacional Padrão Oficial (SOP)";
    dict.header.title = "Fluxograma do Processo de Fabricação PCB";
    dict.tabs.all = "Visão Panorâmica (Fluxograma + Tabela XLS)";
    dict.tabs.downloadXls = "Baixar arquivo .XLS original (1.3MB)";
    dict.flowchart.center = "Centralizar";
    dict.flowchart.zoomIn = "Aumentar Zoom";
    dict.flowchart.zoomOut = "Diminuir Zoom";
    dict.spreadsheet.searchPlaceholder = "Pesquisar estação, equipamento ou parâmetro...";
  } else if (locale === "ar") {
    dict.breadcrumb = {
      home: "الرئيسية",
      pcbManufacture: "تصنيع PCB",
      flowchart: "مخطط سير عملية إنتاج PCB",
      quote: "عرض سعر فوري",
    };
    dict.header.sopBadge = "إجراءات التشغيل القياسية الرسمية (SOP)";
    dict.header.title = "مخطط سير عملية إنتاج لوحات الدوائر المطبوعة PCB";
    dict.tabs.all = "عرض شامل (المخطط + جدول XLS)";
    dict.tabs.downloadXls = "تحميل ملف .XLS الأصلي (1.3 ميجابايت)";
    dict.flowchart.center = "توسيط";
    dict.flowchart.zoomIn = "تكبير";
    dict.flowchart.zoomOut = "تصغير";
    dict.spreadsheet.searchPlaceholder = "ابحث عن المحطة أو المعدات أو المعايير...";
  } else if (locale === "tr") {
    dict.breadcrumb = {
      home: "Ana Sayfa",
      pcbManufacture: "PCB Üretimi",
      flowchart: "PCB Üretim Süreci Akış Şeması",
      quote: "Anında Fiyat Teklifi",
    };
    dict.header.sopBadge = "Resmi Standart Operasyon Prosedürü (SOP)";
    dict.header.title = "PCB Üretim Süreci Akış Şeması";
    dict.tabs.all = "Panoramik Görünüm (Akış Şeması + XLS Tablosu)";
    dict.tabs.downloadXls = "Orijinal .XLS Dosyasını İndir (1.3MB)";
    dict.flowchart.center = "Ortala";
    dict.flowchart.zoomIn = "Yakınlaştır";
    dict.flowchart.zoomOut = "Uzaklaştır";
    dict.spreadsheet.searchPlaceholder = "İstasyon, ekipman veya parametre ara...";
  } else if (locale === "bn") {
    dict.breadcrumb = {
      home: "হোম",
      pcbManufacture: "PCB উৎপাদন",
      flowchart: "উৎপাদন প্রক্রিয়া ফ্লোচার্ট",
      quote: "তাৎক্ষণিক কোটেশন",
    };
    dict.header = {
      sopBadge: "অফিসিয়াল এসওপি স্ট্যান্ডার্ড অপারেটিং প্রসিডিউর",
      docRef: "ডকুমেন্ট নং: FT-SOP-PCB-2026",
      certBadge: "IATF 16949 / ISO 9001 / UL সার্টিফাইড ফ্যাক্টরি",
      companyZh: "武平飞天电子科技有限公司",
      companyEn: "Wuping Feitian Electronic Technology Co.,Ltd",
      title: "PCB উৎপাদন প্রক্রিয়া ফ্লোচার্ট",
      subtitle: "মাল্টিলেয়ার ও ডাবল-সাইডেড PCB-এর সম্পূর্ণ উৎপাদন ধাপ ও প্যারামিটার",
      metaPeDept: "প্রস্তুতকারক:",
      metaPeDeptVal: "প্রসেস ইঞ্জিনিয়ারিং ডিপার্টমেন্ট / PE",
      metaCtoOffice: "অনুমোদনকারী:",
      metaCtoOfficeVal: "চিফ ইঞ্জিনিয়ার অফিস / CTO",
      metaStatus: "নিয়ন্ত্রণ অবস্থা:",
      metaStatusVal: "নিয়ন্ত্রিত নথি ★ আনুষ্ঠানিকভাবে প্রকাশিত",
      metaScope: "প্রযোজ্যতা:",
      metaScopeVal: "২ থেকে ৩২ স্তরের মাল্টিলেয়ার ও বিশেষায়িত সার্কিট বোর্ড",
    };
    dict.tabs = {
      all: "প্যানোরামিক ভিউ (ফ্লোচার্ট + XLS টেবিল)",
      multilayer: "মাল্টিলেয়ার ফ্লো (Sheet 2)",
      doublesided: "ডাবল-সাইডেড ফ্লো (Sheet 1)",
      spreadsheet: "অফিসিয়াল XLS প্যারামিটার টেবিল (২৪টি ধাপ)",
      downloadXls: "মূল .XLS ফাইল ডাউনলোড করুন (১.৩ মেগাবাইট)",
    };
    dict.xlsBanner = {
      badge: "মূল XLS ফাইল সংযুক্ত",
      fileName: "Production_Process_Flow_Chart.xls",
      meta: "(১.৩ মেগাবাইট • ডাবল সাইডেড ও মাল্টিলেয়ার • ২৪টি পূর্ণ ধাপ)",
      desc: "আপনার আপলোড করা মূল ফ্যাক্টরি এক্সেল ফাইলটি এখানে যুক্ত করা হয়েছে। আপনি উপরের ভেক্টর ডায়াগ্রামের মাধ্যমে ইন্টারেক্টিভভাবে জুম ও নেভিগেট করতে পারবেন এবং নিচের টেবিলে প্রতিটি ধাপের মেশিন কোড ও IPC কোয়ালিটি গেট দেখতে পারবেন।",
      downloadBtn: "মূল .XLS ডাউনলোড করুন (১.৩ MB)",
      tableBtn: "XLS টেবিল ভিউতে যান",
      scrollBtn: "নিচের টেবিল দেখুন ↓",
    };
    dict.flowchart.zoomOut = "জুম আউট";
    dict.flowchart.zoomIn = "জুম ইন";
    dict.flowchart.reset = "রিসেট";
    dict.flowchart.center = "মাঝখানে আনুন";
    dict.flowchart.whiteMood = "লাইট মোড";
    dict.flowchart.darkMood = "ডার্ক মোড";
    dict.flowchart.jumpTable = "XLS টেবিল ↓";
    dict.flowchart.print = "প্রিন্ট করুন";
    dict.spreadsheet.downloadOriginal = "মূল .XLS ডাউনলোড করুন (১.৩ MB)";
    dict.spreadsheet.exportCsv = "CSV ডেটা এক্সপোর্ট";
    dict.spreadsheet.print = "টেবিল প্রিন্ট করুন";
    dict.spreadsheet.searchPlaceholder = "ধাপ, যন্ত্রপাতি বা প্যারামিটার খুঁজুন...";
  } else if (locale === "hi") {
    dict.breadcrumb = {
      home: "होम",
      pcbManufacture: "PCB निर्माण",
      flowchart: "उत्पादन प्रक्रिया फ्लोचार्ट",
      quote: "तुरंत कोटेशन",
    };
    dict.header.sopBadge = "आधिकारिक मानक संचालन प्रक्रिया (SOP)";
    dict.header.title = "PCB उत्पादन प्रक्रिया फ्लोचार्ट";
    dict.tabs.all = "पैनोरामिक दृश्य (फ्लोचार्ट + XLS तालिका)";
    dict.tabs.downloadXls = "मूल .XLS फ़ाइल डाउनलोड करें (1.3MB)";
    dict.flowchart.center = "केंद्रीकृत करें";
    dict.flowchart.zoomIn = "ज़ूम इन";
    dict.flowchart.zoomOut = "ज़ूम आउट";
    dict.spreadsheet.searchPlaceholder = "स्टेशन, उपकरण या पैरामीटर खोजें...";
  } else if (locale === "ur") {
    dict.breadcrumb = {
      home: "ہوم",
      pcbManufacture: "پی سی بی مینوفیکچرنگ",
      flowchart: "پیداواری عمل فلو چارٹ",
      quote: "فوری کوٹیشن",
    };
    dict.header.sopBadge = "سرکاری معیاری طریقہ کار (SOP)";
    dict.header.title = "پی سی بی پروڈکشن پراسیس فلو چارٹ";
    dict.tabs.all = "مکمل نظارہ (فلو چارٹ + XLS ٹیبل)";
    dict.tabs.downloadXls = "اصل .XLS فائل ڈاؤن لوڈ کریں (1.3MB)";
    dict.flowchart.center = "درمیان میں لائیں";
    dict.spreadsheet.searchPlaceholder = "اسٹیشن، مشین یا پیرامیٹر تلاش کریں...";
  } else if (locale === "af") {
    dict.breadcrumb = {
      home: "Tuis",
      pcbManufacture: "PCB Vervaardiging",
      flowchart: "Produksieproses Vloeidiagram",
      quote: "Kits Kwotasie",
    };
    dict.header.sopBadge = "Amptelike Standaard Bedryfsprosedure (SOP)";
    dict.header.title = "PCB Produksieproses Vloeidiagram";
    dict.tabs.all = "Panoramiese Aansig (Vloeidiagram + XLS Tabel)";
    dict.tabs.downloadXls = "Laai oorspronklike .XLS lêer af (1.3MB)";
    dict.flowchart.center = "Sentreer";
    dict.spreadsheet.searchPlaceholder = "Soek stasie, toerusting of parameter...";
  }

  return dict;
}
