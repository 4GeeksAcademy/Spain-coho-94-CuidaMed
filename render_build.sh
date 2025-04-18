#!/usr/bin/env bash
#set -o errexit

# Instala dependencias y compila el frontend
npm install
npm run build

# Crea carpeta de destino si no existe
#mkdir -p src/public

# Copia el contenido del build de React
#cp -r dist/* src/public/

# Instala dependencias backend
pipenv install
pipenv run upgrade
