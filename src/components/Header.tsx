import React from 'react';
import { 
  Zap, 
  Activity, 
  ShieldCheck, 
  Download, 
  DollarSign, 
  Euro, 
  PoundSterling, 
  Play, 
  Pause,
  Sun,
  LayoutDashboard,
  BarChart3,
  Sliders,
  Sparkles,
  Receipt
} from 'lucide-react';
import { TariffSchedule } from '../types/energy';

export type ActiveTab = 'overview' | 'analytics' | 'appliances' | 'solar' | 'advisor' | 'tariff';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isLive: boolean;
  setIsLive: (live: boolean) => void;
  simulationSpeed: number;
  setSimulationSpeed: (speed: number) => void;
  tariff: TariffSchedule;
  setTariff: React.Dispatch<React.SetStateAction<TariffSchedule>>;
  onOpenExportModal: () => void;
  liveWatts: number;
  voltage: number;
  frequency: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isLive,
  setIsLive,
  simulationSpeed,
  setSimulationSpeed,
  tariff,
  setTariff,
  onOpenExportModal,
  liveWatts,
  voltage,
  frequency
}) => {


  const handleCurrencyChange = (code: string, symbol: string) => {
    setTariff(prev => ({
      ...prev,
      currencyCode: code,
      currencySymbol: symbol
    }));
  };

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 size={18} /> },
    { id: 'appliances', label: 'Smart Appliances', icon: <Sliders size={18} /> },
    { id: 'solar', label: 'Solar PV & Battery', icon: <Sun size={18} /> },
    { id: 'advisor', label: 'AI Advisor', icon: <Sparkles size={18} /> },
    { id: 'tariff', label: 'Tariff & Budget', icon: <Receipt size={18} /> }
  ];

  return (
    <header className="glass-panel" style={{ margin: '1rem', padding: '1rem 1.5rem', borderRadius: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand & Live Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
            padding: '0.65rem',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
          }}>
            <Zap size={26} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #ffffff 0%, #e2e8f0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                WattIQ
              </h1>
              <span className="badge badge-cyan">v2.4 AI Pro</span>
              <div className="pulse-dot pulse-dot-green" title="Live Telemetry Engine Active"></div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.1rem' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Intelligent Energy Consumption Analyzer</span>
              <span>•</span>
              <span className="font-mono" style={{ color: '#38bdf8' }}>{voltage}V</span>
              <span>•</span>
              <span className="font-mono" style={{ color: '#34d399' }}>{frequency}Hz</span>
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{
          display: 'flex',
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '0.35rem',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          gap: '0.25rem',
          overflowX: 'auto'
        }}>
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.8) 0%, rgba(14, 165, 233, 0.8) 100%)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 15px rgba(2, 132, 199, 0.4)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Controls & Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          
          {/* Live Pulse Toggle */}
          <button
            onClick={() => setIsLive(!isLive)}
            title={isLive ? 'Pause Live Stream' : 'Resume Live Stream'}
            className="btn-secondary"
            style={{ padding: '0.5rem 0.8rem', fontSize: '0.8rem' }}
          >
            {isLive ? <Pause size={15} color="#34d399" /> : <Play size={15} color="#fbbf24" />}
            <span>{isLive ? 'LIVE' : 'PAUSED'}</span>
          </button>

          {/* Currency Selector */}
          <div style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.2rem'
          }}>
            <button
              onClick={() => handleCurrencyChange('USD', '$')}
              style={{
                background: tariff.currencyCode === 'USD' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                border: 'none',
                color: tariff.currencyCode === 'USD' ? '#38bdf8' : 'var(--text-dim)',
                borderRadius: '6px',
                padding: '0.25rem 0.5rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
              title="US Dollar ($)"
            >
              $
            </button>
            <button
              onClick={() => handleCurrencyChange('EUR', '€')}
              style={{
                background: tariff.currencyCode === 'EUR' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                border: 'none',
                color: tariff.currencyCode === 'EUR' ? '#38bdf8' : 'var(--text-dim)',
                borderRadius: '6px',
                padding: '0.25rem 0.5rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
              title="Euro (€)"
            >
              €
            </button>
            <button
              onClick={() => handleCurrencyChange('GBP', '£')}
              style={{
                background: tariff.currencyCode === 'GBP' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                border: 'none',
                color: tariff.currencyCode === 'GBP' ? '#38bdf8' : 'var(--text-dim)',
                borderRadius: '6px',
                padding: '0.25rem 0.5rem',
                cursor: 'pointer',
                fontWeight: 600
              }}
              title="British Pound (£)"
            >
              £
            </button>
          </div>

          {/* Export Report */}
          <button 
            onClick={onOpenExportModal}
            className="btn-primary"
            style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>

      </div>
    </header>
  );
};
