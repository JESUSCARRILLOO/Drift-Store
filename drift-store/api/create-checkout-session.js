// Esta función corre en el servidor de Vercel, NUNCA en el navegador.
// Aquí es seguro usar tu clave secreta de Stripe (STRIPE_SECRET_KEY).
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Catálogo duplicado aquí a propósito: el precio real SIEMPRE debe
// calcularse en el servidor, nunca confiar en lo que envía el navegador.
const PRODUCTS = [
  { id: "zenith-flow",   name: "Zenith Flow Sneaker",   price: 175.00 },
  { id: "apex-aero",     name: "Apex Aero Stride",      price: 190.00 },
  { id: "future-tech",   name: "Future Tech Runner",    price: 160.00 },
  { id: "city-glow",     name: "City Glow Trainer",     price: 130.00 },
  { id: "velvet-soft",   name: "Velvet Soft Runner",    price: 110.00 },
  { id: "luna-platform", name: "Luna Platform Sneaker", price: 85.00  },
  { id: "urban-dusk",    name: "Urban Dusk Trainer",    price: 95.00  },
  { id: "street-mid",    name: "Street Mid Court",      price: 145.00 },
  { id: "urban-peak",    name: "Urban Peak Runner",     price: 120.00 },
];

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Carrito vacío" });
    }

    const line_items = items.map(({ id, qty }) => {
      const product = PRODUCTS.find(p => p.id === id);
      if (!product) throw new Error(`Producto desconocido: ${id}`);
      return {
        price_data: {
          currency: "usd",
          product_data: { name: product.name },
          unit_amount: Math.round(product.price * 100), // Stripe usa centavos
        },
        quantity: Math.max(1, parseInt(qty) || 1),
      };
    });

    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
