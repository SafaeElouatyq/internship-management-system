import { st } from "./studentStyles.js";

export function StudentPageHeader({ title, description, action }) {
  return (
    <div className={st.pageHeader}>
      <div>
        <h1 className={st.title}>{title}</h1>
        {description && <p className={st.subtitle}>{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function StudentAlert({ type = "error", children }) {
  const styles = {
    error: st.alertError,
    success: st.alertSuccess,
    info: st.alertInfo,
  };

  return <div className={`mb-5 ${styles[type] || st.alertError}`}>{children}</div>;
}

export function StudentLoading() {
  return <div className={st.loading}>Chargement...</div>;
}

export function StudentEmptyState({ title, description }) {
  return (
    <div className={st.empty}>
      <h3 className="text-base font-semibold text-zinc-900">{title}</h3>
      {description && (
        <p className="text-sm text-zinc-500 mt-2 max-w-sm mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

export function StudentPrimaryButton({
  children,
  className = "",
  ...props
}) {
  return (
    <button type="button" className={`${st.btnPrimary} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function StudentSecondaryButton({
  children,
  className = "",
  ...props
}) {
  return (
    <button type="button" className={`${st.btnSecondary} ${className}`} {...props}>
      {children}
    </button>
  );
}
