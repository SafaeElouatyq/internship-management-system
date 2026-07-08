import { useState } from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  FileText,
  Gavel,
  Info,
  ListOrdered,
  Mail,
  Phone,
  ShieldCheck,
  Upload,
} from "lucide-react";

const WORKFLOW_STEPS = [
  {
    title: "Déclarer un stage",
    description:
      "Renseignez les informations de votre stage et déposez les documents administratifs requis.",
    icon: FileText,
  },
  {
    title: "Attendre la validation administrative",
    description:
      "La responsable des stages vérifie votre dossier et valide ou demande des corrections.",
    icon: ShieldCheck,
  },
  {
    title: "Suivre l'avancement du stage",
    description:
      "Consultez le statut de votre stage, les remarques et l'évolution de votre dossier.",
    icon: ListOrdered,
  },
  {
    title: "Soumettre les rapports hebdomadaires",
    description:
      "Déposez votre mini-rapport chaque semaine dans la fenêtre autorisée (vendredi → lundi 10h).",
    icon: Upload,
  },
  {
    title: "Participer aux rencontres avec l'encadrant",
    description:
      "Assistez aux rencontres planifiées par votre encadrant académique et consultez les comptes rendus.",
    icon: CalendarDays,
  },
  {
    title: "Téléverser le rapport final",
    description:
      "Déposez les versions de votre rapport PFE (initiale, corrigée, finale, présentation).",
    icon: BookOpen,
  },
  {
    title: "Consulter la décision finale",
    description:
      "Visualisez la décision de soutenance prise par votre encadrant à la fin du stage.",
    icon: Gavel,
  },
];

const FAQ_ITEMS = [
  {
    question: "Comment déclarer un stage ?",
    answer:
      "Accédez à la section « Mon Stage », cliquez sur « Nouvelle déclaration », remplissez le formulaire (entreprise, sujet, dates, encadrant professionnel) et joignez les documents administratifs demandés.",
  },
  {
    question: "Comment soumettre un rapport hebdomadaire ?",
    answer:
      "Rendez-vous dans « Rapports », puis complétez le formulaire de la semaine en cours. La soumission est autorisée du vendredi 00h00 au lundi 10h00 (heure du Maroc).",
  },
  {
    question: "Comment consulter les remarques de mon encadrant ?",
    answer:
      "Les commentaires sont visibles dans le détail de vos rapports hebdomadaires, dans les comptes rendus de rencontres et sur les documents PFE validés ou commentés par l'encadrant.",
  },
  {
    question: "Comment téléverser mon rapport final ?",
    answer:
      "Ouvrez la section « Rapport PFE », choisissez le type de document (version initiale, corrigée, finale ou présentation) et téléversez le fichier au format PDF ou DOCX.",
  },
  {
    question: "Comment changer mon mot de passe ?",
    answer:
      "Allez dans « Paramètres », section « Changer le mot de passe ». Saisissez votre mot de passe actuel, le nouveau mot de passe et sa confirmation, puis cliquez sur « Mettre à jour le mot de passe ».",
  },
  {
    question: "Où trouver les notifications ?",
    answer:
      "Cliquez sur « Notifications » dans le menu latéral. Vous y retrouverez les alertes liées à votre stage, aux validations, aux commentaires et aux décisions.",
  },
];

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 bg-white px-5 py-4 text-left transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800"
      >
        <span className="font-medium text-slate-800 dark:text-slate-100">
          {item.question}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-relaxed text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
          {item.answer}
        </div>
      )}
    </div>
  );
}

function HelpPage() {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Centre d&apos;aide
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Guides, réponses aux questions fréquentes et informations de contact
          pour vous accompagner dans l&apos;utilisation de la plateforme.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
            <ListOrdered size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Guide rapide
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Les étapes principales du parcours de stage sur la plateforme.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {WORKFLOW_STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="flex gap-4 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                  {index + 1}
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex items-center gap-2">
                    <Icon
                      size={18}
                      className="text-blue-600 dark:text-blue-400"
                    />
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 flex items-start gap-4">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
            <CircleHelp size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Questions fréquentes
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Réponses aux questions les plus courantes des utilisateurs.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <FaqItem
              key={item.question}
              item={item}
              isOpen={openFaqIndex === index}
              onToggle={() =>
                setOpenFaqIndex((current) =>
                  current === index ? -1 : index,
                )
              }
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
              <Mail size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Contact &amp; support
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Besoin d&apos;assistance ? Contactez l&apos;administration.
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Si vous rencontrez un problème technique ou une difficulté
              d&apos;utilisation, n&apos;hésitez pas à contacter le service
              administratif. Notre équipe vous répondra dans les meilleurs
              délais.
            </p>

            <div className="space-y-3">
              <a
                href="mailto:support.stage@universite.ma"
                className="flex items-center gap-3 text-slate-700 transition hover:text-blue-600 dark:text-slate-200 dark:hover:text-blue-400"
              >
                <Mail size={18} className="text-blue-600 dark:text-blue-400" />
                <span>support.stage@universite.ma</span>
              </a>

              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <Phone size={18} className="text-blue-600 dark:text-blue-400" />
                <span>+212 5 22 00 00 00</span>
              </div>

              <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
                <Bell size={18} className="text-blue-600 dark:text-blue-400" />
                <span>Consultez aussi vos notifications dans l&apos;application</span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-start gap-4">
            <div className="rounded-xl bg-violet-50 p-3 text-violet-600 dark:bg-violet-950 dark:text-violet-300">
              <Info size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                À propos
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Informations sur la plateforme.
              </p>
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-950">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Application
              </p>
              <p className="mt-1 text-lg font-semibold text-slate-800 dark:text-slate-100">
                Internship Management System
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Version
              </p>
              <p className="mt-1 font-medium text-slate-800 dark:text-slate-100">
                1.0.0
              </p>
            </div>

            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Plateforme web de gestion, de suivi et de supervision des stages
              universitaires. Elle centralise les déclarations, les validations,
              les rapports hebdomadaires, les rencontres et les décisions
              finales pour tous les acteurs du processus.
            </p>

            <p className="border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              © {new Date().getFullYear()} Internship Management System. Tous
              droits réservés.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HelpPage;
