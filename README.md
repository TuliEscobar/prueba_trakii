# Sistema de Monitoreo de Dispositivos Trakii

Este proyecto implementa un sistema completo para el monitoreo de dispositivos GPS, incluyendo seguimiento de ubicación, visualización del nivel de batería y gestión de información detallada del dispositivo.

## 📑 Índice
- [Características](#-características-principales)
- [Requisitos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Ejecución](#-ejecución-local)
- [Componente de Batería](#-componente-de-nivel-de-batería)
- [Panel de Detalles del Dispositivo](#-panel-de-detalles-del-dispositivo)
- [Integración Backend-Frontend](#-integración-backend-frontend)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Licencia](#-licencia)

## 🚀 Características Principales

- **Monitoreo de Batería en Tiempo Real**: Visualización dinámica del nivel de batería con alertas visuales
- **Seguimiento de Ubicación GPS**: Mapa interactivo que muestra la ubicación actual del dispositivo
- **Panel Multi-Vista**: Interfaz con navegación entre diferentes secciones del sistema
- **Diseño Responsivo**: Adaptado para funcionar en dispositivos móviles y de escritorio
- **Integración Backend-Frontend**: El componente de batería se conecta a un backend real usando la API
- **Geocodificación Inversa**: Conversión de coordenadas GPS a direcciones físicas legibles

## 📋 Requisitos Previos

- Navegador web moderno con soporte para JavaScript ES6+
- Conexión a internet para cargar las bibliotecas externas (Bootstrap, Leaflet)
- Python 3.8+ para ejecutar los componentes de backend
- Módulos de Python: Flask y Flask-CORS

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/TuliEscobar/prueba_trakii.git
   cd prueba_trakii
   ```

2. **Instalar dependencias para la API de batería**
   ```bash
   cd Prueba_1
   pip install -r requirements.txt
   ```

## 💻 Estructura del Proyecto

```
sistema-monitoreo-dispositivos/
├── Prueba_1/
│   ├── Prueba_1_trakii.py  # Lógica de monitoreo de batería
│   ├── battery_api.py      # API para exponer los datos de batería
│   └── requirements.txt    # Dependencias de Python
├── Prueba_2/
│   └── index.html          # Mapa interactivo con Leaflet
├── Prueba_3/
│   ├── index.html          # Componente visual de nivel de batería
│   ├── styles.css          # Estilos del componente
│   └── script.js           # Lógica del componente que consume la API
├── Prueba_4/
│   ├── index.html          # Panel de detalles con geocodificación
│   ├── styles.css          # Estilos del panel
│   └── script.js           # Lógica para obtener dirección física
└── README.md
```

## 🚀 Ejecución Local

### 1. Iniciar la API de Batería

Primero, debemos iniciar la API que expone los datos de la función `get_battery_level()`:

```bash
cd Prueba_1
python battery_api.py
```

Esto iniciará un servidor en `http://localhost:5000` con los siguientes endpoints:
- `/battery` - Devuelve el nivel actual de batería
- `/device-info` - Devuelve información del dispositivo

> **IMPORTANTE**: Para el funcionamiento correcto de Prueba_4, es necesario tener en ejecución tanto `battery_api.py` como `prueba_1_trakii.py` de la carpeta Prueba_1. Asegúrate de que el puerto 5000 esté disponible.

### 2. Acceder a los Componentes Web

Hay dos formas de acceder a los componentes web:

#### Método 1: Abrir directamente los archivos HTML
- Abre `Prueba_2/index.html` para ver el mapa interactivo
- Abre `Prueba_3/index.html` para ver el componente de batería conectado a la API
- Abre `Prueba_4/index.html` para ver el panel de detalles con geocodificación

#### Método 2: Usar un servidor web local
```bash
python -m http.server
```
Y navega a:
- http://localhost:8000/Prueba_2/ - Para ver el mapa
- http://localhost:8000/Prueba_3/ - Para ver el componente de batería
- http://localhost:8000/Prueba_4/ - Para ver el panel de detalles

## 📱 Componente de Nivel de Batería

El componente de nivel de batería (Prueba_3) ofrece las siguientes funcionalidades:

- **Conexión con Backend Real**: Utiliza la función `get_battery_level()` del Reto 1 a través de la API
- **Gestión de Errores**: Si la API no está disponible, muestra una alerta y usa datos simulados como respaldo
- **Indicadores de Color Dinámicos**:
  - Verde (>40%): Nivel óptimo
  - Amarillo (20-40%): Nivel bajo
  - Rojo (<20%): Nivel crítico con efecto de parpadeo para alertar al usuario
- **Actualización Automática**: Consulta la API cada 5 segundos para obtener datos actualizados
- **Control Manual**: Incluye un botón para actualizar manualmente y un interruptor para activar/desactivar la actualización automática
- **Historial Visual**: Muestra un registro gráfico de los últimos niveles de batería

> **IMPORTANTE**: Al igual que con Prueba_4, para el funcionamiento correcto de este componente es necesario tener en ejecución tanto `battery_api.py` como `prueba_1_trakii.py` de la carpeta Prueba_1.

## 🗺️ Panel de Detalles del Dispositivo

El panel de detalles del dispositivo (Prueba_4) incluye las siguientes características:

- **Mapa Interactivo**: Visualización de la ubicación del dispositivo con Leaflet.js
- **Geocodificación Inversa**: Conversión de coordenadas GPS a direcciones físicas legibles usando Nominatim (OpenStreetMap)
- **Información Detallada**:
  - Coordenadas exactas (latitud/longitud)
  - Dirección física completa (calle, colonia, ciudad, estado, país)
  - Número de serie del dispositivo
  - Modelo y versión de firmware
  - Estado de conexión con indicador visual
- **Indicador de Estado**: Muestra visualmente si el dispositivo está conectado o desconectado
- **Nivel de Batería en Tiempo Real**: Obtiene y muestra el nivel de batería desde la API (Prueba_1)
- **Actualizaciones Automáticas**: Actualización periódica de la información cada 10 segundos
- **Interfaz Responsiva**: Diseño adaptable a diferentes tamaños de pantalla
- **Manejo de Errores**: Sistema de fallback si la API no está disponible y mensajes de error visuales

## 🔌 Integración Backend-Frontend

La integración entre el backend (Prueba_1) y el frontend (Prueba_3 y Prueba_4) se implementa mediante:

1. **API REST**: Un servidor Flask que expone los datos del monitor de batería
2. **CORS Habilitado**: Permite que el frontend acceda a los datos desde cualquier origen
3. **Fetch API**: El frontend utiliza JavaScript moderno para consultar los datos
4. **Manejo de Errores**: Sistema de fallback para mantener la funcionalidad aunque la API no esté disponible
5. **Geocodificación**: Uso de APIs externas para transformar coordenadas en direcciones legibles

## 🛠️ Tecnologías Utilizadas

### Frontend
- HTML5, CSS3 y JavaScript ES6+
- Bootstrap 5 para la interfaz de usuario responsiva
- Leaflet.js para mapas interactivos
- Fetch API para comunicación con el backend
- Nominatim API para geocodificación inversa

### Backend
- Python para la lógica de monitoreo
- Flask y Flask-CORS para crear la API REST
- Módulos time y random para la simulación de datos

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

Desarrollado por [Héctor Escobar](https://github.com/TuliEscobar) | [LinkedIn](https://www.linkedin.com/in/hectorescobar11) 