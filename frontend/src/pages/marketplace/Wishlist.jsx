import { useEffect, useState } from "react";
import ProductCard from "../../components/cards/ProductCard";
import RoomCard from "../../components/cards/RoomCard";
import JsonAnimation from "../../components/animations/JsonAnimation";
import SectionHeader from "../../components/common/SectionHeader";
import api from "../../services/api";
import emptyStateAnimation from "../../assets/animations/emptyState.json";

const Wishlist = () => {
  const [saved, setSaved] = useState({ wishlist: [], savedRooms: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/saved")
      .then(({ data }) => setSaved(data))
      .catch(() => setSaved({ wishlist: [], savedRooms: [] }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-page py-10">
      <SectionHeader title="Wishlist & Saved Rooms" description="Products and rooms you save appear here for quick comparison." />
      {loading ? <div className="card p-8 text-center font-bold">Loading saved listings...</div> : (
        <div className="grid gap-10">
          <section>
            <h2 className="mb-4 text-xl font-extrabold">Saved Products</h2>
            {saved.wishlist?.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{saved.wishlist.map((product) => <ProductCard key={product._id} product={product} />)}</div> : <div className="card p-8 text-center text-sm text-slate-600"><JsonAnimation animation={emptyStateAnimation} size="h-44 w-full" />No saved products yet.</div>}
          </section>
          <section>
            <h2 className="mb-4 text-xl font-extrabold">Saved Rooms</h2>
            {saved.savedRooms?.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{saved.savedRooms.map((room) => <RoomCard key={room._id} room={room} />)}</div> : <div className="card p-8 text-center text-sm text-slate-600"><JsonAnimation animation={emptyStateAnimation} size="h-44 w-full" />No saved rooms yet.</div>}
          </section>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
