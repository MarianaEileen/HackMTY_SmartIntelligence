
import React, { useState } from 'react';
import Header from './components/Header';
import ConsumptionPredictor from './components/ConsumptionPredictor';
import ExpirationScanner from './components/ExpirationScanner';
import ProductivityEstimator from './components/ProductivityEstimator';
import { PredictionIcon, QrIcon, ProductivityIcon } from './components/icons/FeatureIcons';

type Tab = 'prediction' | 'scanner' | 'productivity';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('prediction');

  const renderContent = () => {
    switch (activeTab) {
      case 'prediction':
        return <ConsumptionPredictor />;
      case 'scanner':
        return <ExpirationScanner />;
      case 'productivity':
        return <ProductivityEstimator />;
      default:
        return <ConsumptionPredictor />;
    }
  };

  const NavButton = ({ tab, icon, label }: { tab: Tab, icon: React.ReactNode, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex-1 flex flex-col items-center justify-center p-2 sm:p-4 text-xs sm:text-sm font-medium transition-colors duration-200 ${
        activeTab === tab 
          ? 'text-blue-600 border-t-2 border-blue-600 bg-blue-50' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-blue-600'
      }`}
    >
      {icon}
      <span className="mt-1">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto pb-24">
        {renderContent()}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex border-t border-slate-200">
        <NavButton tab="prediction" icon={<PredictionIcon />} label="Predicción" />
        <NavButton tab="scanner" icon={<QrIcon />} label="Gestión QR" />
        <NavButton tab="productivity" icon={<ProductivityIcon />} label="Productividad" />
      </nav>
    </div>
  );
};

export default App;
