import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/cards/ProductCard";
import JsonAnimation from "../../components/animations/JsonAnimation";
import SectionHeader from "../../components/common/SectionHeader";
import SkeletonCard from "../../components/loaders/SkeletonCard";
import api from "../../services/api";
import { normalizeProduct } from "../../utils/listingUtils";
import emptyStateAnimation from "../../assets/animations/emptyState.json";

const categories = ["Books", "Electronics", "Cycles", "Furniture", "Gadgets", "Notes", "Hostel Essentials"];

const Products = () => {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("");
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [location, setLocation] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then(({ data }) => setProducts(data.map(normalizeProduct)))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const filtered = useMemo(() => products.filter((product) => {
    const normalizedQuery = query.toLowerCase();
    const matchesCategory = category === "All" || product.category === category;
    const matchesCondition = !condition || product.condition === condition;
    const matchesQuery =
      !normalizedQuery ||
      [product.title, product.description, product.category, product.condition, product.location, product.college, product.seller]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));
    const matchesLocation = !location || product.location.toLowerCase().includes(location.toLowerCase()) || product.college?.toLowerCase().includes(location.toLowerCase());
    return matchesCategory && matchesCondition && matchesQuery && matchesLocation;
  }), [category, condition, query, location, products]);

  return (
    <div className="container-page py-10">
      <SectionHeader title="Student Marketplace" description="Buyer view: real seller listings from the database, filterable by category, condition, location, and budget." />
      <div className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft lg:grid-cols-4">
        <input className="input-field lg:col-span-2" placeholder="Search products" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select className="input-field" value={condition} onChange={(e) => setCondition(e.target.value)}>
          <option value="">Any condition</option>
          <option>New</option><option>Like New</option><option>Good</option><option>Fair</option>
        </select>
        <input className="input-field" placeholder="Location / college" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
      ) : filtered.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      ) : (
        <div className="card p-8 text-center">
          <JsonAnimation animation={emptyStateAnimation} size="h-44 w-full" />
          <h2 className="text-xl font-extrabold">No products found</h2>
          <p className="mt-2 text-sm text-slate-600">Seller listings will appear here after they publish products.</p>
        </div>
      )}
    </div>
  );
};

export default Products;
