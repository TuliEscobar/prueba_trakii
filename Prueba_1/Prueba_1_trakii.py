##phyton
import time
import random
# Función para simular la obtención del nivel de batería
def get_battery_level():
    # Simulamos un nivel de batería entre 0 y 100
    return random.randint(0, 100)

# Función que avisa si el nivel de batería es menor al 30%
def battery_monitor():
    warning_level = 30 # Nivel de batería para activar el aviso
    while True:
        battery_level = get_battery_level() # Obtenemos el nivel de batería actual
        print(f"Nivel de batería: {battery_level}%")
        if battery_level < warning_level:
            print("Advertencia: El nivel de batería es menor al 30%.")
            break
    time.sleep(5) # Esperamos 5 segundos antes de la siguiente lectura
    
    # Iniciar el monitoreo de la batería
if __name__ == "__main__":
    battery_monitor()


"""
La causa-raiz de este problema es que no tiene implemetado un breakpoint en el codigo, 
por lo que el programa no se detiene y sigue ejecutandose.
"""