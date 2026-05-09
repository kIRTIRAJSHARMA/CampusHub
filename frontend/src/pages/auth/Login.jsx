import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import AuthCard from "../../components/forms/AuthCard";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      await login({
        email: form.get("email"),
        password: form.get("password"),
      });
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to login");
    }
  };

  const handleGoogleSuccess = async ({ credential }) => {
    if (!acceptedTerms) {
      toast.error("Please accept Terms & Conditions before Google login");
      return;
    }

    try {
      await loginWithGoogle({ credential, role: "buyer", acceptedTerms });
      toast.success("Logged in with Google");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Backend API is not running. Check MongoDB Atlas IP access and restart backend.");
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to manage listings, save rooms, and contact student sellers."
      footer={<>New to CampusHub? <Link className="font-bold text-blue-600" to="/signup">Create account</Link></>}
      onGoogleSuccess={handleGoogleSuccess}
    >
      <label className="mb-4 flex items-start gap-2 text-sm font-semibold text-slate-600">
        <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1" />
        I accept the <Link to="/terms" className="text-blue-600">Terms & Conditions</Link> for first-time Google registration.
      </label>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <input className="input-field" name="email" type="email" placeholder="College email address" required />
        <input className="input-field" name="password" type="password" placeholder="Password" required minLength={6} />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600"><input type="checkbox" className="rounded" /> Remember me</label>
          <Link to="/forgot-password" className="font-bold text-blue-600">Forgot password?</Link>
        </div>
        <button className="btn-primary w-full" type="submit">Login</button>
      </form>
    </AuthCard>
  );
};

export default Login;
