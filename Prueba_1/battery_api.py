from flask import Flask, jsonify
from flask_cors import CORS
from Prueba_1_trakii import get_battery_level

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

@app.route('/battery', methods=['GET'])
def battery():
    """Devuelve el nivel actual de batería del dispositivo"""
    level = get_battery_level()
    return jsonify({
        'level': level,
        'status': 'critical' if level < 20 else ('warning' if level < 40 else 'normal'),
        'timestamp': __import__('datetime').datetime.now().isoformat()
    })

@app.route('/device-info', methods=['GET'])
def device_info():
    """Devuelve información básica del dispositivo"""
    return jsonify({
        'device_id': 'TRAKII-001',
        'model': 'Tracker GPS Pro',
        'firmware_version': '1.2.5',
        'status': 'Active',
        'last_report': __import__('datetime').datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("Iniciando API de batería en http://localhost:5000")
    print("- GET /battery para obtener el nivel de batería")
    print("- GET /device-info para obtener información del dispositivo")
    app.run(debug=True) 