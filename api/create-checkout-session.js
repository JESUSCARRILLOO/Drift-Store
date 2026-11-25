const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const PRODUCTS = require("../public/products.js");

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
      const product = PRODUCTS.find(p => String(p.id) === String(id));
      if (!product || !Number.isSafeInteger(qty) || qty < 1) return null;
      return {
        price_data: {
          currency: "mxn",
          product_data: { name: product.name },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: qty,
      };
    });
    if (line_items.includes(null)) return res.status(400).json({ error: "Carrito inválido" });
    const origin = req.headers.origin || `https://${req.headers.host}`;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/checkout.html?canceled=true`,
    });
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
