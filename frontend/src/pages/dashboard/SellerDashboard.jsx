import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiBox, FiEye, FiHome, FiMessageCircle, FiPlus, FiTrendingUp } from "react-icons/fi";
import SectionHeader from "../../components/common/SectionHeader";
import api from "../../services/api";
import { formatCurrency } from "../../utils/commerce";

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/products/mine/listings"), api.get("/rooms/mine"), api.get("/inquiries")])
      .then(([productRes, roomRes, inquiryRes]) => {
        setProducts(productRes.data);
        setRooms(roomRes.data);
        setInquiries(inquiryRes.data);
      })
      .catch((error) => toast.error(error.response?.data?.message || "Could not load dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const activeProducts = products.filter((product) => product.status === "active").length;
    const publishedRooms = rooms.filter((room) => room.publishStatus === "published").length;
    const draftListings =
      products.filter((product) => product.status === "draft").length +
      rooms.filter((room) => room.publishStatus === "draft").length;
    const totalViews = [...products, ...rooms].reduce((sum, item) => sum + Number(item.views || 0), 0);
    const paidListingCharges = [
      ...products.filter((product) => product.paymentStatus === "paid" || product.status === "active"),
      ...rooms.filter((room) => room.paymentStatus === "paid" || room.publishStatus === "published"),
    ].reduce((sum, item) => sum + Number(item.listingFee || item.commissionAmount || 0), 0);
    const listingIds = new Set([...products, ...rooms].map((item) => item._id));
    const buyerLeads = inquiries.filter((inquiry) => {
      const productId = inquiry.product?._id || inquiry.product;
      const roomId = inquiry.room?._id || inquiry.room;
      return listingIds.has(productId) || listingIds.has(roomId);
    }).length;

    return [
      { label: "Published listings", value: activeProducts + publishedRooms, icon: FiBox },
      { label: "Drafts awaiting payment", value: draftListings, icon: FiTrendingUp },
      { label: "Total listing views", value: totalViews, icon: FiEye },
      { label: "Buyer leads", value: buyerLeads, icon: FiHome },
      { label: "Paid listing charges", value: formatCurrency(paidListingCharges), icon: FiTrendingUp },
    ];
  }, [products, rooms, inquiries]);

  return (
    <div className="container-page py-10">
      <SectionHeader title="Seller Dashboard" description="Manage student marketplace listings, room ads, payments, and listing performance." />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-5">
            <Icon className="text-2xl text-blue-600" />
            <p className="mt-4 text-3xl font-extrabold">{loading ? "..." : value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-4">
        <Link to="/seller/add-product" className="card p-6 transition hover:-translate-y-1"><FiPlus className="text-3xl text-blue-600" /><h2 className="mt-4 text-xl font-extrabold">Add Product</h2><p className="mt-2 text-sm text-slate-600">Sell books, electronics, notes, cycles, and hostel essentials.</p></Link>
        <Link to="/seller/add-room" className="card p-6 transition hover:-translate-y-1"><FiHome className="text-3xl text-orange-500" /><h2 className="mt-4 text-xl font-extrabold">List Your Room</h2><p className="mt-2 text-sm text-slate-600">Complete details, preview charges, pay, and publish.</p></Link>
        <Link to="/seller/manage-listings" className="card p-6 transition hover:-translate-y-1"><FiBox className="text-3xl text-slate-800" /><h2 className="mt-4 text-xl font-extrabold">Manage Listings</h2><p className="mt-2 text-sm text-slate-600">Edit, delete, boost, and track listing performance.</p></Link>
        <Link to="/messages" className="card p-6 transition hover:-translate-y-1"><FiMessageCircle className="text-3xl text-blue-600" /><h2 className="mt-4 text-xl font-extrabold">Buyer Chats</h2><p className="mt-2 text-sm text-slate-600">Reply to product and room inquiries from interested students.</p></Link>
      </div>
    </div>
  );
};

export default SellerDashboard;
