function PlaceholderPage({ title, description, message }) {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
        {description && <p className="text-slate-500 mt-2">{description}</p>}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
        <p className="text-slate-500 mt-2">
          {message || "Cette section sera disponible prochainement."}
        </p>
      </div>
    </>
  );
}

export default PlaceholderPage;
