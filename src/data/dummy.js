export const DEMO_MODE = true;

export const demoCategories = [
  { id: 'cat-1', name: 'Manufacturing', icon: '🏭', supplierCount: 48 },
  { id: 'cat-2', name: 'Electronics', icon: '💻', supplierCount: 36 },
  { id: 'cat-3', name: 'Chemicals', icon: '⚗️', supplierCount: 22 },
  { id: 'cat-4', name: 'Textiles', icon: '🧵', supplierCount: 29 },
  { id: 'cat-5', name: 'Machinery', icon: '⚙️', supplierCount: 31 },
  { id: 'cat-6', name: 'Automotive', icon: '🚗', supplierCount: 18 },
  { id: 'cat-7', name: 'Food & Beverage', icon: '🍽️', supplierCount: 27 },
  { id: 'cat-8', name: 'Construction', icon: '🏗️', supplierCount: 24 },
];

export const demoIndustries = [
  { id: 'ind-1', name: 'Industrial Equipment' },
  { id: 'ind-2', name: 'Consumer Electronics' },
  { id: 'ind-3', name: 'Chemicals & Materials' },
  { id: 'ind-4', name: 'Textiles & Apparel' },
  { id: 'ind-5', name: 'Automotive & Parts' },
  { id: 'ind-6', name: 'Construction & Infrastructure' },
];

export const demoSuppliers = [
  {
    id: 'sup-1',
    companyName: 'Atlas Industrial Co.',
    name: 'Atlas Industrial Co.',
    location: 'Dubai, UAE',
    address: 'Jebel Ali Free Zone',
    description: 'Heavy machinery and industrial equipment supplier with global reach.',
    businessDescription: 'Heavy machinery and industrial equipment supplier with global reach.',
    isFeatured: true,
    isVerified: true,
    rating: 4.8,
    reviewCount: 128,
    type: 'MANUFACTURER',
    website: 'https://example.com/atlas',
    websiteUrl: 'https://example.com/atlas',
    industryIds: ['ind-1', 'ind-6'],
  },
  {
    id: 'sup-2',
    companyName: 'Nova Electronics Ltd.',
    name: 'Nova Electronics Ltd.',
    location: 'Shenzhen, China',
    address: 'Nanshan District',
    description: 'OEM electronics supplier specializing in IoT and smart devices.',
    businessDescription: 'OEM electronics supplier specializing in IoT and smart devices.',
    isFeatured: true,
    isVerified: true,
    rating: 4.7,
    reviewCount: 96,
    type: 'TRADER',
    website: 'https://example.com/nova',
    websiteUrl: 'https://example.com/nova',
    industryIds: ['ind-2'],
  },
  {
    id: 'sup-3',
    companyName: 'Cresta Materials',
    name: 'Cresta Materials',
    location: 'Mumbai, India',
    address: 'Andheri East',
    description: 'Bulk chemicals and raw materials for industrial production.',
    businessDescription: 'Bulk chemicals and raw materials for industrial production.',
    isFeatured: true,
    isVerified: true,
    rating: 4.6,
    reviewCount: 74,
    type: 'MANUFACTURER',
    website: 'https://example.com/cresta',
    websiteUrl: 'https://example.com/cresta',
    industryIds: ['ind-3'],
  },
  {
    id: 'sup-4',
    companyName: 'LoomWorks Textiles',
    name: 'LoomWorks Textiles',
    location: 'Istanbul, Turkey',
    address: 'Zeytinburnu',
    description: 'Premium fabric and textile supplier for apparel brands.',
    businessDescription: 'Premium fabric and textile supplier for apparel brands.',
    isFeatured: false,
    isVerified: true,
    rating: 4.5,
    reviewCount: 62,
    type: 'MANUFACTURER',
    website: 'https://example.com/loomworks',
    websiteUrl: 'https://example.com/loomworks',
    industryIds: ['ind-4'],
  },
  {
    id: 'sup-5',
    companyName: 'Torque Auto Parts',
    name: 'Torque Auto Parts',
    location: 'Riyadh, KSA',
    address: 'Olaya District',
    description: 'Automotive components supplier with rapid fulfillment.',
    businessDescription: 'Automotive components supplier with rapid fulfillment.',
    isFeatured: false,
    isVerified: true,
    rating: 4.4,
    reviewCount: 51,
    type: 'TRADER',
    website: 'https://example.com/torque',
    websiteUrl: 'https://example.com/torque',
    industryIds: ['ind-5'],
  },
  {
    id: 'sup-6',
    companyName: 'BuildCore Supplies',
    name: 'BuildCore Supplies',
    location: 'Doha, Qatar',
    address: 'West Bay',
    description: 'Construction materials and site-ready inventory partner.',
    businessDescription: 'Construction materials and site-ready inventory partner.',
    isFeatured: false,
    isVerified: true,
    rating: 4.3,
    reviewCount: 39,
    type: 'CONTRACTOR',
    website: 'https://example.com/buildcore',
    websiteUrl: 'https://example.com/buildcore',
    industryIds: ['ind-6'],
  },
];

export const demoProducts = [
  {
    id: 'prod-1',
    name: 'Industrial Conveyor Belt',
    slug: 'industrial-conveyor-belt',
    overview: 'Heavy-duty conveyor belt system for manufacturing lines.',
    imageUrl: new URL('../assets/images/christopher-burns-8KfCR12oeUM-unsplash.jpg', import.meta.url).href,
    category: { id: 'cat-1', name: 'Manufacturing' },
    industryId: 'ind-1',
    prices: [{ currency: 'USD', amount: 4200 }],
    createdAt: '2025-12-01T10:00:00Z',
  },
  {
    id: 'prod-2',
    name: 'Smart IoT Sensor Kit',
    slug: 'smart-iot-sensor-kit',
    overview: 'Multi-sensor kit with gateway for real-time monitoring.',
    imageUrl: new URL('../assets/images/victor-UoIiVYka3VY-unsplash.jpg', import.meta.url).href,
    category: { id: 'cat-2', name: 'Electronics' },
    industryId: 'ind-2',
    prices: [{ currency: 'USD', amount: 280 }],
    createdAt: '2025-11-18T09:30:00Z',
  },
  {
    id: 'prod-3',
    name: 'Industrial Solvent Pack',
    slug: 'industrial-solvent-pack',
    overview: 'High-purity solvents for industrial cleaning applications.',
    imageUrl: new URL('../assets/images/isis-franca-hsPFuudRg5I-unsplash.jpg', import.meta.url).href,
    category: { id: 'cat-3', name: 'Chemicals' },
    industryId: 'ind-3',
    prices: [{ currency: 'USD', amount: 160 }],
    createdAt: '2025-10-05T12:15:00Z',
  },
  {
    id: 'prod-4',
    name: 'Premium Cotton Fabric',
    slug: 'premium-cotton-fabric',
    overview: 'Soft, durable fabric rolls for apparel manufacturing.',
    imageUrl: new URL('../assets/images/ant-rozetsky-SLIFI67jv5k-unsplash.jpg', import.meta.url).href,
    category: { id: 'cat-4', name: 'Textiles' },
    industryId: 'ind-4',
    prices: [{ currency: 'USD', amount: 12 }],
    createdAt: '2025-09-22T08:45:00Z',
  },
  {
    id: 'prod-5',
    name: 'Precision Gear Set',
    slug: 'precision-gear-set',
    overview: 'Hardened steel gear set for heavy machinery.',
    imageUrl: new URL('../assets/images/1190169.jpg', import.meta.url).href,
    category: { id: 'cat-5', name: 'Machinery' },
    industryId: 'ind-1',
    prices: [{ currency: 'USD', amount: 980 }],
    createdAt: '2025-12-20T07:20:00Z',
  },
  {
    id: 'prod-6',
    name: 'Alloy Brake Discs',
    slug: 'alloy-brake-discs',
    overview: 'Performance brake discs for automotive fleets.',
    imageUrl: new URL('../assets/images/christopher-burns-8KfCR12oeUM-unsplash.jpg', import.meta.url).href,
    category: { id: 'cat-6', name: 'Automotive' },
    industryId: 'ind-5',
    prices: [{ currency: 'USD', amount: 95 }],
    createdAt: '2025-08-12T14:05:00Z',
  },
  {
    id: 'prod-7',
    name: 'Construction Steel Beams',
    slug: 'construction-steel-beams',
    overview: 'Structural steel beams for large-scale projects.',
    imageUrl: new URL('../assets/images/victor-UoIiVYka3VY-unsplash.jpg', import.meta.url).href,
    category: { id: 'cat-8', name: 'Construction' },
    industryId: 'ind-6',
    prices: [{ currency: 'USD', amount: 1200 }],
    createdAt: '2025-07-03T11:10:00Z',
  },
  {
    id: 'prod-8',
    name: 'Food Grade Packaging',
    slug: 'food-grade-packaging',
    overview: 'Safe, durable packaging for food and beverage distribution.',
    imageUrl: new URL('../assets/images/isis-franca-hsPFuudRg5I-unsplash.jpg', import.meta.url).href,
    category: { id: 'cat-7', name: 'Food & Beverage' },
    industryId: 'ind-6',
    prices: [{ currency: 'USD', amount: 25 }],
    createdAt: '2025-06-21T16:40:00Z',
  },
];

const sortProducts = (items, sort) => {
  if (!sort || sort === 'newest') {
    return [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
  if (sort === 'oldest') {
    return [...items].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }
  if (sort === 'a-z') {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sort === 'z-a') {
    return [...items].sort((a, b) => b.name.localeCompare(a.name));
  }
  if (sort === 'price_asc') {
    return [...items].sort((a, b) => (a.prices?.[0]?.amount || 0) - (b.prices?.[0]?.amount || 0));
  }
  if (sort === 'price_desc') {
    return [...items].sort((a, b) => (b.prices?.[0]?.amount || 0) - (a.prices?.[0]?.amount || 0));
  }
  return items;
};

export const filterDemoProducts = (params = {}) => {
  let results = [...demoProducts];
  if (params.search) {
    const term = params.search.toLowerCase();
    results = results.filter((product) =>
      product.name.toLowerCase().includes(term) ||
      product.overview.toLowerCase().includes(term)
    );
  }
  if (params.categoryId) {
    results = results.filter((product) => product.category?.id === params.categoryId);
  }
  if (params.industryId) {
    results = results.filter((product) => product.industryId === params.industryId);
  }
  if (params.currency && (params.minPrice || params.maxPrice)) {
    const min = params.minPrice ? Number(params.minPrice) : 0;
    const max = params.maxPrice ? Number(params.maxPrice) : Number.POSITIVE_INFINITY;
    results = results.filter((product) =>
      (product.prices || []).some((price) =>
        price.currency === params.currency && price.amount >= min && price.amount <= max
      )
    );
  }
  return sortProducts(results, params.sort);
};

export const filterDemoSuppliers = (params = {}) => {
  let results = [...demoSuppliers];
  if (params.search) {
    const term = params.search.toLowerCase();
    results = results.filter((supplier) =>
      (supplier.companyName || '').toLowerCase().includes(term) ||
      (supplier.name || '').toLowerCase().includes(term)
    );
  }
  if (params.supplierType) {
    results = results.filter((supplier) => supplier.type === params.supplierType);
  }
  if (params.industryId) {
    results = results.filter((supplier) => (supplier.industryIds || []).includes(params.industryId));
  }
  return results;
};

export const demoPaginate = (items, params = {}) => {
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 12;
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);
  return { data, meta: { total, page, limit, totalPages } };
};
