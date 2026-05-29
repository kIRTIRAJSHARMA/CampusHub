import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import SignupForm from "../../components/auth/SignupForm";
import AuthCard from "../../components/forms/AuthCard";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("buyer");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [mascotMode, setMascotMode] = useState("idle");
  const [mascotProgress, setMascotProgress] = useState(0.5);

  const resetMascot = () => window.setTimeout(() => setMascotMode("idle"), 900);

  const handleGoogleSuccess = async ({ credential }) => {
    if (!acceptedTerms) {
      setMascotMode("error");
      toast.error("Please accept Terms & Conditions before Google signup");
      resetMascot();
      return;
    }

    try {
      await loginWithGoogle({ credential, role, acceptedTerms });
      setMascotMode("success");
      toast.success("Google account connected");
      window.setTimeout(() => navigate("/"), 650);
    } catch (error) {
      setMascotMode("error");
      toast.error(error.response?.data?.message || "Backend API is not running. Check MongoDB Atlas IP access and restart backend.");
      resetMascot();
    }
  };

  return (
    <AuthCard
      title="Create your CampusHub account"
      subtitle="Choose your role and start buying, selling, or listing rooms in your college community."
      footer={<>Already have an account? <Link className="font-bold text-blue-600" to="/login">Login</Link></>}
      onGoogleSuccess={handleGoogleSuccess}
      mascotMode={mascotMode}
      mascotProgress={mascotProgress}
    >
      <SignupForm
        role={role}
        setRole={setRole}
        acceptedTerms={acceptedTerms}
        setAcceptedTerms={setAcceptedTerms}
        onMascotModeChange={setMascotMode}
        onMascotProgressChange={setMascotProgress}
      />
    </AuthCard>
  );
};

export default Signup;
