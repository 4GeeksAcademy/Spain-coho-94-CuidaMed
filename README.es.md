🏥 CuidaMed: Gestión segura de tu salud.
---
CuidaMed es una plataforma innovadora gratuita de gestión de salud que te permite guardar y consultar tu información médica de forma segura, a través de una interfaz intuitiva.

---
✨ Características Principales.
---

* 📊 Estadísticas de salud: Visualiza datos importantes como tensión arterial, pulso, glucosa y peso con rangos de normalidad, advertencia y peligro.

* 📁 Historial médico completo: Almacena y accede fácilmente a tu historial de salud.

* 🆘 Contacto de emergencia: Contacta rápidamente con tu contacto de emergencia a través de un QR personalizado.

* 🖼️ Galería de informes: Almacena y visualiza radiografías, exámenes y otros documentos médicos, en un solo lugar.

* 🔒 Acceso seguro: Protección de datos mediante autenticación con Google.

* 💯 Totalmente gratuito: Accede a todas las funciones sin costo alguno.

---
👤 Tipos de Roles
---
📱 Usuarios

Actualmente disponible solo el rol de usuario. Las personas que utilizan la plataforma para gestionar su información médica personal.
Próximamente se añadirán roles adicionales.

---
🛠️ Tecnologías Utilizadas
---
Frontend
---

* React ⚛️
* Bootstrap 🎨 (diseño responsive)
* Librerías:

    * qrcode-react
    * recharts
    * iconos de Bootstrap
    * jwt-decode

---
Backend
---

* Python 🐍
* Flask 🌶️
* SQLAlchemy 🗃️
* Tigrisdata (para la galeria de informes)
* flask-email (para envío de correos)
* itsdangerous
* python-dotenv 

---
Autenticación
---

* Google Auth 🔐
  
---
🚀 Instalación
---

> Si usas Github Codespaces (recomendado) o Gitpod, esta plantilla ya vendrá con Python, Node y la base de datos Posgres instalados. Si estás trabajando localmente, asegúrate de instalar Python 3.10, Node.

🛠️ Configuración del Backend:
---

Se recomienda instalar el backend primero, asegúrate de tener Python 3.10, Pipenv y un motor de base de datos (se recomienda Posgres).

1.- Instala los paquetes de python: 

$ pipenv install

2.- Crea un archivo .env basado en el .env.example:

$ cp .env.example .env

3.- Instala tu motor de base de datos y crea tu base de datos, dependiendo de tu base de datos, debes crear una variable DATABASE_URL con uno de los valores posibles, asegúrate de reemplazar los valores con la información de tu base de datos:

| Engine    | DATABASE_URL                                        |
| --------- | --------------------------------------------------- |
| SQLite    | sqlite:////test.db                                  |
| MySQL     | mysql://username:password@localhost:port/example    |
| Postgress | postgres://username:password@localhost:5432/example |

4.- Migra las migraciones:

$ pipenv run migrate
(omite si no has hecho cambios en los modelos en ./src/api/models.py)

5.- Ejecuta las migraciones:

$ pipenv run upgrade

6.- Ejecuta la aplicación:

$ pipenv run start

> Nota: Los usuarios de Codespaces pueden conectarse a psql escribiendo: psql -h localhost -U gitpod example

> Deshacer una migración

También puedes deshacer una migración ejecutando

$ pipenv run downgrade

---
🛠️ Configuración manual del Frontend:
---

* Asegúrate de estar usando la versión 20 de node y de que ya hayas instalado y ejecutado correctamente el backend

1.- Instala los paquetes: 

$ npm install

2.- ¡Empieza a codificar! inicia el servidor de desarrollo de webpack 

$ npm run start

---
👥 Sobre Nosotros
---

CuidaMed ha sido creado con dedicación por un equipo de estudiantes apasionados por la programación. Combinando nuestras habilidades y conocimientos, hemos dado vida a esta plataforma innovadora que busca transformar la manera en que gestionamos y guardamos toda nuestra información de salud.

👩‍💻 MichPisani: https://github.com/MichPisani

👩‍💻 Leodelis: https://github.com/Leodelis

👨‍💻 PipeBarros: https://github.com/InTheScencia 

---
💻 Contribuyentes
---
Esta plantilla fue construida como parte del Coding Bootcamp de 4Geeks Academy por Alejandro Sanchez y muchos otros contribuyentes. Descubre más sobre nuestro Curso de Desarrollador Full Stack y Bootcamp de Ciencia de Datos.

