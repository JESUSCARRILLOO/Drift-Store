const PRODUCTS = [
  { id: 1, name: "Nike Dunk Low Retro Hombre", brand: "Nike", category: "hombre", price: 175.00,
    image: "images/Nike-Dunk-Low-Retro-Hombre.jpg",
    images: [
      "images/Nike-Dunk-Low-Retro-Hombre.jpg",
      "images/Nike-Dunk-Low-Retro-Hombre-1.jpg",
      "images/Nike-Dunk-Low-Retro-Hombre-2.jpg",
      "images/Nike-Dunk-Low-Retro-Hombre-3.jpg",
      "images/Nike-Dunk-Low-Retro-Hombre-4.jpg"
    ],
    description: "Un clásico urbano de línea baja, ideal para uso diario. Combina comodidad y estilo streetwear.",
    sizes: [24,25,26,27,28,29,30] },

  { id: 2, name: "Nike Air Max Fire", brand: "Nike", category: "hombre", price: 190.00, onSale: true, originalPrice: 220.00,
    image: "images/Nike-Air-Max-Fire-Hombre.jpg",
    images: [
      "images/Nike-Air-Max-Fire-Hombre.jpg",
      "images/Nike-Air-Max-Fire-Hombre-1.jpg",
      "images/Nike-Air-Max-Fire-Hombre-2.jpg",
      "images/Nike-Air-Max-Fire-Hombre-3.jpg",
      "images/Nike-Air-Max-Fire-Hombre-4.jpg",
      "images/Nike-Air-Max-Fire-Hombre-5.jpg",
      "images/Nike-Air-Max-Fire-Hombre-6.jpg"
    ],
    description: "Amortiguación visible y diseño llamativo para quienes buscan destacar en la calle.",
    sizes: [24,25,26,27,28,29,30] },

  { id: 3, name: "Asics Gel 1130", brand: "Asics", category: "unisex", price: 160.00,
    image: "images/Asics-Gel-1130-Mujer.jpg",
    images: [
      "images/Asics-Gel-1130-Mujer.jpg",
      "images/Asics-Gel-1130-Mujer-1.jpg",
      "images/Asics-Gel-1130-Mujer-2.jpg",
      "images/Asics-Gel-1130-Mujer-3.jpg",
      "images/Asics-Gel-1130-Mujer-4.jpg",
      "images/Asics-Gel-1130-Mujer-5.jpg"
    ],
    description: "Silueta retro running, ligera y versátil para el día a día urbano.",
    sizes: [23,24,25,26,27,28,29] },

  { id: 4, name: "Vans Upland", brand: "Vans", category: "mujer", price: 130.00,
    image: "images/Vans-Upland-Mujer.jpg",
    images: [
      "images/Vans-Upland-Mujer.jpg",
      "images/Vans-Upland-Mujer-1.jpg",
      "images/Vans-Upland-Mujer-2.jpg",
      "images/Vans-Upland-Mujer-3.jpg",
      "images/Vans-Upland-Mujer-4.jpg"
    ],
    description: "Estilo skate clásico con un toque moderno, cómodo para caminar toda la ciudad.",
    sizes: [22,23,24,25,26,27] },

  { id: 5, name: "Puma Suede", brand: "Puma", category: "mujer", price: 110.00, onSale: true, originalPrice: 140.00,
    image: "images/Puma-Suede-Classic-Mujer.jpg",
    images: [
      "images/Puma-Suede-Classic-Mujer.jpg",
      "images/Puma-Suede-Classic-Mujer-1.jpg",
      "images/Puma-Suede-Classic-Mujer-2.jpg",
      "images/Puma-Suede-Classic-Mujer-3.jpg",
      "images/Puma-Suede-Classic-Mujer-4.jpg"
    ],
    description: "El icónico modelo de gamuza, atemporal y fácil de combinar con cualquier outfit.",
    sizes: [22,23,24,25,26,27] },

  { id: 6, name: "Converse Chuck Taylor", brand: "Converse", category: "mujer", price: 85.00,
    image: "images/Converse-Chuck-Taylor-All-Star-Hi-Mujer.jpg",
    images: [
      "images/Converse-Chuck-Taylor-All-Star-Hi-Mujer.jpg",
      "images/Converse-Chuck-Taylor-All-Star-Hi-Mujer-1.jpg",
      "images/Converse-Chuck-Taylor-All-Star-Hi-Mujer-2.jpg",
      "images/Converse-Chuck-Taylor-All-Star-Hi-Mujer-3.jpg",
      "images/Converse-Chuck-Taylor-All-Star-Hi-Mujer-4.jpg",
      "images/Converse-Chuck-Taylor-All-Star-Hi-Mujer-5.jpg"
    ],
    description: "El sneaker más clásico de todos los tiempos, sencillo y versátil.",
    sizes: [22,23,24,25,26,27] },

  { id: 7, name: "Tenis adidas Superstar", brand: "adidas", category: "hombre", price: 95.00,
    image: "images/Adidas-Superstar-Hombre.jpg",
    images: [
      "images/Adidas-Superstar-Hombre.jpg",
      "images/Adidas-Superstar-Hombre-1.jpg",
      "images/Adidas-Superstar-Hombre-2.jpg",
      "images/Adidas-Superstar-Hombre-3.jpg",
      "images/Adidas-Superstar-Hombre-4.jpg",
      "images/Adidas-Superstar-Hombre-5.jpg",
      "images/Adidas-Superstar-Hombre-6.jpg"
    ],
    description: "La icónica punta de concha, un básico infalible del streetwear.",
    sizes: [24,25,26,27,28,29,30] },

  { id: 8, name: "Nike Air Force One", brand: "Nike", category: "unisex", price: 145.00, onSale: true, originalPrice: 175.00,
    image: "images/Nike-Air-Force-one.jpg",
    images: [
      "images/Nike-Air-Force-one.jpg",
      "images/Nike-Air-Force-one-1.jpg",
      "images/Nike-Air-Force-one-2.jpg",
      "images/Nike-Air-Force-one-3.jpg",
      "images/Nike-Air-Force-one-4.jpg",
      "images/Nike-Air-Force-one-5.jpg",
      "images/Nike-Air-Force-one-6.jpg"
    ],
    description: "El modelo blanco por excelencia, atemporal y combinable con cualquier outfit urbano.",
    sizes: [23,24,25,26,27,28,29] },

  { id: 9, name: "Vans Old Skool", brand: "Vans", category: "hombre", price: 120.00,
    image: "images/Vans-Old-Skool-Hombre.jpg",
    images: [
      "images/Vans-Old-Skool-Hombre.jpg",
      "images/Vans-Old-Skool-Hombre-1.jpg",
      "images/Vans-Old-Skool-Hombre-2.jpg",
      "images/Vans-Old-Skool-Hombre-3.jpg",
      "images/Vans-Old-Skool-Hombre-4.jpg"
    ],
    description: "El modelo más reconocible de Vans, con su franja lateral característica.",
    sizes: [24,25,26,27,28,29,30] },
];
