import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Home from "../pages/home/Home";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Products from "../pages/marketplace/Products";
import ProductDetails from "../pages/marketplace/ProductDetails";
import ProductPayment from "../pages/marketplace/ProductPayment";
import Wishlist from "../pages/marketplace/Wishlist";
import Messages from "../pages/messages/Messages";
import Rooms from "../pages/rooms/Rooms";
import RoomDetails from "../pages/rooms/RoomDetails";
import RoomPayment from "../pages/rooms/RoomPayment";
import PaymentSuccess from "../pages/rooms/PaymentSuccess";
import PaymentFailed from "../pages/rooms/PaymentFailed";
import SellerDashboard from "../pages/dashboard/SellerDashboard";
import AddProduct from "../pages/dashboard/AddProduct";
import AddRoom from "../pages/dashboard/AddRoom";
import ManageListings from "../pages/dashboard/ManageListings";
import Profile from "../pages/profile/Profile";
import About from "../pages/extra/About";
import Contact from "../pages/extra/Contact";
import FAQ from "../pages/extra/FAQ";
import Privacy from "../pages/extra/Privacy";
import Terms from "../pages/extra/Terms";
import NotFound from "../pages/extra/NotFound";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />;
};

const SellerRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === "seller" || user?.role === "admin" ? children : <Navigate to="/products" replace />;
};

const AppRoutes = () => (
  <>
    <Navbar />
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
        <Route path="/products/payment" element={<ProductPayment />} />
        <Route path="/products/payment/success" element={<PaymentSuccess />} />
        <Route path="/products/payment/failed" element={<PaymentFailed />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:id" element={<RoomDetails />} />
        <Route path="/rooms/payment" element={<RoomPayment />} />
        <Route path="/rooms/payment/success" element={<PaymentSuccess />} />
        <Route path="/rooms/payment/failed" element={<PaymentFailed />} />
        <Route path="/seller/dashboard" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
        <Route path="/seller/add-product" element={<SellerRoute><AddProduct /></SellerRoute>} />
        <Route path="/seller/add-room" element={<SellerRoute><AddRoom /></SellerRoute>} />
        <Route path="/seller/manage-listings" element={<SellerRoute><ManageListings /></SellerRoute>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </>
);

export default AppRoutes;
