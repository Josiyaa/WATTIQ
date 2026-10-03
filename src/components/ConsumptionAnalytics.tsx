import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { BarChart3, TrendingUp, Calendar, DollarSign, Leaf, Zap } from 'lucide-react';
import { HistoricalPoint, TariffSchedule } from '../types/energy';

interface ConsumptionAnalyticsProps {
  hourlyData: HistoricalPoint[];
  dailyData: HistoricalPoint[];
  monthlyData: HistoricalPoint[];
  tariff: TariffSchedule;
}

export const ConsumptionAnalytics: React.FC<ConsumptionAnalyticsProps> = ({
  hourlyData,
  dailyData,
  monthlyData,
  tariff
}) => {
  const [timeframe, setTimeframe] = useState<'hourly' | 'daily' | 'monthly'>('hourly');
  const [metricView, setMetricView] = useState<'energy' | 'cost' | 'co2'>('energy');

  const currentDataset = timeframe === 'hourly' ? hourlyData : timeframe === 'daily' ? dailyData : monthlyData;

  // Calculate totals
  const totalLoad = currentDataset.reduce((sum, d) => sum + d.totalLoadKwh, 0).toFixed(1);
  const totalSolar = currentDataset.reduce((sum, d) => sum + d.solarGenKwh, 0).toFixed(1);
  const totalGrid = currentDataset.reduce((sum, d) => sum + d.gridUsageKwh, 0).toFixed(1);
  const totalCost = currentDataset.reduce((sum, d) => sum + d.costDollars, 0).toFixed(2);
  const totalCo2 = currentDataset.reduce((sum, d) => sum + d.co2Kg, 0).toFixed(1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header & View Controls */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 color="#38bdf8" /> Consumption & Financial Analytics
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Analyze power load profiles, solar offset ratio, and energy costs across custom timeframes
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          
          {/* Timeframe selector */}
          <div style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.2rem'
          }}>
            {(['hourly', 'daily', 'monthly'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                style={{
                  background: timeframe === tf ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                  border: 'none',
                  color: timeframe === tf ? '#38bdf8' : 'var(--text-dim)',
                  fontWeight: timeframe === tf ? 700 : 500,
                  borderRadius: '8px',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {tf === 'hourly' ? '24 Hours' : tf === 'daily' ? '7 Days' : '12 Months'}
              </button>
            ))}
          </div>

          {/* Metric View selector */}
          <div style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.8)',
            borderRadius: '10px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '0.2rem'
          }}>
            <button
              onClick={() => setMetricView('energy')}
              style={{
                background: metricView === 'energy' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
                border: 'none',
                color: metricView === 'energy' ? '#38bdf8' : 'var(--text-dim)',
                fontWeight: 600,
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Energy (kWh)
            </button>
            <button
              onClick={() => setMetricView('cost')}
              style={{
                background: metricView === 'cost' ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                border: 'none',
                color: metricView === 'cost' ? '#34d399' : 'var(--text-dim)',
                fontWeight: 600,
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              Cost ({tariff.currencySymbol})
            </button>
            <button
              onClick={() => setMetricView('co2')}
              style={{
                background: metricView === 'co2' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
                border: 'none',
                color: metricView === 'co2' ? '#fbbf24' : 'var(--text-dim)',
                fontWeight: 600,
                borderRadius: '8px',
                padding: '0.4rem 0.75rem',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              CO₂ (kg)
            </button>
          </div>

        </div>
      </div>

      {/* Metric Summary Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Load (kWh)</span>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>{totalLoad} <span style={{ fontSize: '0.9rem' }}>kWh</span></div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Solar Production</span>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{totalSolar} <span style={{ fontSize: '0.9rem' }}>kWh</span></div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Net Grid Billed</span>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fb7185' }}>{totalGrid} <span style={{ fontSize: '0.9rem' }}>kWh</span></div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Period Cost</span>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>{tariff.currencySymbol}{totalCost}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Carbon Emission</span>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a855f7' }}>{totalCo2} <span style={{ fontSize: '0.9rem' }}>kg</span></div>
        </div>
      </div>

      {/* Main Interactive Recharts Graph */}
      <div className="glass-panel" style={{ padding: '1.5rem', minHeight: '400px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem' }}>
          {metricView === 'energy' ? 'Home Power Demand vs Solar Output' : metricView === 'cost' ? 'Accrued Energy Costs' : 'Carbon Emissions Profile'}
        </h3>

        <div style={{ width: '100%', height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            {metricView === 'energy' ? (
              <AreaChart data={currentDataset} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                <XAxis dataKey="period" stroke="#64748b" style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', borderColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff' }} 
                  labelStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="totalLoadKwh" name="Total Home Load (kWh)" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorLoad)" />
                <Area type="monotone" dataKey="solarGenKwh" name="Solar Gen (kWh)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorSolar)" />
                <Area type="monotone" dataKey="gridUsageKwh" name="Net Grid Billed (kWh)" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#colorGrid)" />
              </AreaChart>
            ) : metricView === 'cost' ? (
              <BarChart data={currentDataset} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                <XAxis dataKey="period" stroke="#64748b" style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', borderColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff' }} 
                />
                <Bar dataKey="costDollars" name={`Cost (${tariff.currencySymbol})`} fill="#34d399" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={currentDataset} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                <XAxis dataKey="period" stroke="#64748b" style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }} />
                <Tooltip 
                  contentStyle={{ background: '#0f172a', borderColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '10px', color: '#fff' }} 
                />
                <Bar dataKey="co2Kg" name="CO₂ Emissions (kg)" fill="#c084fc" radius={[6, 6, 0, 0]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Data Table */}
      <div className="glass-panel" style={{ padding: '1.25rem', overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.75rem' }}>Historical Breakdown Log</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.75rem' }}>Time Period</th>
              <th style={{ padding: '0.75rem' }}>Total Load</th>
              <th style={{ padding: '0.75rem' }}>Solar PV</th>
              <th style={{ padding: '0.75rem' }}>Grid Billed</th>
              <th style={{ padding: '0.75rem' }}>Peak kW</th>
              <th style={{ padding: '0.75rem' }}>Cost ({tariff.currencySymbol})</th>
              <th style={{ padding: '0.75rem' }}>CO₂ Emissions</th>
            </tr>
          </thead>
          <tbody>
            {currentDataset.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'background 0.2s' }}>
                <td className="font-mono" style={{ padding: '0.75rem', color: '#ffffff', fontWeight: 600 }}>{row.period}</td>
                <td className="font-mono" style={{ padding: '0.75rem', color: '#38bdf8' }}>{row.totalLoadKwh} kWh</td>
                <td className="font-mono" style={{ padding: '0.75rem', color: '#f59e0b' }}>{row.solarGenKwh} kWh</td>
                <td className="font-mono" style={{ padding: '0.75rem', color: '#fb7185' }}>{row.gridUsageKwh} kWh</td>
                <td className="font-mono" style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{row.peakDemandKw} kW</td>
                <td className="font-mono" style={{ padding: '0.75rem', color: '#34d399', fontWeight: 700 }}>{tariff.currencySymbol}{row.costDollars.toFixed(2)}</td>
                <td className="font-mono" style={{ padding: '0.75rem', color: '#c084fc' }}>{row.co2Kg} kg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
