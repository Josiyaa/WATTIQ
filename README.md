# ⚡ WattIQ: Intelligent Energy Consumption Analyzer

> **WattIQ** is an ultra-modern, full-stack smart energy telemetry dashboard and microgrid intelligence system. It provides real-time power monitoring, appliance-level tracking, solar PV & battery storage analytics, and AI-driven energy cost optimization recommendations.

---

## 🌟 Key Features

- **⚡ Real-Time Power Telemetry**: Live power load tracking (Watts/kW), grid frequency ($60\text{Hz} \pm 0.05$), grid voltage, battery state of charge (SOC), and Time-of-Use (TOU) tariff tracking.
- **🔌 Smart Appliance Tracker**: Appliance-level power draw (Active vs. Standby), room categorization, smart scheduling, priority tagging, and instant ON/OFF controls.
- **☀️ Solar PV & Battery Microgrid**: Live solar array production ($kWp$), inverter efficiency, battery charging/discharging flows, and daily net export revenue calculations.
- **🤖 AI Energy Advisor**: Smart insights engine detecting high-cost peak charging, heat pump pre-cooling strategies, and phantom standby power waste.
- **📊 Consumption Analytics**: Interactive historical breakdown across Hourly, Daily, and Monthly energy usage with CO₂ footprint metrics.
- **💵 Tariff & Budget Management**: Customizable Time-of-Use (TOU) pricing tiers (Off-Peak, Standard, Peak), flat rates, currency switching (USD $\$$, EUR $€$, GBP $£$), and monthly budget cap warnings.
- **📄 Report Export**: Instant CSV data export & formatted PDF summary generation for energy audits.

---

## 🏗️ Architecture & Stack

### **Frontend**
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Modern Glassmorphism Vanilla CSS Design Tokens
- **Icons**: Lucide React
- **Charts**: Recharts (Area, Bar, Radial & Line Charts)
- **Effects**: Canvas Confetti & Custom Animations

### **Backend**
- **Framework**: Python 3 (Flask + Flask-CORS)
- **Endpoints**: Telemetry API, Smart Appliance CRUD, Solar System State, Tariff Configuration, & AI Recommendations

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+) & npm
- Python 3.10+

---

### 1. Clone the Repository
```bash
git clone https://github.com/Josiyaa/WATTIQ.git
cd WATTIQ
```

---

### 2. Run the Backend API (Flask)
```bash
# Install Python dependencies
pip install -r backend/requirements.txt

# Start Flask Backend Server (http://127.0.0.1:5000)
python backend/app.py
```

---

### 3. Run the Frontend App (React + Vite)
In a new terminal window:
```bash
# Install Node modules
npm install

# Start Vite Development Server (http://localhost:3000)
npm run dev
```

Open your browser and navigate to `http://localhost:3000/`.

---

## 📁 Repository Structure

```
WATTIQ/
├── backend/
│   ├── app.py              # Flask REST API Server
│   ├── requirements.txt    # Python Dependencies
│   └── README.md           # Backend API Documentation
├── src/
│   ├── components/         # React UI Components
│   │   ├── AIAdvisor.tsx
│   │   ├── AddApplianceModal.tsx
│   │   ├── ApplianceTracker.tsx
│   │   ├── ConsumptionAnalytics.tsx
│   │   ├── ExportModal.tsx
│   │   ├── Header.tsx
│   │   ├── RealtimeOverview.tsx
│   │   ├── SolarMicrogrid.tsx
│   │   └── TariffBudgetManager.tsx
│   ├── hooks/
│   │   └── useEnergyData.ts # Custom React Telemetry State Hook
│   ├── services/
│   │   └── api.ts           # REST API Communication Service
│   ├── types/
│   │   └── energy.ts        # TypeScript Interfaces
│   ├── utils/
│   │   └── mockData.ts      # Mock Telemetry Datasets
│   ├── App.tsx             # Main React Application Container
│   ├── index.css           # Glassmorphism Design Tokens & CSS
│   └── main.tsx            # App Entrypoint
├── index.html              # HTML Entry Point
├── package.json            # Node Dependencies & Scripts
├── tsconfig.json           # TypeScript Configuration
├── vite.config.ts          # Vite Config
├── LICENSE                 # MIT License
└── README.md               # Project Documentation
```

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

### 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check out the [issues page](https://github.com/Josiyaa/WATTIQ/issues).
