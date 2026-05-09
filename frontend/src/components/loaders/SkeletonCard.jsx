import JsonAnimation from "../animations/JsonAnimation";
import loaderAnimation from "../../assets/animations/loader.json";

const SkeletonCard = () => (
  <div className="card overflow-hidden p-4">
    <JsonAnimation animation={loaderAnimation} size="h-64 w-full" />
  </div>
);

export default SkeletonCard;
