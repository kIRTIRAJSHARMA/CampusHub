import { Link } from "react-router-dom";
import { FiClock, FiHeart, FiHome, FiShoppingBag } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { getAvatar } from "../../utils/avatar";

const Profile = () => {
  const { user } = useAuth();

  return (
  <div className="container-page py-10">
    <div className="card grid gap-6 p-6 lg:grid-cols-[260px_1fr]">
      <aside className="text-center">
        <img src={getAvatar(user)} alt="Profile" className="mx-auto h-32 w-32 rounded-full object-cover" />
        <h1 className="mt-4 text-2xl font-extrabold">{user?.name || "CampusHub Student"}</h1>
        <p className="text-sm text-slate-500">{user?.college || "North City University"}</p>
        <div className="mt-4 grid gap-2 rounded-2xl bg-slate-50 p-4 text-left text-sm text-slate-600">
          <p><b className="text-slate-900">Role:</b> {user?.role || "buyer"}</p>
          <p><b className="text-slate-900">Course:</b> {user?.department || "Not added"}</p>
          <p><b className="text-slate-900">Year:</b> {user?.year || "Not added"}</p>
          <p><b className="text-slate-900">Area:</b> {user?.hostelOrArea || "Not added"}</p>
        </div>
      </aside>
      <section className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "Wishlist", icon: FiHeart, to: "/wishlist", description: "Saved products" },
          { label: "Saved rooms", icon: FiHome, to: "/wishlist", description: "Rooms kept for later" },
          { label: "Recently viewed", icon: FiClock, to: "/products", description: "Continue browsing listings" },
          { label: "Messages", icon: FiShoppingBag, to: "/messages", description: "Buyer and seller chats" },
        ].map(({ label, icon: Icon, to, description }) => (
          <Link key={label} to={to} className="rounded-2xl bg-slate-50 p-5 transition hover:bg-blue-50"><Icon className="text-2xl text-blue-600" /><p className="mt-3 font-extrabold">{label}</p><p className="text-sm text-slate-500">{description}</p></Link>
        ))}
      </section>
    </div>
  </div>
  );
};

export default Profile;
