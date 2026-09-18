import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import JsonAnimation from "../../components/animations/JsonAnimation";
import RoomCard from "../../components/cards/RoomCard";
import SectionHeader from "../../components/common/SectionHeader";
import SkeletonCard from "../../components/loaders/SkeletonCard";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { normalizeRoom } from "../../utils/listingUtils";
import emptyStateAnimation from "../../assets/animations/emptyState.json";

const Rooms = () => {
  const [searchParams] = useSearchParams();
  const [roomListings, setRoomListings] = useState([]);
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const canSell = user?.role === "seller" || user?.role === "admin";

  useEffect(() => {
    api.get("/rooms")
      .then(({ data }) => setRoomListings(data.map(normalizeRoom)))
      .catch(() => setRoomListings([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const filteredRooms = useMemo(() => roomListings.filter((room) => {
    const normalizedQuery = query.toLowerCase();
    const matchesQuery =
      !normalizedQuery ||
      [room.title, room.description, room.location, room.college, room.type, room.owner, room.availability, room.distance, ...(room.amenities || [])]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));
    const matchesType = !type || room.type === type;
    return matchesQuery && matchesType;
  }), [query, type, roomListings]);

  return (
    <div>
      <section className="bg-white py-10">
        <div className="container-page rounded-3xl bg-gradient-to-r from-slate-950 to-blue-700 p-8 text-white shadow-soft lg:p-12">
          <p className="font-bold text-orange-300">Get Your Desired Rooms</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-extrabold sm:text-5xl">Leave the stress of finding room, PG, hostel, or flat.</h1>
          <p className="mt-4 max-w-2xl text-white/75">Just search for your ideal accommodation and we'll show you the best options.</p>
          {canSell && <Link to="/seller/add-room" className="mt-7 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:scale-[1.02]">List Your Room</Link>}
        </div>
      </section>
      <section className="container-page py-10">
        <SectionHeader title="Rooms, PGs & Flats" description="Buyer view: only real paid and published room listings are shown here." />
        <div className="mb-8 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft lg:grid-cols-4">
          <input className="input-field" placeholder="College or area" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select className="input-field" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Any type</option>
            <option>Room</option><option>PG</option><option>Hostel</option><option>Flat</option>
          </select>
          <select className="input-field"><option>Budget</option><option>Under ₹7,000</option><option>₹7,000 - ₹12,000</option><option>Above ₹12,000</option></select>
          <select className="input-field"><option>Availability</option><option>Available now</option><option>This month</option></select>
        </div>
        {loading ? (
          <div className="grid gap-6 lg:grid-cols-3"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>
        ) : filteredRooms.length ? (
          <div className="grid gap-6 lg:grid-cols-3">{filteredRooms.map((room) => <RoomCard key={room.id} room={room} />)}</div>
        ) : (
          <div className="card p-8 text-center">
            <JsonAnimation animation={emptyStateAnimation} size="h-44 w-full" />
            <h2 className="text-xl font-extrabold">No paid room listings found</h2>
            <p className="mt-2 text-sm text-slate-600">Sellers must accept charges and complete payment before rooms appear publicly.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Rooms;
