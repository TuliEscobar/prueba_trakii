/**
 * Panel de Detalles del Dispositivo - Versión para Windows
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

// Coordenadas de Mallorca - Definidas en un solo lugar y reutilizadas
const COORDS = {
    lat: 39.5696,
    lng: 2.6502
};

// Variables globales
let map;
let marker;
let updateTimer = null;

// Inicializar la aplicación
async function initApp() {
    // Limpiar contenido antiguo
    clearInterface();
    
    // Inicializar mapa con las coordenadas de Mallorca
    initMap(COORDS);
    
    // Probar conexión con la API
    const apiStatus = await testApiConnection();
    if (!apiStatus) {
        showErrorPanel("No se pudo conectar con la API. Asegúrate de que battery_api.py y prueba_1_trakii.py están en ejecución.");
        return;
    }
    
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

// Limpiar la interfaz para nuevos datos
function clearInterface() {
    deviceIdElement.textContent = "Cargando...";
    serialNumberElement.textContent = "Cargando...";
    deviceModelElement.textContent = "Cargando...";
    firmwareElement.textContent = "Cargando...";
    batteryLevelElement.textContent = "Cargando...";
    batteryStatusElement.textContent = "Cargando...";
    coordinatesElement.textContent = "Cargando...";
    addressElement.innerHTML = `
        <div class="spinner-border spinner-border-sm text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
        </div>
        <span>Obteniendo dirección...</span>
    `;
}

// Inicializar mapa
function initMap(coordinates) {
    console.log("Inicializando mapa...");
    
    try {
        // Posición inicial desde las coordenadas proporcionadas
        const initialPosition = [coordinates.lat, coordinates.lng];
        
        // Crear mapa
        map = L.map(mapElement).setView(initialPosition, 13);
        
        // Añadir capa de mapa
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
        
        // Añadir marcador inicial
        marker = L.marker(initialPosition).addTo(map);
        marker.bindPopup("Cargando datos del dispositivo...").openPopup();
        
        console.log("Mapa inicializado correctamente con coordenadas:", coordinates);
    } catch (error) {
        console.error("Error al inicializar el mapa:", error);
        showErrorPanel("Error al inicializar el mapa: " + error.message);
    }
}

// Probar conexión a la API
async function testApiConnection() {
    try {
        console.log("Probando conexión a la API...");
        
        const response = await fetch(`${API_URL}/battery`, { 
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            mode: 'cors',
            cache: 'no-cache'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        // Si llegamos aquí, la conexión fue exitosa
        console.log("Conexión a la API establecida correctamente");
        return true;
    } catch (error) {
        console.error("Error al conectar con la API:", error);
        return false;
    }
}

// Cargar todos los datos
async function loadAllData() {
    console.log("-------------- INICIO DE CARGA DE DATOS --------------");
    console.log("API URL:", API_URL);
    console.log("Coordenadas:", COORDS);
    
    let hasErrors = false;
    
    try {
        // 1. Verificar que la API está disponible
        const apiTest = await testApiConnection();
        if (!apiTest) {
            console.error("API no disponible, no se continuará con la carga de datos");
            showErrorPanel("La API no está respondiendo. Asegúrate de que battery_api.py está en ejecución en http://127.0.0.1:5000");
            return;
        }
        
        // 2. Obtener información del dispositivo
        console.log("Solicitando información del dispositivo...");
        const deviceInfo = await getDeviceInfo();
        if (deviceInfo) {
            console.log("Información del dispositivo recibida:", deviceInfo);
            updateDeviceInfo(deviceInfo);
        } else {
            console.error("No se recibió información del dispositivo");
            hasErrors = true;
        }
        
        // 3. Obtener nivel de batería
        console.log("Solicitando información de batería...");
        const batteryData = await getBatteryData();
        if (batteryData) {
            console.log("Datos de batería recibidos:", batteryData);
            updateBatteryInfo(batteryData);
        } else {
            console.error("No se recibieron datos de batería");
            hasErrors = true;
        }
        
        // 4. Usar las coordenadas definidas al inicio
        console.log("Usando coordenadas de Mallorca");
        updateLocationInfo(COORDS);
        
        // 5. Actualizar marca de tiempo
        updateTimestamp();
        
        // 6. Mostrar errores si los hubo
        if (hasErrors) {
            showErrorPanel("Se produjeron algunos errores al cargar los datos. Revisa la consola para más detalles.");
        }
        
        console.log("-------------- FIN DE CARGA DE DATOS --------------");
    } catch (error) {
        console.error("Error general al cargar datos:", error);
        showErrorPanel("Error al cargar datos: " + error.message);
    }
}

// Obtener información del dispositivo
async function getDeviceInfo() {
    try {
        console.log("Obteniendo información del dispositivo desde:", API_URL + "/device-info");
        
        const response = await fetch(`${API_URL}/device-info`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Información del dispositivo recibida:", data);
        return data;
    } catch (error) {
        console.error("Error al obtener información del dispositivo:", error);
        return null;
    }
}

// Obtener datos de batería
async function getBatteryData() {
    try {
        console.log("Obteniendo nivel de batería desde:", API_URL + "/battery");
        
        const response = await fetch(`${API_URL}/battery`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Datos de batería recibidos:", data);
        return data;
    } catch (error) {
        console.error("Error al obtener nivel de batería:", error);
        return null;
    }
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
    
    // Verificar que el nivel de batería sea un número
    const level = parseInt(batteryData.level);
    if (isNaN(level)) {
        console.error("Nivel de batería no válido:", batteryData.level);
        return;
    }
    
    // Actualizar texto
    batteryLevelElement.textContent = `${level}%`;
    
    // Actualizar barra de progreso
    batteryLevelBarElement.style.width = `${level}%`;
    
    // Determinar estado y color basado en el status de la API
    let statusText = "";
    let colorClass = "";
    
    // Usar directamente el estado que viene de la API
    switch(batteryData.status) {
        case "critical":
            statusText = "Crítico";
            colorClass = "bg-danger";
            batteryStatusElement.className = "detail-value text-danger";
            break;
        case "warning":
            statusText = "Bajo";
            colorClass = "bg-warning";
            batteryStatusElement.className = "detail-value text-warning";
            break;
        case "normal":
            statusText = "Óptimo";
            colorClass = "bg-success";
            batteryStatusElement.className = "detail-value text-success";
            break;
        default:
            // Fallback para estado desconocido
            statusText = "Desconocido";
            colorClass = "bg-secondary";
            batteryStatusElement.className = "detail-value text-secondary";
    }
    
    batteryStatusElement.textContent = statusText;
    batteryLevelBarElement.className = `progress-bar ${colorClass}`;
}

// Actualizar información de ubicación en la interfaz
function updateLocationInfo(locationData) {
    if (!locationData || !locationData.lat || !locationData.lng) {
        console.error("Datos de ubicación inválidos:", locationData);
        return;
    }
    
    try {
        // Generar una pequeña variación aleatoria en las coordenadas (simular movimiento)
        const variation = 0.002; // Aproximadamente 200 metros
        const randomLat = locationData.lat + (Math.random() - 0.5) * variation;
        const randomLng = locationData.lng + (Math.random() - 0.5) * variation;
        
        // Crear objeto con coordenadas ligeramente alteradas
        const variedLocation = {
            lat: randomLat,
            lng: randomLng,
            originalLat: locationData.lat,
            originalLng: locationData.lng
        };
        
        console.log("Coordenadas originales:", locationData.lat.toFixed(6), locationData.lng.toFixed(6));
        console.log("Coordenadas variadas:", randomLat.toFixed(6), randomLng.toFixed(6));
        
        // Actualizar coordenadas en la interfaz
        coordinatesElement.textContent = `${randomLat.toFixed(6)}, ${randomLng.toFixed(6)}`;
        
        // Actualizar marcador en el mapa
        const newPosition = [randomLat, randomLng];
        marker.setLatLng(newPosition);
        map.setView(newPosition, 13);
        
        // Actualizar popup con información
        marker.setPopupContent(`
            <b>Ubicación del dispositivo</b><br>
            Latitud: ${randomLat.toFixed(6)}<br>
            Longitud: ${randomLng.toFixed(6)}<br>
        `).openPopup();
        
        // Obtener dirección
        getAddress(randomLat, randomLng);
        
    } catch (error) {
        console.error("Error al actualizar mapa:", error);
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
        console.error("Error al obtener dirección:", error);
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
        updateTimer = setInterval(loadAllData, 5000); // Actualizar cada 5 segundos
        console.log("Actualizaciones automáticas iniciadas (cada 5 segundos)");
        
        // Mostrar indicador de actualización automática
        const statusBadge = document.createElement('span');
        statusBadge.id = 'auto-update-badge';
        statusBadge.className = 'badge bg-info ms-2';

        
        // Agregar al lado del título
        const headerTitle = document.querySelector('.details-header h2');
        if (headerTitle && !document.getElementById('auto-update-badge')) {
            headerTitle.appendChild(statusBadge);
        }
    }
}

// Detener actualización automática
function stopAutoUpdate() {
    if (updateTimer) {
        clearInterval(updateTimer);
        updateTimer = null;
        console.log("Actualizaciones automáticas detenidas");
        
        // Eliminar indicador
        const statusBadge = document.getElementById('auto-update-badge');
        if (statusBadge) {
            statusBadge.remove();
        }
    }
}

// Alternar actualización automática
function toggleAutoUpdate() {
    if (autoUpdateToggle.checked) {
        console.log("Activando simulación de movimiento");
        startAutoUpdate();
        showSuccessMessage("Simulación de movimiento activada");
    } else {
        console.log("Desactivando simulación de movimiento");
        stopAutoUpdate();
        showSuccessMessage("Simulación de movimiento desactivada");
    }
}

// Mostrar mensaje de éxito
function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.className = 'toast align-items-center text-white bg-success position-fixed bottom-0 end-0 m-3';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.style.zIndex = '9999';
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast, {
        autohide: true,
        delay: 3000
    });
    
    bsToast.show();
    
    // Auto eliminar cuando se oculta
    toast.addEventListener('hidden.bs.toast', () => toast.remove());
}

// Mostrar panel de error
function showErrorPanel(message) {
    console.error(message);
    
    const errorBox = document.createElement('div');
    errorBox.className = 'alert alert-danger m-3';
    errorBox.innerHTML = `
        <h5 class="alert-heading">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            Error
        </h5>
        <p>${message}</p>
        <p class="mb-0">Asegúrate de que battery_api.py y prueba_1_trakii.py están en ejecución.</p>
    `;
    
    // Añadir botón para cerrar
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.onclick = function() {
        errorBox.remove();
    };
    
    errorBox.appendChild(closeButton);
    
    // Añadir a la página
    document.querySelector('.container-fluid').prepend(errorBox);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initApp); 