import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { FiCamera, FiX } from "react-icons/fi";
import AuthCard from "../../components/forms/AuthCard";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("buyer");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo must be under 2 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const preferredCategories = form.getAll("preferredCategories");

    try {
      await signup({
        name: form.get("name"),
        email: form.get("email"),
        college: form.get("college"),
        department: form.get("department"),
        year: form.get("year"),
        phone: form.get("phone"),
        city: form.get("city"),
        hostelOrArea: form.get("hostelOrArea"),
        role: form.get("role"),
        sellerType: form.get("sellerType") || "",
        preferredCategories,
        avatar: avatarPreview,
        password: form.get("password"),
        acceptedTerms: form.get("acceptedTerms") === "on",
      });
      toast.success("Account created");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create account");
    }
  };

  const handleGoogleSuccess = async ({ credential }) => {
    if (!acceptedTerms) {
      toast.error("Please accept Terms & Conditions before Google signup");
      return;
    }

    try {
      await loginWithGoogle({ credential, role, acceptedTerms });
      toast.success("Google account connected");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Backend API is not running. Check MongoDB Atlas IP access and restart backend.");
    }
  };

  return (
    <AuthCard
      title="Create your CampusHub account"
      subtitle="Choose your role and start buying, selling, or listing rooms in your college community."
      footer={<>Already have an account? <Link className="font-bold text-blue-600" to="/login">Login</Link></>}
      onGoogleSuccess={handleGoogleSuccess}
    >
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-3 text-sm font-extrabold text-slate-800">Profile photo</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-white shadow-sm">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-slate-400">
                  <FiCamera className="text-3xl" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:bg-blue-50 hover:text-blue-700">
                <FiCamera /> Upload photo
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="sr-only" />
              </label>
              {avatarPreview && (
                <button type="button" onClick={() => setAvatarPreview("")} className="ml-3 inline-flex items-center gap-1 text-sm font-bold text-red-600">
                  <FiX /> Remove
                </button>
              )}
              <p className="mt-2 text-xs text-slate-500">JPG or PNG, up to 2 MB. This appears on your profile and seller cards.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <input className="input-field" name="name" placeholder="Full name" required />
          <input className="input-field" name="phone" placeholder="Mobile number" required />
        </div>
        <input className="input-field" name="email" type="email" placeholder="College email address" required />
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="input-field" name="college" placeholder="College name" required />
          <input className="input-field" name="department" placeholder="Department / course" required />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <select className="input-field" name="year" required>
            <option value="">Study year</option>
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
            <option>Postgraduate</option>
          </select>
          <input className="input-field" name="city" placeholder="City" required />
        </div>
        <input className="input-field" name="hostelOrArea" placeholder="Hostel, PG, or nearby area" required />
        <div>
          <p className="mb-3 text-sm font-extrabold text-slate-800">Choose your role</p>
          <div className="grid grid-cols-2 gap-3">
          <label className={`cursor-pointer rounded-xl border p-4 text-center text-sm font-bold transition ${role === "buyer" ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700"}`}>
            <input type="radio" name="role" value="buyer" checked={role === "buyer"} onChange={() => setRole("buyer")} className="sr-only" /> Buyer
            <span className="mt-1 block text-xs font-medium text-slate-500">Browse and contact sellers</span>
          </label>
          <label className={`cursor-pointer rounded-xl border p-4 text-center text-sm font-bold transition ${role === "seller" ? "border-orange-200 bg-orange-50 text-orange-700" : "border-slate-200 bg-white text-slate-700"}`}>
            <input type="radio" name="role" value="seller" checked={role === "seller"} onChange={() => setRole("seller")} className="sr-only" /> Seller
            <span className="mt-1 block text-xs font-medium text-slate-500">List products and rooms</span>
          </label>
          </div>
        </div>

        {role === "buyer" ? (
          <div className="rounded-2xl bg-blue-50 p-4">
            <p className="mb-3 text-sm font-extrabold text-blue-800">What are you interested in?</p>
            <div className="grid gap-2 text-sm sm:grid-cols-2">
              {["Books", "Electronics", "Cycles", "Rooms", "Notes", "Hostel Essentials"].map((item) => (
                <label key={item} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 font-semibold text-slate-700">
                  <input type="checkbox" name="preferredCategories" value={item} /> {item}
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-orange-50 p-4">
            <p className="mb-3 text-sm font-extrabold text-orange-800">Seller details</p>
            <select className="input-field" name="sellerType" required>
              <option value="">Seller type</option>
              <option value="student">Student seller</option>
              <option value="property-owner">Room / flat owner</option>
              <option value="pg-manager">PG / hostel manager</option>
            </select>
            <p className="mt-3 text-xs leading-5 text-orange-800">Room listings show the 20% standard or 30% boosted platform commission before publishing.</p>
          </div>
        )}

        <input className="input-field" name="password" type="password" placeholder="Create password" required minLength={6} />
        <label className="flex items-start gap-2 text-sm font-semibold text-slate-600">
          <input type="checkbox" name="acceptedTerms" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1" required />
          I accept the <Link to="/terms" className="text-blue-600">Terms & Conditions</Link> before registration.
        </label>
        <button className="btn-primary w-full" type="submit">Sign up</button>
      </form>
    </AuthCard>
  );
};

export default Signup;
