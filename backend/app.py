import time
import random
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing for React frontend

# --- INITIAL IN-MEMORY DATA STORE ---
APPLIANCES = [
  {
    "id": "app-hvac",
    "name": "Smart Inverter Heat Pump",
    "category": "Living Room",
    "powerWatts": 2200,
    "isOn": True,
    "isSmartSchedule": True,
    "scheduleTime": "16:00 - 22:00 (Pre-cool)",
    "dailyAvgHours": 6.5,
    "iconName": "Wind",
    "priority": "Essential",
    "standbyWatts": 12,
    "monthlyCostEstimate": 78.50
  },
  {
    "id": "app-ev",
    "name": "Level 2 EV Charger (7.2kW)",
    "category": "Garage & EV",
    "powerWatts": 7200,
    "isOn": False,
    "isSmartSchedule": True,
    "scheduleTime": "00:00 - 05:00 (Super Off-Peak)",
    "dailyAvgHours": 2.5,
    "iconName": "Car",
    "priority": "High-Load",
    "standbyWatts": 8,
    "monthlyCostEstimate": 92.00
  },
  {
    "id": "app-fridge",
    "name": "Sub-Zero Smart Refrigerator",
    "category": "Kitchen",
    "powerWatts": 180,
    "isOn": True,
    "isSmartSchedule": False,
    "dailyAvgHours": 24.0,
    "iconName": "Refrigerator",
    "priority": "Essential",
    "standbyWatts": 180,
    "monthlyCostEstimate": 18.20
  },
  {
    "id": "app-workstation",
    "name": "AI Workstation & Quad Monitors",
    "category": "Home Office",
    "powerWatts": 650,
    "isOn": True,
    "isSmartSchedule": False,
    "dailyAvgHours": 8.0,
    "iconName": "Monitor",
    "priority": "Flexible",
    "standbyWatts": 15,
    "monthlyCostEstimate": 22.40
  },
  {
    "id": "app-washer",
    "name": "Eco-Steam Washer & Dryer",
    "category": "Utility Room",
    "powerWatts": 1400,
    "isOn": False,
    "isSmartSchedule": True,
    "scheduleTime": "11:00 - 14:00 (Solar Peak)",
    "dailyAvgHours": 1.2,
    "iconName": "WashingMachine",
    "priority": "Flexible",
    "standbyWatts": 4,
    "monthlyCostEstimate": 14.30
  },
  {
    "id": "app-pool",
    "name": "Variable Speed Pool Pump",
    "category": "Outdoor",
    "powerWatts": 1100,
    "isOn": True,
    "isSmartSchedule": True,
    "scheduleTime": "10:00 - 16:00",
    "dailyAvgHours": 6.0,
    "iconName": "Waves",
    "priority": "High-Load",
    "standbyWatts": 2,
    "monthlyCostEstimate": 35.80
  }
]

TARIFF = {
  "currencySymbol": "$",
  "currencyCode": "USD",
  "flatRate": 0.16,
  "useTou": True,
  "offPeakRate": 0.09,
  "standardRate": 0.16,
  "peakRate": 0.28,
  "offPeakHours": "23:00 - 07:00",
  "peakHours": "16:00 - 21:00",
  "monthlyBudget": 240.00
}

SOLAR_STATE = {
  "capacityKw": 8.5,
  "currentGenWatts": 4850,
  "dailyGenKwh": 34.2,
  "efficiencyPercent": 96.4,
  "batteryCapacityKwh": 13.5,
  "batterySocPercent": 82.0,
  "batteryHealthPercent": 98.5,
  "isBatteryDischarging": False,
  "netExportRevenueToday": 4.12
}

AI_INSIGHTS = [
  {
    "id": "ins-1",
    "title": "Shift Level 2 EV Charging to Off-Peak",
    "description": "EV Charging is active during standard rate hours ($0.16/kWh). Delaying charge to 23:00 ($0.09/kWh) saves $28.40/mo.",
    "type": "savings",
    "impact": "High",
    "estimatedMonthlySavings": 28.40,
    "actionText": "Schedule 23:00 Charge",
    "actionType": "adjust_schedule",
    "targetApplianceId": "app-ev"
  },
  {
    "id": "ins-2",
    "title": "Heat Pump Pre-Cooling Strategy",
    "description": "Utilize excess Solar production between 12:00 and 15:00 to pre-cool living areas before TOU Peak rates begin.",
    "type": "solar",
    "impact": "High",
    "estimatedMonthlySavings": 19.50,
    "actionText": "Enable Solar Sync",
    "actionType": "toggle_appliance",
    "targetApplianceId": "app-hvac"
  },
  {
    "id": "ins-3",
    "title": "Phantom Standby Load Detected",
    "description": "3 connected devices draw 45W continuous standby power when off ($5.80/mo wasted).",
    "type": "efficiency",
    "impact": "Low",
    "estimatedMonthlySavings": 5.80,
    "actionText": "Optimize Standby",
    "actionType": "view_solar"
  }
]

# --- API ENDPOINTS ---

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "WattIQ: Intelligent Energy Consumption Analyzer Backend API",
        "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
    })

@app.route('/api/telemetry', methods=['GET'])
def get_telemetry():
    # Calculate live home load based on active appliances
    total_home_load = sum(
        app['powerWatts'] if app['isOn'] else app['standbyWatts']
        for app in APPLIANCES
    )
    
    # Add minor noise for live realism
    solar_gen = max(0, int(SOLAR_STATE['currentGenWatts'] + random.uniform(-100, 100)))
    net_balance = total_home_load - solar_gen
    
    grid_import = max(0, net_balance)
    battery_flow = abs(net_balance) if net_balance < 0 else 0
    
    hour = int(time.strftime('%H'))
    tou_tier = "Standard"
    rate = TARIFF['standardRate']
    
    if TARIFF['useTou']:
        if 16 <= hour < 21:
            tou_tier = "Peak"
            rate = TARIFF['peakRate']
        elif hour >= 23 or hour < 7:
            tou_tier = "Off-Peak"
            rate = TARIFF['offPeakRate']

    return jsonify({
        "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        "timeLabel": time.strftime('%I:%M:%S %p'),
        "homeLoadWatts": total_home_load,
        "solarGenWatts": solar_gen,
        "gridImportWatts": grid_import,
        "batteryFlowWatts": battery_flow,
        "batterySocPercent": SOLAR_STATE['batterySocPercent'],
        "costRate": rate,
        "touTier": tou_tier,
        "gridVoltage": round(120.0 + random.uniform(-0.4, 0.4), 1),
        "gridFrequency": round(60.0 + random.uniform(-0.03, 0.03), 2)
    })

@app.route('/api/appliances', methods=['GET'])
def get_appliances():
    return jsonify(APPLIANCES)

@app.route('/api/appliances', methods=['POST'])
def add_appliance():
    data = request.json or {}
    new_app = {
        "id": f"app-custom-{int(time.time() * 1000)}",
        "name": data.get("name", "New Smart Appliance"),
        "category": data.get("category", "Living Room"),
        "powerWatts": data.get("powerWatts", 300),
        "isOn": data.get("isOn", False),
        "isSmartSchedule": data.get("isSmartSchedule", False),
        "scheduleTime": data.get("scheduleTime"),
        "dailyAvgHours": data.get("dailyAvgHours", 4.0),
        "iconName": data.get("iconName", "Zap"),
        "priority": data.get("priority", "Flexible"),
        "standbyWatts": data.get("standbyWatts", 5),
        "monthlyCostEstimate": round((data.get("powerWatts", 300) / 1000) * data.get("dailyAvgHours", 4.0) * 30 * TARIFF['standardRate'], 2)
    }
    APPLIANCES.append(new_app)
    return jsonify({"success": True, "appliance": new_app})

@app.route('/api/appliances/<app_id>/toggle', methods=['POST'])
def toggle_appliance(app_id):
    for app in APPLIANCES:
        if app['id'] == app_id:
            app['isOn'] = not app['isOn']
            return jsonify({"success": True, "appliance": app})
    return jsonify({"success": False, "error": "Appliance not found"}), 404

@app.route('/api/appliances/<app_id>', methods=['DELETE'])
def delete_appliance(app_id):
    global APPLIANCES
    APPLIANCES = [a for a in APPLIANCES if a['id'] != app_id]
    return jsonify({"success": True, "id": app_id})

@app.route('/api/solar', methods=['GET'])
def get_solar_state():
    return jsonify(SOLAR_STATE)

@app.route('/api/tariff', methods=['GET', 'POST'])
def handle_tariff():
    global TARIFF
    if request.method == 'POST':
        data = request.json or {}
        TARIFF.update(data)
        return jsonify({"success": True, "tariff": TARIFF})
    return jsonify(TARIFF)

@app.route('/api/insights', methods=['GET'])
def get_insights():
    return jsonify(AI_INSIGHTS)

if __name__ == '__main__':
    print("[INFO] Starting WattIQ: Intelligent Energy Consumption Analyzer Backend API on http://127.0.0.1:5000 ...")
    app.run(host='0.0.0.0', port=5000, debug=True)
