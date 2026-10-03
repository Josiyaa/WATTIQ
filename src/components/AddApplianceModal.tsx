import React, { useState } from 'react';
import { X, Plus, Sliders, Zap } from 'lucide-react';
import { Appliance, RoomCategory } from '../types/energy';

interface AddApplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppliance: (app: Omit<Appliance, 'id' | 'monthlyCostEstimate'>) => void;
}

export const AddApplianceModal: React.FC<AddApplianceModalProps> = ({
  isOpen,
  onClose,
  onAddAppliance
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<RoomCategory>('Living Room');
  const [powerWatts, setPowerWatts] = useState<number>(350);
  const [standbyWatts, setStandbyWatts] = useState<number>(5);
  const [dailyAvgHours, setDailyAvgHours] = useState<number>(4);
  const [priority, setPriority] = useState<'Essential' | 'Flexible' | 'High-Load'>('Flexible');
  const [iconName, setIconName] = useState<string>('Zap');
  const [isSmartSchedule, setIsSmartSchedule] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddAppliance({
      name,
      category,
      powerWatts,
      standbyWatts,
      dailyAvgHours,
      priority,
      iconName,
      isOn: true,
      isSmartSchedule,
      scheduleTime: isSmartSchedule ? '08:00 - 20:00' : undefined
    });

    // reset
    setName('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', padding: '1.75rem', position: 'relative' }}>
        
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
            <Sliders size={24} color="#38bdf8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>Register Smart Appliance</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Add device to VoltPulse real-time load tracker</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Device Name</label>
            <input 
              type="text" 
              placeholder="e.g. Induction Cooktop, Espresso Machine" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(7, 9, 19, 0.8)',
                color: '#ffffff',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Room / Zone</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RoomCategory)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(7, 9, 19, 0.8)',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              >
                <option value="Living Room">Living Room</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Master Bedroom">Master Bedroom</option>
                <option value="Home Office">Home Office</option>
                <option value="Garage & EV">Garage & EV</option>
                <option value="Utility Room">Utility Room</option>
                <option value="Outdoor">Outdoor</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Load Rating (Watts)</label>
              <input 
                type="number" 
                min="5" 
                max="12000"
                value={powerWatts}
                onChange={(e) => setPowerWatts(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(7, 9, 19, 0.8)',
                  color: '#38bdf8',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Standby Draw (Watts)</label>
              <input 
                type="number" 
                min="0" 
                max="200"
                value={standbyWatts}
                onChange={(e) => setStandbyWatts(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(7, 9, 19, 0.8)',
                  color: '#fbbf24',
                  fontFamily: 'JetBrains Mono',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>Priority Classification</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(7, 9, 19, 0.8)',
                  color: '#ffffff',
                  fontSize: '0.85rem'
                }}
              >
                <option value="Essential">Essential</option>
                <option value="Flexible">Flexible</option>
                <option value="High-Load">High-Load</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">
              <Plus size={16} /> Register Appliance
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
