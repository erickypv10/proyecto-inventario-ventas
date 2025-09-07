# Proyecto Inventario Ventas

Aplicación completa de inventario y ventas desarrollada con backend en C# .NET 8 y frontend en React.  
Incluye funcionalidades para gestionar ventas, clientes, proveedores, productos y categorías.

## Estructura del repositorio

- `/backend`: Código fuente y solución del backend en .NET 8.
- `/frontend`: Código fuente del frontend en React.

## Requisitos previos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js y npm](https://nodejs.org/) (versión recomendada para React)

## Cómo ejecutar

### Backend

1. Abre una terminal en la carpeta `/backend/WebApplication2` (donde está el archivo `.sln`).
2. Ejecuta:
dotnet restore
dotnet run
3. El backend se ejecutará en un puerto como `https://localhost:7106` (o el que aparezca en consola).
4. Puedes abrir el navegador en `https://localhost:7106/swagger` para ver la documentación Swagger y probar los endpoints.

### Frontend

1. Abre una terminal en la carpeta `/frontend`.
2. Instala dependencias y ejecuta:
npm install
npm start

3. La app React se ejecutará generalmente en `http://localhost:3000`.