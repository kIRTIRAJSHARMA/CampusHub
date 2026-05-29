import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import LoginForm from "../../components/auth/LoginForm";
import AuthCard from "../../components/forms/AuthCard";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search || ""}` : "/";
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [mascotMode, setMascotMode] = useState("idle");
  const [mascotProgress, setMascotProgress] = useState(0.5);

  const resetMascot = () => window.setTimeout(() => setMascotMode("idle"), 900);

  const handleGoogleSuccess = async ({ credential }) => {
    if (!acceptedTerms) {
      setMascotMode("error");
      toast.error("Please accept Terms & Conditions before Google login");
      resetMascot();
      return;
    }

    try {
      await loginWithGoogle({ credential, role: "buyer", acceptedTerms });
      setMascotMode("success");
      toast.success("Logged in with Google");
      window.setTimeout(() => navigate(redirectTo, { replace: true }), 650);
    } catch (error) {
      setMascotMode("error");
      toast.error(error.response?.data?.message || "Backend API is not running. Check MongoDB Atlas IP access and restart backend.");
      resetMascot();
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to manage listings, save rooms, and contact student sellers."
      footer={<>New to CampusHub? <Link className="font-bold text-blue-600" to="/signup">Create account</Link></>}
      onGoogleSuccess={handleGoogleSuccess}
      mascotMode={mascotMode}
      mascotProgress={mascotProgress}
    >
      <label className="mb-4 flex items-start gap-2 text-sm font-semibold text-slate-600">
        <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1" />
        I accept the <Link to="/terms" className="text-blue-600">Terms & Conditions</Link> for first-time Google registration.
      </label>
      <LoginForm
        onMascotModeChange={setMascotMode}
        onMascotProgressChange={setMascotProgress}
        redirectTo={redirectTo}
      />
    </AuthCard>
  );
};

export default Login;
