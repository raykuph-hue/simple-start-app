// Template definitions with industry-specific designs and stock images
export interface TemplateImage {
  hero: string;
  feature1?: string;
  feature2?: string;
  feature3?: string;
  gallery?: string[];
  testimonial?: string;
}

export interface Template {
  id: string;
  name: string;
  industry: string;
  category: "business" | "creative" | "ecommerce" | "service";
  description: string;
  preview: string; // CSS gradient for preview
  accent: string;
  badges: ("Popular" | "New" | "Trending" | "Premium")[];
  features: string[];
  pages: string[];
  images: TemplateImage;
}

// Stock image URLs by category (using high-quality Unsplash images)
const stockImages = {
  technology: {
    hero: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=800&fit=crop",
    feature1: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
    feature2: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
    feature3: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop",
    ],
  },
  restaurant: {
    hero: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop",
    feature1: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
    feature2: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
    feature3: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop",
    ],
  },
  creative: {
    hero: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop",
    feature1: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=600&h=400&fit=crop",
    feature2: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&h=400&fit=crop",
    feature3: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1509395062183-67c5ad6faff9?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
    ],
  },
  fitness: {
    hero: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop",
    feature1: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop",
    feature2: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop",
    feature3: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&h=300&fit=crop",
    ],
  },
  ecommerce: {
    hero: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=800&fit=crop",
    feature1: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop",
    feature2: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
    feature3: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&h=300&fit=crop",
    ],
  },
  agency: {
    hero: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop",
    feature1: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
    feature2: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop",
    feature3: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1552581234-26160f608093?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop",
    ],
  },
  coaching: {
    hero: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=800&fit=crop",
    feature1: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=600&h=400&fit=crop",
    feature2: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
    feature3: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=300&fit=crop",
    ],
  },
  blog: {
    hero: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&h=800&fit=crop",
    feature1: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
    feature2: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop",
    feature3: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=600&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1516414447565-b14be0adf13e?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=300&fit=crop",
    ],
  },
  realestate: {
    hero: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=800&fit=crop",
    feature1: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop",
    feature2: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop",
    feature3: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop",
    ],
  },
  local: {
    hero: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=800&fit=crop",
    feature1: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600&h=400&fit=crop",
    feature2: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&h=400&fit=crop",
    feature3: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=400&h=300&fit=crop",
    ],
  },
  nonprofit: {
    hero: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=800&fit=crop",
    feature1: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&h=400&fit=crop",
    feature2: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&h=400&fit=crop",
    feature3: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1560252829-804f1aedf1be?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&h=300&fit=crop",
    ],
  },
};

export const templates: Template[] = [
  {
    id: "tech-startup",
    name: "Tech Startup",
    industry: "Technology",
    category: "business",
    preview: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    accent: "#00d4ff",
    badges: ["Popular"],
    description: "Modern SaaS landing page with product features, pricing, and testimonials",
    features: ["Hero with CTA", "Feature Grid", "Pricing Table", "Testimonials", "Contact Form"],
    pages: ["Home", "Features", "Pricing", "About", "Contact"],
    images: stockImages.technology,
  },
  {
    id: "restaurant",
    name: "Fine Dining",
    industry: "Restaurant",
    category: "service",
    preview: "linear-gradient(135deg, #1a0f0f 0%, #2d1f1f 50%, #4a2c2c 100%)",
    accent: "#e07a5f",
    badges: ["Popular", "Trending"],
    description: "Elegant restaurant website with menu, reservations, and gallery",
    features: ["Hero Image", "Menu Display", "Reservation Form", "Photo Gallery", "Location Map"],
    pages: ["Home", "Menu", "Reservations", "Gallery", "Contact"],
    images: stockImages.restaurant,
  },
  {
    id: "portfolio",
    name: "Creative Portfolio",
    industry: "Creative",
    category: "creative",
    preview: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)",
    accent: "#ffd700",
    badges: ["New"],
    description: "Showcase your work beautifully with a minimalist portfolio design",
    features: ["Project Grid", "Case Studies", "About Section", "Skills", "Contact"],
    pages: ["Home", "Work", "About", "Contact"],
    images: stockImages.creative,
  },
  {
    id: "fitness",
    name: "Fitness Studio",
    industry: "Fitness",
    category: "service",
    preview: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #252550 100%)",
    accent: "#ff6b6b",
    badges: ["Trending"],
    description: "Energetic gym & studio site with class schedules and membership plans",
    features: ["Hero Video", "Class Schedule", "Trainer Profiles", "Membership Plans", "Contact"],
    pages: ["Home", "Classes", "Trainers", "Pricing", "Contact"],
    images: stockImages.fitness,
  },
  {
    id: "ecommerce",
    name: "Online Store",
    industry: "E-commerce",
    category: "ecommerce",
    preview: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)",
    accent: "#6c3ce9",
    badges: ["Popular", "Premium"],
    description: "Sleek shopping experience with product grid and checkout flow",
    features: ["Product Grid", "Featured Items", "Categories", "Cart", "Checkout"],
    pages: ["Home", "Shop", "Product", "Cart", "Checkout"],
    images: stockImages.ecommerce,
  },
  {
    id: "agency",
    name: "Digital Agency",
    industry: "Agency",
    category: "business",
    preview: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f6416c 100%)",
    accent: "#ffffff",
    badges: ["New", "Premium"],
    description: "Bold creative agency look with portfolio and service offerings",
    features: ["Animated Hero", "Services Grid", "Portfolio", "Team", "Contact"],
    pages: ["Home", "Services", "Work", "Team", "Contact"],
    images: stockImages.agency,
  },
  {
    id: "coaching",
    name: "Life Coach",
    industry: "Coaching",
    category: "service",
    preview: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ee9ca7 100%)",
    accent: "#2d3436",
    badges: ["New"],
    description: "Warm and inviting coaching website with booking integration",
    features: ["Hero Section", "Services", "Testimonials", "Booking", "Blog"],
    pages: ["Home", "Services", "About", "Book", "Blog"],
    images: stockImages.coaching,
  },
  {
    id: "blog",
    name: "Personal Blog",
    industry: "Blog",
    category: "creative",
    preview: "linear-gradient(135deg, #2c3e50 0%, #3498db 50%, #2980b9 100%)",
    accent: "#f1c40f",
    badges: [],
    description: "Clean blog layout with featured posts and categories",
    features: ["Featured Post", "Post Grid", "Categories", "Author Bio", "Newsletter"],
    pages: ["Home", "Articles", "Categories", "About", "Contact"],
    images: stockImages.blog,
  },
  {
    id: "real-estate",
    name: "Real Estate",
    industry: "Real Estate",
    category: "business",
    preview: "linear-gradient(135deg, #232526 0%, #414345 50%, #232526 100%)",
    accent: "#c9a227",
    badges: ["Popular"],
    description: "Luxury real estate website with property listings and search",
    features: ["Property Search", "Featured Listings", "Agent Profiles", "Virtual Tours", "Contact"],
    pages: ["Home", "Listings", "Agents", "About", "Contact"],
    images: stockImages.realestate,
  },
  {
    id: "local-business",
    name: "Local Business",
    industry: "Local",
    category: "service",
    preview: "linear-gradient(135deg, #11998e 0%, #38ef7d 50%, #11998e 100%)",
    accent: "#ffffff",
    badges: ["Trending"],
    description: "Perfect for local shops, services, and small businesses",
    features: ["Hero Section", "Services", "Reviews", "Location", "Hours"],
    pages: ["Home", "Services", "Reviews", "Location", "Contact"],
    images: stockImages.local,
  },
  {
    id: "saas-dashboard",
    name: "SaaS Product",
    industry: "Technology",
    category: "business",
    preview: "linear-gradient(135deg, #0c0c1d 0%, #1a1a3e 50%, #2d2d5a 100%)",
    accent: "#7c3aed",
    badges: ["Premium", "New"],
    description: "Feature-rich SaaS landing page with demo and pricing",
    features: ["Hero Animation", "Feature Cards", "Demo Video", "Pricing", "FAQ"],
    pages: ["Home", "Features", "Pricing", "Demo", "Contact"],
    images: stockImages.technology,
  },
  {
    id: "nonprofit",
    name: "Nonprofit",
    industry: "Non-profit",
    category: "business",
    preview: "linear-gradient(135deg, #134e5e 0%, #71b280 50%, #134e5e 100%)",
    accent: "#f39c12",
    badges: ["New"],
    description: "Impactful nonprofit website with donation and volunteer forms",
    features: ["Mission Statement", "Impact Stats", "Donate Button", "Events", "Volunteer"],
    pages: ["Home", "About", "Programs", "Donate", "Contact"],
    images: stockImages.nonprofit,
  },
];

export const getTemplateById = (id: string): Template | undefined => {
  return templates.find((t) => t.id === id);
};

export const getTemplatesByCategory = (category: Template["category"]): Template[] => {
  return templates.filter((t) => t.category === category);
};

export const getTemplatesByIndustry = (industry: string): Template[] => {
  return templates.filter((t) => t.industry.toLowerCase() === industry.toLowerCase());
};

export const getFeaturedTemplates = (): Template[] => {
  return templates.filter((t) => t.badges.includes("Popular") || t.badges.includes("Trending"));
};

// Helper to get images for a template category
export const getTemplateImages = (templateId: string): TemplateImage | undefined => {
  const template = getTemplateById(templateId);
  return template?.images;
};
