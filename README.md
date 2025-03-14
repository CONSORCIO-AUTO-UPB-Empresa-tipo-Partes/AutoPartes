# 📌 Repositorio Central - Integración Backend y Frontend

## 🚀 Proyecto de Gestión de Autopartes

Este repositorio central tiene como objetivo la **integración del Backend y Frontend** del sistema de gestión de autopartes del **Consorcio AUTO-UPB**. La coordinación entre ambos equipos de desarrollo es clave para mantener una arquitectura modular y bien estructurada. Se seguirá la metodología de **Git Flow** para garantizar un flujo de trabajo eficiente y colaborativo.

## 📁 Estructura de Ramas en Git

Utilizaremos la estrategia de **Git Flow** para manejar las versiones del software de manera estructurada, asegurando la integración fluida entre Backend y Frontend.

### 🔹 Ramas Principales (Persistentes)

Estas ramas son permanentes y representan los estados clave del proyecto:

- **`main`** (Producción) ✅
  - Contiene la versión estable y en producción del sistema.
  - Se actualiza solo mediante **merge desde `develop`** cuando una versión está lista para despliegue.
  - No se realizan desarrollos directos en esta rama.

```sh
# Fusionar cambios de develop a main cuando una versión está lista
 git checkout main
 git merge develop
```

- **`develop`** (Desarrollo) ✅
  - Contiene el código en desarrollo y pruebas.
  - Recibe cambios desde las ramas `feature/*` tanto de Backend como de Frontend.
  - Se mantiene siempre funcional para evitar bloqueos en el equipo.

```sh
# Crear una nueva rama de desarrollo desde develop
 git checkout develop
```

### 🌱 Ramas Temporales (Se eliminan al finalizar)

- **`feature/backend/*`** y **`feature/frontend/*`** (Nuevas Funcionalidades) 📌
  - Se crean desde `develop` para desarrollar nuevas funcionalidades de cada equipo.
  - Una vez terminadas, se fusionan en `develop` y se eliminan.

```sh
# Crear una nueva rama para una funcionalidad en Backend
 git checkout develop
 git checkout -b feature/backend/nueva-funcionalidad

# Crear una nueva rama para una funcionalidad en Frontend
 git checkout develop
 git checkout -b feature/frontend/nueva-funcionalidad

# Fusionar y eliminar la rama feature
 git checkout develop
 git merge feature/backend/nueva-funcionalidad
 git branch -d feature/backend/nueva-funcionalidad
```

- **`hotfix/*`** (Correcciones Urgentes en Producción) 🛠️
  - Se crean desde `main` para corregir errores críticos.
  - Se fusionan en `main` y `develop` y luego se eliminan.

```sh
# Crear una rama hotfix para corregir un error crítico
 git checkout main
 git checkout -b hotfix/fix-login

# Aplicar el fix y fusionarlo en main y develop
 git checkout main
 git merge hotfix/fix-login
 git checkout develop
 git merge hotfix/fix-login
 git branch -d hotfix/fix-login
```

- **`release/*`** (Preparación de Nueva Versión) 🚀
  - Se crean desde `develop` cuando se prepara una nueva versión para producción.
  - Se usa para pruebas finales y ajustes antes de lanzar la versión.
  - Se fusiona en `main` y `develop` y luego se elimina.

```sh
# Crear una rama de versión
 git checkout develop
 git checkout -b release/v1.0.0

# Fusionar en main y develop, etiquetar la versión y eliminar la rama release
 git checkout main
 git merge release/v1.0.0
 git tag v1.0.0
 git checkout develop
 git merge release/v1.0.0
 git branch -d release/v1.0.0
```

### 🎯 Resumen Visual del Flujo de Ramas

```
  main  <-- (Código estable y en producción)
   │
   ├── develop  <-- (Código en desarrollo)
   │      │
   │      ├── feature/backend/nueva-funcionalidad  <-- (Rama para Backend)
   │      │
   │      ├── feature/frontend/nueva-funcionalidad  <-- (Rama para Frontend)
   │
   ├── release/v1.0.0  <-- (Preparación de versión para producción)
   │
   ├── hotfix/fix-crash  <-- (Corrección urgente en producción)
```

### 🔥 Beneficios de esta forma de trabajo:

✅ **Separación clara de Backend y Frontend**: Cada equipo trabaja en su espacio sin interferencias.
✅ **Menos errores en producción**: Se prueban los cambios antes de fusionarlos en `main`.
✅ **Trabajo en equipo optimizado**: Se mantiene una estructura ordenada para el desarrollo paralelo.
✅ **Facilidad para revertir cambios**: Se puede regresar a una versión estable en cualquier momento.

### 📝 Reglas Generales del Equipo

📌 **Nunca hagas commits directamente en `main` o `develop`**.
📌 **Cada feature, fix o release debe estar en su propia rama**.
📌 **Usa nombres descriptivos para las ramas** (`feature/backend/login`, `feature/frontend/carrito`).
📌 **Antes de hacer un merge, asegúrate de actualizar tu rama con los últimos cambios de `develop`**.

```sh
 git pull origin develop
```

📌 **Realiza Pull Requests en GitHub antes de fusionar cambios en `develop`**.
📌 **Usa `git tag` para marcar versiones en producción (`v1.0.0`)**.

---
