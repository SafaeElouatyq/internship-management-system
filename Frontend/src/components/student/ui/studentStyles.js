export const st = {
  page: "max-w-5xl mx-auto w-full",
  pageHeader: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8",
  title: "text-2xl font-semibold tracking-tight text-zinc-900",
  subtitle: "text-[15px] text-zinc-500 leading-relaxed mt-1.5 max-w-xl",
  card: "bg-white rounded-lg border border-zinc-200/90 shadow-sm shadow-zinc-950/[0.03]",
  cardPad: "p-6",
  tableWrap:
    "bg-white rounded-lg border border-zinc-200/90 shadow-sm shadow-zinc-950/[0.03] overflow-hidden",
  tableHead: "bg-zinc-50/90 border-b border-zinc-200",
  th: "text-left px-5 py-3 text-[11px] font-medium uppercase tracking-wider text-zinc-500",
  tr: "border-b border-zinc-100 last:border-0 transition-colors duration-150 hover:bg-zinc-50/60",
  td: "px-5 py-4 text-sm text-zinc-600",
  tdPrimary: "px-5 py-4 text-sm font-medium text-zinc-900",
  btnPrimary:
    "inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 active:scale-[0.98] text-white text-sm font-medium px-4 py-2.5 rounded-md shadow-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
  btnSecondary:
    "inline-flex items-center justify-center gap-2 bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 text-sm font-medium px-4 py-2.5 rounded-md transition-all duration-150",
  btnGhost:
    "inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed",
  btnGhostPrimary:
    "inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed",
  btnGhostDanger:
    "inline-flex h-8 w-8 items-center justify-center rounded-md text-red-600 hover:bg-red-50 transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed",
  btnLink:
    "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-colors duration-150",
  input:
    "w-full border border-zinc-200 rounded-md px-3.5 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all duration-150 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-900/5 bg-white",
  label: "block text-sm font-medium text-zinc-700 mb-1.5",
  badge: "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
  alertError:
    "rounded-lg border border-red-200/80 bg-red-50/70 px-4 py-3 text-sm text-red-700",
  alertSuccess:
    "rounded-lg border border-emerald-200/80 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800",
  alertInfo:
    "rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-3.5 text-sm text-zinc-700",
  empty:
    "rounded-lg border border-dashed border-zinc-200 bg-zinc-50/40 px-6 py-16 text-center",
  loading:
    "rounded-lg border border-zinc-200/90 bg-white px-6 py-16 text-center text-sm text-zinc-500 animate-pulse",
  formCard:
    "bg-white rounded-lg border border-zinc-200/90 shadow-sm shadow-zinc-950/[0.03] p-6 mb-6",
  formTitle: "text-base font-semibold text-zinc-900 mb-5",
  sectionTitle: "text-sm font-semibold text-zinc-900 mb-3",
  modalOverlay:
    "fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/20 backdrop-blur-[2px] p-4",
  modal:
    "bg-white rounded-xl border border-zinc-200/90 shadow-xl shadow-zinc-950/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto",
  modalPad: "p-6 sm:p-8",
  panel:
    "rounded-lg border border-zinc-200/80 bg-zinc-50/50 p-5",
  navActive:
    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-zinc-900 bg-zinc-100 transition-colors duration-150",
  navInactive:
    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors duration-150",
};

export const studentNavLinkClass = (isActive) =>
  isActive ? st.navActive : st.navInactive;
