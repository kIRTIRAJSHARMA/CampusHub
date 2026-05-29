import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

const getTypingProgress = (event) => {
  const valueLength = Math.max(event.target.value.length, 1);
  return (event.target.selectionStart ?? valueLength) / valueLength;
};

const LoginForm = ({ onMascotModeChange, onMascotProgressChange, redirectTo = "/" }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setReadingMode = (event) => {
    onMascotModeChange?.("email");
    onMascotProgressChange?.(getTypingProgress(event));
  };

  const settleMascot = () => {
    window.setTimeout(() => {
      if (!["email", "password"].includes(document.activeElement?.name)) {
        onMascotModeChange?.("idle");
      }
    }, 70);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    const form = new FormData(event.currentTarget);

    try {
      await login({
        email: form.get("email"),
        password: form.get("password"),
      });
      onMascotModeChange?.("success");
      toast.success("Logged in successfully");
      await wait(650);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      onMascotModeChange?.("error");
      toast.error(error.response?.data?.message || "Unable to login");
      window.setTimeout(() => onMascotModeChange?.("idle"), 900);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <input
        className="input-field"
        name="email"
        type="email"
        placeholder="College email address"
        autoComplete="email"
        required
        onFocus={setReadingMode}
        onChange={setReadingMode}
        onKeyUp={setReadingMode}
        onClick={setReadingMode}
        onBlur={settleMascot}
      />
      <input
        className="input-field"
        name="password"
        type="password"
        placeholder="Password"
        autoComplete="current-password"
        required
        minLength={6}
        onFocus={() => onMascotModeChange?.("password")}
        onBlur={settleMascot}
      />
      <div className="flex items-center justify-between gap-3 text-sm">
        <label className="flex items-center gap-2 text-slate-600">
          <input type="checkbox" className="rounded" /> Remember me
        </label>
        <Link to="/forgot-password" className="font-bold text-blue-600 transition hover:text-orange-600">
          Forgot password?
        </Link>
      </div>
      <button className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Checking..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
