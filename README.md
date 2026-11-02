# 🏫 Sistema Escolar - Servidor Web C++

Sistema web para la organización y administración visual de información escolar, ahora servido a través de un servidor HTTP nativo programado en C++.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![C++](https://img.shields.io/badge/C++-00599C?style=flat&logo=c%2B%2B&logoColor=white)
![Sockets](https://img.shields.io/badge/TCP-Sockets-blueviolet)
![Status](https://img.shields.io/badge/status-en%20desarrollo-yellow)

---

## 📌 Descripción

El proyecto ha evolucionado: ahora cuenta con un **servidor web programado desde cero en C++** usando sockets TCP. El servidor es capaz de recibir peticiones HTTP del navegador, buscar los archivos correspondientes (HTML, CSS, JS, imágenes) y enviarlos de vuelta con los encabezados correctos, funcionando como un servidor de archivos estáticos.

---

## ✨ Características del Servidor

- 🌐 **Sockets TCP:** Implementación nativa usando la API de Berkeley (Winsock en Windows / POSIX en Linux).
- 🔄 **Múltiples peticiones:** Bucle infinito con `accept()` para atender cada recurso que solicita el navegador.
- 📂 **Archivos estáticos:** Sirve HTML, CSS, JS, imágenes (PNG, JPG, GIF) y fuentes.
- 🏷️ **Tipos MIME:** Identifica la extensión del archivo y asigna el `Content-Type` correcto para que el navegador lo interprete bien.
- 🛡️ **Seguridad básica:** Bloquea intentos de Directory Traversal (rutas con `..`).
- 🚫 **404 Personalizado:** Si el archivo no existe, devuelve una página HTML de error amigable.
- 💻 **Multiplataforma:** Código preparado con `#ifdef` para compilar tanto en Windows como en Linux/macOS.

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|------------|-----|
| C++ | Lenguaje del servidor backend |
| Sockets (TCP) | Comunicación por red |
| Protocolo HTTP/1.1 | Interpretación de peticiones y respuestas |
| HTML5 / CSS3 / JS | Frontend del sistema escolar |

---

## 📁 Estructura del proyecto

```text
Sistema-Escolar/
├── servidor.cpp       <-- Código del servidor web en C++
├── README.md
└── Public/            <-- Carpeta pública (servida por el servidor)
    ├── index.html
    ├── styless.css
    ├── app.js
    └── img/
        ├── mi.png
        └── fondo.gif
```

---

## 🚀 Instalación y ejecución

### 🐧 Linux / macOS
1. Abre la terminal en la carpeta raíz del proyecto.
2. Compila el servidor:
   ```bash
   g++ servidor.cpp -o servidor
   ```
3. Ejecuta el servidor:
   ```bash
   ./servidor
   ```

### 🪟 Windows (MinGW / VS Code)
1. Abre la terminal (PowerShell o CMD) en la carpeta raíz.
2. Compila el servidor (importante el `-lws2_32`):
   ```bash
   g++ servidor.cpp -o servidor.exe -lws2_32
   ```
3. Ejecuta el servidor:
   ```cmd
   .\servidor.exe
   ```

### 🌐 Abrir en el navegador
Una vez que la terminal muestre `Servidor escuchando en http://localhost:8080`, abre tu navegador y visita:
```text
http://localhost:8080
```

---

## 🧠 Conceptos aplicados

- **Sockets:** Creación, `bind`, `listen`, `accept`, `recv`, `send` y cierre.
- **HTTP Básico:** Parseo de la línea de petición (`GET /ruta HTTP/1.1`).
- **Cabeceras HTTP:** Envío de `Content-Type`, `Content-Length` y `Connection`.
- **MIME Types:** Mapeo de extensiones (`.html`, `.css`, `.js`, `.png`, `.gif`) a tipos válidos.
- **I/O de archivos en C++:** Lectura en modo binario con `std::ifstream` e iteradores.
- **CRLF (`\r\n`):** Uso correcto de los saltos de línea requeridos por el protocolo HTTP.

---

## 🧪 Cómo probarlo

1. Ejecuta el servidor en la terminal.
2. En el navegador, entra a `http://localhost:8080`. Deberías ver la interfaz del Sistema Escolar con su fondo animado.
3. Mira la consola de C++: aparecerán las peticiones que hace el navegador.
   ```text
   [REQ] GET / HTTP/1.1
   [REQ] GET /styless.css HTTP/1.1
   [REQ] GET /app.js HTTP/1.1
   [REQ] GET /img/fondo.gif HTTP/1.1
   ```
4. Prueba el 404 visitando una ruta que no exista: `http://localhost:8080/xyz`.

---

## ⚠️ Notas importantes

- El servidor debe ejecutarse **desde la carpeta raíz** donde se encuentra la carpeta `Public/` (o cambiar la variable `CARPETA_PUBLICA` en el código si se llama distinto).
- En Windows, si usas Visual Studio, asegúrate de copiar la carpeta `Public/` a la carpeta `Debug/` o `x64/Debug/` donde se genera el `.exe`, o ejecutar desde la terminal con la ruta correcta.
- Si el puerto `8080` está ocupado, puedes cambiarlo en la línea `const int PUERTO = 8080;` del archivo `servidor.cpp`.

---

## 📄 Licencia

MIT License
