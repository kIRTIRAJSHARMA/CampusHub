import { Link } from "react-router-dom";
import JsonAnimation from "../../components/animations/JsonAnimation";
import notFoundAnimation from "../../assets/animations/notFound.json";

const NotFound = () => (
  <div className="container-page grid min-h-[70vh] place-items-center py-12 text-center">
    <div>
      <JsonAnimation animation={notFoundAnimation} size="h-56 w-full" />
      <p className="text-7xl font-extrabold text-blue-600">404</p>
      <h1 className="mt-4 text-3xl font-extrabold">Page not found</h1>
      <p className="mt-3 text-slate-600">The listing or page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary mt-7">Back to Home</Link>
    </div>
  </div>
);

export default NotFound;
