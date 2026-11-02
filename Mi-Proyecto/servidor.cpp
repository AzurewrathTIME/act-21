#include <iostream>
#include <fstream>
#include <string>

#ifdef _WIN32
  #include <winsock2.h>
  #include <ws2tcpip.h>
  #pragma comment(lib, "ws2_32.lib")
  using socket_t = SOCKET;
  #define CLOSE_SOCKET closesocket
#else
  #include <sys/socket.h>
  #include <netinet/in.h>
  #include <arpa/inet.h>
  #include <unistd.h>
  using socket_t = int;
  #define CLOSE_SOCKET close
  #define INVALID_SOCKET (-1)
#endif

using namespace std;

const int PUERTO = 8080;
const string CARPETA_PUBLICA = "Public"; // <--- Cambiado a "Public"

string leerArchivo(const string& ruta) {
    ifstream archivo(ruta, ios::binary);
    if (!archivo.is_open()) return "";
    string contenido((istreambuf_iterator<char>(archivo)), istreambuf_iterator<char>());
    return contenido;
}

string obtenerMIME(const string& ruta) {
    size_t punto = ruta.find_last_of('.');
    if (punto == string::npos) return "application/octet-stream";
    
    string ext = ruta.substr(punto + 1);
    
    if (ext == "html" || ext == "htm") return "text/html; charset=utf-8";
    if (ext == "css") return "text/css; charset=utf-8";
    if (ext == "js") return "application/javascript; charset=utf-8";
    if (ext == "json") return "application/json; charset=utf-8";
    if (ext == "png") return "image/png";
    if (ext == "jpg" || ext == "jpeg") return "image/jpeg";
    if (ext == "gif") return "image/gif";
    if (ext == "svg") return "image/svg+xml";
    if (ext == "ico") return "image/x-icon";
    if (ext == "txt") return "text/plain; charset=utf-8";
    
    return "application/octet-stream";
}

int main() {
#ifdef _WIN32
    WSADATA wsa;
    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
        cerr << "Error al inicializar Winsock" << endl;
        return 1;
    }
#endif

    socket_t servidor = socket(AF_INET, SOCK_STREAM, 0);
    if (servidor == INVALID_SOCKET) {
        cerr << "Error al crear el socket" << endl;
        return 1;
    }

    sockaddr_in direccion{};
    direccion.sin_family = AF_INET;
    direccion.sin_addr.s_addr = INADDR_ANY;
    direccion.sin_port = htons(PUERTO);

    if (bind(servidor, (sockaddr*)&direccion, sizeof(direccion)) != 0) {
        cerr << "Error en bind (puerto ocupado)" << endl;
        CLOSE_SOCKET(servidor);
        return 1;
    }

    if (listen(servidor, 10) != 0) {
        cerr << "Error en listen" << endl;
        CLOSE_SOCKET(servidor);
        return 1;
    }

    cout << "Servidor escuchando en http://localhost:" << PUERTO << endl;

    while (true) {
        sockaddr_in clienteDir{};
#ifdef _WIN32
        int tam = sizeof(clienteDir);
#else
        socklen_t tam = sizeof(clienteDir);
#endif

        socket_t cliente = accept(servidor, (sockaddr*)&clienteDir, &tam);
        if (cliente == INVALID_SOCKET) {
            continue;
        }

        char buffer[4096] = {0};
        int bytes = recv(cliente, buffer, sizeof(buffer) - 1, 0);
        if (bytes <= 0) {
            CLOSE_SOCKET(cliente);
            continue;
        }
        string peticion(buffer, bytes);

        size_t finLinea = peticion.find("\r\n");
        string primeraLinea = (finLinea != string::npos) ? peticion.substr(0, finLinea) : peticion;
        
        cout << "[REQ] " << primeraLinea << endl;

        string metodo, ruta;
        size_t p1 = primeraLinea.find(' ');
        size_t p2 = primeraLinea.find(' ', p1 + 1);
        if (p1 != string::npos && p2 != string::npos) {
            metodo = primeraLinea.substr(0, p1);
            ruta = primeraLinea.substr(p1 + 1, p2 - p1 - 1);
        }

        size_t queryPos = ruta.find('?');
        if (queryPos != string::npos) {
            ruta = ruta.substr(0, queryPos);
        }

        if (ruta == "/" || ruta == "") {
            ruta = "/index.html";
        }

        if (ruta.find("..") != string::npos) {
            string respuesta = "HTTP/1.1 400 Bad Request\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Length: 11\r\nConnection: close\r\n\r\nBad Request";
            send(cliente, respuesta.c_str(), respuesta.size(), 0);
            CLOSE_SOCKET(cliente);
            continue;
        }

        string rutaCompleta = CARPETA_PUBLICA + ruta;
        
        // ESTA LÍNEA TE DIRÁ EN LA CONSOLA QUÉ ARCHIVO ESTÁ BUSCANDO EXACTAMENTE
        cout << "Buscando: " << rutaCompleta << endl; 

        string contenido = leerArchivo(rutaCompleta);

        string respuesta;

        if (contenido.empty()) {
            string html404 = "<!DOCTYPE html><html lang=\"es\"><head><meta charset=\"UTF-8\"><title>404</title><style>body{font-family:sans-serif;text-align:center;padding:5rem;background:#f3f4f6;}h1{font-size:4rem;color:#dc2626;}a{color:#2563eb;}</style></head><body><h1>404</h1><p>La página que buscas no existe.</p><p><a href=\"/\">Volver al inicio</a></p></body></html>";

            respuesta = "HTTP/1.1 404 Not Found\r\nContent-Type: text/html; charset=utf-8\r\nContent-Length: " + to_string(html404.size()) + "\r\nConnection: close\r\n\r\n" + html404;
        } else {
            string mime = obtenerMIME(ruta);
            respuesta = "HTTP/1.1 200 OK\r\nContent-Type: " + mime + "\r\nContent-Length: " + to_string(contenido.size()) + "\r\nConnection: close\r\n\r\n" + contenido;
        }

        send(cliente, respuesta.c_str(), respuesta.size(), 0);
        CLOSE_SOCKET(cliente);
    }

    CLOSE_SOCKET(servidor);

#ifdef _WIN32
    WSACleanup();
#endif

    return 0;
}