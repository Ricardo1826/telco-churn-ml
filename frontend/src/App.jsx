import { useState } from 'react';
import Dashboard from './Dashboard';
import Simulator from './Simulator';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-slate-900 text-white py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <span className="inline-block bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Regression logistique · AUC 0.84
          </span>
          <h1 className="text-3xl font-bold mb-2">Prediction du churn client</h1>
          <p className="text-slate-300 max-w-2xl">
            Modele entraine sur le dataset Telco Customer Churn (7043 clients), identifiant les facteurs de resiliation et estimant le risque pour un client donne.
          </p>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200 px-4">
        <div className="max-w-5xl mx-auto flex gap-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-5 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'dashboard'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Tableau de bord
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-5 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === 'simulator'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Simulateur
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' ? <Dashboard /> : <Simulator />}
      </main>
    </div>
  );
}

export default App;