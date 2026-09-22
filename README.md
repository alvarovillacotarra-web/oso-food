# Oso Food

Web corporativa estática de Oso Food, gastrobar en Valladolid.

## Desarrollo local

No requiere dependencias. Puedes abrir `index.html` directamente en el navegador o iniciar el servidor incluido:

```powershell
node server.js
```

Después, abre `http://localhost:3000`.

## Publicar en GitHub

1. Crea un repositorio vacío en GitHub (sin README, `.gitignore` ni licencia).
2. Desde esta carpeta, enlázalo y publícalo:

```powershell
git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
git branch -M main
git push -u origin main
```

## Desplegar en Vercel

1. En Vercel, selecciona **Add New → Project** e importa el repositorio de GitHub.
2. Deja los valores detectados: framework **Other**, sin comando de build y directorio de salida `.`.
3. Pulsa **Deploy**.

La configuración de `vercel.json` permite URLs limpias y cachea los recursos estáticos.

Antes de conectar un dominio propio, actualiza en `index.html` las URLs canónicas, Open Graph y los datos estructurados si el dominio final no es `osofoodvalladolid.es`.
