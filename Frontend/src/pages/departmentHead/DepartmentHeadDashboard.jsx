import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  GraduationCap,
  Gavel,
  History,
  LayoutDashboard,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import { getDashboardStats } from "../../services/departmentHeadService.jsx";
import { MIN_MEETINGS_LICENCE } from "../../utils/meetingUtils.jsx";

const WORKFLOW_STEPS = [
  "Déclaration",
  "Vérification administrative",
  "Affectation encadrant",
  "Validation du sujet",
  "Suivi",
  "Rapport PFE",
  "Décision finale",
];

const QUICK_ACTIONS = [
  {
    title: "Liste des stages",
    description: "Consulter les déclarations validées et leur avancement.",
    path: "/department-head/internships",
    icon: BriefcaseBusiness,
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Affectation des encadrants",
    description: "Assigner un encadrant académique à chaque étudiant.",
    path: "/department-head/internships",
    icon: UserPlus,
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Notifications",
    description: "Voir les alertes et mises à jour récentes.",
    path: "/department-head/notifications",
    icon: Bell,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Historique",
    description: "Consulter les décisions finales enregistrées.",
    path: "/department-head/final-decisions",
    icon: History,
    color: "bg-slate-100 text-slate-600",
  },
];

const getAcademicYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  if (month >= 9) {
    return `${year} — ${year + 1}`;
  }

  return `${year - 1} — ${year}`;
};

const getUserName = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.firstName || "Chef de filière";
  } catch {
    return "Chef de filière";
  }
};

function DepartmentHeadDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getDashboardStats()
      .then((data) => {
        if (active) {
          setDashboard(data);
        }
      })
      .catch((loadError) => {
        if (active) {
          setError(
            loadError.response?.data?.message || "Erreur lors du chargement",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = dashboard?.stats;

  const statCards = stats
    ? [
        {
          title: "Total étudiants",
          value: stats.totalStudents,
          icon: Users,
          accent: "border-l-blue-500",
          iconBg: "bg-blue-50 text-blue-600",
        },
        {
          title: "Étudiants avec stage déclaré",
          value: stats.declaredStudentCount,
          icon: UserCheck,
          accent: "border-l-emerald-500",
          iconBg: "bg-emerald-50 text-emerald-600",
        },
        {
          title: "Étudiants sans stage",
          value: stats.studentsWithoutInternship,
          icon: UserX,
          accent: "border-l-slate-400",
          iconBg: "bg-slate-100 text-slate-600",
        },
        {
          title: "Étudiants sans encadrant",
          value: stats.studentsWithoutSupervisor,
          icon: UserPlus,
          accent: "border-l-orange-500",
          iconBg: "bg-orange-50 text-orange-600",
        },
        {
          title: "Dossiers validés administrativement",
          value: stats.administrativelyValidatedCount,
          icon: ClipboardList,
          accent: "border-l-teal-500",
          iconBg: "bg-teal-50 text-teal-600",
        },
        {
          title: "Sujets validés",
          value: stats.subjectValidatedCount,
          icon: CheckCircle2,
          accent: "border-l-green-500",
          iconBg: "bg-green-50 text-green-600",
        },
        {
          title: "Rapports hebdomadaires déposés",
          value: stats.weeklyReportsSubmitted,
          icon: FileText,
          accent: "border-l-cyan-500",
          iconBg: "bg-cyan-50 text-cyan-600",
        },
        {
          title: "Rapports hebdomadaires en retard",
          value: stats.weeklyReportsLate,
          icon: Clock,
          accent: "border-l-red-500",
          iconBg: "bg-red-50 text-red-600",
        },
        {
          title: "Rencontres incomplètes",
          value: stats.incompleteMeetingsCount,
          icon: CalendarDays,
          accent: "border-l-amber-500",
          iconBg: "bg-amber-50 text-amber-600",
        },
        {
          title: "Autorisés à soutenir",
          value: stats.authorizedCount,
          icon: Gavel,
          accent: "border-l-violet-500",
          iconBg: "bg-violet-50 text-violet-600",
        },
      ]
    : [];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-8 py-10 text-white shadow-lg">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <LayoutDashboard size={16} />
            Tableau de bord
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight">
            Bienvenue, {getUserName()}
          </h1>

          <p className="mt-3 text-base leading-relaxed text-blue-100">
            Supervisez l&apos;avancement des stages de votre filière
            {dashboard?.department?.name
              ? ` — ${dashboard.department.name}`
              : ""}
            . Consultez les indicateurs clés, accédez rapidement aux actions
            importantes et suivez le parcours des étudiants jusqu&apos;à la
            décision finale.
          </p>
        </div>

        <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-12 right-24 h-28 w-28 rounded-full bg-white/10" />
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          Chargement...
        </div>
      ) : (
        <>
          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-800">
                Actions rapides
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Accédez directement aux pages les plus utilisées.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;

                return (
                  <Link
                    key={action.title}
                    to={action.path}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  >
                    <div
                      className={`inline-flex rounded-xl p-3 ${action.color}`}
                    >
                      <Icon size={22} />
                    </div>

                    <h3 className="mt-4 font-semibold text-slate-800 group-hover:text-blue-700">
                      {action.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      {action.description}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
                      Accéder
                      <ArrowRight
                        size={16}
                        className="transition group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-800">
                Indicateurs de suivi
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Vue synthétique de l&apos;état des stages dans votre filière.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {statCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className={`rounded-2xl border border-slate-200 border-l-4 bg-white p-6 shadow-sm ${card.accent}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">
                          {card.title}
                        </p>
                        <p className="mt-2 text-3xl font-bold text-slate-800">
                          {card.value}
                        </p>
                      </div>

                      <div
                        className={`rounded-xl p-3 ${card.iconBg}`}
                      >
                        <Icon size={22} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="text-xl font-bold text-slate-800">
                Parcours du stage
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Étapes du processus de suivi, de la déclaration à la décision
                finale.
              </p>

              <div className="mt-6 overflow-x-auto pb-2">
                <div className="flex min-w-[760px] items-center gap-2">
                  {WORKFLOW_STEPS.map((step, index) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-center">
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">
                          Étape {index + 1}
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-800">
                          {step}
                        </p>
                      </div>

                      {index < WORKFLOW_STEPS.length - 1 && (
                        <ArrowRight
                          size={18}
                          className="shrink-0 text-slate-300"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-800">
                Informations
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Contexte pédagogique du suivi des stages.
              </p>

              <dl className="mt-6 space-y-5">
                <div className="rounded-xl bg-slate-50 px-4 py-4">
                  <dt className="flex items-center gap-2 text-sm text-slate-500">
                    <CalendarDays size={16} />
                    Année universitaire
                  </dt>
                  <dd className="mt-2 text-lg font-semibold text-slate-800">
                    {getAcademicYear()}
                  </dd>
                </div>

                <div className="rounded-xl bg-slate-50 px-4 py-4">
                  <dt className="flex items-center gap-2 text-sm text-slate-500">
                    <GraduationCap size={16} />
                    Niveau concerné
                  </dt>
                  <dd className="mt-2 text-lg font-semibold text-slate-800">
                    Licence
                  </dd>
                </div>

                <div className="rounded-xl bg-slate-50 px-4 py-4">
                  <dt className="flex items-center gap-2 text-sm text-slate-500">
                    <Users size={16} />
                    Rencontres minimales
                  </dt>
                  <dd className="mt-2 text-lg font-semibold text-slate-800">
                    {MIN_MEETINGS_LICENCE} rencontres obligatoires
                  </dd>
                </div>

                {dashboard?.department?.name && (
                  <div className="rounded-xl bg-blue-50 px-4 py-4">
                    <dt className="text-sm text-blue-600">Filière</dt>
                    <dd className="mt-2 text-lg font-semibold text-blue-900">
                      {dashboard.department.name}
                    </dd>
                  </div>
                )}
              </dl>
            </section>
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-800">
                Répartition des étudiants par encadrant
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Nombre d&apos;étudiants affectés à chaque encadrant académique.
              </p>
            </div>

            {!dashboard?.supervisorDistribution?.length ? (
              <div className="p-10 text-center text-slate-500">
                Aucune affectation enregistrée pour le moment.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Encadrant
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                        Étudiants affectés
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard.supervisorDistribution.map((entry) => (
                      <tr
                        key={entry.supervisorId}
                        className="border-t border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {entry.supervisorName}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                            {entry.studentCount}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

export default DepartmentHeadDashboard;
