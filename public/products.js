const dpstreetGallery = (base, lastAngle) => [
  `images/${base}.jpg`,
  ...Array.from({ length: lastAngle - 1 }, (_, index) => `images/${base}-${index + 2}.jpg`)
];

const PRODUCTS = [
  { id: 1, name: "Nike Dunk Low Retro Hombre", brand: "Nike", category: "hombre", price: 2599.00,
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

  { id: 2, name: "Nike Air Max Fire Hombre", brand: "Nike", category: "hombre", price: 2099.00, onSale: true, originalPrice: 2399.00,
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

  { id: 3, name: "Asics Gel 1130 Mujer", brand: "Asics", category: "mujer", price: 2399.00,
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

  { id: 4, name: "Vans Upland Mujer", brand: "Vans", category: "mujer", price: 1999.00,
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

  { id: 5, name: "Puma Suede Classic Mujer", brand: "Puma", category: "mujer", price: 1599.00, onSale: true, originalPrice: 1799.00,
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

  { id: 6, name: "Converse Chuck Taylor All Star Hi Mujer", brand: "Converse", category: "mujer", price: 1299.00,
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

  { id: 7, name: "Adidas Superstar Hombre", brand: "adidas", category: "hombre", price: 2299.00,
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

  { id: 8, name: "Nike Air Force One Hombre", brand: "Nike", category: "hombre", price: 2399.00, onSale: true, originalPrice: 2599.00,
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

  { id: 9, name: "Vans Old Skool Hombre", brand: "Vans", category: "hombre", price: 1399.00,
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

  { id: 10, name: "Nike Air Max Invigor Hombre", brand: "Nike", category: "hombre", price: 2099.00,
    image: "images/Nike-Air-Max-Invigor-Hombre-Dpstreet.jpg",
    images: dpstreetGallery("Nike-Air-Max-Invigor-Hombre-Dpstreet", 5),
    description: "Diseño inspirado en el Air Max 95, con malla transpirable, superposiciones ligeras y unidad Air visible.",
    sizes: [25,26,27,28,29,30] },

  { id: 11, name: "Nike Dunk Low Retro Hombre", brand: "Nike", category: "hombre", price: 2599.00,
    image: "images/Nike-Dunk-Low-Retro-Hombre-Dpstreet.jpg",
    images: dpstreetGallery("Nike-Dunk-Low-Retro-Hombre-Dpstreet", 5),
    description: "Silueta inspirada en el basquetbol universitario, con parte superior de piel y suela de goma.",
    sizes: [25,26,27,28,29,30] },

  { id: 12, name: "adidas Superstar Hombre", brand: "adidas", category: "hombre", price: 2299.00,
    image: "images/Adidas-Superstar-Hombre-Dpstreet.jpg",
    images: dpstreetGallery("Adidas-Superstar-Hombre-Dpstreet", 7),
    description: "Un clásico urbano con puntera shell toe, las tres franjas y suela de goma.",
    sizes: [25,26,27,28,29,30] },

  { id: 13, name: "adidas Samba OG Hombre", brand: "adidas", category: "hombre", price: 2299.00,
    image: "images/Adidas-Samba-OG-Hombre-Dpstreet.jpg",
    images: dpstreetGallery("Adidas-Samba-OG-Hombre-Dpstreet", 7),
    description: "Silueta clásica de inspiración futbolera con perfil bajo y suela gum para uso urbano.",
    sizes: [25,26,27,28,29,30] },

  { id: 14, isNewArrival: true, name: "Vans Knu Skool Hombre", brand: "Vans", category: "hombre", price: 1799.00,
    image: "images/Vans-Knu-Skool-Hombre-Dpstreet.jpg",
    images: dpstreetGallery("Vans-Knu-Skool-Hombre-Dpstreet", 6),
    description: "Inspirado en el Old Skool, con Sidestripe de mayor tamaño y una silueta chunky de los años noventa.",
    sizes: [25,26,27,28,29,30] },

  { id: 15, name: "Vans Old Skool Hombre", brand: "Vans", category: "hombre", price: 1399.00,
    image: "images/Vans-Old-Skool-Hombre-Dpstreet.jpg",
    images: dpstreetGallery("Vans-Old-Skool-Hombre-Dpstreet", 5),
    description: "Un clásico skate con la franja lateral Sidestripe, parte superior de lona y suela waffle.",
    sizes: [25,26,27,28,29,30] },

  { id: 16, isNewArrival: true, name: "ASICS Gel-1130 Hombre", brand: "Asics", category: "hombre", price: 2399.00,
    image: "images/Asics-Gel-1130-Hombre-Dpstreet.jpg",
    images: dpstreetGallery("Asics-Gel-1130-Hombre-Dpstreet", 5),
    description: "Silueta retro running con detalles técnicos y amortiguación GEL para una pisada cómoda.",
    sizes: [25,26,27,28,29,30] },

  { id: 17, name: "ASICS Gel-NYC Hombre", brand: "Asics", category: "hombre", price: 3199.00,
    image: "images/Asics-Gel-NYC-Hombre-Dpstreet.jpg",
    images: dpstreetGallery("Asics-Gel-NYC-Hombre-Dpstreet", 5),
    description: "Un diseño urbano que combina referencias retro running con capas de materiales y amortiguación GEL.",
    sizes: [25,26,27,28,29,30] },

  { id: 18, name: "Puma Park Lifestyle Hombre", brand: "Puma", category: "hombre", price: 1849.00,
    image: "images/Puma-Park-Lifestyle-Hombre-Dpstreet.jpg",
    images: dpstreetGallery("Puma-Park-Lifestyle-Hombre-Dpstreet", 5),
    description: "Una silueta casual de inspiración deportiva con líneas limpias para combinar a diario.",
    sizes: [25,26,27,28,29,30] },

  { id: 19, name: "Puma Suede XL Hombre", brand: "Puma", category: "hombre", price: 2199.00,
    image: "images/Puma-Suede-XL-Hombre-Dpstreet.jpg",
    images: dpstreetGallery("Puma-Suede-XL-Hombre-Dpstreet", 7),
    description: "Una actualización de la silueta Suede con acabados de gamuza y proporciones de inspiración skate.",
    sizes: [25,26,27,28,29,30] },

  { id: 20, name: "Nike Dunk Low Mujer", brand: "Nike", category: "mujer", price: 2599.00,
    image: "images/Nike-Dunk-Low-Mujer-Dpstreet.jpg",
    images: dpstreetGallery("Nike-Dunk-Low-Mujer-Dpstreet", 7),
    description: "Un clásico de inspiración basquetbolera con perfil bajo, revestimientos de piel y estilo urbano atemporal.",
    sizes: [22,23,24,25,26] },

  { id: 21, name: "Nike Air Force 1 07 Mujer", brand: "Nike", category: "mujer", price: 2599.00,
    image: "images/Nike-Air-Force-1-07-Mujer-Dpstreet.jpg",
    images: dpstreetGallery("Nike-Air-Force-1-07-Mujer-Dpstreet", 7),
    description: "Silueta icónica de piel con amortiguación Nike Air y suela de goma para acompañar el uso diario.",
    sizes: [22,23,24,25,26] },

  { id: 22, isNewArrival: true, name: "adidas Samba OG Mujer", brand: "adidas", category: "mujer", price: 2399.00,
    image: "images/Adidas-Samba-OG-Mujer-Dpstreet.jpg",
    images: dpstreetGallery("Adidas-Samba-OG-Mujer-Dpstreet", 7),
    description: "Un icono de inspiración futbolera con exterior de piel, detalles de gamuza y suela de caucho natural.",
    sizes: [22,23,24,25,26] },

  { id: 23, name: "adidas Superstar II Mujer", brand: "adidas", category: "mujer", price: 2299.00,
    image: "images/Adidas-Superstar-II-Mujer-Dpstreet.jpg",
    images: dpstreetGallery("Adidas-Superstar-II-Mujer-Dpstreet", 7),
    description: "La clásica punta shell toe y su silueta renovada llevan un referente del basquetbol al estilo urbano.",
    sizes: [22,23,24,25,26] },

  { id: 24, name: "Vans Hylane Mujer", brand: "Vans", category: "mujer", price: 1899.00,
    image: "images/Vans-Hylane-Mujer-Dpstreet.jpg",
    images: dpstreetGallery("Vans-Hylane-Mujer-Dpstreet", 7),
    description: "Un diseño retro de skate con lengüeta acolchada, banda lateral destacada y suela waffle.",
    sizes: [22,23,24,25,26] },

  { id: 25, name: "Vans Old Skool Stackform Mujer", brand: "Vans", category: "mujer", price: 1699.00,
    image: "images/Vans-Old-Skool-Stackform-Mujer-Dpstreet.jpg",
    images: dpstreetGallery("Vans-Old-Skool-Stackform-Mujer-Dpstreet", 5),
    description: "La franja Sidestripe clásica se combina con una plataforma elevada y una silueta skate reconocible.",
    sizes: [22,23,24,25,26] },

  { id: 26, isNewArrival: true, name: "ASICS Gel-NYC 2055 Mujer", brand: "Asics", category: "mujer", price: 2999.00,
    image: "images/Asics-Gel-NYC-2055-Mujer-Dpstreet.jpg",
    images: dpstreetGallery("Asics-Gel-NYC-2055-Mujer-Dpstreet", 5),
    description: "Una silueta retro running con capas inspiradas en los años 2000, espuma ligera y tecnología GEL.",
    sizes: [22,23,24,25,26] },

  { id: 27, name: "ASICS Gel-NYC RGD Mujer", brand: "Asics", category: "mujer", price: 3399.00,
    image: "images/Asics-Gel-NYC-RGD-Mujer-Dpstreet.jpg",
    images: dpstreetGallery("Asics-Gel-NYC-RGD-Mujer-Dpstreet", 5),
    description: "Estética urbana inspirada en el running clásico, con revestimientos y amortiguación GEL en el talón.",
    sizes: [22,23,24,25,26] },

  { id: 28, isNewArrival: true, featuredArrival: true, name: "Puma Speedcat OG Mujer", brand: "Puma", category: "mujer", price: 2199.00,
    image: "images/Puma-Speedcat-OG-Mujer-Dpstreet.jpg",
    images: dpstreetGallery("Puma-Speedcat-OG-Mujer-Dpstreet", 7),
    description: "Inspirado en el automovilismo, combina un perfil estilizado, parte superior de piel y suela de goma.",
    sizes: [22,23,24,25,26] },

  { id: 29, name: "Puma Palermo Mujer", brand: "Puma", category: "mujer", price: 1999.00,
    image: "images/Puma-Palermo-Mujer-Dpstreet.jpg",
    images: dpstreetGallery("Puma-Palermo-Mujer-Dpstreet", 7),
    description: "Un clásico de inspiración futbolera con puntera en T y detalles de gamuza para un look casual.",
    sizes: [22,23,24,25,26] },
];
