function AppSidebar({ children, footer }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex h-screen w-72 flex-col justify-between border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="min-h-0 flex-1 overflow-y-auto pt-10">{children}</div>

      {footer ? (
        <div className="shrink-0 border-t border-slate-100 p-5">{footer}</div>
      ) : null}
    </aside>
  );
}

export default AppSidebar;
