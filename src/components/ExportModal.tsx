import React from 'react';
import { X, Download, Printer, FileText, CheckCircle, ShieldCheck } from 'lucide-react';
import { TariffSchedule, SolarSystemState, HistoricalPoint } from '../types/energy';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  tariff: TariffSchedule;
  solarState: SolarSystemState;
  estimatedMonthlyBill: number;
  carbonStats: { co2Kg: number; treesRequired: number; monthlyKwh: number };
  dailyData: HistoricalPoint[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  tariff,
  solarState,
  estimatedMonthlyBill,
  carbonStats,
  dailyData
}) => {
  if (!isOpen) return null;

  const handleDownloadCsv = () => {
    const headers = ['Period', 'TotalLoadKwh', 'SolarGenKwh', 'GridUsageKwh', 'CostDollars', 'Co2Kg'];
    const rows = dailyData.map(d => [
      d.period,
      d.totalLoadKwh,
      d.solarGenKwh,
      d.gridUsageKwh,
      d.costDollars,
      d.co2Kg
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `voltpulse_energy_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', padding: '1.75rem', position: 'relative' }}>
        
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            color: '#ffffff',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.15)', padding: '0.65rem', borderRadius: '12px' }}>
            <FileText size={24} color="#38bdf8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>VoltPulse Energy Executive Audit</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Generate verified CSV logs or print high-level summary report</p>
          </div>
        </div>

        {/* Report Preview Card */}
        <div style={{ background: 'rgba(7, 9, 19, 0.8)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '0.75rem', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Report Timestamp</span>
            <span className="font-mono" style={{ color: '#ffffff', fontWeight: 600 }}>{new Date().toLocaleString()}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Est. Monthly Electricity Bill</span>
              <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>
                {tariff.currencySymbol}{estimatedMonthlyBill.toFixed(2)}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Solar PV Capacity</span>
              <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>
                {solarState.capacityKw} kWp
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Monthly Energy Volume</span>
              <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>
                {carbonStats.monthlyKwh} kWh
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Carbon Reduction</span>
              <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#c084fc' }}>
                {carbonStats.co2Kg} kg CO₂
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button className="btn-secondary" onClick={handlePrint}>
            <Printer size={16} /> Print Report
          </button>
          <button className="btn-primary" onClick={handleDownloadCsv}>
            <Download size={16} /> Download CSV Data
          </button>
        </div>

      </div>
    </div>
  );
};
