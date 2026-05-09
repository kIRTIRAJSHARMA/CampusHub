import { Link, useLocation } from "react-router-dom";
import JsonAnimation from "../../components/animations/JsonAnimation";
import paymentFailedAnimation from "../../assets/animations/paymentFailed.json";

const PaymentFailed = () => {
  const location = useLocation();
  const listingType = location.state?.listingType === "product" ? "product" : "room";
  const retryPath = listingType === "product" ? "/products/payment" : "/rooms/payment";

  return (
    <div className="container-page grid min-h-[70vh] place-items-center py-10">
      <div className="card max-w-xl p-8 text-center">
        <JsonAnimation animation={paymentFailedAnimation} size="h-44 w-full" />
        <h1 className="mt-5 text-3xl font-extrabold">Payment Failed</h1>
        <p className="mt-3 text-slate-600">The listing was not published. Please retry the payment to activate your {listingType} advertisement.</p>
        <Link to={retryPath} state={location.state} className="btn-primary mt-7">Try Again</Link>
      </div>
    </div>
  );
};

export default PaymentFailed;
