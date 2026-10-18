export const categories = [
  { id: 'banarasi', name: 'Banarasi' },
  { id: 'jamdani', name: 'Jamdani' },
  { id: 'cotton', name: 'Cotton' },
  { id: 'kanjivaram', name: 'Kanjivaram' },
  { id: 'party', name: 'Party wear' },
  { id: 'printed', name: 'Printed' },
]

const photo = (id, width = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`

export const products = [
  {
    id: 'marigold-katan',
    name: 'Aubergine Katan',
    category: 'banarasi',
    price: 18400,
    compareAt: 24500,
    fabric: 'Katan silk',
    length: '5.5 m with blouse piece',
    tone: '#6e3b55',
    featured: true,
    note: 'A deep purple ground with a gold border. Woven for weddings and the long evenings around them.',
    image: photo('photo-1610030469983-98e550d6193c'),
  },
  {
    id: 'ivory-tussar',
    name: 'Ivory Tussar',
    category: 'banarasi',
    price: 12800,
    fabric: 'Tussar silk',
    length: '5.5 m with blouse piece',
    tone: '#e7e1d6',
    featured: true,
    note: 'Undyed tussar with a soft slub. The pallu is kept quiet so the cloth can do the talking.',
    image: photo('photo-1742677143629-b9784beab2e1'),
  },
  {
    id: 'mist-jamdani',
    name: 'Mist Jamdani',
    category: 'jamdani',
    price: 9600,
    fabric: 'Cotton jamdani',
    length: '5.5 m with blouse piece',
    tone: '#c5d0c4',
    featured: true,
    note: 'Figured motifs woven into a pale ground. Light enough for a warm afternoon, finished enough for a gathering.',
    image: photo('photo-1609748340041-f5d61e061ebc'),
  },
  {
    id: 'pearl-muslin',
    name: 'Emerald Jamdani',
    category: 'jamdani',
    price: 14200,
    fabric: 'Silk jamdani',
    length: '5.5 m with blouse piece',
    tone: '#1f4a38',
    featured: true,
    note: 'A deep green ground with a woven floral pallu. Rich enough for a celebration, light in the hand.',
    image: photo('photo-1745482036066-5d215ed6b910'),
  },
  {
    id: 'indigo-cotton',
    name: 'Indigo Cotton',
    category: 'cotton',
    price: 3450,
    fabric: 'Handloom cotton',
    length: '5.5 m with blouse piece',
    tone: '#2f3e68',
    note: 'Everyday cotton in a deep indigo. Washes well and holds a crisp fall.',
    image: photo('photo-1610189012906-4c0aa9b9781e'),
  },
  {
    id: 'temple-red',
    name: 'Temple Red',
    category: 'kanjivaram',
    price: 22000,
    fabric: 'Kanjivaram silk',
    length: '5.5 m with blouse piece',
    tone: '#8e2f2f',
    note: 'A temple border in contrasting silk. Made to be worn, then folded away for the next occasion.',
    image: photo('photo-1617627143750-d86bc21e42bb'),
  },
  {
    id: 'champagne-organza',
    name: 'Amethyst Silk',
    category: 'party',
    price: 6800,
    fabric: 'Silk',
    length: '5.5 m with blouse piece',
    tone: '#6b4c7a',
    note: 'A purple silk with a heavy gold border. For evenings when the room is already dressed.',
    image: photo('photo-1641699862936-be9f49b1c38d'),
  },
  {
    id: 'garden-chiffon',
    name: 'Garden Chiffon',
    category: 'printed',
    price: 2950,
    fabric: 'Printed chiffon',
    length: '5.5 m with blouse piece',
    tone: '#3f6b4e',
    note: 'A small floral print on a fluid chiffon. Easy to drape, easy to pack.',
    image: photo('photo-1679006831648-7c9ea12e5807'),
  },
]

export const slides = [
  {
    id: '01',
    title: 'Weaves that hold the light.',
    text: 'Each saree is a conversation between loom and hand. We walk that path with you.',
    image: photo('photo-1742677143629-b9784beab2e1', 1600),
  },
  {
    id: '02',
    title: 'A smaller edit. A clearer choice.',
    text: 'Banarasi, Jamdani, cotton, and a few pieces for the evening. Nothing we cannot stand behind.',
    image: photo('photo-1727430228383-aa1fb59db8bf', 1600),
  },
]

export const principles = [
  {
    id: '01',
    title: 'Handloom',
    text: 'Small batches from looms we know by name. If a weave is rushed, it does not enter the edit.',
  },
  {
    id: '02',
    title: 'Colour',
    text: 'Grounds chosen for how they sit in daylight, not how they shout on a screen.',
  },
  {
    id: '03',
    title: 'Cloth',
    text: 'Silk, cotton, muslin, organza. The fabric is named on every piece, with the blouse length beside it.',
  },
  {
    id: '04',
    title: 'Care',
    text: 'Dry clean the silks. Wash the cottons cold. We would rather tell you that plainly than dress it up.',
  },
]

export function formatPrice(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function categoryName(id) {
  return categories.find((category) => category.id === id)?.name ?? id
}

export function getProduct(id) {
  return products.find((product) => product.id === id)
}
