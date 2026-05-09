import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiHeart, FiMail, FiMapPin, FiStar } from "react-icons/fi";
import api from "../../services/api";
import { formatCurrency } from "../../utils/commerce";
import { normalizeProduct } from "../../utils/listingUtils";

const ProductCard = ({ product }) => {
  const item = normalizeProduct(product);

  const saveWishlist = async () => {
    try {
      await api.post(`/users/wishlist/${item.id}`);
      toast.success("Wishlist updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login to save this product");
    }
  };

  return (
    <article className="card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/products/${item.id}`} className="block">
        <div className="relative h-48 overflow-hidden bg-slate-100">
          <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          {item.promoted && <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">Promoted</span>}
          {item.featured && !item.promoted && <span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">Featured</span>}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${item.id}`} className="block">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 font-bold text-slate-950">{item.title}</h3>
            <p className="font-extrabold text-blue-600">{formatCurrency(item.price)}</p>
          </div>
          <p className="mt-2 text-sm text-slate-500">{item.category} · {item.condition}</p>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1"><FiMapPin /> {item.location}</span>
            <span className="flex items-center gap-1 text-amber-500"><FiStar /> {item.rating}</span>
          </div>
        </Link>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link to={`/products/${item.id}`} className="btn-primary py-2 text-sm"><FiMail /> Contact</Link>
          <button onClick={saveWishlist} className="btn-secondary py-2 text-sm"><FiHeart /> Save</button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
