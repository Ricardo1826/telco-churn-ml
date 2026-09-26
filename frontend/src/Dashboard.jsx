function StatCard({ label, value, sublabel, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    red: 'bg-red-50 text-red-700',
    green: 'bg-green-50 text-green-700',
  };
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${colors[color].split(' ')[1]}`}>{value}</p>
      {sublabel && <p className="text-xs text-slate-400 mt-1">{sublabel}</p>}
    </div>
  );
}

function RiskBar({ label, value, maxValue = 55 }) {
  const pct = (value / maxValue) * 100;
  const color = value > 35 ? 'bg-red-500' : value > 15 ? 'bg-amber-500' : 'bg-green-500';
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-700">{label}</span>
        <span className="font-semibold text-slate-900">{value}%</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Dashboard() {
  const contractRisk = [
    { label: 'Contrat mensuel', value: 42.7 },
    { label: 'Contrat 1 an', value: 11.3 },
    { label: 'Contrat 2 ans', value: 2.8 },
  ];

  const internetRisk = [
    { label: 'Fibre optique', value: 41.9 },
    { label: 'DSL', value: 19.0 },
    { label: 'Pas internet', value: 7.4 },
  ];

  const paymentRisk = [
    { label: 'Cheque electronique', value: 45.3 },
    { label: 'Cheque postal', value: 19.1 },
    { label: 'Virement automatique', value: 16.7 },
    { label: 'Carte automatique', value: 15.2 },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Taux de churn global" value="26,5%" sublabel="1869 clients sur 7043" color="red" />
        <StatCard label="Segment le plus a risque" value="54,6%" sublabel="Contrat mensuel + Fibre optique" color="red" />
        <StatCard label="Segment le plus stable" value="0,8%" sublabel="Contrat 2 ans + Sans internet" color="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Par type de contrat</h3>
          {contractRisk.map(r => <RiskBar key={r.label} {...r} />)}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Par type d'internet</h3>
          {internetRisk.map(r => <RiskBar key={r.label} {...r} />)}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Par methode de paiement</h3>
          {paymentRisk.map(r => <RiskBar key={r.label} {...r} />)}
        </div>
      </div>

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-5">
        <h3 className="font-semibold text-amber-900 mb-2">Recommandation</h3>
        <p className="text-sm text-amber-800">
          Les clients en contrat mensuel avec fibre optique et paiement par cheque electronique representent le segment le plus volatile.
          Prioriser les offres de retention (remise, engagement incitatif) sur ce profil dans les premiers mois suivant la souscription.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;