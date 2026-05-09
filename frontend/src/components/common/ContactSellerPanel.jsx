import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiSend, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { getAvatar } from "../../utils/avatar";

const ContactSellerPanel = ({ listingType, listingId, seller }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      toast.error("Login to contact the seller");
      return;
    }

    setSending(true);
    try {
      const { data } = await api.post("/inquiries", {
        [listingType === "product" ? "product" : "room"]: listingId,
        message,
      });
      setMessage("");
      toast.success("Chat started");
      navigate(`/messages?thread=${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send message");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="rounded-2xl bg-slate-50 p-5">
      <div className="flex items-center gap-3">
        <img src={getAvatar(seller)} alt="" className="h-12 w-12 rounded-full object-cover" />
        <div>
          <p className="font-extrabold">{seller?.name || "CampusHub Seller"}</p>
          <p className="text-sm text-slate-600">{seller?.college || "Verified seller"} · {seller?.averageRating || 0}★ ({seller?.reviewCount || 0})</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-slate-700"><FiUser /> Seller profile</span>
        {seller?.phone && <a href={`tel:${seller.phone}`} className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-slate-700"><FiPhone /> Call</a>}
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-slate-700"><FiMail /> Chat request</span>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
        <textarea
          className="input-field min-h-28"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={`Hi, I am interested in this ${listingType}. Is it still available?`}
          required
          minLength={10}
          disabled={!isAuthenticated || user?.id === seller?._id}
        />
        <button className="btn-primary" type="submit" disabled={sending || !isAuthenticated || user?.id === seller?._id}>
          <FiSend /> {sending ? "Sending..." : "Contact Seller"}
        </button>
      </form>
    </div>
  );
};

export default ContactSellerPanel;
