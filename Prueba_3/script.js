/**
 * Monitor de Batería en Tiempo Real
 * Script para simular y visualizar los niveles de batería de dispositivos
 */

// Elementos del DOM
const batteryLevel = document.getElementById('battery-level');
const batteryPercentage = document.getElementById('battery-percentage');
const batteryStatus = document.getElementById('battery-status');
const lastUpdate = document.getElementById('last-update');
const refreshBtn = document.getElementById('refresh-btn');
const autoUpdateToggle = document.getElementById('auto-update');
const batteryHistoryElement = document.getElementById('battery-history');

// Configuración
const CONFIG = {
    updateInterval: 5000, // 5 segundos entre actualizaciones automáticas
    historyLength: 20,    // Número de entradas en el historial
    warningLevel:50,     // Nivel para alerta amarilla
    criticalLevel: 20     // Nivel para alerta roja
};

// Variables de estado
let currentLevel = 100;
let batteryData = [];
let updateTimer = null;

// Inicializar la aplicación
function initApp() {
    // Establecer nivel inicial
    updateBatteryLevel(generateRandomLevel());
    
    // Iniciar el historial con valores simulados
    initializeHistory();
    
    // Configurar actualizaciones automáticas
    startAutoUpdate();
    
    // Configurar eventos
    setupEventListeners();
}

// Generar nivel de batería aleatorio (para simulación)
function generateRandomLevel() {
    // Para mayor realismo, la batería tiende a bajar desde el nivel actual
    // con menos probabilidad de subir (simula descarga real)
    const variation = Math.random() > 0.7 ? 
        Math.floor(Math.random() * 5) : 
        -Math.floor(Math.random() * 8);
    
    let newLevel = currentLevel + variation;
    
    // Mantener dentro de límites válidos
    newLevel = Math.max(1, Math.min(100, newLevel));
    
    return newLevel;
}

// Actualizar visualización del nivel de batería
function updateBatteryLevel(level) {
    // Guardar el nivel actual
    currentLevel = level;
    
    // Actualizar nivel visual de la batería (invertido porque CSS parte desde abajo)
    const heightPercentage = level + '%';
    batteryLevel.style.height = heightPercentage;
    
    // Actualizar el texto de porcentaje
    batteryPercentage.textContent = level + '%';
    
    // Actualizar color y clase según el nivel
    if (level <= CONFIG.criticalLevel) {
        batteryLevel.className = 'battery-level battery-low battery-critical';
        batteryPercentage.className = 'display-1 fw-bold text-low';
        batteryStatus.textContent = '¡CRÍTICO! Conecte el cargador inmediatamente';
        batteryStatus.className = 'fs-4 mb-0 text-danger';
    } else if (level <= CONFIG.warningLevel) {
        batteryLevel.className = 'battery-level battery-medium';
        batteryPercentage.className = 'display-1 fw-bold text-medium';
        batteryStatus.textContent = 'Nivel bajo, considere cargar pronto';
        batteryStatus.className = 'fs-4 mb-0 text-warning';
    } else {
        batteryLevel.className = 'battery-level battery-high';
        batteryPercentage.className = 'display-1 fw-bold text-high';
        batteryStatus.textContent = 'Nivel óptimo';
        batteryStatus.className = 'fs-4 mb-0 text-success';
    }
    
    // Actualizar hora de última actualización
    updateTimestamp();
    
    // Actualizar historial
    updateHistory(level);
}

// Actualizar marca de tiempo
function updateTimestamp() {
    const now = new Date();
    lastUpdate.textContent = now.toLocaleTimeString();
}

// Inicializar historial con datos de ejemplo
function initializeHistory() {
    // Generar datos de historial inicial (último al primero)
    for (let i = 0; i < CONFIG.historyLength; i++) {
        // Generar un nivel que disminuye gradualmente (para el efecto visual inicial)
        const historyLevel = Math.min(100, Math.max(20, 100 - (i * 2)));
        batteryData.unshift(historyLevel);
    }
    
    // Mostrar el historial inicial
    renderBatteryHistory();
}

// Actualizar historial con nuevo nivel
function updateHistory(level) {
    // Agregar nuevo nivel al inicio
    batteryData.unshift(level);
    
    // Mantener el historial dentro del límite configurado
    if (batteryData.length > CONFIG.historyLength) {
        batteryData.pop();
    }
    
    // Actualizar visualización
    renderBatteryHistory();
}

// Renderizar historial visual
function renderBatteryHistory() {
    // Limpiar contenedor
    batteryHistoryElement.innerHTML = '';
    
    // Crear barras para cada valor del historial
    batteryData.forEach(level => {
        const bar = document.createElement('div');
        bar.className = 'history-bar';
        
        // Establecer altura proporcional al nivel
        bar.style.height = level + '%';
        
        // Establecer color según nivel
        if (level <= CONFIG.criticalLevel) {
            bar.style.backgroundColor = '#f44336';
        } else if (level <= CONFIG.warningLevel) {
            bar.style.backgroundColor = '#ffc107';
        } else {
            bar.style.backgroundColor = '#4caf50';
        }
        
        // Agregar al contenedor
        batteryHistoryElement.appendChild(bar);
    });
}

// Configurar eventos
function setupEventListeners() {
    // Botón de actualización manual
    refreshBtn.addEventListener('click', () => {
        updateBatteryLevel(generateRandomLevel());
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
            updateBatteryLevel(generateRandomLevel());
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

// Iniciar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initApp); 