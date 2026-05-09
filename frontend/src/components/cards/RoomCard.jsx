import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiHeart, FiMail, FiMapPin, FiShield, FiStar } from "react-icons/fi";
import api from "../../services/api";
import { formatCurrency } from "../../utils/commerce";
import { normalizeRoom } from "../../utils/listingUtils";

const RoomCard = ({ room }) => {
  const item = normalizeRoom(room);

  const saveRoom = async () => {
    try {
      await api.post(`/users/saved-rooms/${item.id}`);
      toast.success("Saved rooms updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login to save this room");
    }
  };

  return (
    <article className="card group overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/rooms/${item.id}`} className="block">
        <div className="relative h-52 overflow-hidden bg-slate-100">
          <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          {item.premium && <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-slate-950 px-3 py-1 text-xs font-bold text-white"><FiShield /> Premium</span>}
          {item.promoted && <span className="absolute right-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">Promoted</span>}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/rooms/${item.id}`} className="block">
          <h3 className="font-bold text-slate-950">{item.title}</h3>
          <p className="mt-2 flex items-center gap-1 text-sm text-slate-500"><FiMapPin /> {item.location}</p>
          <div className="mt-4 flex items-end justify-between">
            <p><span className="text-xl font-extrabold text-blue-600">{formatCurrency(item.rent)}</span><span className="text-sm text-slate-500">/mo</span></p>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{item.available}</span>
          </div>
          <p className="mt-3 flex items-center gap-1 text-xs font-bold text-amber-600"><FiStar /> {item.rating} average</p>
        </Link>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link to={`/rooms/${item.id}`} className="btn-primary py-2 text-sm"><FiMail /> Contact</Link>
          <button onClick={saveRoom} className="btn-secondary py-2 text-sm"><FiHeart /> Save</button>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
