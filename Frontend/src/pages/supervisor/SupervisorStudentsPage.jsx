import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AssignedStudentsTable from "../../components/supervisor/AssignedStudentsTable";
import { getAssignedInternships } from "../../services/supervisorInternshipService.jsx";
import { internshipStatusOptions } from "../../utils/internshipUtils.jsx";

function SupervisorStudentsPage() {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [searchStudent, setSearchStudent] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadInternships() {
    try {
      const data = await getAssignedInternships({
        student: searchStudent,
        status,
      });

      setInternships(data.internships);
    } catch (error) {
      setError(error.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInternships();
  }, []);

  const Search = (event) => {
    event.preventDefault();
    setLoading(true);
    loadInternships();
  };

  const View = (internship) => {
    navigate(`/supervisor/internships/${internship.id}`);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Mes étudiants
        </h1>

        <p className="text-slate-500 mt-2">
          Consultez vos étudiants assignés et validez leurs sujets de stage.
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-2xl">
          {error}
        </div>
      )}

      <form
        onSubmit={Search}
        className="bg-white rounded-2xl shadow-sm p-5 border border-slate-200 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4">
          <input
            type="text"
            value={searchStudent}
            onChange={(event) => setSearchStudent(event.target.value)}
            placeholder="Rechercher par étudiant"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            {internshipStatusOptions.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium"
          >
            Rechercher
          </button>
        </div>
      </form>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          Chargement...
        </div>
      ) : (
        <AssignedStudentsTable internships={internships} onView={View} />
      )}
    </>
  );
}

export default SupervisorStudentsPage;
