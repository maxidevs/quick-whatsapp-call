
# Quick WhatsCALL

Quick WhatsCALL es una aplicación web sencilla que genera un enlace directo a un número de WhatsApp. El usuario puede ingresar un número de teléfono y opcionalmente un mensaje personalizado. La aplicación automáticamente genera un enlace con el formato adecuado para abrir un chat de WhatsApp en una nueva ventana.

## Características

- Selección automática del código de país a partir de una lista.
- Validación del número de teléfono, permitiendo solo números.
- Creación de un enlace directo a un número de WhatsApp con un mensaje opcional.
- Interfaz simple y minimalista usando el framework de CSS Pico.

## Instalación

1. Clona el repositorio o descarga los archivos del proyecto.
   ```bash
   git clone https://github.com/tu_usuario/quick-whatscall.git
   ```
2. Asegúrate de tener un servidor local corriendo para poder acceder a los archivos locales (puedes usar herramientas como `live-server` o el servidor integrado de VSCode).
3. Coloca el archivo `CountryCodes.json` en el directorio `data/` en el root del proyecto.

## Estructura del Proyecto

```
quick-whatscall/
│
├── data/
│   └── CountryCodes.json   # Archivo JSON con los códigos de países
├── index.html              # Archivo HTML principal de la app
├── style.css               # (Opcional) Archivo CSS personalizado
└── main.js                 # Lógica JavaScript para la interacción de la app
```

## Uso

1. Abre el archivo `index.html` en tu navegador.
2. Selecciona el código de país desde el menú desplegable.
3. Ingresa un número de teléfono válido (10 dígitos).
4. Opcionalmente, ingresa un mensaje personalizado en el campo de texto.
5. El botón de enviar se habilitará automáticamente cuando se haya ingresado un número válido.
6. Haz clic en el botón "Enviar" para abrir una nueva pestaña con el chat de WhatsApp.

### Requisitos del Número de Teléfono
- Debe ser un número válido de 10 dígitos (sin incluir el código de país).
- Solo se permiten números, otros caracteres son automáticamente filtrados.

### Mensaje Opcional
- Si decides escribir un mensaje personalizado, este será codificado correctamente para que se adjunte al enlace de WhatsApp.

## Detalles Técnicos

- La lista de códigos de país se carga dinámicamente desde un archivo JSON (`CountryCodes.json`).
- La aplicación deshabilita el botón de enviar hasta que el número de teléfono sea válido (10 dígitos).
- La validación del campo de teléfono previene que se ingresen caracteres no numéricos mediante la función `preventStrings()`.
- Se usa la API `fetch` para obtener los códigos de país y rellenar el `select` dinámicamente.

## Tecnologías Utilizadas

- **HTML5**
- **CSS3** (con [Pico CSS](https://picocss.com/), un framework de CSS minimalista)
- **JavaScript (ES6)**

## JSON de Ejemplo (CountryCodes.json)

El archivo `CountryCodes.json` debe tener un formato similar a este:

```json
[
  {
    "name": "Colombia",
    "dial_code": "+57",
    "code": "CO"
  },
  {
    "name": "United States",
    "dial_code": "+1",
    "code": "US"
  }
  // Más países...
]
```

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
