import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import PandaMascot from "../auth/PandaMascot";
import { isGoogleOAuthReady } from "../../config/oauth";

const AuthCard = ({ title, subtitle, children, footer, onGoogleSuccess, onGoogleError, mascotMode, mascotProgress }) => (
  <div className="relative flex min-h-[calc(100vh-72px)] items-start justify-center overflow-hidden bg-[radial-gradient(circle_at_12%_8%,#dbeafe,transparent_30%),radial-gradient(circle_at_90%_18%,#ffedd5,transparent_28%),linear-gradient(135deg,#f8fafc_0%,#eff6ff_45%,#fff7ed_100%)] px-4 pb-12 pt-48 sm:pb-16 sm:pt-56 lg:pt-60">
    <motion.div
      className="relative mx-auto w-full max-w-xl"
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <PandaMascot mode={mascotMode} inputProgress={mascotProgress} />
      <div className="rounded-[2rem] border border-white/70 bg-white/[0.72] p-5 shadow-[0_24px_70px_rgba(15,23,42,0.13)] backdrop-blur-2xl sm:p-8">
        <h1 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>
        {isGoogleOAuthReady ? (
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white px-4 py-2">
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={onGoogleError || (() => toast.error("Google sign-in failed"))}
              theme="outline"
              size="large"
              width="100%"
              text="continue_with"
              shape="rectangular"
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => toast("Add a real Google OAuth Web Client ID in both .env files, then restart frontend and backend.")}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition hover:bg-slate-50"
          >
            <FcGoogle className="text-xl" /> Continue with Google
          </button>
        )}
        <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase text-slate-400">
          <span className="h-px flex-1 bg-slate-200" /> or <span className="h-px flex-1 bg-slate-200" />
        </div>
        {children}
        {footer && <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>}
      </div>
    </motion.div>
  </div>
);

export default AuthCard;
