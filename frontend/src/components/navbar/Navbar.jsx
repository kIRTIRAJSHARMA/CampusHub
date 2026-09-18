import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FiChevronDown, FiLogOut, FiMenu, FiSearch, FiShoppingBag, FiUser, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import NotificationBell from "../notifications/NotificationBell";
import { getAvatar } from "../../utils/avatar";
import logo from "../../assets/animations/logo.png";

const navItems = [
  { label: "Marketplace", path: "/products" },
  { label: "Rooms", path: "/rooms" },
  { label: "Messages", path: "/messages" },
  { label: "Dashboard", path: "/seller/dashboard" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const visibleNavItems = navItems.filter((item) => item.label !== "Dashboard" || user?.role === "seller" || user?.role === "admin");
  const linkClass = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-bold transition ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`;
  const handleSearch = (event) => {
    event.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;

    const roomWords = ["room", "rooms", "pg", "hostel", "flat", "rent"];
    const path = roomWords.some((word) => term.toLowerCase().includes(word)) ? "/rooms" : "/products";
    navigate(`${path}?q=${encodeURIComponent(term)}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <nav className="container-page flex min-h-[72px] items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="CampusHub" className="h-10 w-10 rounded-xl object-contain" />
          <span className="text-xl font-extrabold text-slate-950">CampusHub</span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {visibleNavItems.map((item) => <NavLink key={item.path} to={item.path} className={linkClass}>{item.label}</NavLink>)}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <form onSubmit={handleSearch} className="flex w-72 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <FiSearch className="text-slate-400" />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Search books, rooms, cycles..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </form>
          <NotificationBell />
          <Link to="/wishlist" className="rounded-xl border border-slate-200 p-3 text-slate-700 transition hover:bg-slate-50" aria-label="Wishlist"><FiShoppingBag /></Link>
          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50">
                <img src={getAvatar(user)} alt={user?.name || "Profile"} className="h-9 w-9 rounded-full object-cover" />
                <span className="text-left">
                  <span className="block max-w-32 truncate text-sm font-extrabold text-slate-950">{user?.name}</span>
                  <span className="block text-xs capitalize text-slate-500">{user?.role}</span>
                </span>
                <FiChevronDown className="text-slate-400" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-soft">
                  <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-bold hover:bg-slate-50"><FiUser /> My Profile</Link>
                  {(user?.role === "seller" || user?.role === "admin") && <Link to="/seller/dashboard" onClick={() => setProfileOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-bold hover:bg-slate-50">Seller Dashboard</Link>}
                  <button onClick={() => { logout(); setProfileOpen(false); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"><FiLogOut /> Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary py-2.5">Login</Link>
              <Link to="/signup" className="btn-primary py-2.5">Sign up</Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <NotificationBell />
          <button className="rounded-xl border border-slate-200 p-3" onClick={() => setOpen(!open)} aria-label="Open menu">
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-4 lg:hidden">
          <form onSubmit={handleSearch} className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <FiSearch className="text-slate-400" />
            <input className="w-full bg-transparent text-sm outline-none" placeholder="Search CampusHub" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
          </form>
          <div className="grid gap-2">
            {visibleNavItems.map((item) => <NavLink key={item.path} to={item.path} onClick={() => setOpen(false)} className={linkClass}>{item.label}</NavLink>)}
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold">
                  <img src={getAvatar(user)} alt={user?.name || "Profile"} className="h-9 w-9 rounded-full object-cover" />
                  <span>Logged in as {user?.name}</span>
                </Link>
                <button onClick={() => { logout(); setOpen(false); }} className="rounded-xl bg-red-50 px-4 py-3 text-left text-sm font-bold text-red-600">Logout</button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link to="/login" onClick={() => setOpen(false)} className="btn-secondary mt-2">Login</Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary mt-2">Sign up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
