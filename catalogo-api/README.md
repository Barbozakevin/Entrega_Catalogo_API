# API REST: Catálogo de productos y favoritos

Proyecto académico con Node.js, Express y PostgreSQL. Incluye autenticación JWT, autorización por roles, CRUD de productos y favoritos aislados por usuario.

## Integrantes y aportes

- Integrante 1: [nombre y aporte verificable]
- Integrante 2: [nombre y aporte verificable]

Completen los nombres y reflejen las contribuciones en commits separados del repositorio.

## Base de datos elegida

Se eligió PostgreSQL porque el modelo relaciona usuarios, productos y favoritos con integridad referencial. La clave primaria compuesta de favoritos evita duplicados, las restricciones del esquema impiden precios no positivos y `ON DELETE CASCADE` elimina los favoritos asociados cuando se elimina un producto, manteniendo consistencia.

## Requisitos

- Node.js 18 o superior y npm
- PostgreSQL 14 o superior, o Docker Desktop
- Postman

## Instalación rápida

1. Descarguen/clonen el proyecto y entren a la carpeta `catalogo-api`.
2. Instalen dependencias: `npm install`.
3. Copien `.env.example` a `.env` y configuren `DATABASE_URL`, `JWT_SECRET`, y las credenciales iniciales del administrador. No suban `.env` a GitHub.
4. Inicien PostgreSQL. Con Docker Compose: `docker compose up -d db`. El esquema se crea al iniciar el volumen por primera vez.
5. Si la base ya existía, ejecuten el esquema manualmente: `npm run db:init` (requiere el cliente `psql`).
6. Carguen los cinco productos de muestra: `npm run db:seed`.
7. Creen el administrador: `npm run admin:create`. El script asigna ese rol solo en la inicialización local y no modifica cuentas existentes.
8. Inicien la API: `npm run dev` (o `npm start`). Comprueben `http://localhost:3000/health`.

Para volver a inicializar un volumen de Docker desde cero, detengan los servicios y eliminen el volumen con `docker compose down -v`; esto borra los datos de ese volumen.

## Variables de entorno

| Variable | Uso | Ejemplo local |
|---|---|---|
| `PORT` | Puerto HTTP | `3000` |
| `DATABASE_URL` | Cadena de conexión PostgreSQL | `postgresql://postgres:CAMBIAR_PASSWORD@localhost:5432/catalogo_db` |
| `JWT_SECRET` | Firma JWT, secreto largo y aleatorio | No usar el valor de ejemplo en entregas |
| `JWT_EXPIRES_IN` | Duración del token | `1h` |
| `BCRYPT_ROUNDS` | Costo de hash de contraseña | `12` |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Cuenta administradora inicial | Credenciales ficticias locales; contraseña de al menos 12 caracteres |

## Rutas

Prefijo general: `/api`. Las respuestas exitosas usan `{ "data": ... }`; los errores usan `{ "error": "..." }`.

| Método | Ruta | Permiso | Función |
|---|---|---|---|
| POST | `/api/auth/registro` | Público | Crea usuario normal; no acepta rol del cliente |
| POST | `/api/auth/login` | Público | Valida credenciales y devuelve JWT |
| GET | `/api/productos?categoria=Hogar` | Público | Lista y filtra por categoría |
| GET | `/api/productos/:id` | Público | Consulta un producto |
| POST | `/api/productos` | Administrador | Crea producto |
| PUT | `/api/productos/:id` | Administrador | Reemplaza sus datos editables |
| DELETE | `/api/productos/:id` | Administrador | Elimina producto y sus favoritos asociados |
| GET | `/api/favoritos` | Usuario autenticado | Lista solo sus favoritos |
| POST | `/api/favoritos` | Usuario autenticado | Agrega `{ "productoId": 1 }` |
| DELETE | `/api/favoritos/:productoId` | Usuario autenticado | Quita solo su propio favorito |

Para rutas protegidas: `Authorization: Bearer <token>`. La identidad se obtiene del JWT verificado, nunca de un `userId` enviado por el cliente. Contraseñas se almacenan con bcrypt y no se incluyen en respuestas.

## Criterio de validación y estados

Los campos faltantes, correo inválido, precio menor o igual a cero e identificadores mal formados devuelven `400`. Duplicados devuelven `409`; recursos no existentes `404`; credenciales/token inválidos o vencidos `401`; rol insuficiente `403`. Creaciones responden `201`, consultas y actualizaciones `200`, eliminaciones `204`.

## Pruebas con Postman

Importen `postman/Catalogo_API.postman_collection.json` y `postman/Catalogo_API.postman_environment.json`. Seleccionen el entorno `Catálogo local`. Primero ejecuten `00 - Login administrador`; las variables de entorno son ejemplos y deben reemplazarse por las credenciales creadas en `.env`. Después ejecuten las peticiones en orden, porque los scripts guardan tokens e identificadores de las respuestas.

La colección contiene aserciones para registro/login, duplicados, CRUD y filtros, validaciones, permisos, favoritos duplicados y producto inexistente, aislamiento entre usuarios y eliminación. La petición de token vencido necesita un JWT vencido firmado con el secreto local: ejecuten `node scripts/create-expired-token.js` y copien la salida en la variable `expiredToken` del entorno antes de esa prueba.

### Persistencia después del reinicio

Después de crear productos y favoritos, detengan Node.js con `Ctrl+C`, vuelvan a iniciar `npm start` y repitan las consultas de productos y favoritos con el token del usuario. Los registros continúan en PostgreSQL. Docker conserva los datos en el volumen `catalogo_data`.

## Repositorio y video

Repositorio público: [pegar enlace después de publicarlo]
Video (10–15 minutos): [pegar enlace compartible después de subirlo]
Commit final: [copiar identificador completo desde `git rev-parse HEAD`]

El video debe mostrar a ambos integrantes, explicar sus aportes, recorrer una petición desde Postman hasta la ruta/controlador/base de datos y respuesta, y demostrar flujo exitoso, errores, permisos, aislamiento y persistencia tras reiniciar. No muestren `.env`, contraseñas ni tokens activos.

## Tabla de evidencias a completar antes de entregar

| Caso | Resultado esperado | Resultado obtenido |
|---|---|---|
| Registro y login válidos | 201 y 200, token emitido | [completar tras ejecutar] |
| Correo duplicado / credenciales incorrectas | 409 / 401 | [completar] |
| CRUD administrador y filtro | 201, 200, 204; filtro correcto | [completar] |
| Datos inválidos / producto inexistente | 400 / 404 | [completar] |
| Ruta sin token / token vencido | 401 / 401 | [completar] |
| Usuario normal modifica productos | 403 | [completar] |
| Favorito duplicado / inexistente | 409 / 404 | [completar] |
| Aislamiento A y B | B no ve ni elimina favoritos de A; A conserva el suyo | [completar] |
| Reinicio de servidor | Productos y favoritos siguen disponibles | [completar] |

## Licencia y referencias

Dependencias de terceros: Express, node-postgres (`pg`), bcryptjs, jsonwebtoken, dotenv y Helmet. Revisen y citen la documentación consultada en el informe/video, junto con las herramientas de apoyo que utilicen.
