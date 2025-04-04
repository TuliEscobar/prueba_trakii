/**
 * Panel de Detalles del Dispositivo - Versión Simplificada
 */

// Elementos del DOM
const mapElement = document.getElementById('map');
const coordinatesElement = document.getElementById('coordinates');
const addressElement = document.getElementById('address');
const lastUpdateElement = document.getElementById('last-update');
const deviceIdElement = document.getElementById('device-id');
const serialNumberElement = document.getElementById('serial-number');
const deviceModelElement = document.getElementById('device-model');
const firmwareElement = document.getElementById('firmware');
const connectionStatusElement = document.getElementById('connection-status');
const batteryLevelElement = document.getElementById('battery-level');
const batteryLevelBarElement = document.getElementById('battery-level-bar');
const batteryStatusElement = document.getElementById('battery-status');
const refreshBtn = document.getElementById('refresh-btn');
const autoUpdateToggle = document.getElementById('auto-update');

// URLs de API
const API_URL = 'http://127.0.0.1:5000';
const LOCATION_JSON_URL = './coordenadas.json';

// Variables globales
let map;
let marker;
let updateTimer = null;

// Inicializar la aplicación
function initApp() {
    // Mostrar mensaje de inicio
    showStatus("Inicializando aplicación...");
    
    // Limpiar datos antiguos estáticos
    deviceIdElement.textContent = "Cargando...";
    serialNumberElement.textContent = "Cargando...";
    deviceModelElement.textContent = "Cargando...";
    firmwareElement.textContent = "Cargando...";
    batteryLevelElement.textContent = "Cargando...";
    batteryStatusElement.textContent = "Cargando...";
    
    // Inicializar mapa
    initMap();
    
    // Cargar datos iniciales
    loadAllData();
    
    // Configurar botones
    refreshBtn.addEventListener('click', loadAllData);
    autoUpdateToggle.addEventListener('change', toggleAutoUpdate);
    
    // Iniciar actualización automática si está activado
    if (autoUpdateToggle.checked) {
        startAutoUpdate();
    }
}

// Inicializar mapa
function initMap() {
    showStatus("Inicializando mapa...");
    
    try {
        // Posición inicial
        const initialPosition = [19.4326, -99.1332];
        
        // Crear mapa
        map = L.map(mapElement).setView(initialPosition, 13);
        
        // Añadir capa de mapa
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        
        // Añadir marcador inicial
        marker = L.marker(initialPosition).addTo(map);
        marker.bindPopup("Cargando datos del dispositivo...").openPopup();
        
        showStatus("Mapa inicializado correctamente");
    } catch (error) {
        showError("Error al inicializar el mapa: " + error.message);
    }
}

// Cargar todos los datos
async function loadAllData() {
    showStatus("Cargando datos...");
    
    try {
        // 1. Obtener nivel de batería 
        let batteryData = null;
        try {
            batteryData = await getBatteryData();
            showStatus("Datos de batería obtenidos: " + JSON.stringify(batteryData));
        } catch (batteryError) {
            showError("Error al obtener batería: " + batteryError.message);
            // Fallback
            batteryData = {
                level: Math.floor(Math.random() * 100),
                status: "normal"
            };
        }
        
        // 2. Obtener información del dispositivo
        let deviceInfo = null;
        try {
            deviceInfo = await getDeviceInfo();
            showStatus("Datos del dispositivo obtenidos: " + JSON.stringify(deviceInfo));
        } catch (deviceError) {
            showError("Error al obtener información del dispositivo: " + deviceError.message);
            // Fallback
            deviceInfo = {
                device_id: "ERROR-ID",
                model: "Sin conexión",
                firmware_version: "N/A",
                status: "Inactive"
            };
        }
        
        // 3. Obtener datos de ubicación
        let locationData = null;
        try {
            locationData = await getLocationData();
            showStatus("Datos de ubicación obtenidos: " + JSON.stringify(locationData));
        } catch (locationError) {
            showError("Error al obtener ubicación: " + locationError.message);
            // Fallback
            locationData = {
                lat: 39.5696,
                lng: 2.6502
            };
        }
        
        // 4. Actualizar la interfaz con todos los datos
        if (deviceInfo) {
            updateDeviceInfo(deviceInfo);
        }
        
        if (batteryData) {
            updateBatteryInfo(batteryData);
        }
        
        if (locationData) {
            updateLocationInfo(locationData);
        }
        
        // 5. Actualizar marca de tiempo
        updateTimestamp();
        
        showStatus("Todos los datos cargados correctamente");
    } catch (error) {
        showError("Error general al cargar datos: " + error.message);
    }
}

// Obtener nivel de batería de la API
async function getBatteryData() {
    try {
        showStatus("Intentando obtener datos de batería desde: " + API_URL + "/battery");
        
        const response = await fetch(`${API_URL}/battery`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const data = await response.json();
        showStatus("Datos de batería recibidos correctamente: " + JSON.stringify(data));
        return data;
    } catch (error) {
        showError("Error al obtener batería: " + error.message);
        // Devolver datos ficticios como fallback
        return {
            level: Math.floor(Math.random() * 100),
            status: "critical",
            timestamp: new Date().toISOString()
        };
    }
}

// Obtener información del dispositivo de la API
async function getDeviceInfo() {
    try {
        showStatus("Intentando obtener información del dispositivo desde: " + API_URL + "/device-info");
        
        const response = await fetch(`${API_URL}/device-info`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const data = await response.json();
        showStatus("Información del dispositivo recibida correctamente: " + JSON.stringify(data));
        return data;
    } catch (error) {
        showError("Error al obtener info del dispositivo: " + error.message);
        // Devolver datos ficticios como fallback
        return {
            device_id: "API-ERROR",
            model: "Error de conexión",
            firmware_version: "N/A",
            status: "Inactive",
            last_report: new Date().toISOString()
        };
    }
}

// Obtener datos de ubicación del JSON
async function getLocationData() {
    showStatus("Intentando obtener ubicación desde: " + LOCATION_JSON_URL);
    
    // Intentar diferentes rutas para el archivo de coordenadas
    const possiblePaths = [
        './Prueba_2/coordenadas.json',
        '../Prueba_2/coordenadas.json',
        'Prueba_2/coordenadas.json',
        '/Prueba_2/coordenadas.json',
        'coordenadas.json'
    ];
    
    // Tratar de usar coordenadas hardcodeadas si todo falla
    const fallbackCoordinates = {
        lat: 39.5696,
        lng: 2.6502
    };
    
    // Intentar acceder a cada posible ruta
    for (const path of possiblePaths) {
        try {
            showStatus(`Probando ruta: ${path}`);
            
            const response = await fetch(path);
            
            if (response.ok) {
                const data = await response.json();
                showStatus(`Éxito obteniendo ubicación desde: ${path}`);
                return data;
            }
        } catch (error) {
            showError(`Fallo al obtener ubicación desde ${path}: ${error.message}`);
        }
    }
    
    // Si todas las rutas fallan, usar valores predeterminados
    showStatus("Usando coordenadas predeterminadas como fallback");
    return fallbackCoordinates;
}

// Actualizar información del dispositivo en la interfaz
function updateDeviceInfo(deviceInfo) {
    if (!deviceInfo) return;
    
    deviceIdElement.textContent = deviceInfo.device_id || "No disponible";
    serialNumberElement.textContent = deviceInfo.device_id || "No disponible";
    deviceModelElement.textContent = deviceInfo.model || "No disponible";
    firmwareElement.textContent = deviceInfo.firmware_version || "No disponible";
    
    // Actualizar estado de conexión
    const isConnected = deviceInfo.status === "Active";
    const statusIndicator = connectionStatusElement.querySelector('.status-indicator');
    const statusText = connectionStatusElement.querySelector('.status-text');
    
    if (isConnected) {
        statusIndicator.className = "status-indicator connected";
        statusText.textContent = "Conectado";
        statusText.className = "status-text text-success";
    } else {
        statusIndicator.className = "status-indicator disconnected";
        statusText.textContent = "Desconectado";
        statusText.className = "status-text text-danger";
    }
}

// Actualizar información de batería en la interfaz
function updateBatteryInfo(batteryData) {
    if (!batteryData) return;
    
    const level = batteryData.level;
    
    // Actualizar texto
    batteryLevelElement.textContent = `${level}%`;
    
    // Actualizar barra de progreso
    batteryLevelBarElement.style.width = `${level}%`;
    
    // Determinar estado y color
    let statusText = "";
    let colorClass = "";
    
    if (batteryData.status === "critical" || level <= 20) {
        statusText = "Crítico";
        colorClass = "bg-danger";
        batteryStatusElement.className = "detail-value text-danger";
    } else if (batteryData.status === "warning" || level <= 40) {
        statusText = "Bajo";
        colorClass = "bg-warning";
        batteryStatusElement.className = "detail-value text-warning";
    } else {
        statusText = "Óptimo";
        colorClass = "bg-success";
        batteryStatusElement.className = "detail-value text-success";
    }
    
    batteryStatusElement.textContent = statusText;
    batteryLevelBarElement.className = `progress-bar ${colorClass}`;
}

// Actualizar información de ubicación en la interfaz
function updateLocationInfo(locationData) {
    if (!locationData || !locationData.lat || !locationData.lng) {
        showStatus("Sin datos de ubicación válidos");
        return;
    }
    
    try {
        const lat = locationData.lat;
        const lng = locationData.lng;
        
        // Actualizar coordenadas en la interfaz
        coordinatesElement.textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        // Actualizar marcador en el mapa
        const newPosition = [lat, lng];
        marker.setLatLng(newPosition);
        map.setView(newPosition, 13);
        
        // Actualizar popup con información básica
        marker.setPopupContent(`
            <b>Ubicación del dispositivo</b><br>
            Latitud: ${lat.toFixed(6)}<br>
            Longitud: ${lng.toFixed(6)}
        `).openPopup();
        
        // Obtener dirección
        getAddress(lat, lng);
        
    } catch (error) {
        showError("Error al actualizar mapa: " + error.message);
    }
}

// Obtener dirección a partir de coordenadas
async function getAddress(lat, lng) {
    try {
        // Mostrar mensaje de carga
        addressElement.innerHTML = `
            <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <span>Obteniendo dirección...</span>
        `;
        
        // URL de API de geocodificación
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
        
        // Solicitud
        const response = await fetch(url, {
            headers: {
                'Accept-Language': 'es',
                'User-Agent': 'TrakiiDeviceMonitor/1.0'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        showStatus("Dirección obtenida");
        
        // Formatear dirección
        let address = "";
        
        if (data.display_name) {
            address = data.display_name.replace(/,/g, "<br>");
        } else if (data.address) {
            const parts = [];
            if (data.address.road) parts.push(data.address.road);
            if (data.address.city || data.address.town) parts.push(data.address.city || data.address.town);
            if (data.address.state) parts.push(data.address.state);
            if (data.address.country) parts.push(data.address.country);
            
            address = parts.join("<br>");
        } else {
            address = "Dirección no disponible";
        }
        
        // Mostrar en la interfaz
        addressElement.innerHTML = address;
        
    } catch (error) {
        showError("Error al obtener dirección: " + error.message);
        addressElement.innerHTML = "<span class='text-danger'>No se pudo obtener la dirección</span>";
    }
}

// Actualizar marca de tiempo
function updateTimestamp() {
    const now = new Date();
    lastUpdateElement.textContent = now.toLocaleTimeString();
}

// Iniciar actualización automática
function startAutoUpdate() {
    if (!updateTimer) {
        updateTimer = setInterval(loadAllData, 10000);
        showStatus("Actualizaciones automáticas iniciadas");
    }
}

// Detener actualización automática
function stopAutoUpdate() {
    if (updateTimer) {
        clearInterval(updateTimer);
        updateTimer = null;
        showStatus("Actualizaciones automáticas detenidas");
    }
}

// Alternar actualización automática
function toggleAutoUpdate() {
    if (autoUpdateToggle.checked) {
        startAutoUpdate();
    } else {
        stopAutoUpdate();
    }
}

// Mostrar mensaje de estado en la consola
function showStatus(message) {
    console.log(`[INFO] ${message}`);
}

// Mostrar error en la consola y en la interfaz si es crítico
function showError(message) {
    console.error(`[ERROR] ${message}`);
    
    // Mostrar error en la interfaz para facilitar la depuración
    const errorBox = document.createElement('div');
    errorBox.className = 'alert alert-danger mt-2';
    errorBox.role = 'alert';
    errorBox.textContent = `Error: ${message}`;
    
    // Añadir botón para cerrar
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'alert');
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.onclick = function() {
        errorBox.remove();
    };
    
    errorBox.appendChild(closeButton);
    
    // Añadir a la página (como primer hijo del contenedor principal)
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(errorBox, container.firstChild);
        
        // Auto eliminar después de 10 segundos
        setTimeout(() => {
            if (errorBox.parentNode) {
                errorBox.remove();
            }
        }, 10000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp); 