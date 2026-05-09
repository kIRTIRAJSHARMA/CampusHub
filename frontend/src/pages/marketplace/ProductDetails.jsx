import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { FiHeart, FiMail, FiMapPin, FiShield, FiStar } from "react-icons/fi";
import ProductCard from "../../components/cards/ProductCard";
import ContactSellerPanel from "../../components/common/ContactSellerPanel";
import ReviewPanel from "../../components/common/ReviewPanel";
import SectionHeader from "../../components/common/SectionHeader";
import api from "../../services/api";
import { calculateCommission, formatCurrency } from "../../utils/commerce";
import { normalizeProduct } from "../../utils/listingUtils";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => {
      const normalized = normalizeProduct(data);
      setProduct(normalized);
      setActiveImage(normalized.image);
      return api.get("/products");
    }).then(({ data }) => {
      setRelated(data.map(normalizeProduct).filter((item) => item.id !== id).slice(0, 3));
    }).catch(() => setProduct(null));
  }, [id]);

  if (!product) {
    return <div className="container-page py-10"><div className="card p-8 text-center font-bold">Product not found or still loading.</div></div>;
  }

  const commission = calculateCommission(product.price, "product", product.promoted);

  const saveWishlist = async () => {
    try {
      await api.post(`/users/wishlist/${product.id}`);
      toast.success("Wishlist updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login to save this product");
    }
  };

  const checkout = async () => {
    try {
      await api.post("/payments/checkout", { productId: product.id, acceptedTerms });
      toast.success("Payment created with platform commission");
    } catch (error) {
      toast.error(error.response?.data?.message || "Accept T&C and try again");
    }
  };

  return (
    <div className="container-page py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="card overflow-hidden"><img src={activeImage} alt={product.title} className="h-[520px] w-full object-cover" /></div>
          {product.images?.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((image) => <button key={image.url} onClick={() => setActiveImage(image.url)} className="overflow-hidden rounded-xl border border-slate-200"><img src={image.url} alt="" className="h-20 w-full object-cover" /></button>)}
            </div>
          )}
        </div>
        <div className="card p-6">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">{product.category}</span>
          <h1 className="mt-4 text-3xl font-extrabold text-slate-950">{product.title}</h1>
          <p className="mt-3 text-3xl font-extrabold text-blue-600">{formatCurrency(product.price)}</p>
          <p className="mt-5 leading-7 text-slate-600">{product.description}</p>
          <div className="mt-6 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <p className="flex items-center gap-2"><FiMapPin /> {product.location}</p>
            <p className="flex items-center gap-2"><FiStar className="text-amber-500" /> {product.rating} average rating</p>
            <p className="flex items-center gap-2"><FiShield /> Condition: {product.condition}</p>
          </div>
          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm">
            <p className="font-extrabold text-slate-900">Checkout commission</p>
            <div className="mt-3 grid gap-2 text-slate-700">
              <p className="flex justify-between"><span>Platform commission</span><b>{Math.round(commission.rate * 100)}%</b></p>
              <p className="flex justify-between"><span>Commission amount</span><b>{formatCurrency(commission.amount)}</b></p>
              <p className="flex justify-between"><span>Seller receives</span><b>{formatCurrency(commission.sellerReceives)}</b></p>
            </div>
          </div>
          <div className="mt-6"><ContactSellerPanel listingType="product" listingId={product.id} seller={product.sellerProfile} /></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button onClick={checkout} className="btn-primary"><FiMail /> Pay / Checkout</button>
            <button onClick={saveWishlist} className="btn-secondary"><FiHeart /> Save to wishlist</button>
          </div>
          <label className="mt-4 flex items-start gap-2 text-sm font-semibold text-slate-600">
            <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1" />
            I accept the Terms & Conditions before buying and making payment.
          </label>
        </div>
      </div>
      <ReviewPanel targetType="product" targetId={product.id} averageRating={product.rating} reviewCount={product.reviewCount} initialReviews={product.reviews || []} />
      {product.sellerId && <ReviewPanel targetType="seller" targetId={product.sellerId} averageRating={product.sellerProfile?.averageRating} reviewCount={product.sellerProfile?.reviewCount} initialReviews={[]} />}
      {related.length > 0 && (
        <div className="mt-12">
          <SectionHeader title="More Seller Listings" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
