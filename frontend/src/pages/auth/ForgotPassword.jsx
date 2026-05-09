import toast from "react-hot-toast";
import AuthCard from "../../components/forms/AuthCard";

const ForgotPassword = () => (
  <AuthCard title="Reset password" subtitle="Enter your college email and we will send a secure reset link.">
    <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); toast.success("Reset link sent"); }}>
      <input className="input-field" type="email" placeholder="College email address" required />
      <button className="btn-primary w-full" type="submit">Send reset link</button>
    </form>
  </AuthCard>
);

export default ForgotPassword;
