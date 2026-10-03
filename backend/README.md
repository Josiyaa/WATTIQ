# WattIQ: Intelligent Energy Consumption Analyzer - Flask Backend

This is the backend REST API server for **WattIQ: Intelligent Energy Consumption Analyzer**.

## Features & Endpoints
- **Health Check**: `GET /api/health`
- **Real-Time Telemetry**: `GET /api/telemetry`
- **Smart Appliances CRUD**:
  - `GET /api/appliances`
  - `POST /api/appliances`
  - `POST /api/appliances/<id>/toggle`
  - `DELETE /api/appliances/<id>`
- **Solar PV & Storage Microgrid**: `GET /api/solar`
- **Tariff & Budget Settings**: `GET /api/tariff` & `POST /api/tariff`
- **AI Insights & Recommendations**: `GET /api/insights`

## Setup & Running

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Backend API Server**:
   ```bash
   python app.py
   ```
   The backend server will run on `http://127.0.0.1:5000`.
