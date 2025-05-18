# Proyecto de Gestión de Autopartes - Consorcio AUTO-UPB

**Repositorio Central del Sistema de Gestión de Autopartes**

Este repositorio alberga el código fuente y la documentación del sistema integral de gestión de autopartes, desarrollado para optimizar las operaciones del **Consorcio AUTO-UPB**.

**Fecha de última actualización del README:** 2025-05-18
**Autores del proyecto:**
  - [Sofia Santis Silva (Estudiante Ing. Sitemas UPB)](https://github.com/esedesofiaaa)
  - [Valentina Fuentes (Estudiante Ing. Sitemas UPB)](https://github.com/ZValentinaF)
  - [Angelica Parra (Estudiante Ing. Sitemas UPB)](https://github.com/Angelica-994)
  - [Camilo Manotas (Estudiante Ing. Sitemas UPB)](https://github.com/JuanCamiloGM)
  - [Stiven Pabón (Estudiante Ing. Sitemas UPB)](https://github.com/STIFFF230)
  - [Raúl Lozano (Estudiante Ing. Sitemas UPB)](https://github.com/RaulLzn)


## Objetivo del Proyecto

El objetivo primordial de este proyecto es la implementación de una solución de software robusta y eficiente para la **gestión integral de autopartes y los procesos comerciales asociados** dentro del Consorcio AUTO-UPB. El sistema está diseñado para:

*   **Centralizar y optimizar la administración del inventario:** Incluyendo el manejo detallado de tipos de ítems (`Itemtype`) y lotes específicos de autopartes (`Batch`), permitiendo un control preciso del stock.
*   **Agilizar y formalizar el proceso de ventas y facturación:** Mediante la gestión de facturas (`Bill`), el seguimiento de los ítems vendidos en cada transacción (`Billhasbatch`, `SaleItem`), y la correcta asociación de estos.
*   **Fortalecer las relaciones con proveedores:** A través de un módulo dedicado a la gestión de la información de los proveedores (`Provider`).
*   **Garantizar la seguridad y la integridad de los datos:** Implementando un sistema de gestión de usuarios (`User`, `Person`), roles (`Usertype`), y permisos granulares (`Permission`, `Usertypehaspermission`) para controlar el acceso a las diferentes funcionalidades del sistema.
*   **Mejorar la trazabilidad y la toma de decisiones:** Proporcionando una base de datos estructurada que facilite el seguimiento de las autopartes y la generación de reportes (funcionalidad implícita).

## Características Principales

El sistema de Gestión de Autopartes del Consorcio AUTO-UPB incluye las siguientes funcionalidades clave:

*   **Módulo de Inventario Avanzado:**
    *   Registro, seguimiento y gestión de lotes (`Batch`) de autopartes.
    *   Clasificación y categorización de autopartes por tipo (`Itemtype`).
*   **Módulo de Ventas y Facturación:**
    *   Generación y administración de facturas de venta (`Bill`).
    *   Vinculación precisa de los lotes de autopartes vendidos a cada factura (`Billhasbatch`).
    *   Detalle de los ítems por venta (`SaleItem`).
*   **Módulo de Gestión de Proveedores:**
    *   Mantenimiento de un directorio de proveedores (`Provider`) con su información relevante.
*   **Módulo de Administración de Usuarios y Seguridad:**
    *   Gestión de identidades de usuarios (`User`) y personas asociadas (`Person`).
    *   Definición de tipos de usuario o roles (`Usertype`).
    *   Configuración detallada de permisos por rol (`Permission`, `Usertypehaspermission`).
    *   Autenticación basada en JWT y autorización robusta mediante Spring Security.
*   **Interfaz de Usuario Web:**
    *   Frontend accesible vía web, compuesto por archivos estáticos (HTML, CSS, JavaScript).
*   **Manejo Global de Excepciones:**
    *   Configuración para la gestión centralizada de errores (`GlobalExceptionHandler.java`, `SecurityExceptionHandler.java`).

## Arquitectura del Sistema

El proyecto está estructurado con un backend Spring Boot que maneja la lógica de negocio, sirve la interfaz de usuario estática y gestiona la seguridad.

*   **Backend (Lógica de Negocio, API y Seguridad):**
    *   Desarrollado en **Java 17** con **Spring Boot 3.4.3**.
    *   DTOs en `com.autopartes.BackendAutoPartes.model.dto`.
    *   Persistencia con **Spring Data JPA**.
    *   Seguridad gestionada por **Spring Security** (config en `com.autopartes.BackendAutoPartes.config.SecurityConfig.java` y componentes en `com.autopartes.BackendAutoPartes.security`).

      ![image](https://github.com/user-attachments/assets/8bcf39eb-d216-4210-bb13-905720609726)
      
*   **Frontend (Interfaz de Usuario):**
    *   Archivos estáticos (HTML, CSS, JavaScript) en `src/main/resources/static/`.
    *   Servidos por Spring Boot, configuraciones CORS en `com.autopartes.BackendAutoPartes.config.WebConfig.java`.

      ![image](https://github.com/user-attachments/assets/d9bd5589-51a7-4a50-b48e-2193747a2e4f)

*   **Base de Datos:**
    *   Producción: **PostgreSQL**.
    *   Pruebas: **H2 Database Engine**.
    *   Cache/Sesiones: **Redis**.

### Seguridad Detallada:
*   **Autenticación JWT:**
    *   `JwtUtils.java`: Generación y validación de tokens.
    *   `JwtFilter.java`: Filtro para validar JWTs en solicitudes.
    *   `MyUserDetailsService.java`: Carga de detalles de usuario.
*   **Autorización:** Reglas de acceso basadas en roles en `SecurityConfig.java`.
*   **Codificación de Contraseñas:** `PasswordEncoder` (ej. BCrypt) en `PasswordEncoderConfig.java`.
*   **Manejo de Excepciones de Seguridad:** `SecurityExceptionHandler.java`.

## Infraestructura y Servicios Relacionados

Este sistema de gestión de autopartes fue diseñado y desarrollado en conjunto con la planificación e implementación de varios servicios de infraestructura esenciales para el Consorcio AUTO-UPB. Estos servicios, que soportan y complementan la aplicación, incluyen:

*   **Servicio de Correo Electrónico**
*   **Servicio de Voz sobre IP (VoIP)**
*   **Servicio de DHCP (Dynamic Host Configuration Protocol)**
*   **Servicio de DNS (Domain Name System)**
*   **Servicio de Base de Datos (PostgreSQL, administrado centralmente)**
*   **Servicio de SFTP (Secure File Transfer Protocol)**

Las configuraciones detalladas de estos servicios, así como la topología de red implementada y otra documentación relevante de infraestructura, se encuentran en un repositorio dedicado. Puede consultar esta información en el siguiente enlace:

➡️ **[https://github.com/CONSORCIO-AUTO-UPB-Empresa-tipo-Partes/autopartes-servicios-red]**

## 🛠️ Tecnologías Utilizadas

### Backend:
*   **Lenguaje:** Java 17
*   **Framework:** Spring Boot 3.4.3 (Web, Data JPA, Security, Data Redis, Actuator)
*   **Seguridad:** JSON Web Tokens (JWT) - `io.jsonwebtoken`
*   **Base de Datos:** PostgreSQL, H2
*   **Construcción:** Apache Maven
*   **Utilidades:** Lombok, P6Spy, Jakarta Validation API, Hibernate Validator

### Frontend (servido desde `src/main/resources/static/`):
*   **Tecnologías Base:** HTML5, CSS3, JavaScript.

### Configuración Adicional:
*   `WebConfig.java` (CORS, etc.), `GlobalExceptionHandler.java`.

### Herramientas de Desarrollo:
*   **Control de Versiones:** Git

## Flujo de Trabajo y Contribuciones

El proyecto sigue un **estilo de trabajo inspirado en GitFlow**, utilizando ramas principales para producción (`main`) y desarrollo (`develop`), y ramas de soporte para nuevas funcionalidades y correcciones.

Para contribuir al proyecto:

1.  **Comunicación vía Issues:** Antes de desarrollar, crea un *issue* en GitHub o comenta en uno existente para describir la funcionalidad o el bug.
2.  **Desarrollo en Ramas Dedicadas:**
    *   Crea una rama a partir de `develop` para nuevas funcionalidades (ej. `feature/nombre-funcionalidad`).
    *   Para correcciones urgentes en producción (hotfixes), la rama se crea desde `main`.
3.  **Actualiza tu Rama:** Antes de solicitar la integración, asegúrate de que tu rama esté actualizada con los últimos cambios de `develop`.
4.  **Pull Requests (PRs):** Envía un Pull Request a la rama `develop` (o `main` para hotfixes) con una descripción clara de tus cambios, haciendo referencia al issue correspondiente.
5.  **Revisión de Código:** Espera la revisión y aprobación del equipo antes de que tu PR sea fusionado.
6.  **Mensajes de Commit Significativos:** Utiliza mensajes de commit claros y descriptivos.

## 🚀 Guía de Inicio Rápido (Configuración y Ejecución)

### Prerrequisitos:
*   JDK 17+
*   Apache Maven
*   PostgreSQL (servidor activo)
*   Redis (servidor activo, si es crítico para el arranque)
*   Git

### Configuración:

1.  **Clonar Repositorio:**
    ```sh
    git clone https://github.com/CONSORCIO-AUTO-UPB-Empresa-tipo-Partes/RepositorioCentral.git
    cd RepositorioCentral
    ```

2.  **Configurar Base de Datos PostgreSQL:**
    *   Cree una base de datos (ej. `autopartes_db`).
    *   Actualice `src/main/resources/application.properties` con sus credenciales:
    ```properties
    spring.application.name=BackendAutoPartes
    spring.datasource.url=jdbc:postgresql://localhost:5432/autopartes_db
    spring.datasource.username=tu_usuario_pg
    spring.datasource.password=tu_contraseña_pg
    spring.datasource.driver-class-name=org.postgresql.Driver
    spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.show-sql=true
    # spring.data.redis.host=localhost
    # spring.data.redis.port=6379
    ```

### Ejecución:

1.  **Con Maven:**
    ```sh
    mvn spring-boot:run
    ```
2.  **Empaquetado (Alternativo):**
    ```sh
    mvn clean package
    java -jar target/BackendAutoPartes-0.0.1-SNAPSHOT.jar
    ```
3.  **Acceso:** `http://localhost:8080/` (o el puerto configurado).

## 📄 Licencia

---
*Consorcio AUTO-UPB*
