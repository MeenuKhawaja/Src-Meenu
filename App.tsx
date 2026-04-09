import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Clock, MapPin, Phone, Star, Plus, Minus, ShoppingCart, 
  Leaf, Users, Award, Heart, ArrowLeft, ArrowRight, Truck 
} from 'lucide-react';

// Types
interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  popular?: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

// Menu Data - Based on Business Info
const menuItems: MenuItem[] = [
  { id: 1, name: "Arabic Shawarma", category: "Fast Food", price: 450, description: "Tender grilled chicken, fresh veggies & signature sauce in warm pita", image: "/images/shawarma.jpg", popular: true },
  { id: 2, name: "Cream Cake Slice", category: "Bakery & Desserts", price: 250, description: "Rich vanilla cream cake with fresh berries and delicate frosting", image: "/images/cream-cake.jpg", popular: true },
  { id: 3, name: "Grilled Chicken Burger", category: "Fast Food", price: 380, description: "Juicy grilled chicken, cheese, crisp veggies on a toasted bun", image: "/images/burger.jpg", popular: true },
  { id: 4, name: "Assorted Pastries & Donuts", category: "Bakery & Desserts", price: 120, description: "Freshly baked, chocolate glazed & sprinkled delights", image: "/images/pastries.jpg" },
  { id: 5, name: "Loaded Cheese Fries", category: "Fast Food", price: 280, description: "Crispy fries topped with melted cheese, sauces & herbs", image: "/images/loaded-fries.jpg" },
  { id: 6, name: "Classic Chicken Sandwich", category: "Fast Food", price: 320, description: "Grilled chicken, fresh vegetables & special mayo on artisan bread", image: "/images/sandwich.jpg" },
  { id: 7, name: "Shawarma Roll", category: "Fast Food", price: 420, description: "Spiced chicken shawarma wrapped with fresh salad in soft paratha", image: "/images/shawarma.jpg" },
  { id: 8, name: "Channa Chaat", category: "Traditional Snacks", price: 180, description: "Spiced chickpeas, tangy chutneys, yogurt & crispy sev", image: "/images/channa-chaat.jpg" },
  { id: 9, name: "Sweet Lassi", category: "Beverages", price: 150, description: "Creamy yogurt drink with cardamom, saffron & pistachio", image: "/images/sweet-lassi.jpg" },
  { id: 10, name: "Spiced Popcorn", category: "Traditional Snacks", price: 100, description: "Freshly popped corn with special masala seasoning", image: "/images/popcorn.jpg" },
];

const categories = ["All", "Bakery & Desserts", "Fast Food", "Traditional Snacks", "Beverages"];

// Initial Reviews
const initialReviews: Review[] = [
  { id: 1, name: "Ahmed Khan", rating: 5, comment: "Best shawarma in Sialkot! So fresh and flavorful. The prices are incredibly affordable too.", date: "2 days ago" },
  { id: 2, name: "Fatima Malik", rating: 4, comment: "Amazing cream cakes and pastries. Perfect place for family dinners. Open till late which is great.", date: "1 week ago" },
  { id: 3, name: "Usman Tariq", rating: 5, comment: "Love the burgers and loaded fries. Great value for money. Always a comfortable and welcoming atmosphere.", date: "3 weeks ago" },
  { id: 4, name: "Ayesha Raza", rating: 4, comment: "The channa chaat and sweet lassi are must-tries! Friendly staff and cozy vibe. Highly recommended for students.", date: "1 month ago" },
];

// Gallery Data
const galleryImages: GalleryImage[] = [
  { id: 1, src: "/images/interior.jpg", alt: "Cozy Cafe Interior", caption: "Our warm and welcoming dining space" },
  { id: 2, src: "/images/family-dine.jpg", alt: "Family Dining", caption: "Perfect for families and friends" },
  { id: 3, src: "/images/shawarma.jpg", alt: "Signature Shawarma", caption: "Our famous Arabic Shawarma" },
  { id: 4, src: "/images/cream-cake.jpg", alt: "Cream Cakes", caption: "Freshly baked cream cakes" },
  { id: 5, src: "/images/burger.jpg", alt: "Grilled Burgers", caption: "Juicy grilled burgers" },
  { id: 6, src: "/images/pastries.jpg", alt: "Fresh Pastries", caption: "Assorted fresh pastries & donuts" },
];

// Business Info
const businessInfo = {
  name: "Ideal Healthy Bakery and Cafe",
  tagline: "Fresh, Flavorful & Comfort in Every Bite",
  address: "GG57+7VM, PGMEA, Kashmir Road, Pakka Garha Ghumman, Sialkot, Pakistan",
  phone: "+92 52 4299100",
  hours: "Open Daily — Closes at 1:00 AM",
  rating: 4.0,
  reviewCount: 404,
};

const App: React.FC = () => {
  // State
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  
  // Gallery Modal
  const [selectedGalleryIndex, setSelectedGalleryIndex] = useState<number | null>(null);
  
  // Review Form & List
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: "", rating: 5, comment: "" });
  
  // Contact Form
  const [contactForm, setContactForm] = useState({ name: "", phone: "", message: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Reservation Form
  const [isReserveOpen, setIsReserveOpen] = useState(false);
  const [reserveForm, setReserveForm] = useState({ name: "", phone: "", date: "", time: "", guests: "2" });
  const [reserveSuccess, setReserveSuccess] = useState(false);

  // Mobile Menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filtered Menu
  const filteredMenu = activeCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  // Cart Functions
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Checkout
  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const [checkoutForm, setCheckoutForm] = useState({
    customerName: "",
    phone: "",
    orderType: "Delivery" as "Delivery" | "Takeaway" | "Dine-in",
    address: "",
  });

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrderNum = "IH" + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(newOrderNum);
    setIsCheckoutOpen(false);
    setIsSuccessOpen(true);
    // Clear cart after successful order
    setTimeout(() => {
      setCart([]);
    }, 500);
  };

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setCheckoutForm({ customerName: "", phone: "", orderType: "Delivery", address: "" });
  };

  // Gallery Functions
  const openGallery = (index: number) => setSelectedGalleryIndex(index);
  const closeGallery = () => setSelectedGalleryIndex(null);
  const goToPrev = () => {
    if (selectedGalleryIndex !== null) {
      setSelectedGalleryIndex((selectedGalleryIndex - 1 + galleryImages.length) % galleryImages.length);
    }
  };
  const goToNext = () => {
    if (selectedGalleryIndex !== null) {
      setSelectedGalleryIndex((selectedGalleryIndex + 1) % galleryImages.length);
    }
  };

  // Reviews Functions
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    const review: Review = {
      id: Date.now(),
      name: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: "Just now",
    };
    setReviews([review, ...reviews]);
    setNewReview({ name: "", rating: 5, comment: "" });
    setShowReviewForm(false);
  };

  const renderStars = (rating: number, interactive = false, onRate?: (r: number) => void) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`star w-5 h-5 ${i < rating ? "fill-[#D9A66C] text-[#D9A66C]" : "text-gray-300"} ${interactive ? "cursor-pointer" : ""}`}
        onClick={() => interactive && onRate && onRate(i + 1)}
      />
    ));
  };

  // Contact Form Submit
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({ name: "", phone: "", message: "" });
    }, 2200);
  };

  // Reservation Submit
  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveForm.name || !reserveForm.phone) return;
    setReserveSuccess(true);
    setTimeout(() => {
      setIsReserveOpen(false);
      setReserveSuccess(false);
      setReserveForm({ name: "", phone: "", date: "", time: "", guests: "2" });
    }, 1800);
  };

  // Smooth Scroll
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition - bodyRect - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#1A1A1A]">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#D9A66C]/20">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-full bg-[#6B3E2E] flex items-center justify-center">
              <Heart className="w-5 h-5 text-[#D9A66C]" />
            </div>
            <div>
              <div className="font-serif text-2xl tracking-tight text-[#6B3E2E]">Ideal Healthy</div>
              <div className="text-[10px] text-[#6B3E2E]/70 -mt-1">BAKERY &amp; CAFE</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium tracking-wide">
            <button onClick={() => scrollToSection('about')} className="hover:text-[#6B3E2E] transition-colors">Our Story</button>
            <button onClick={() => scrollToSection('menu')} className="hover:text-[#6B3E2E] transition-colors">Menu</button>
            <button onClick={() => scrollToSection('why')} className="hover:text-[#6B3E2E] transition-colors">Why Us</button>
            <button onClick={() => scrollToSection('reviews')} className="hover:text-[#6B3E2E] transition-colors">Reviews</button>
            <button onClick={() => scrollToSection('gallery')} className="hover:text-[#6B3E2E] transition-colors">Gallery</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-[#6B3E2E] transition-colors">Visit Us</button>
          </nav>

          {/* Right Side: Cart + Order */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#6B3E2E] hover:bg-[#FFF8F2] transition-all text-sm font-medium relative"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D9A66C] text-[#6B3E2E] text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => scrollToSection('menu')}
              className="btn-primary hidden md:block px-8 py-2.5 rounded-full text-sm font-semibold tracking-wide"
            >
              ORDER NOW
            </button>
            
            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2">
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }} 
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t bg-white px-6 py-6 flex flex-col gap-4 text-lg"
            >
              {["about", "menu", "why", "reviews", "gallery", "contact"].map((sec) => (
                <button key={sec} onClick={() => scrollToSection(sec)} className="text-left py-1 capitalize">
                  {sec === "why" ? "Why Choose Us" : sec === "about" ? "Our Story" : sec}
                </button>
              ))}
              <button onClick={() => scrollToSection('menu')} className="btn-primary mt-3 py-3 rounded-full">ORDER NOW</button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-[100dvh] min-h-[620px] flex items-center justify-center overflow-hidden bg-[#FFF8F2]">
        <div className="absolute inset-0 bg-[radial-gradient(#6B3E2E_0.6px,transparent_1px)] bg-[length:5px_5px] opacity-[0.035]"></div>
        
        <img 
          src="/images/hero.jpg" 
          alt="Cozy Bakery Cafe Interior" 
          className="absolute inset-0 w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <div className="relative z-10 max-w-4xl px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/90 text-[#6B3E2E] rounded-full px-5 py-1 text-xs tracking-[2px] mb-6 font-medium">
            EST. IN SIALKOT • OPEN TILL 1 AM
          </div>
          
          <h1 className="serif text-[68px] md:text-[84px] leading-[0.9] font-semibold tracking-[-3.2px] mb-4">
            FRESHLY MADE.<br />ALWAYS DELICIOUS.
          </h1>
          <p className="max-w-lg mx-auto text-xl md:text-2xl text-white/90 font-light tracking-[-0.2px] mb-9">
            Your go-to bakery &amp; cafe in Sialkot for comfort food, desserts, and late-night cravings.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => scrollToSection('menu')} 
              className="btn-primary px-10 py-4 rounded-full text-lg font-semibold tracking-wide"
            >
              VIEW MENU
            </button>
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="btn-accent px-10 py-4 rounded-full text-lg font-semibold tracking-wide flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" /> ORDER NOW
            </button>
          </div>

          {/* Rating Badge */}
          <div className="mt-12 inline-flex items-center gap-3 bg-white/95 text-[#1A1A1A] rounded-2xl px-8 py-3.5 shadow-xl">
            <div className="flex">{renderStars(4)}</div>
            <div>
              <div className="font-semibold text-xl leading-none">{businessInfo.rating}</div>
              <div className="text-[11px] text-[#6B3E2E]/70 -mt-px">from {businessInfo.reviewCount}+ happy customers</div>
            </div>
          </div>
        </div>

        {/* Scroll Prompt */}
        <div onClick={() => scrollToSection('about')} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/70 cursor-pointer hover:text-white text-xs tracking-[3px]">
          SCROLL TO DISCOVER <div className="h-px w-6 bg-white/40 my-1.5" /> ↓
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="uppercase tracking-[3px] text-[#D9A66C] text-sm mb-4">ESTABLISHED WITH LOVE IN SIALKOT</div>
            <h2 className="serif text-[#6B3E2E] text-6xl leading-none tracking-[-1.6px] mb-8">Your Everyday<br />Comfort Food Destination</h2>
            
            <div className="space-y-6 text-[17px] leading-relaxed text-[#1A1A1A]/90">
              <p>A place where taste meets comfort. From freshly baked pastries to satisfying meals, we bring you flavors you’ll come back for.</p>
              <p>Known across Sialkot for our wide variety, affordable prices, and welcoming atmosphere — we’re the trusted spot for families, students, and late-night food lovers alike.</p>
            </div>
            <div className="flex gap-4 mt-9">
              <button onClick={() => scrollToSection('menu')} className="btn-outline px-9 py-3.5 rounded-full text-sm tracking-widest">EXPLORE THE MENU</button>
              <button onClick={() => setIsReserveOpen(true)} className="px-9 py-3.5 rounded-full border border-[#D9A66C] text-[#6B3E2E] text-sm tracking-widest hover:bg-[#FFF8F2]">RESERVE A TABLE</button>
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden aspect-[16/11] shadow-2xl">
            <img src="/images/interior.jpg" alt="Cafe Interior" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 p-9 text-white">
              <p className="text-sm opacity-80">Comfortable. Welcoming. Always open late.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MENU SECTION */}
      <section id="menu" className="bg-[#FFF8F2] py-20 border-y border-[#D9A66C]/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-[#D9A66C] tracking-[4px] text-sm mb-3">DISCOVER OUR FAVORITES</div>
            <h2 className="serif text-[#6B3E2E] text-6xl tracking-[-1.8px]">Our Menu</h2>
            <p className="mt-4 max-w-md mx-auto text-lg">Fresh bakery items, flavorful fast food, and traditional Pakistani favorites — all at budget-friendly prices.</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-x-9 gap-y-3 mb-12 border-b pb-4 text-sm font-medium">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={`tab pb-1.5 ${activeCategory === cat ? 'active font-semibold' : 'text-[#6B3E2E]/60 hover:text-[#6B3E2E]'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenu.map(item => (
              <div key={item.id} className="menu-card bg-white rounded-3xl overflow-hidden shadow border border-[#D9A66C]/10 flex flex-col">
                <div className="relative h-56 overflow-hidden">
                  <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                  {item.popular && (
                    <div className="popular-tag absolute top-4 right-4 px-4 py-1 rounded-full tracking-[1px] font-semibold">MOST POPULAR</div>
                  )}
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-serif text-2xl tracking-tight text-[#6B3E2E]">{item.name}</h3>
                    <div className="font-semibold text-[#6B3E2E] whitespace-nowrap">PKR {item.price}</div>
                  </div>
                  <p className="text-[15px] text-[#1A1A1A]/75 leading-snug mb-auto">{item.description}</p>
                  <button 
                    onClick={() => addToCart(item)} 
                    className="mt-7 w-full py-3.5 rounded-2xl bg-[#6B3E2E] text-white text-sm tracking-[1px] hover:bg-[#8C5F4D] active:scale-[0.985] flex items-center justify-center gap-2 transition"
                  >
                    <Plus className="w-4 h-4" /> ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <button onClick={() => setIsCartOpen(true)} className="btn-accent inline-flex px-12 py-4 rounded-full font-semibold text-lg items-center gap-3">
              <ShoppingCart /> VIEW YOUR CART ({cartCount})
            </button>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <div className="text-[#D9A66C] text-xs tracking-[4px] mb-2">THE IDEAL DIFFERENCE</div>
          <h2 className="serif text-[#6B3E2E] text-6xl tracking-[-1.6px]">Why Choose Ideal Healthy</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Leaf, title: "Fresh Ingredients", desc: "Every dish prepared daily using the freshest local produce and premium ingredients." },
            { icon: Award, title: "Affordable Prices", desc: "Exceptional quality and generous portions without the premium price tag." },
            { icon: Menu, title: "Wide Variety", desc: "From baked goods and burgers to traditional chaat and shawarmas — something for everyone." },
            { icon: Users, title: "Family-Friendly", desc: "Comfortable seating and a welcoming space perfect for families, students, and friends." },
            { icon: Clock, title: "Open Late Till 1 AM", desc: "Late-night cravings? We’re open every day till 1 AM. Perfect for students and night owls." },
            { icon: Truck, title: "Dine-In • Takeaway • Delivery", desc: "Enjoy here, grab &amp; go, or have your favorites delivered right to your doorstep." },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-9 border border-[#D9A66C]/10 group">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF8F2] flex items-center justify-center mb-8 group-hover:bg-[#D9A66C] transition-colors">
                <feature.icon className="w-7 h-7 text-[#6B3E2E]" />
              </div>
              <h4 className="text-2xl font-serif tracking-tight mb-4 text-[#6B3E2E]">{feature.title}</h4>
              <p className="leading-relaxed text-[#1A1A1A]/75">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CUSTOMER REVIEWS */}
      <section id="reviews" className="bg-[#6B3E2E] py-20 text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-y-4 mb-10">
            <div>
              <div className="tracking-[3px] text-[#D9A66C] text-sm mb-2">REAL STORIES FROM OUR GUESTS</div>
              <h2 className="serif text-white text-6xl tracking-[-1.6px]">What Our Guests Say</h2>
            </div>
            <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn-accent self-start md:self-auto px-8 py-3 rounded-full text-sm font-semibold flex items-center gap-2 text-[#6B3E2E]">
              {showReviewForm ? "CLOSE FORM" : "SHARE YOUR EXPERIENCE"}
            </button>
          </div>

          {/* Add Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.form 
                initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:20 }}
                onSubmit={handleReviewSubmit}
                className="bg-white/10 border border-white/20 p-9 rounded-3xl mb-10 max-w-2xl"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <input type="text" placeholder="Your Name" value={newReview.name} onChange={(e) => setNewReview({...newReview, name: e.target.value})} required className="bg-white/95 text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 px-6 py-4 rounded-2xl outline-none" />
                  <div className="flex items-center gap-3 bg-white/95 px-6 rounded-2xl">
                    <span className="text-sm text-[#1A1A1A]/70">Rating</span>
                    <div className="flex">{renderStars(newReview.rating, true, (r) => setNewReview({...newReview, rating: r}))}</div>
                  </div>
                </div>
                <textarea placeholder="Tell us about your experience..." rows={3} value={newReview.comment} onChange={(e) => setNewReview({...newReview, comment: e.target.value})} required className="mt-5 w-full resize-y bg-white/95 text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 px-6 py-4 rounded-2xl outline-none" />
                <button type="submit" className="mt-6 btn-primary w-full py-4 rounded-2xl text-lg tracking-widest">POST MY REVIEW</button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review, i) => (
              <div key={i} className="bg-white/95 text-[#1A1A1A] rounded-3xl px-9 py-9">
                <div className="flex justify-between mb-4">
                  <div>
                    <div className="font-semibold tracking-tight text-xl">{review.name}</div>
                    <div className="text-xs text-[#6B3E2E]/60">{review.date}</div>
                  </div>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                <p className="leading-snug text-[15px] text-[#1A1A1A]/85">“{review.comment}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="text-[#D9A66C] tracking-[4px] text-sm">A TASTE OF THE EXPERIENCE</div>
          <h2 className="serif text-[#6B3E2E] text-[58px] tracking-[-1.6px]">Moments at Ideal Healthy</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((img, index) => (
            <div key={img.id} onClick={() => openGallery(index)} className="group relative aspect-[16/11] rounded-3xl overflow-hidden shadow cursor-pointer">
              <img src={img.src} alt={img.alt} className="gallery-img absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70 transition-all group-hover:via-black/50" />
              <div className="absolute bottom-0 p-7 text-white">
                <div className="font-serif text-2xl tracking-tight mb-1.5 leading-none">{img.caption}</div>
                <div className="text-sm text-white/70">Click to enlarge</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT & LOCATION */}
      <section id="contact" className="bg-[#FFF8F2] py-20 border-t">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-x-16 gap-y-14">
          {/* Left: Info + Forms */}
          <div>
            <div className="text-[#D9A66C] tracking-widest text-sm">COME SAY HELLO</div>
            <h2 className="serif text-[#6B3E2E] text-6xl tracking-[-2px] mt-3 leading-none">Visit Us Today</h2>

            <div className="mt-10 space-y-8 text-[15px]">
              <div className="flex gap-5">
                <MapPin className="w-6 h-6 text-[#D9A66C] mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-[#6B3E2E] mb-px">ADDRESS</div>
                  <div>{businessInfo.address}</div>
                </div>
              </div>
              <div className="flex gap-5">
                <Clock className="w-6 h-6 text-[#D9A66C] mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-[#6B3E2E] mb-px">OPENING HOURS</div>
                  <div>{businessInfo.hours}</div>
                  <div className="text-xs text-[#6B3E2E]/60 mt-px">Daily • No Holidays</div>
                </div>
              </div>
              <div className="flex gap-5">
                <Phone className="w-6 h-6 text-[#D9A66C] mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-[#6B3E2E] mb-px">CALL OR WHATSAPP</div>
                  <a href={`tel:${businessInfo.phone}`} className="hover:underline text-xl font-medium text-[#6B3E2E]">{businessInfo.phone}</a>
                </div>
              </div>
            </div>

            {/* Reserve Table CTA */}
            <button onClick={() => setIsReserveOpen(true)} className="mt-10 btn-primary px-10 py-4 rounded-full tracking-[1.5px] font-medium flex items-center gap-2">
              RESERVE YOUR TABLE <Users className="w-4 h-4" />
            </button>

            {/* Simple Contact Form */}
            <div className="mt-14">
              <div className="font-serif text-[#6B3E2E] text-3xl tracking-tight mb-6">Send Us a Message</div>
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} type="text" placeholder="Your Name" required className="bg-white rounded-2xl px-7 py-[17px] border border-[#D9A66C]/20 focus:border-[#D9A66C] outline-none" />
                  <input value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} type="tel" placeholder="Phone Number" required className="bg-white rounded-2xl px-7 py-[17px] border border-[#D9A66C]/20 focus:border-[#D9A66C] outline-none" />
                </div>
                <textarea value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} placeholder="How can we help you today?" rows={3} className="w-full bg-white rounded-3xl px-7 py-5 border border-[#D9A66C]/20 focus:border-[#D9A66C] outline-none resize-y" />
                <button type="submit" className="btn-primary w-full py-4 rounded-2xl font-medium tracking-widest">SEND MESSAGE</button>
                {contactSubmitted && <div className="text-[#D9A66C] font-medium text-center pt-1">Thank you! We will contact you shortly.</div>}
              </form>
            </div>
          </div>

          {/* Right: Map & Hours */}
          <div>
            <div className="rounded-3xl overflow-hidden shadow-xl border border-[#D9A66C]/20 h-[430px] lg:h-full relative">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3617.894!2d74.529!3d32.48!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391eda6e%3A0x0!2sGG57%2B7VM%20Pakka%20Garha%20Ghumman%2C%20Sialkot%2C%20Punjab!5e0!3m2!1sen!2spk!4v1690000000000" 
                className="w-full h-full border-0" 
                allowFullScreen loading="lazy" 
              />
            </div>
            <div className="mt-5 flex justify-between text-sm">
              <div className="text-[#6B3E2E]/80">Sialkot, Pakistan</div>
              <a href={`https://maps.google.com/?q=${encodeURIComponent(businessInfo.address)}`} target="_blank" className="flex items-center gap-1.5 underline decoration-[#D9A66C]/40 hover:decoration-[#D9A66C]">GET DIRECTIONS →</a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1A1A1A] text-[#FFF8F2]/90 pt-16 pb-9 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-12 gap-y-16">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-[#D9A66C] rounded-full flex items-center justify-center"><Heart className="w-4.5 h-4.5 text-[#6B3E2E]" /></div>
              <div className="text-white font-serif tracking-tight text-4xl">Ideal Healthy</div>
            </div>
            <div className="pl-1 text-[#FFF8F2]/60 max-w-xs">Fresh bakery. Comforting meals. Late-night warmth. Your neighborhood cafe in Sialkot.</div>
          </div>
          <div className="md:col-span-3 text-sm">
            <div className="font-medium text-white tracking-widest mb-5">QUICK LINKS</div>
            <div className="space-y-[13px] text-[#FFF8F2]/70">
              <button onClick={() => scrollToSection('menu')} className="block hover:text-white">Our Menu</button>
              <button onClick={() => scrollToSection('why')} className="block hover:text-white">Why Choose Us</button>
              <button onClick={() => scrollToSection('gallery')} className="block hover:text-white">Gallery</button>
              <button onClick={() => setIsReserveOpen(true)} className="block hover:text-white">Reserve a Table</button>
            </div>
          </div>
          <div className="md:col-span-4 text-sm">
            <div className="font-medium text-white tracking-widest mb-5">CONTACT</div>
            <div className="space-y-1.5 text-[#FFF8F2]/70">
              <div>{businessInfo.address}</div>
              <a href={`tel:${businessInfo.phone}`} className="hover:text-white block">{businessInfo.phone}</a>
              <div className="pt-3 text-[#D9A66C]">{businessInfo.hours}</div>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-9 border-t border-white/10 max-w-6xl mx-auto text-center text-xs tracking-widest text-white/40">© IDEAL HEALTHY BAKERY &amp; CAFE — SIALKOT, PAKISTAN. MADE WITH LOVE FOR OUR COMMUNITY.</div>
      </footer>

      {/* FLOATING ORDER BUTTON (Mobile) */}
      <button onClick={() => setIsCartOpen(true)} className="fab fixed bottom-7 right-7 md:hidden bg-[#6B3E2E] text-white rounded-full p-4 z-[60] shadow-xl flex items-center gap-2 text-sm font-medium">
        <ShoppingCart className="w-5 h-5" /> {cartCount > 0 && <span>{cartCount}</span>}
      </button>

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[70] flex justify-end" onClick={() => setIsCartOpen(false)}>
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 240 }}
              onClick={e => e.stopPropagation()} 
              className="cart-drawer bg-white w-full max-w-md h-full overflow-y-auto flex flex-col"
            >
              <div className="p-8 flex justify-between items-center border-b">
                <div className="flex items-center gap-4">
                  <ShoppingCart className="w-6 h-6 text-[#6B3E2E]" /> 
                  <div><div className="font-serif tracking-tight text-[#6B3E2E] text-3xl">Your Order</div><div className="text-sm text-[#1A1A1A]/60">Ready in minutes</div></div>
                </div>
                <button onClick={() => setIsCartOpen(false)}><X /></button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center px-9">
                  <div><ShoppingCart className="mx-auto mb-6 opacity-30" size={66} /><p className="text-xl">Your cart is empty</p><p className="mt-1 text-[#1A1A1A]/60">Add something delicious from the menu</p></div>
                </div>
              ) : (
                <>
                  <div className="flex-1 px-8 pt-6 space-y-5 overflow-auto">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 bg-[#FFF8F2] rounded-2xl p-4">
                        <img src={item.image} alt="" className="w-20 h-20 rounded-xl object-cover" />
                        <div className="flex-1 text-sm">
                          <div className="font-medium pr-6">{item.name}</div>
                          <div className="text-[#6B3E2E] font-semibold mt-px">PKR {item.price} × {item.quantity}</div>
                          <div className="flex items-center gap-3 mt-3">
                            <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="border w-7 h-7 flex items-center justify-center rounded hover:bg-white"><Minus size={14} /></button>
                            <div className="font-mono text-xs w-4 text-center">{item.quantity}</div>
                            <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="border w-7 h-7 flex items-center justify-center rounded hover:bg-white"><Plus size={14} /></button>
                            <button onClick={() => removeFromCart(item.id)} className="ml-auto text-xs text-red-600/70 hover:text-red-600 underline">REMOVE</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-8 border-t bg-white">
                    <div className="flex justify-between text-xl mb-6 font-semibold">
                      <div>Total</div><div>PKR {cartTotal}</div>
                    </div>
                    <button onClick={openCheckout} className="w-full btn-primary py-4 rounded-2xl tracking-[2px] text-lg">CHECKOUT &amp; PLACE ORDER</button>
                    <div className="text-center text-xs mt-4 text-[#1A1A1A]/60">Dine-in • Takeaway • Delivery Available</div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHECKOUT MODAL */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur z-[80] flex items-center justify-center p-6" onClick={() => setIsCheckoutOpen(false)}>
            <motion.div initial={{scale:0.96, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.96, opacity:0}} transition={{ease:[0.22,1,0.36,1]}} onClick={e=>e.stopPropagation()} className="modal bg-white rounded-3xl max-w-lg w-full p-9 md:p-11">
              <h3 className="font-serif text-[#6B3E2E] text-[42px] tracking-[-1.2px] mb-1">Checkout</h3>
              <p className="mb-8 text-[#1A1A1A]/60">Please confirm your details. Your order will be ready shortly.</p>
              
              <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                <input required value={checkoutForm.customerName} onChange={e => setCheckoutForm({...checkoutForm, customerName: e.target.value})} placeholder="Full Name" className="w-full bg-[#FFF8F2] border-none rounded-2xl px-7 py-4" />
                <input required value={checkoutForm.phone} onChange={e => setCheckoutForm({...checkoutForm, phone: e.target.value})} placeholder="Phone Number" className="w-full bg-[#FFF8F2] border-none rounded-2xl px-7 py-4" />
                
                <div>
                  <label className="block mb-2 text-sm font-medium text-[#6B3E2E]">Order Type</label>
                  <div className="flex gap-3">
                    {(["Delivery", "Takeaway", "Dine-in"] as const).map(type => (
                      <button type="button" key={type} onClick={() => setCheckoutForm({...checkoutForm, orderType: type, address: type === "Delivery" ? checkoutForm.address : ""})} className={`flex-1 py-3 rounded-2xl text-sm border transition ${checkoutForm.orderType === type ? "bg-[#6B3E2E] text-white border-[#6B3E2E]" : "border-[#D9A66C]/30"}`}>{type}</button>
                    ))}
                  </div>
                </div>

                {checkoutForm.orderType === "Delivery" && (
                  <input required value={checkoutForm.address} onChange={e => setCheckoutForm({...checkoutForm, address: e.target.value})} placeholder="Delivery Address" className="w-full bg-[#FFF8F2] border-none rounded-2xl px-7 py-4" />
                )}

                <div className="pt-4 flex justify-between text-xl border-t">
                  <div>Total Due</div><div className="font-medium tracking-tight">PKR {cartTotal}</div>
                </div>

                <button type="submit" className="w-full py-4 bg-[#D9A66C] text-[#6B3E2E] rounded-2xl font-semibold tracking-[1.5px] text-lg mt-2 active:bg-[#c48a4f]">CONFIRM ORDER • PAY CASH ON DELIVERY</button>
              </form>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-sm underline mx-auto block mt-7 text-[#6B3E2E]/60">Cancel</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ORDER SUCCESS MODAL */}
      <AnimatePresence>
        {isSuccessOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[90] p-5" onClick={closeSuccess}>
            <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} onClick={e=>e.stopPropagation()} className="bg-white rounded-3xl px-10 py-12 max-w-md text-center">
              <div className="mx-auto mb-6 rounded-full w-20 h-20 flex items-center justify-center bg-[#FFF8F2]"><Award className="text-[#D9A66C] w-10 h-10" /></div>
              <h3 className="font-serif tracking-[-1px] text-[#6B3E2E] text-[42px]">Order Confirmed!</h3>
              <p className="mt-3 text-[#1A1A1A]/70">Thank you for choosing Ideal Healthy. Your order <span className="font-mono text-[#6B3E2E] font-semibold">#{orderNumber}</span> has been received.</p>
              
              <div className="my-9 bg-[#FFF8F2] rounded-2xl py-6 px-6 text-left">
                <div className="uppercase tracking-widest text-xs mb-1 text-[#D9A66C]">ESTIMATED READY TIME</div>
                <div className="font-medium text-2xl text-[#6B3E2E]">20–30 MINUTES</div>
                <div className="mt-4 pt-4 border-t text-xs text-[#1A1A1A]/60">Order Type: {checkoutForm.orderType} • Total Paid on Pickup/Delivery: PKR {cartTotal}</div>
              </div>
              <button onClick={closeSuccess} className="btn-primary w-full py-4 rounded-2xl tracking-widest">BACK TO CAFE</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RESERVATION MODAL */}
      <AnimatePresence>
        {isReserveOpen && (
          <div className="fixed inset-0 z-[85] bg-black/70 flex items-center justify-center p-6" onClick={() => setIsReserveOpen(false)}>
            <motion.div initial={{scale:0.95}} animate={{scale:1}} exit={{scale:0.95}} onClick={e=>e.stopPropagation()} className="modal bg-white max-w-md w-full rounded-3xl p-9 md:p-10">
              {!reserveSuccess ? (
                <>
                  <h3 className="font-serif text-5xl text-[#6B3E2E] tracking-tight">Reserve a Table</h3>
                  <p className="mt-3 mb-9 text-[#1A1A1A]/70">Join us for a relaxing meal. We’ll hold your table for 15 minutes.</p>
                  <form onSubmit={handleReserveSubmit} className="space-y-4">
                    <input required placeholder="Full Name" value={reserveForm.name} onChange={e=>setReserveForm({...reserveForm, name: e.target.value})} className="bg-[#FFF8F2] w-full rounded-2xl px-7 py-4" />
                    <input required placeholder="Phone Number" value={reserveForm.phone} onChange={e=>setReserveForm({...reserveForm, phone: e.target.value})} className="bg-[#FFF8F2] w-full rounded-2xl px-7 py-4" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="date" required value={reserveForm.date} onChange={e=>setReserveForm({...reserveForm, date: e.target.value})} className="bg-[#FFF8F2] w-full rounded-2xl px-7 py-4" />
                      <input type="time" required value={reserveForm.time} onChange={e=>setReserveForm({...reserveForm, time: e.target.value})} className="bg-[#FFF8F2] w-full rounded-2xl px-7 py-4" />
                    </div>
                    <select value={reserveForm.guests} onChange={e=>setReserveForm({...reserveForm, guests: e.target.value})} className="bg-[#FFF8F2] w-full rounded-2xl px-7 py-[18px]">
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guests</option>)}
                    </select>
                    <button type="submit" className="mt-3 btn-primary w-full py-4 tracking-widest rounded-2xl">CONFIRM RESERVATION</button>
                  </form>
                </>
              ) : (
                <div className="text-center py-5">
                  <Award className="mx-auto mb-7 w-16 h-16 text-[#D9A66C]" />
                  <div className="font-serif text-5xl text-[#6B3E2E]">You're All Set!</div>
                  <div className="mt-4 text-[#1A1A1A]/70">We look forward to welcoming you.<br />See you soon at Ideal Healthy.</div>
                </div>
              )}
              {!reserveSuccess && <button onClick={()=>setIsReserveOpen(false)} className="text-sm mt-7 block mx-auto text-[#6B3E2E]/60 underline">Maybe later</button>}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GALLERY LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedGalleryIndex !== null && (
          <div className="fixed inset-0 z-[95] bg-black/95 flex items-center justify-center p-4" onClick={closeGallery}>
            <button onClick={closeGallery} className="absolute top-8 right-8 text-white/70 hover:text-white z-10"><X size={32} /></button>
            
            <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
              <img 
                src={galleryImages[selectedGalleryIndex].src} 
                alt={galleryImages[selectedGalleryIndex].alt} 
                className="w-full max-h-[82dvh] object-contain rounded-2xl" 
              />
              <div className="text-white mt-6 flex justify-between items-center px-1">
                <div>
                  <div className="font-serif text-4xl tracking-tight">{galleryImages[selectedGalleryIndex].caption}</div>
                  <div className="opacity-60 text-sm mt-1">{selectedGalleryIndex + 1} / {galleryImages.length}</div>
                </div>
                <div className="flex gap-3">
                  <button onClick={goToPrev} className="rounded-full p-4 border border-white/30 hover:bg-white/10"><ArrowLeft /></button>
                  <button onClick={goToNext} className="rounded-full p-4 border border-white/30 hover:bg-white/10"><ArrowRight /></button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
