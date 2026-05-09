import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { FiCheck, FiHeart, FiMapPin, FiShield, FiStar } from "react-icons/fi";
import ContactSellerPanel from "../../components/common/ContactSellerPanel";
import ReviewPanel from "../../components/common/ReviewPanel";
import api from "../../services/api";
import { calculateCommission, formatCurrency } from "../../utils/commerce";
import { normalizeRoom } from "../../utils/listingUtils";

const RoomDetails = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    api.get(`/rooms/${id}`).then(({ data }) => {
      const normalized = normalizeRoom(data);
      setRoom(normalized);
      setActiveImage(normalized.image);
    }).catch(() => setRoom(null));
  }, [id]);

  if (!room) {
    return <div className="container-page py-10"><div className="card p-8 text-center font-bold">Room not found or still loading.</div></div>;
  }

  const commission = calculateCommission(room.rent, "room", room.promoted);

  const saveRoom = async () => {
    try {
      await api.post(`/users/saved-rooms/${room.id}`);
      toast.success("Saved rooms updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login to save this room");
    }
  };

  const checkout = async () => {
    try {
      await api.post("/payments/checkout", { roomId: room.id, acceptedTerms });
      toast.success("Payment created with platform commission");
    } catch (error) {
      toast.error(error.response?.data?.message || "Accept T&C and try again");
    }
  };

  return (
    <div className="container-page py-10">
      <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <img src={activeImage} alt={room.title} className="h-[500px] w-full rounded-3xl object-cover shadow-soft" />
        <div className="grid gap-4">
          {(room.images?.slice(0, 2) || []).map((image) => <button key={image.url} onClick={() => setActiveImage(image.url)}><img src={image.url} alt="" className="h-[242px] w-full rounded-3xl object-cover shadow-soft" /></button>)}
        </div>
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <section className="card p-6">
          <div className="flex flex-wrap gap-2">
            {room.premium && <span className="flex items-center gap-1 rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white"><FiShield /> Premium Featured</span>}
            {room.promoted && <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">Promoted</span>}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold">{room.title}</h1>
          <p className="mt-3 flex items-center gap-2 text-slate-600"><FiMapPin /> {room.location}</p>
          <p className="mt-3 flex items-center gap-2 text-sm font-bold text-amber-600"><FiStar /> {room.rating} average rating · {room.reviewCount} reviews</p>
          <p className="mt-6 leading-7 text-slate-600">{room.description}</p>
          <h2 className="mt-8 text-xl font-extrabold">Amenities</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {(room.amenities || []).map((amenity) => <p key={amenity} className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm font-bold"><FiCheck className="text-emerald-600" /> {amenity}</p>)}
          </div>
          <div className="mt-8 rounded-2xl bg-blue-50 p-5">
            <p className="font-bold">Nearby college</p>
            <p className="mt-1 text-sm text-slate-600">{room.college} {room.distance ? `· ${room.distance}` : ""}</p>
          </div>
        </section>
        <aside className="card h-fit p-6">
          <p className="text-3xl font-extrabold text-blue-600">{formatCurrency(room.rent)}<span className="text-sm text-slate-500">/mo</span></p>
          <p className="mt-2 text-sm text-slate-600">Deposit: {formatCurrency(room.deposit)}</p>
          <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{room.available}</p>
          <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm">
            <p className="font-extrabold">Checkout commission</p>
            <p className="mt-2 flex justify-between"><span>Platform commission</span><b>{Math.round(commission.rate * 100)}%</b></p>
            <p className="mt-2 flex justify-between"><span>Commission amount</span><b>{formatCurrency(commission.amount)}</b></p>
          </div>
          <ContactSellerPanel listingType="room" listingId={room.id} seller={room.ownerProfile} />
          <button onClick={saveRoom} className="btn-secondary mt-4 w-full"><FiHeart /> Save Room</button>
          <button onClick={checkout} className="btn-primary mt-3 w-full">Pay / Checkout</button>
          <label className="mt-4 flex items-start gap-2 text-xs font-semibold text-slate-600">
            <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1" />
            I accept the Terms & Conditions before booking and making payment.
          </label>
        </aside>
      </div>
      <ReviewPanel targetType="room" targetId={room.id} averageRating={room.rating} reviewCount={room.reviewCount} initialReviews={room.reviews || []} />
      {room.ownerId && <ReviewPanel targetType="seller" targetId={room.ownerId} averageRating={room.ownerProfile?.averageRating} reviewCount={room.ownerProfile?.reviewCount} initialReviews={[]} />}
    </div>
  );
};

export default RoomDetails;
