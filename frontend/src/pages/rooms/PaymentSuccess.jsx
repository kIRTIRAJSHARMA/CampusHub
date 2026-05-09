import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import JsonAnimation from "../../components/animations/JsonAnimation";
import paymentSuccessAnimation from "../../assets/animations/paymentSuccess.json";

const PaymentSuccess = () => {
  const location = useLocation();
  const listingType = location.state?.listingType === "product" ? "product" : "room";

  return (
    <div className="container-page grid min-h-[70vh] place-items-center py-10">
      <div className="card max-w-xl p-8 text-center">
        <JsonAnimation animation={paymentSuccessAnimation} size="mx-auto h-28 w-28 overflow-visible" />
        <h1 className="mt-6 text-3xl font-extrabold">Payment Successful</h1>
        <p className="mt-3 text-slate-600">Your {listingType} listing payment is confirmed. Your {listingType} is now published with the selected visibility placement.</p>
        <Link to="/seller/manage-listings" className="btn-primary mt-7">View Published Listing</Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
