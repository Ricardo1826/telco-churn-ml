import { useState } from 'react';

function Simulator() {
  const [formData, setFormData] = useState({
    tenure: '',
    monthly_charges: '',
    contract: 'Month-to-month',
    internet_service: 'Fiber optic',
    payment_method: 'Electronic check',
    senior_citizen: 0,
    partner: 0,
    dependents: 0,
    phone_service: 1,
    multiple_lines: 0,
    online_security: 0,
    online_backup: 0,
    device_protection: 0,
    tech_support: 0,
    streaming_tv: 0,
    streaming_movies: 0,
    paperless_billing: 0,
    gender: 0,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tenure: parseFloat(formData.tenure),
          monthly_charges: parseFloat(formData.monthly_charges),
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail?.[0]?.msg || 'Valeurs invalides');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkboxFields = [
    { name: 'senior_citizen', label: 'Client senior' },
    { name: 'partner', label: 'A un(e) conjoint(e)' },
    { name: 'dependents', label: 'A des personnes a charge' },
    { name: 'phone_service', label: 'Service telephonique' },
    { name: 'multiple_lines', label: 'Plusieurs lignes telephoniques' },
    { name: 'online_security', label: 'Securite en ligne' },
    { name: 'online_backup', label: 'Sauvegarde en ligne' },
    { name: 'device_protection', label: 'Protection des appareils' },
    { name: 'tech_support', label: 'Support technique' },
    { name: 'streaming_tv', label: 'Streaming TV' },
    { name: 'streaming_movies', label: 'Streaming films' },
    { name: 'paperless_billing', label: 'Facturation dematerialisee' },
  ];

  const riskFactors = () => {
    const factors = [];
    if (formData.contract === 'Month-to-month') factors.push({ label: 'Contrat mensuel', impact: 'negatif' });
    if (formData.contract === 'Two year') factors.push({ label: 'Engagement 2 ans', impact: 'positif' });
    if (formData.internet_service === 'Fiber optic') factors.push({ label: 'Fibre optique', impact: 'negatif' });
    if (formData.internet_service === 'No') factors.push({ label: "Pas d'internet", impact: 'positif' });
    if (formData.payment_method === 'Electronic check') factors.push({ label: 'Cheque electronique', impact: 'negatif' });
    if (parseFloat(formData.tenure) < 12) factors.push({ label: 'Client recent', impact: 'negatif' });
    if (parseFloat(formData.tenure) > 48) factors.push({ label: 'Client fidele', impact: 'positif' });
    if (formData.tech_support === 1) factors.push({ label: 'Support technique actif', impact: 'positif' });
    return factors;
  };

  return (
    <div>
      {result && (() => {
        const isRisk = result.churn_prediction === 'Yes';
        const pct = result.churn_probability * 100;
        const circumference = 2 * Math.PI * 54;
        const offset = circumference - (pct / 100) * circumference;
        const color = isRisk ? '#dc2626' : '#16a34a';
        const factors = riskFactors();

        return (
          <div className="mb-6 rounded-xl p-6 border border-slate-200 bg-white">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-36 h-36 shrink-0">
                <svg className="w-36 h-36 -rotate-90">
                  <circle cx="72" cy="72" r="54" stroke="#e2e8f0" strokeWidth="12" fill="none" />
                  <circle
                    cx="72" cy="72" r="54" stroke={color} strokeWidth="12" fill="none"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="round" className="transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold" style={{ color }}>{pct.toFixed(0)}%</span>
                  <span className="text-xs text-slate-400">risque</span>
                </div>
              </div>

              <div className="flex-1">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${isRisk ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {isRisk ? 'CLIENT A RISQUE' : 'CLIENT STABLE'}
                </span>
                <p className="text-sm text-slate-600 mb-4">
                  {isRisk
                    ? 'Ce profil presente une forte probabilite de resiliation. Une action de retention est recommandee.'
                    : 'Ce profil presente un faible risque de resiliation, aucune action particuliere requise.'}
                </p>

                {factors.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {factors.map(f => (
                      <span key={f.label}
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                          f.impact === 'negatif' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'
                        }`}>
                        {f.impact === 'negatif' ? '↑ ' : '↓ '}{f.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-5">Profil du client</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Anciennete (en mois)</label>
            <input
              type="number" name="tenure" value={formData.tenure} onChange={handleChange}
              placeholder="Ex : 12 (entre 0 et 72)" min="0" max="72" required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Charges mensuelles ($)</label>
            <input
              type="number" name="monthly_charges" value={formData.monthly_charges} onChange={handleChange}
              placeholder="Ex : 65 (entre 18 et 119)" min="18" max="119" required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Type de contrat</label>
            <select name="contract" value={formData.contract} onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="Month-to-month">Mensuel</option>
              <option value="One year">1 an</option>
              <option value="Two year">2 ans</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Type de connexion internet</label>
            <select name="internet_service" value={formData.internet_service} onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="DSL">DSL</option>
              <option value="Fiber optic">Fibre optique</option>
              <option value="No">Aucune</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1">Methode de paiement</label>
            <select name="payment_method" value={formData.payment_method} onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
              <option value="Electronic check">Cheque electronique</option>
              <option value="Mailed check">Cheque postal</option>
              <option value="Bank transfer (automatic)">Virement automatique</option>
              <option value="Credit card (automatic)">Carte automatique</option>
            </select>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-slate-700 mb-3">Services et options</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {checkboxFields.map(f => (
            <label key={f.name} className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox" name={f.name} checked={formData[f.name] === 1}
                onChange={handleChange} className="rounded border-slate-300"
              />
              {f.label}
            </label>
          ))}
        </div>

        {error && <p className="mb-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <button type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-lg transition-colors">
          {loading ? 'Analyse en cours...' : 'Estimer le risque de churn'}
        </button>
      </form>
    </div>
  );
}

export default Simulator;