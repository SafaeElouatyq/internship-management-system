function ReportTable({ reports }) {
  if (!reports.length) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-800">
          Aucun rapport
        </h3>
        <p className="text-slate-500 mt-2">
          Vos rapports hebdomadaires apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-800">
          Mes rapports
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="text-left px-4 py-4">Date</th>
              <th className="text-left px-4 py-4">Travail réalisé</th>
              <th className="text-left px-4 py-4">Progression</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                className="border-t border-slate-200 hover:bg-slate-50"
              >
                <td className="px-4 py-4 text-slate-600 whitespace-nowrap">
                  {report.submittedAt?.slice(0, 10)}
                </td>

                <td className="px-4 py-4 text-slate-800">
                  <p className="line-clamp-2">{report.completedWork}</p>
                </td>

                <td className="px-4 py-4">
                  <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                    {report.progress}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReportTable;
