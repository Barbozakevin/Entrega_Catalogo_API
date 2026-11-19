# Entrega: Catálogo de productos y favoritos

**Integrantes:** [Nombre Apellido 1] y [Nombre Apellido 2]  
**Repositorio público:** [URL]  
**Video explicativo:** [URL con permiso de lectura]  
**Commit final:** [identificador completo]

## Propósito y decisión técnica

Se implementó una API REST para administrar un catálogo de productos y listas de favoritos personales. Se utilizó PostgreSQL por sus relaciones e integridad referencial, Express para las rutas HTTP, bcrypt para resguardar contraseñas y JWT para identificar sesiones con vencimiento. El registro público asigna siempre el rol `usuario`; las modificaciones del catálogo quedan reservadas a `administrador`.

## Aportes del equipo

| Integrante | Aporte al código y pruebas | Participación en el video |
|---|---|---|
| [Integrante 1] | [Completar con trabajo real y commits] | [Tema explicado] |
| [Integrante 2] | [Completar con trabajo real y commits] | [Tema explicado] |

## Pruebas

| Caso | Resultado esperado | Resultado obtenido |
|---|---|---|
| Registro, login, correo duplicado y clave incorrecta | 201, 200, 409 y 401 | [Completar con evidencia real] |
| CRUD de productos, filtro por categoría | Operaciones válidas y filtro correcto | [Completar] |
| Precio inválido, campos vacíos y producto no existente | 400, 400 y 404 | [Completar] |
| Ruta protegida sin token o con token vencido | 401 | [Completar] |
| Usuario normal intenta modificar el catálogo | 403 | [Completar] |
| Favorito agregado, listado, duplicado y eliminado | 201, 200, 409 y 204 | [Completar] |
| Usuario A y usuario B | B no ve ni elimina el favorito de A | [Completar] |
| Reinicio de Node.js | Datos continúan disponibles en PostgreSQL | [Completar] |

## Resultado y dificultad encontrada

[Describir lo que realmente ocurrió durante las pruebas y una dificultad que el equipo resolvió. Añadir referencias/capturas propias si la plataforma las solicita.]

> Este modelo debe completarse con los nombres, enlaces y resultados reales del equipo antes de exportarlo a PDF. No inventen resultados de pruebas, identificadores de commit o enlaces.
