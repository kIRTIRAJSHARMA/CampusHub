import { Link } from "react-router-dom";
import { FiInstagram, FiLinkedin, FiTwitter } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();
  const canSell = user?.role === "seller" || user?.role === "admin";

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-orange-500 font-extrabold text-white">CH</span>
            <span className="text-xl font-extrabold">CampusHub</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">A student-first marketplace for everyday campus needs, trusted rentals, and faster local deals.</p>
        </div>
        <div>
          <h4 className="font-bold">Explore</h4>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <Link to="/products">Products</Link>
            <Link to="/rooms">Rooms</Link>
            {canSell && <Link to="/seller/dashboard">Seller Dashboard</Link>}
          </div>
        </div>
        <div>
          <h4 className="font-bold">Company</h4>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
          </div>
        </div>
        <div>
          <h4 className="font-bold">Legal</h4>
          <div className="mt-4 grid gap-3 text-sm text-slate-600">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
          <div className="mt-5 flex gap-3 text-slate-500">
            <FiInstagram /><FiTwitter /><FiLinkedin />
          </div>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-sm text-slate-500">© 2026 CampusHub. Built for student communities.</div>
    </footer>
  );
};

export default Footer;
