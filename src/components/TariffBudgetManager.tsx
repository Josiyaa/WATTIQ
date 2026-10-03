import React, { useState } from 'react';
import { 
  Receipt, 
  DollarSign, 
  Clock, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  Sliders, 
  Save 
} from 'lucide-react';
import { TariffSchedule } from '../types/energy';

interface TariffBudgetManagerProps {
  tariff: TariffSchedule;
  setTariff: React.Dispatch<React.SetStateAction<TariffSchedule>>;
  estimatedMonthlyBill: number;
}

export const TariffBudgetManager: React.FC<TariffBudgetManagerProps> = ({
  tariff,
  setTariff,
  estimatedMonthlyBill
}) => {
  const [useTou, setUseTou] = useState(tariff.useTou);
  const [flatRate, setFlatRate] = useState(tariff.flatRate);
  const [offPeakRate, setOffPeakRate] = useState(tariff.offPeakRate);
  const [standardRate, setStandardRate] = useState(tariff.standardRate);
  const [peakRate, setPeakRate] = useState(tariff.peakRate);
  const [monthlyBudget, setMonthlyBudget] = useState(tariff.monthlyBudget);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const budgetUsagePercent = Math.min(100, (estimatedMonthlyBill / Math.max(1, monthlyBudget)) * 100);
  const isOverBudget = estimatedMonthlyBill > monthlyBudget;

  const handleSave = () => {
    setTariff(prev => ({
      ...prev,
      useTou,
      flatRate,
      offPeakRate,
      standardRate,
      peakRate,
      monthlyBudget
    }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Receipt color="#34d399" /> Electricity Tariff & Monthly Budget Manager
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Configure Time-of-Use pricing tiers ($/kWh), set monthly cost targets, and track budget compliance
          </p>
        </div>

        <button className="btn-primary" onClick={handleSave}>
          <Save size={18} /> {savedSuccess ? 'Saved Tariff Settings!' : 'Save Changes'}
        </button>
      </div>

      {/* Monthly Budget Progress Card */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Monthly Budget Target</span>
            <div className="font-mono" style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginTop: '0.25rem' }}>
              {tariff.currencySymbol}{estimatedMonthlyBill.toFixed(2)}
              <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 500 }}> / {tariff.currencySymbol}{monthlyBudget} Limit</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className={`badge ${isOverBudget ? 'badge-rose' : 'badge-emerald'}`}>
              {isOverBudget ? 'Budget Exceeded Warning' : 'Under Target Goal'}
            </span>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '0.4rem' }}>
              {budgetUsagePercent.toFixed(0)}% of monthly allocation used
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', height: '14px', overflow: 'hidden' }}>
          <div 
            style={{ 
              width: `${budgetUsagePercent}%`, 
              height: '100%', 
              background: isOverBudget ? 'linear-gradient(90deg, #f59e0b 0%, #f43f5e 100%)' : 'linear-gradient(90deg, #10b981 0%, #38bdf8 100%)',
              borderRadius: '10px',
              transition: 'width 0.6s ease'
            }}
          ></div>
        </div>
      </div>

      {/* Tariff Settings Controls Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.25rem' }}>
        
        {/* Rate Structure Configuration (8 cols) */}
        <div className="glass-panel" style={{ gridColumn: 'span 8', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Utility Tariff Schedule ($/kWh)</h3>

          {/* Pricing Model Selector */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <label style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.9rem' }}>Pricing Structure:</label>
            <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '0.2rem', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <button
                onClick={() => setUseTou(false)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: !useTou ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                  color: !useTou ? '#38bdf8' : 'var(--text-dim)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Flat Rate
              </button>
              <button
                onClick={() => setUseTou(true)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: useTou ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                  color: useTou ? '#38bdf8' : 'var(--text-dim)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Time-of-Use (TOU)
              </button>
            </div>
          </div>

          {/* Rate Input Fields */}
          {!useTou ? (
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1.25rem', borderRadius: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Flat Electricity Rate ({tariff.currencySymbol}/kWh)</label>
              <input 
                type="number" 
                step="0.01"
                value={flatRate}
                onChange={(e) => setFlatRate(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(7, 9, 19, 0.8)',
                  color: '#ffffff',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '1.1rem'
                }}
              />
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: '12px' }}>
                <span className="badge badge-emerald" style={{ marginBottom: '0.5rem' }}>Off-Peak (23:00 - 07:00)</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={offPeakRate}
                  onChange={(e) => setOffPeakRate(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(7, 9, 19, 0.8)',
                    color: '#34d399',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '1.2rem',
                    fontWeight: 700
                  }}
                />
              </div>

              <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '1rem', borderRadius: '12px' }}>
                <span className="badge badge-cyan" style={{ marginBottom: '0.5rem' }}>Standard Rate</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={standardRate}
                  onChange={(e) => setStandardRate(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(7, 9, 19, 0.8)',
                    color: '#38bdf8',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '1.2rem',
                    fontWeight: 700
                  }}
                />
              </div>

              <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '1rem', borderRadius: '12px' }}>
                <span className="badge badge-rose" style={{ marginBottom: '0.5rem' }}>Peak Rate (16:00 - 21:00)</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={peakRate}
                  onChange={(e) => setPeakRate(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: 'rgba(7, 9, 19, 0.8)',
                    color: '#fb7185',
                    fontFamily: 'JetBrains Mono',
                    fontSize: '1.2rem',
                    fontWeight: 700
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Monthly Budget Setup Card (4 cols) */}
        <div className="glass-panel" style={{ gridColumn: 'span 4', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Target Allocation</h3>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Monthly Electricity Budget ({tariff.currencySymbol})</label>
            <input 
              type="number" 
              step="10"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(7, 9, 19, 0.8)',
                color: '#34d399',
                fontFamily: 'JetBrains Mono',
                fontSize: '1.3rem',
                fontWeight: 800
              }}
            />
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Setting a target budget activates automatic push notifications when high load events threaten to breach your allocation threshold.
          </p>
        </div>

      </div>

    </div>
  );
};
