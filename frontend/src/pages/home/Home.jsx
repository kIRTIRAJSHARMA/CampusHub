import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiBookOpen, FiHome, FiMonitor, FiSearch, FiTrendingUp } from "react-icons/fi";
import SectionHeader from "../../components/common/SectionHeader";
import JsonAnimation from "../../components/animations/JsonAnimation";
import ProductCard from "../../components/cards/ProductCard";
import RoomCard from "../../components/cards/RoomCard";
import SkeletonCard from "../../components/loaders/SkeletonCard";
import api from "../../services/api";
import { normalizeProduct, normalizeRoom } from "../../utils/listingUtils";
import campusHeroAnimation from "../../assets/animations/campusHero.json";
import emptyStateAnimation from "../../assets/animations/emptyState.json";

const categories = ["Books", "Electronics", "Cycles", "Furniture", "Gadgets", "Notes", "Hostel Essentials"];
const iconMap = { Books: FiBookOpen, Electronics: FiMonitor, "Hostel Essentials": FiHome };

const Home = () => {
  const [products, setProducts] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get("/products"), api.get("/rooms")])
      .then(([productRes, roomRes]) => {
        setProducts(productRes.data.map(normalizeProduct));
        setRooms(roomRes.data.map(normalizeRoom));
      })
      .catch(() => {
        setProducts([]);
        setRooms([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;

    const roomWords = ["room", "rooms", "pg", "hostel", "flat", "rent"];
    const path = roomWords.some((word) => term.toLowerCase().includes(word)) ? "/rooms" : "/products";
    navigate(`${path}?q=${encodeURIComponent(term)}`);
  };

  return (
    <div>
      <section className="bg-white">
        <div className="container-page grid min-h-[640px] items-center gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              <FiTrendingUp /> Trusted campus deals, one tap away
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
              Buy, sell, rent, and exchange inside your student community.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Buyers discover real seller listings from MongoDB. Sellers can publish products and paid room ads with photos.
            </p>
            <form onSubmit={handleSearch} className="mt-8 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft sm:flex">
              <div className="flex flex-1 items-center gap-3 px-4 py-3">
                <FiSearch className="text-slate-400" />
                <input className="w-full outline-none" placeholder="Search for laptops, rooms, calculators..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
              </div>
              <button type="submit" className="btn-primary w-full sm:w-auto">Search CampusHub</button>
            </form>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <img
              src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80"
              alt="Students on campus"
              className="h-[520px] w-full rounded-3xl object-cover shadow-soft"
            />
            <JsonAnimation animation={campusHeroAnimation} size="pointer-events-none absolute inset-0 h-full w-full" />
            <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-white/50 bg-white/90 p-5 shadow-soft backdrop-blur">
              <p className="text-sm font-bold text-slate-950">Room listing fee</p>
              <p className="mt-1 text-sm text-slate-600">Publish room ads after reviewing the 20% or 30% platform commission.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container-page py-12">
        <SectionHeader title="Shop By Category" description="Everything students actually need, organized for quick discovery." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = iconMap[category] || FiArrowRight;
            return (
              <Link key={category} to="/products" className="card flex items-center gap-4 p-5 transition hover:-translate-y-1 hover:shadow-lg">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-700"><Icon /></span>
                <span className="font-bold">{category}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-page py-12">
        <SectionHeader title="Featured Products" eyebrow="Marketplace" action={<Link to="/products" className="btn-secondary">View all <FiArrowRight /></Link>} />
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
        ) : products.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} />)}</div>
        ) : (
          <div className="card p-8 text-center text-sm text-slate-600">
            <JsonAnimation animation={emptyStateAnimation} size="h-44 w-full" />
            No seller products yet. Add one from the seller dashboard.
          </div>
        )}
      </section>

      <section className="bg-white py-14">
        <div className="container-page">
          <SectionHeader title="Premium Rooms Near Campus" eyebrow="Rentals" description="Only paid and published room listings appear here." />
          {loading ? (
            <div className="grid gap-6 lg:grid-cols-3"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
          ) : rooms.length ? (
            <div className="grid gap-6 lg:grid-cols-3">{rooms.map((room) => <RoomCard key={room.id} room={room} />)}</div>
        ) : (
            <div className="card p-8 text-center text-sm text-slate-600">
              <JsonAnimation animation={emptyStateAnimation} size="h-44 w-full" />
              No published room listings yet. Sellers must accept charges and complete payment before rooms appear here.
            </div>
          )}
        </div>
      </section>

      <section className="container-page py-12">
        <SectionHeader title="Recently Added" description="Fresh listings from students around you." />
        {products.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{products.slice(-4).map((product) => <ProductCard key={product.id} product={product} />)}</div>
        ) : (
          <div className="card p-8 text-center text-sm text-slate-600">
            <JsonAnimation animation={emptyStateAnimation} size="h-44 w-full" />
            Recently added products will show here.
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
