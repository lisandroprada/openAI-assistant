# Math Tutor Chatbot

Este proyecto es un chatbot de tutor de matemáticas que utiliza la API de OpenAI para responder preguntas matemáticas. El proyecto está construido con Node.js y Express en el backend, y una interfaz de usuario simple en el frontend.

## Características

- Crear un asistente de tutor de matemáticas.
- Crear y gestionar hilos de conversación.
- Enviar mensajes y recibir respuestas del asistente.
- Mostrar el estado de ejecución de las respuestas.
- Recuperar y visualizar conversaciones anteriores.

## Requisitos

- Node.js (v14 o superior)
- npm (v6 o superior)
- Una clave API de OpenAI

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/math-tutor-chatbot.git
   cd math-tutor-chatbot
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env` en la raíz del proyecto y añade tu clave API de OpenAI:

   ```plaintext
   OPENAI_API_KEY=your_openai_api_key
   ```

4. Inicia el servidor:

   ```bash
   node server.js
   ```

5. Abre tu navegador y navega a `http://localhost:3000`.

## Estructura del Proyecto

```
math-tutor-chatbot/
├── controllers/
│   └── assistantController.js
├── public/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── app.js
│   └── index.html
├── routes/
│   └── assistant.js
├── .env
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Uso

### Crear Asistente

1. Haz clic en el botón "Create Assistant" para crear un asistente de tutor de matemáticas.

### Crear Hilo

1. Haz clic en el botón "Create Thread" para crear un nuevo hilo de conversación.

### Mostrar Hilos

1. Haz clic en el botón "Show Threads" para mostrar todos los hilos creados.

### Enviar Mensaje

1. Escribe tu pregunta en el campo de entrada y haz clic en el botón "Send" para enviar el mensaje al asistente.

### Recuperar Conversación

1. Haz clic en un hilo de la lista de hilos para recuperar y visualizar la conversación de ese hilo.

## Contribuir

Si deseas contribuir a este proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-caracteristica`).
3. Realiza tus cambios y haz commit (`git commit -am 'Añadir nueva característica'`).
4. Haz push a la rama (`git push origin feature/nueva-caracteristica`).
5. Abre un Pull Request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.
