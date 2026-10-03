import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Trash2, 
  Power, 
  Clock, 
  Search, 
  Filter,
  Wind,
  Zap,
  Flame,
  Monitor,
  Shirt,
  Tv,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import { Appliance, RoomCategory, TariffSchedule } from '../types/energy';

interface ApplianceTrackerProps {
  appliances: Appliance[];
  onToggleAppliance: (id: string) => void;
  onDeleteAppliance: (id: string) => void;
  onOpenAddModal: () => void;
  tariff: TariffSchedule;
}

export const ApplianceTracker: React.FC<ApplianceTrackerProps> = ({
  appliances,
  onToggleAppliance,
  onDeleteAppliance,
  onOpenAddModal,
  tariff
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Living Room', 'Kitchen', 'Garage & EV', 'Utility Room', 'Home Office'];

  const filteredAppliances = appliances.filter(app => {
    const matchesCat = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getApplianceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wind': return <Wind size={22} color="#38bdf8" />;
      case 'Zap': return <Zap size={22} color="#f59e0b" />;
      case 'Flame': return <Flame size={22} color="#fb7185" />;
      case 'Monitor': return <Monitor size={22} color="#a855f7" />;
      case 'Shirt': return <Shirt size={22} color="#34d399" />;
      case 'Tv': return <Tv size={22} color="#38bdf8" />;
      case 'Lightbulb': return <Lightbulb size={22} color="#fbbf24" />;
      default: return <Zap size={22} color="#38bdf8" />;
    }
  };

  const totalActiveWatts = appliances.filter(a => a.isOn).reduce((sum, a) => sum + a.powerWatts, 0);
  const totalStandbyWatts = appliances.filter(a => !a.isOn).reduce((sum, a) => sum + a.standbyWatts, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Top Banner & Action */}
      <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders color="#38bdf8" /> Smart Appliance Control & Loads
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Monitor real-time wattage, toggle load states, set smart schedules, and prevent vampire standby draw
          </p>
        </div>

        <button className="btn-primary" onClick={onOpenAddModal}>
          <Plus size={18} /> Register Smart Appliance
        </button>
      </div>

      {/* Quick Summary Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Load Power</span>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>
            {totalActiveWatts} <span style={{ fontSize: '0.9rem' }}>W</span>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vampire Standby Draw</span>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24' }}>
            {totalStandbyWatts} <span style={{ fontSize: '0.9rem' }}>W</span>
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active Devices</span>
          <div className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>
            {appliances.filter(a => a.isOn).length} / {appliances.length}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Category pills */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: selectedCategory === cat ? 'linear-gradient(135deg, rgba(2, 132, 199, 0.8) 0%, rgba(14, 165, 233, 0.8) 100%)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)',
                fontWeight: selectedCategory === cat ? 700 : 500,
                fontSize: '0.8rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', width: '240px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search appliance..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem 0.5rem 2.2rem',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(15, 23, 42, 0.8)',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>

      </div>

      {/* Appliances Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {filteredAppliances.map(app => (
          <div 
            key={app.id} 
            className="glass-panel" 
            style={{
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1rem',
              borderColor: app.isOn ? 'rgba(56, 189, 248, 0.3)' : 'rgba(255, 255, 255, 0.08)',
              boxShadow: app.isOn ? '0 10px 25px -5px rgba(2, 132, 199, 0.25)' : 'none'
            }}
          >
            {/* Header: Icon, Name & Category */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    background: app.isOn ? 'rgba(56, 189, 248, 0.15)' : 'rgba(100, 116, 139, 0.15)',
                    padding: '0.65rem',
                    borderRadius: '12px',
                    border: '1px solid ' + (app.isOn ? 'rgba(56, 189, 248, 0.3)' : 'transparent')
                  }}>
                    {getApplianceIcon(app.iconName)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>{app.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{app.category}</span>
                  </div>
                </div>

                {/* Toggle Switch */}
                <label className="switch" title={app.isOn ? 'Turn Appliance Off' : 'Turn Appliance On'}>
                  <input 
                    type="checkbox" 
                    checked={app.isOn} 
                    onChange={() => onToggleAppliance(app.id)} 
                  />
                  <span className="slider"></span>
                </label>
              </div>

              {/* Status Stats */}
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Power Draw</span>
                  <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 800, color: app.isOn ? '#38bdf8' : 'var(--text-dim)' }}>
                    {app.isOn ? app.powerWatts : app.standbyWatts} <span style={{ fontSize: '0.85rem' }}>W</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Est. Monthly</span>
                  <div className="font-mono" style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>
                    {tariff.currencySymbol}{app.monthlyCostEstimate.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer: Priority & Delete */}
            <div style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              paddingTop: '0.75rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.75rem'
            }}>
              <span className={`badge ${app.priority === 'Essential' ? 'badge-cyan' : app.priority === 'High-Load' ? 'badge-rose' : 'badge-emerald'}`}>
                {app.priority}
              </span>

              {app.isSmartSchedule && (
                <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Clock size={13} /> {app.scheduleTime || 'Scheduled'}
                </span>
              )}

              <button
                onClick={() => onDeleteAppliance(app.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-dim)',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  transition: 'color 0.2s'
                }}
                title="Remove Appliance"
              >
                <Trash2 size={15} hover-color="#fb7185" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
