import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { RealtimeOverview } from './components/RealtimeOverview';
import { ConsumptionAnalytics } from './components/ConsumptionAnalytics';
import { ApplianceTracker } from './components/ApplianceTracker';
import { SolarMicrogrid } from './components/SolarMicrogrid';
import { AIAdvisor } from './components/AIAdvisor';
import { TariffBudgetManager } from './components/TariffBudgetManager';
import { ExportModal } from './components/ExportModal';
import { AddApplianceModal } from './components/AddApplianceModal';
import { useEnergyData } from './hooks/useEnergyData';
import { ShieldCheck, AlertCircle, Info, CheckCircle2, X } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const {
    appliances,
    toggleAppliance,
    addAppliance,
    deleteAppliance,
    telemetry,
    solarState,
    setSolarState,
    tariff,
    setTariff,
    aiInsights,
    hourlyData,
    dailyData,
    monthlyData,
    isLiveTelemetryActive,
    setIsLiveTelemetryActive,
    simulationSpeed,
    setSimulationSpeed,
    gridVoltage,
    gridFrequency,
    simParams,
    setSimParams,
    estimatedMonthlyBill,
    carbonStats,
    efficiencyScore,
    toasts,
    removeToast
  } = useEnergyData();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Header & Nav */}
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLive={isLiveTelemetryActive}
        setIsLive={setIsLiveTelemetryActive}
        simulationSpeed={simulationSpeed}
        setSimulationSpeed={setSimulationSpeed}
        tariff={tariff}
        setTariff={setTariff}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        liveWatts={telemetry.homeLoadWatts}
        voltage={gridVoltage}
        frequency={gridFrequency}
      />

      {/* Main View Area */}
      <main style={{ flex: 1, padding: '0 1.5rem 2rem 1.5rem', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
        {activeTab === 'overview' && (
          <RealtimeOverview 
            telemetry={telemetry}
            solarState={solarState}
            tariff={tariff}
            appliances={appliances}
            estimatedMonthlyBill={estimatedMonthlyBill}
            carbonStats={carbonStats}
            efficiencyScore={efficiencyScore}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'analytics' && (
          <ConsumptionAnalytics 
            hourlyData={hourlyData}
            dailyData={dailyData}
            monthlyData={monthlyData}
            tariff={tariff}
          />
        )}

        {activeTab === 'appliances' && (
          <ApplianceTracker 
            appliances={appliances}
            onToggleAppliance={toggleAppliance}
            onDeleteAppliance={deleteAppliance}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            tariff={tariff}
          />
        )}

        {activeTab === 'solar' && (
          <SolarMicrogrid 
            solarState={solarState}
            tariff={tariff}
            telemetry={telemetry}
          />
        )}

        {activeTab === 'advisor' && (
          <AIAdvisor 
            aiInsights={aiInsights}
            simParams={simParams}
            setSimParams={setSimParams}
            tariff={tariff}
            appliances={appliances}
            efficiencyScore={efficiencyScore}
            onToggleAppliance={toggleAppliance}
          />
        )}

        {activeTab === 'tariff' && (
          <TariffBudgetManager 
            tariff={tariff}
            setTariff={setTariff}
            estimatedMonthlyBill={estimatedMonthlyBill}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '1.25rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        color: 'var(--text-dim)',
        fontSize: '0.8rem'
      }}>
        WattIQ: Intelligent Energy Consumption Analyzer • Built with React, TypeScript & Recharts • Grid Frequency Standard 60Hz ±0.05
      </footer>

      {/* Modals */}
      <ExportModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        tariff={tariff}
        solarState={solarState}
        estimatedMonthlyBill={estimatedMonthlyBill}
        carbonStats={carbonStats}
        dailyData={dailyData}
      />

      <AddApplianceModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAppliance={addAppliance}
      />

      {/* Toast Overlay Stack */}
      <div style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        zIndex: 9999,
        maxWidth: '360px',
        width: '100%'
      }}>
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className="glass-panel"
            style={{
              padding: '0.85rem 1.1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              borderColor: toast.type === 'warning' ? 'rgba(245, 158, 11, 0.4)' : toast.type === 'success' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(56, 189, 248, 0.4)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)'
            }}
          >
            {toast.type === 'warning' ? <AlertCircle size={20} color="#f59e0b" /> : toast.type === 'success' ? <CheckCircle2 size={20} color="#34d399" /> : <Info size={20} color="#38bdf8" />}
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{toast.title}</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default App;
