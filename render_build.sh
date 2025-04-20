#!/usr/bin/env bash

# Instala dependencias y compila el frontend
npm install
npm run build

# Instala dependencias backend
pipenv install
pipenv run upgrade
