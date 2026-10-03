import React from 'react';
import { 
  Sparkles, 
  TrendingDown, 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  Sliders, 
  ShieldAlert, 
  Sun, 
  Clock, 
  Flame 
} from 'lucide-react';
import { AIInsight, SimulationParams, TariffSchedule, Appliance } from '../types/energy';

interface AIAdvisorProps {
  aiInsights: AIInsight[];
  simParams: SimulationParams;
  setSimParams: React.Dispatch<React.SetStateAction<SimulationParams>>;
  tariff: TariffSchedule;
  appliances: Appliance[];
  efficiencyScore: number;
  onToggleAppliance: (id: string) => void;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({
  aiInsights,
  simParams,
  setSimParams,
  tariff,
  appliances,
  efficiencyScore,
  onToggleAppliance
}) => {
  const totalPotentialMonthlySavings = aiInsights.reduce((sum, item) => sum + item.estimatedMonthlySavings, 0);

  // Scenario Simulator calculations
  const hvacSavings = simParams.hvacThermostatOffset * 8.50;
  const evSavings = simParams.evChargeSchedule === 'off-peak' ? 44.50 : simParams.evChargeSchedule === 'solar-only' ? 58.00 : 0;
  const solarSavings = simParams.solarCapacityBoostKw * 14.20;
  const batterySavings = simParams.batteryUpgradeKwh * 3.80;

  const totalSimulatedMonthlySavings = Math.round(hvacSavings + evSavings + solarSavings + batterySavings);
  const totalSimulatedAnnualSavings = totalSimulatedMonthlySavings * 12;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles color="#c084fc" /> AI Energy Intelligence & Scenario Optimizer
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Real-time pattern analysis, automated Time-of-Use savings recommendations, and interactive scenario predictor
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', padding: '0.5rem 1rem', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. AI Savings Potential</span>
            <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#c084fc' }}>
              {tariff.currencySymbol}{totalPotentialMonthlySavings.toFixed(2)} <span style={{ fontSize: '0.8rem' }}>/ mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: AI Recommendations & Scenario Simulator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem' }}>
        
        {/* Left Column: AI Recommendation Cards (7 cols) */}
        <div style={{ gridColumn: 'span 7', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>Active Smart Recommendations</h3>

          {aiInsights.map(insight => (
            <div key={insight.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={`badge ${insight.type === 'savings' ? 'badge-emerald' : insight.type === 'solar' ? 'badge-amber' : insight.type === 'alert' ? 'badge-rose' : 'badge-cyan'}`}>
                    {insight.type.toUpperCase()}
                  </span>
                  <span className={`badge ${insight.impact === 'High' ? 'badge-rose' : 'badge-violet'}`}>
                    {insight.impact} Impact
                  </span>
                </div>
                <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#34d399' }}>
                  +{tariff.currencySymbol}{insight.estimatedMonthlySavings.toFixed(2)}/mo
                </span>
              </div>

              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{insight.title}</h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{insight.description}</p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                <button 
                  className="btn-primary" 
                  style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
                  onClick={() => {
                    if (insight.targetApplianceId) {
                      onToggleAppliance(insight.targetApplianceId);
                    }
                  }}
                >
                  {insight.actionText} <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Scenario Predictor Simulator (5 cols) */}
        <div className="glass-panel" style={{ gridColumn: 'span 5', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={20} color="#38bdf8" /> "What-If" Scenario Simulator
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Adjust parameters to forecast live billing reduction
            </p>
          </div>

          {/* Slider 1: Thermostat Offset */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>HVAC Summer Thermostat Shift</span>
              <span className="font-mono" style={{ color: '#38bdf8', fontWeight: 700 }}>+{simParams.hvacThermostatOffset}°F</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="4" 
              step="1" 
              value={simParams.hvacThermostatOffset}
              onChange={(e) => setSimParams(prev => ({ ...prev, hvacThermostatOffset: Number(e.target.value) }))}
              style={{ width: '100%', accentColor: '#38bdf8' }}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>+1°F shift saves approx. 8% on cooling load</span>
          </div>

          {/* Slider 2: EV Charge Schedule */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>EV Charging Strategy</span>
              <span className="font-mono" style={{ color: '#34d399', fontWeight: 700, textTransform: 'uppercase' }}>{simParams.evChargeSchedule}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem' }}>
              {(['anytime', 'off-peak', 'solar-only'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setSimParams(prev => ({ ...prev, evChargeSchedule: mode }))}
                  style={{
                    padding: '0.35rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: simParams.evChargeSchedule === mode ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    color: simParams.evChargeSchedule === mode ? '#ffffff' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 600,
                    textTransform: 'capitalize'
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Slider 3: Solar PV Capacity Boost */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              <span style={{ color: '#ffffff', fontWeight: 600 }}>Solar Expansion (+kW)</span>
              <span className="font-mono" style={{ color: '#f59e0b', fontWeight: 700 }}>+{simParams.solarCapacityBoostKw} kW</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="5" 
              step="1" 
              value={simParams.solarCapacityBoostKw}
              onChange={(e) => setSimParams(prev => ({ ...prev, solarCapacityBoostKw: Number(e.target.value) }))}
              style={{ width: '100%', accentColor: '#f59e0b' }}
            />
          </div>

          {/* Results Summary Box */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(2, 132, 199, 0.15) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '14px',
            padding: '1.25rem',
            textAlign: 'center'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Projected Total Savings</span>
            <div className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#34d399', margin: '0.25rem 0' }}>
              +{tariff.currencySymbol}{totalSimulatedMonthlySavings} <span style={{ fontSize: '1rem' }}>/ mo</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 700 }}>
              ~{tariff.currencySymbol}{totalSimulatedAnnualSavings} Projected Yearly Savings
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
