import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiArrowRight, FiImage, FiX } from "react-icons/fi";
import api from "../../services/api";
import { calculateCommission, formatCurrency } from "../../utils/commerce";
import { readImageFiles } from "../../utils/listingUtils";

const amenityOptions = ["Wi-Fi", "Laundry", "Meals", "Study Desk", "CCTV", "Power Backup", "Kitchen", "Parking", "Furnished"];

const AddRoom = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [rent, setRent] = useState(0);
  const [promoted, setPromoted] = useState(false);
  const commission = calculateCommission(rent, "room", promoted);

  const handleImages = async (event) => {
    try {
      const uploaded = await readImageFiles(event.target.files, 8);
      setImages(uploaded);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amenities = form.getAll("amenities");

    if (!images.length) {
      toast.error("Please upload at least one room photo");
      return;
    }

    try {
      const { data } = await api.post("/rooms", {
        title: form.get("title"),
        type: form.get("type"),
        rent: Number(form.get("rent")),
        deposit: Number(form.get("deposit")),
        college: form.get("college"),
        location: form.get("location"),
        distance: form.get("distance"),
        availability: form.get("availability"),
        description: form.get("description"),
        amenities,
        images,
        promoted,
        acceptedTerms: form.get("acceptedTerms") === "on",
      });
      toast.success("Room draft saved. Complete payment to publish.");
      navigate("/rooms/payment", { state: { roomId: data._id, amount: data.listingFee || commission.amount, promoted } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login as a seller to list rooms");
    }
  };

  return (
    <div className="container-page py-10">
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-orange-500 to-blue-600 p-6 text-white shadow-soft">
        <h1 className="text-3xl font-extrabold">List Your Room</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <form className="card grid gap-4 p-6" onSubmit={handleSubmit}>
          <input className="input-field" name="title" placeholder="Room / PG / Flat title" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <select className="input-field" name="type" required><option>Room</option><option>PG</option><option>Hostel</option><option>Flat</option></select>
            <input className="input-field" name="location" placeholder="Full location" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <input className="input-field" name="rent" type="number" min="1" placeholder="Monthly rent" value={rent || ""} onChange={(event) => setRent(event.target.value)} required />
            <input className="input-field" name="deposit" type="number" min="0" placeholder="Security deposit" />
            <input className="input-field" name="availability" placeholder="Available now / date" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="input-field" name="college" placeholder="College nearby" required />
            <input className="input-field" name="distance" placeholder="Distance from campus" required />
          </div>
          <textarea className="input-field min-h-32" name="description" placeholder="Room description, rules, food, timings, sharing details..." required />
          <label className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm font-bold text-slate-800">
            <input type="checkbox" checked={promoted} onChange={(event) => setPromoted(event.target.checked)} />
            Boost this room for top search, homepage featured, and recommendations
          </label>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm">
            <h2 className="font-extrabold text-slate-900">Listing charges before publishing</h2>
            <div className="mt-3 grid gap-2 text-slate-700">
              <p className="flex justify-between"><span>Commission rate</span><b>{promoted ? "30%" : "20%"}</b></p>
              <p className="flex justify-between"><span>Platform commission</span><b>{formatCurrency(commission.amount)}</b></p>
              <p className="flex justify-between"><span>Owner receives after booking</span><b>{formatCurrency(commission.sellerReceives)}</b></p>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <p className="mb-3 text-sm font-extrabold text-slate-800">Amenities</p>
            <div className="grid gap-2 sm:grid-cols-3">
              {amenityOptions.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold">
                  <input type="checkbox" name="amenities" value={amenity} /> {amenity}
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-5">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl bg-slate-50 p-8 text-center transition hover:bg-orange-50">
              <FiImage className="text-3xl text-orange-600" />
              <span className="mt-2 font-bold">Upload room photos</span>
              <span className="mt-1 text-xs text-slate-500">Add up to 8 photos, each under 2 MB.</span>
              <input type="file" accept="image/*" multiple onChange={handleImages} className="sr-only" />
            </label>
            {images.length > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {images.map((image, index) => (
                  <div key={image.publicId} className="relative overflow-hidden rounded-xl">
                    <img src={image.url} alt={`Room ${index + 1}`} className="h-32 w-full object-cover" />
                    <button type="button" onClick={() => setImages(images.filter((_, i) => i !== index))} className="absolute right-2 top-2 rounded-full bg-white p-2 text-red-600 shadow">
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <h2 className="font-extrabold">Preview Listing</h2>
            <p className="mt-2 text-sm text-slate-600">Your premium badge and promoted room card will appear after payment success.</p>
          </div>
          <label className="flex items-start gap-2 text-sm font-semibold text-slate-600">
            <input type="checkbox" name="acceptedTerms" className="mt-1" required />
            I accept the Terms & Conditions before listing this room.
          </label>
          <button className="btn-primary" type="submit">Continue to Payment <FiArrowRight /></button>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
