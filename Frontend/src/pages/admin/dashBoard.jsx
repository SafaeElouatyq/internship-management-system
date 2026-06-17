import { useTranslation } from "react-i18next";

function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        {t("dashboard.title")}
      </h1>
    </div>
  );
}

export default DashboardPage;