# Sistema de Monitoreo de Dispositivos

Este proyecto consiste en un sistema de monitoreo que incluye seguimiento de localización GPS, nivel de batería y detalles del dispositivo.

## 🚀 Características

- Monitoreo en tiempo real del nivel de batería
- Visualización de ubicación en mapa interactivo
- Sistema de alertas para nivel bajo de batería

## 📋 Requisitos Previos

- Python 3.8 o superior
- Navegador web moderno
- Node.js (opcional, para servidor local)

## 🔧 Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/TuliEscobar/prueba_trakii
cd prueba_trakii
```

2. Instalar dependencias de Python
```bash
pip install -r requirements.txt
```

3. Instalar dependencias web (si aplica)
```bash
npm install
```

## 🚀 Ejecución Local

1. Iniciar el monitor de batería:
```bash
python monitor/battery_monitor.py
```

2. Abrir el archivo index.html en tu navegador web preferido
   
correr python -m http.server
```bash
correr python -m http.server
```
ir a:
```bash
http://localhost:8000/Prueba_2/
```


## 🛠️ Tecnologías Utilizadas

- Python para el backend y monitoreo
- Leaflet.js para mapas interactivos
- HTML5, CSS3 y JavaScript para la interfaz web
- Bootstrap para la barra de navegación y estilos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles 

# Sistema de Monitoreo de Dispositivos Trakii

Este proyecto consiste en un sistema completo para el monitoreo de dispositivos GPS, incluyendo seguimiento de ubicación, monitorización de nivel de batería y gestión de información del dispositivo.

## 🚀 Características Principales

- **Monitoreo de Batería en Tiempo Real**: Visualización dinámica del nivel de batería con alertas visuales
- **Seguimiento de Ubicación GPS**: Mapa interactivo que muestra la ubicación actual del dispositivo
- **Panel Multi-Vista**: Interfaz con navegación entre diferentes secciones del sistema
- **Diseño Responsivo**: Adaptado para funcionar en dispositivos móviles y de escritorio

## 📋 Requisitos Previos

- Navegador web moderno con soporte para JavaScript ES6+
- Conexión a internet para cargar las librerías externas
- Python 3.8+ (para ejecutar los componentes de backend, opcional)

## 🔧 Instalación

1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/prueba-trakii.git
cd prueba-trakii
```

2. No requiere instalación adicional para la parte frontend. Para el backend:
```bash
cd Prueba_1
python -m pip install -r requirements.txt
```

## 💻 Estructura del Proyecto

```
prueba-trakii/
├── Prueba_1/
│   └── Prueba_1_trakii.py  # Backend para monitoreo de batería
├── Prueba_2/
│   └── index.html          # Mapa interactivo con Leaflet
├── Prueba_3/
│   ├── index.html          # Componente visual de nivel de batería
│   ├── styles.css          # Estilos del componente
│   └── script.js           # Lógica del componente de batería
└── README.md
```

## 🚀 Ejecución Local

### Componente de Batería (Prueba_3)
1. Abre el archivo `Prueba_3/index.html` en tu navegador
2. Observa como el nivel de batería se actualiza automáticamente cada 5 segundos
3. Prueba las funciones manuales como "Actualizar Ahora" y "Actualización Auto"

### Monitoreo de Batería Backend (Prueba_1)
```bash
cd Prueba_1
python Prueba_1_trakii.py
```

### Mapa GPS (Prueba_2)
1. Abre el archivo `Prueba_2/index.html` en tu navegador
2. Observa el mapa con la ubicación del dispositivo

## 📱 Componente de Nivel de Batería

El componente de nivel de batería (Prueba_3) incluye las siguientes características:

- **Visualización Dinámica**: Representación visual de batería que cambia según el nivel de carga
- **Indicadores de Color**: 
  - Verde (>40%): Nivel óptimo
  - Amarillo (20-40%): Nivel bajo
  - Rojo (<20%): Nivel crítico, con efecto de parpadeo
- **Actualización en Tiempo Real**: Actualización automática cada 5 segundos
- **Control Manual**: Botón para actualizar manualmente y toggle para activar/desactivar actualizaciones
- **Historial Visual**: Representación gráfica de los últimos niveles de batería
- **Información Detallada**: Muestra ID del dispositivo, modelo y hora de última actualización

## 🖥️ Interfaz de Usuario

La aplicación cuenta con una barra de navegación que permite acceder a tres vistas principales:

1. **Localización**: Muestra el mapa interactivo con la ubicación actual del dispositivo
2. **Batería**: Visualiza el nivel actual de batería con alertas visuales
3. **Detalles**: Información detallada sobre el dispositivo

## 🛠️ Tecnologías Utilizadas

- **Frontend**:
  - HTML5, CSS3 y JavaScript ES6+
  - Bootstrap 5 para UI responsiva
  - Leaflet.js para mapas interactivos
  - Chart.js para visualización de datos
- **Backend**:
  - Python para lógica de monitoreo
  - Módulos time y random para simulación

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## ✨ Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría realizar. 