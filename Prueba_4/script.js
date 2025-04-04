/**
 * Panel de Detalles del Dispositivo
 * Script para mostrar información detallada del dispositivo y su ubicación
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

// API para obtener datos del dispositivo (simulación)
const API_URL = 'http://localhost:5000';

// Configuración
const CONFIG = {
    updateInterval: 10000,  // 10 segundos
    defaultLatLng: [19.4326, -99.1332],  // Ciudad de México
    mapZoom: 13,
    geocodingApis: {
        // Opciones de API para geocodificación inversa
        openStreetMap: 'https://nominatim.openstreetmap.org/reverse',
        positionStack: 'http://api.positionstack.com/v1/reverse'
    },
    apiKey: {
        // API keys (reemplazar con tus propias claves)
        positionStack: 'YOUR_API_KEY'
    }
};

// Variables de estado
let map;
let marker;
let currentPosition = CONFIG.defaultLatLng;
let deviceData = null;
let updateTimer = null;
let isOnline = true;

// Inicializar la aplicación
function initApp() {
    // Inicializar el mapa
    initMap();
    
    // Cargar datos iniciales
    updateDeviceData();
    
    // Iniciar actualizaciones automáticas
    startAutoUpdate();
    
    // Configurar eventos
    setupEventListeners();
}

// Inicializar el mapa con Leaflet
function initMap() {
    // Crear el mapa centrado en la posición por defecto
    map = L.map(mapElement).setView(CONFIG.defaultLatLng, CONFIG.mapZoom);
    
    // Añadir capa de OpenStreetMap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Añadir marcador inicial
    marker = L.marker(CONFIG.defaultLatLng).addTo(map);
    marker.bindPopup("<b>Dispositivo TRAKII-001</b><br>Ubicación actual").openPopup();
}

// Actualizar los datos del dispositivo
async function updateDeviceData() {
    try {
        // Simular una conexión a la API
        if (Math.random() > 0.1) { // 90% de probabilidad de estar online
            isOnline = true;
            
            // Obtener nuevos datos del dispositivo
            deviceData = await fetchDeviceData();
            
            // Actualizar la interfaz con los nuevos datos
            updateUI(deviceData);
            
            // Actualizar el mapa con la nueva posición
            updateMapPosition(deviceData.location.latitude, deviceData.location.longitude);
            
            // Obtener y mostrar la dirección física
            getAddress(deviceData.location.latitude, deviceData.location.longitude);
        } else {
            // Simular dispositivo desconectado
            isOnline = false;
            updateConnectionStatus(false);
        }
        
        // Actualizar la marca de tiempo
        updateTimestamp();
    } catch (error) {
        console.error("Error al actualizar datos:", error);
        
        // Modo fallback: Usar datos aleatorios si la API falla
        simulateRandomData();
    }
}

// Obtener datos del dispositivo (simulación API)
async function fetchDeviceData() {
    // En un escenario real, esta función haría un fetch a tu API
    // Por ahora, simularemos los datos
    
    // Generar variación pequeña en la posición para simular movimiento
    const latVariation = (Math.random() - 0.5) * 0.005;
    const lngVariation = (Math.random() - 0.5) * 0.005;
    
    const lat = CONFIG.defaultLatLng[0] + latVariation;
    const lng = CONFIG.defaultLatLng[1] + lngVariation;
    
    // Simular nivel de batería
    const batteryLevel = Math.floor(Math.random() * 100);
    
    // Datos simulados
    return {
        deviceId: "TRAKII-001",
        serialNumber: "SN-78956423",
        model: "Tracker GPS Pro",
        firmware: "v2.5.3",
        status: "connected",
        battery: {
            level: batteryLevel,
            status: batteryLevel > 40 ? "optimal" : (batteryLevel > 20 ? "low" : "critical")
        },
        location: {
            latitude: lat,
            longitude: lng,
            accuracy: 5 + Math.floor(Math.random() * 10)
        },
        lastUpdate: new Date().toISOString()
    };
}

// Actualizar la interfaz con los nuevos datos
function updateUI(data) {
    // Actualizar información de dispositivo
    deviceIdElement.textContent = data.deviceId;
    serialNumberElement.textContent = data.serialNumber;
    deviceModelElement.textContent = data.model;
    firmwareElement.textContent = data.firmware;
    
    // Actualizar estado de conexión
    updateConnectionStatus(data.status === "connected");
    
    // Actualizar nivel de batería
    updateBatteryInfo(data.battery.level, data.battery.status);
    
    // Actualizar coordenadas
    const lat = data.location.latitude.toFixed(6);
    const lng = data.location.longitude.toFixed(6);
    coordinatesElement.textContent = `${lat}, ${lng}`;
}

// Actualizar estado de conexión
function updateConnectionStatus(isConnected) {
    const statusIndicator = connectionStatusElement.querySelector('.status-indicator');
    const statusText = connectionStatusElement.querySelector('.status-text');
    
    if (isConnected) {
        statusIndicator.className = 'status-indicator connected';
        statusText.textContent = 'Conectado';
        statusText.className = 'status-text text-success';
    } else {
        statusIndicator.className = 'status-indicator disconnected';
        statusText.textContent = 'Desconectado';
        statusText.className = 'status-text text-danger';
    }
}

// Actualizar información de batería
function updateBatteryInfo(level, status) {
    // Actualizar texto de nivel
    batteryLevelElement.textContent = `${level}%`;
    
    // Actualizar barra de progreso
    batteryLevelBarElement.style.width = `${level}%`;
    
    // Actualizar color y texto según nivel
    if (level <= 20) {
        batteryLevelBarElement.className = 'progress-bar bg-danger';
        batteryStatusElement.textContent = 'Crítico';
        batteryStatusElement.className = 'detail-value text-danger';
    } else if (level <= 40) {
        batteryLevelBarElement.className = 'progress-bar bg-warning';
        batteryStatusElement.textContent = 'Bajo';
        batteryStatusElement.className = 'detail-value text-warning';
    } else {
        batteryLevelBarElement.className = 'progress-bar bg-success';
        batteryStatusElement.textContent = 'Óptimo';
        batteryStatusElement.className = 'detail-value text-success';
    }
}

// Actualizar posición en el mapa
function updateMapPosition(lat, lng) {
    // Guardar posición actual
    currentPosition = [lat, lng];
    
    // Actualizar posición del marcador
    marker.setLatLng(currentPosition);
    
    // Centrar el mapa en la nueva posición
    map.setView(currentPosition, CONFIG.mapZoom);
    
    // Actualizar popup del marcador
    marker.setPopupContent(`
        <b>Dispositivo ${deviceData.deviceId}</b><br>
        Latitud: ${lat.toFixed(6)}<br>
        Longitud: ${lng.toFixed(6)}<br>
        Precisión: ${deviceData.location.accuracy}m
    `);
}

// Obtener dirección a partir de coordenadas (geocodificación inversa)
async function getAddress(lat, lng) {
    try {
        // Mostrar estado de carga
        showAddressLoading();
        
        // Intentar obtener la dirección usando OpenStreetMap (Nominatim)
        const url = `${CONFIG.geocodingApis.openStreetMap}?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
        
        const response = await fetch(url, {
            headers: {
                'Accept-Language': 'es', // Solicitar respuesta en español
                'User-Agent': 'TrakiiDeviceMonitor/1.0' // Identificación para Nominatim
            }
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Formatear y mostrar la dirección
        const address = formatAddress(data);
        showAddress(address);
        
    } catch (error) {
        console.error("Error al obtener la dirección:", error);
        showAddressError();
    }
}

// Formatear objeto de dirección de Nominatim
function formatAddress(data) {
    // Si no hay datos, mostrar mensaje genérico
    if (!data || !data.address) {
        return "Dirección no disponible";
    }
    
    // Extraer componentes de la dirección
    const {
        road, 
        house_number, 
        neighbourhood, 
        suburb,
        city, 
        town,
        state, 
        postcode, 
        country
    } = data.address;
    
    // Construir dirección formateada
    let formattedAddress = '';
    
    // Línea 1: Calle y número
    if (road) {
        formattedAddress += road;
        if (house_number) formattedAddress += ` ${house_number}`;
        formattedAddress += '<br>';
    }
    
    // Línea 2: Colonia/Barrio
    if (neighbourhood || suburb) {
        formattedAddress += `Col. ${neighbourhood || suburb}<br>`;
    }
    
    // Línea 3: Ciudad/Municipio, Estado, CP
    if (city || town) {
        formattedAddress += city || town;
        if (state) formattedAddress += `, ${state}`;
        if (postcode) formattedAddress += ` C.P. ${postcode}`;
        formattedAddress += '<br>';
    } else if (state) {
        formattedAddress += `${state}`;
        if (postcode) formattedAddress += ` C.P. ${postcode}`;
        formattedAddress += '<br>';
    }
    
    // Línea 4: País
    if (country) {
        formattedAddress += country;
    }
    
    return formattedAddress || "Dirección no disponible";
}

// Mostrar estado de carga para la dirección
function showAddressLoading() {
    addressElement.innerHTML = `
        <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
        </div>
        <span>Obteniendo dirección...</span>
    `;
}

// Mostrar dirección obtenida
function showAddress(address) {
    addressElement.innerHTML = address;
}

// Mostrar error al obtener dirección
function showAddressError() {
    addressElement.innerHTML = `
        <span class="text-danger">No se pudo obtener la dirección</span>
    `;
}

// Actualizar marca de tiempo
function updateTimestamp() {
    const now = new Date();
    lastUpdateElement.textContent = now.toLocaleTimeString();
}

// Simular datos aleatorios (fallback)
function simulateRandomData() {
    // Crear datos simulados
    const randomData = {
        deviceId: "TRAKII-001",
        serialNumber: "SN-78956423",
        model: "Tracker GPS Pro",
        firmware: "v2.5.3",
        status: Math.random() > 0.3 ? "connected" : "disconnected",
        battery: {
            level: Math.floor(Math.random() * 100),
            status: "unknown"
        },
        location: {
            latitude: CONFIG.defaultLatLng[0] + (Math.random() - 0.5) * 0.01,
            longitude: CONFIG.defaultLatLng[1] + (Math.random() - 0.5) * 0.01,
            accuracy: 10 + Math.floor(Math.random() * 20)
        },
        lastUpdate: new Date().toISOString()
    };
    
    // Determinar estado de batería
    randomData.battery.status = randomData.battery.level > 40 
        ? "optimal" 
        : (randomData.battery.level > 20 ? "low" : "critical");
    
    // Actualizar la interfaz con los datos aleatorios
    updateUI(randomData);
    
    // Actualizar el mapa
    updateMapPosition(randomData.location.latitude, randomData.location.longitude);
    
    // Intentar obtener la dirección
    getAddress(randomData.location.latitude, randomData.location.longitude);
    
    // Guardar los datos
    deviceData = randomData;
}

// Configurar eventos de la interfaz
function setupEventListeners() {
    // Botón de actualización manual
    refreshBtn.addEventListener('click', () => {
        updateDeviceData();
    });
    
    // Toggle de actualización automática
    autoUpdateToggle.addEventListener('change', () => {
        if (autoUpdateToggle.checked) {
            startAutoUpdate();
        } else {
            stopAutoUpdate();
        }
    });
}

// Iniciar actualizaciones automáticas
function startAutoUpdate() {
    if (!updateTimer) {
        updateTimer = setInterval(() => {
            updateDeviceData();
        }, CONFIG.updateInterval);
    }
}

// Detener actualizaciones automáticas
function stopAutoUpdate() {
    if (updateTimer) {
        clearInterval(updateTimer);
        updateTimer = null;
    }
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initApp); 