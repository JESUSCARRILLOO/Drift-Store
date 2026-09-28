const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const PRODUCTS = [
  { id: 1, name: "Nike Court Vision Low",  price: 175.00 },
  { id: 2, name: "Nike Air Max Fire",      price: 190.00 },
  { id: 3, name: "Asics Gel 1130",         price: 160.00 },
  { id: 4, name: "Vans Upland",            price: 130.00 },
  { id: 5, name: "Puma Suede",             price: 110.00 },
  { id: 6, name: "Converse Chuck Taylor",  price: 85.00  },
  { id: 7, name: "Tenis adidas Superstar", price: 95.00  },
  { id: 8, name: "Dunk Low Retro",         price: 145.00 },
  { id: 9, name: "Vans Old Skool",         price: 120.00 },
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
      const product = PRODUCTS.find(p => String(p.id) === String(id));
      if (!product) throw new Error(`Producto desconocido: ${id}`);
      return {
        price_data: {
          currency: "mxn",
          product_data: { name: product.name },
          unit_amount: Math.round(product.price * 100),
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
