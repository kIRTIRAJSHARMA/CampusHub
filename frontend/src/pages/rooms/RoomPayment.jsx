import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiCreditCard, FiLock, FiShield } from "react-icons/fi";
import api from "../../services/api";
import { formatCurrency } from "../../utils/commerce";

const RoomPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const roomId = location.state?.roomId;
  const amount = location.state?.amount || 0;
  const promoted = Boolean(location.state?.promoted);

  const handlePayment = async () => {
    if (!roomId) {
      navigate("/rooms/payment/success");
      return;
    }

    try {
      const { data } = await api.post("/payments/room-listing", { roomId });
      await api.post("/payments/room-listing/confirm", { paymentId: data.payment._id, success: true });
      toast.success("Room listing published");
      navigate("/rooms/payment/success", { state: { listingType: "room" } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed");
      navigate("/rooms/payment/failed", { state: { listingType: "room", roomId, amount, promoted } });
    }
  };

  return (
    <div className="container-page py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <section className="card p-6">
          <p className="font-bold text-blue-600">Step 5 of 6</p>
          <h1 className="mt-2 text-3xl font-extrabold">Pay {formatCurrency(amount)} Listing Charge</h1>
          <p className="mt-3 text-slate-600">This room listing charge is calculated from the {promoted ? "30%" : "20%"} platform commission and must be accepted before publishing.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {["Better visibility", "Featured placement", "More student reach", "Faster rental chances"].map((item) => (
              <div key={item} className="rounded-2xl bg-blue-50 p-5 font-bold text-slate-800">{item}</div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-slate-200 p-5">
            <h2 className="font-extrabold">Payment Method</h2>
            <div className="mt-4 grid gap-3">
              <label className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 font-bold"><input type="radio" defaultChecked /> UPI / Cards / Net Banking</label>
              <label className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 font-bold"><input type="radio" /> Wallet</label>
            </div>
          </div>
        </section>
        <aside className="card h-fit p-6">
          <h2 className="text-xl font-extrabold">Order Summary</h2>
          <div className="mt-6 grid gap-4 text-sm">
            <div className="flex justify-between"><span>Room listing charge</span><b>{formatCurrency(amount)}</b></div>
            <div className="flex justify-between"><span>Promotion</span><b>{promoted ? "Boosted" : "Standard"}</b></div>
            <div className="flex justify-between"><span>GST included</span><b>{formatCurrency(0)}</b></div>
            <div className="border-t border-slate-200 pt-4 flex justify-between text-lg"><span>Total</span><b>{formatCurrency(amount)}</b></div>
          </div>
          <button onClick={handlePayment} className="btn-primary mt-6 w-full"><FiCreditCard /> Pay {formatCurrency(amount)}</button>
          <Link to="/rooms/payment/failed" state={{ listingType: "room", roomId, amount, promoted }} className="btn-secondary mt-3 w-full">Simulate failed payment</Link>
          <p className="mt-4 flex items-center gap-2 text-xs text-slate-500"><FiLock /> Secured payment UI placeholder for Razorpay/Stripe.</p>
          <p className="mt-2 flex items-center gap-2 text-xs text-slate-500"><FiShield /> Listing publishes only after payment success.</p>
        </aside>
      </div>
    </div>
  );
};

export default RoomPayment;
