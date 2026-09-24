# DRIFT — Tienda con pagos reales (gratis)

## Qué incluye
- `public/` → tu página web (catálogo + carrito), es lo que la gente ve.
- `api/create-checkout-session.js` → el "backend": crea el cobro en Stripe de forma segura.
- Los precios reales se validan siempre en el servidor, nunca en el navegador (así nadie puede alterar precios desde la consola).

## Paso 1 — Cuenta de Stripe (gratis, sin costo hasta que vendas)
1. Crea una cuenta en https://dashboard.stripe.com/register
2. Ve a **Developers → API keys**.
3. Copia la **Secret key** (empieza con `sk_test_...` en modo prueba).

## Paso 2 — Subir el proyecto a GitHub
1. Crea un repositorio nuevo en https://github.com/new
2. Sube esta carpeta completa (puedes arrastrar los archivos desde la web de GitHub, o usar `git push` si conoces Git).

## Paso 3 — Desplegar en Vercel (gratis)
1. Ve a https://vercel.com y entra con tu cuenta de GitHub.
2. Click en **Add New → Project** y selecciona tu repositorio.
3. En **Environment Variables**, agrega:
   - Nombre: `STRIPE_SECRET_KEY`
   - Valor: tu clave secreta de Stripe del Paso 1
4. Click **Deploy**. En ~1 minuto tendrás tu URL pública (algo como `drift-store.vercel.app`).

## Paso 4 — Probar un pago
- Con la clave `sk_test_...`, usa la tarjeta de prueba de Stripe: `4242 4242 4242 4242`, cualquier fecha futura y CVC.
- Cuando quieras cobrar de verdad, activa tu cuenta de Stripe (datos bancarios) y cambia la clave por la de **modo producción** (`sk_live_...`) en Vercel.

## Cómo editar el catálogo
- Cambia productos, nombres y precios en `public/products.js`.
- Actualiza también los mismos precios en `api/create-checkout-session.js` (por seguridad, el precio de cobro se define ahí, no en el navegador).
- Cambia colores/fuentes en `public/style.css`.

## ¿Por qué no se puede publicar directo como "artifact"?
Los pagos reales con Stripe necesitan una clave secreta que **nunca** debe estar en el navegador — por eso se necesita este pequeño backend (`api/`), y por eso Vercel (que sí soporta backend gratis) es la opción, en vez de un simple archivo HTML suelto.
