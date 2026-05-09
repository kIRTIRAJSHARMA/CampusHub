import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { isGoogleOAuthReady } from "../../config/oauth";

const AuthCard = ({ title, subtitle, children, footer, onGoogleSuccess, onGoogleError }) => (
  <div className="min-h-[calc(100vh-72px)] bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_35%),radial-gradient(circle_at_bottom_right,#ffedd5,transparent_35%)] px-4 py-12">
    <div className="mx-auto max-w-2xl">
      <div className="card p-6 sm:p-8">
        <h1 className="text-3xl font-extrabold text-slate-950">{title}</h1>
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
    </div>
  </div>
);

export default AuthCard;
