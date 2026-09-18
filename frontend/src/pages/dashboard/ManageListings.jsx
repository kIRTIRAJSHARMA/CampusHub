import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../services/api";
import { normalizeProduct, normalizeRoom } from "../../utils/listingUtils";

const productCategories = ["Books", "Electronics", "Cycles", "Furniture", "Gadgets", "Notes", "Hostel Essentials"];
const productConditions = ["New", "Like New", "Good", "Fair"];
const roomTypes = ["Room", "PG", "Hostel", "Flat"];

const ManageListings = () => {
  const [products, setProducts] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadListings = () => {
    setLoading(true);
    Promise.all([api.get("/products/mine/listings"), api.get("/rooms/mine")])
      .then(([productRes, roomRes]) => {
        setProducts(productRes.data.map(normalizeProduct));
        setRooms(roomRes.data.map(normalizeRoom));
      })
      .catch(() => toast.error("Login as a seller to manage listings"))
      .finally(() => setLoading(false));
  };

  useEffect(loadListings, []);

  const archiveListing = async (type, id, title) => {
    const confirmed = window.confirm(`Remove "${title}" from your listings?`);
    if (!confirmed) return;

    setRemovingId(`${type}-${id}`);
    try {
      await api.delete(`/${type}/${id}`);
      toast.success("Listing removed");
      loadListings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not remove listing");
    } finally {
      setRemovingId("");
    }
  };

  const boostListing = async (item) => {
    try {
      await api.put(`/${item.listingType}/${item.id}`, { promoted: true });
      toast.success("Listing boosted");
      loadListings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not boost listing");
    }
  };

  const openEditor = (item) => {
    setEditingItem({
      ...item,
      price: item.listingType === "rooms" ? item.rent : item.price,
      deposit: item.deposit || 0,
      description: item.description || "",
      college: item.college || "",
      distance: item.distance || "",
      availability: item.availability || "",
    });
  };

  const closeEditor = () => {
    if (saving) return;
    setEditingItem(null);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editingItem) return;

    const form = new FormData(event.currentTarget);
    const isRoom = editingItem.listingType === "rooms";
    const payload = isRoom
      ? {
          title: form.get("title"),
          type: form.get("type"),
          rent: Number(form.get("price")),
          deposit: Number(form.get("deposit") || 0),
          college: form.get("college"),
          location: form.get("location"),
          distance: form.get("distance"),
          availability: form.get("availability"),
          description: form.get("description"),
        }
      : {
          title: form.get("title"),
          price: Number(form.get("price")),
          category: form.get("category"),
          condition: form.get("condition"),
          college: form.get("college"),
          location: form.get("location"),
          description: form.get("description"),
        };

    setSaving(true);
    try {
      await api.put(`/${editingItem.listingType}/${editingItem.id}`, payload);
      toast.success("Listing updated");
      setEditingItem(null);
      loadListings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update listing");
    } finally {
      setSaving(false);
    }
  };

  const allListings = [
    ...products.map((item) => ({ ...item, listingType: "products", label: "Product", price: item.price, status: item.status })),
    ...rooms.map((item) => ({ ...item, listingType: "rooms", label: "Room", price: item.rent, status: item.publishStatus })),
  ];

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-extrabold">Manage Listings</h1>
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">Loading your listings...</div>
        ) : allListings.length ? allListings.map((item) => (
          <div key={`${item.label}-${item.id}`} className="grid gap-4 border-b border-slate-100 p-4 last:border-0 sm:grid-cols-[80px_1fr_auto] sm:items-center">
            <img src={item.image} alt={item.title} className="h-20 w-20 rounded-xl object-cover" />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-bold">{item.title}</h2>
                <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700">{item.label}</span>
                {item.promoted && <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-bold text-orange-700">Promoted</span>}
                {item.status && <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold capitalize text-slate-600">{item.status}</span>}
              </div>
              <p className="mt-1 text-sm text-slate-500">{item.location}</p>
              <p className="mt-1 text-sm font-bold text-blue-600">₹{Number(item.price || 0).toLocaleString("en-IN")}</p>
            </div>
            <div className="flex gap-2">
              {item.listingType === "products" && item.status === "draft" && (
                <Link to="/products/payment" state={{ productId: item.id, amount: item.listingFee, promoted: item.promoted }} className="btn-primary py-2">Pay & Publish</Link>
              )}
              {item.listingType === "rooms" && item.status === "draft" && (
                <Link to="/rooms/payment" state={{ roomId: item.id, amount: item.listingFee, promoted: item.promoted }} className="btn-primary py-2">Pay & Publish</Link>
              )}
              {!item.promoted && <button onClick={() => boostListing(item)} className="btn-secondary py-2">Boost</button>}
              <button onClick={() => openEditor(item)} className="btn-secondary py-2">Edit</button>
              <button
                onClick={() => archiveListing(item.listingType, item.id, item.title)}
                disabled={removingId === `${item.listingType}-${item.id}`}
                className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {removingId === `${item.listingType}-${item.id}` ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        )) : (
          <div className="p-8 text-center">
            <h2 className="text-xl font-extrabold">No seller listings yet</h2>
            <p className="mt-2 text-sm text-slate-600">Add products or room drafts from the seller dashboard.</p>
          </div>
        )}
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/60 px-4 py-6">
          <form onSubmit={handleEditSubmit} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-blue-600">Edit {editingItem.label}</p>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-950">{editingItem.title}</h2>
              </div>
              <button type="button" onClick={closeEditor} className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">Close</button>
            </div>

            <div className="mt-6 grid gap-4">
              <input className="input-field" name="title" defaultValue={editingItem.title} placeholder="Listing title" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <input className="input-field" name="price" type="number" min="1" defaultValue={editingItem.price} placeholder={editingItem.listingType === "rooms" ? "Monthly rent" : "Price"} required />
                {editingItem.listingType === "rooms" ? (
                  <select className="input-field" name="type" defaultValue={editingItem.type || "Room"} required>
                    {roomTypes.map((type) => <option key={type}>{type}</option>)}
                  </select>
                ) : (
                  <select className="input-field" name="category" defaultValue={editingItem.category} required>
                    {productCategories.map((category) => <option key={category}>{category}</option>)}
                  </select>
                )}
              </div>

              {editingItem.listingType === "rooms" ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  <input className="input-field" name="deposit" type="number" min="0" defaultValue={editingItem.deposit} placeholder="Security deposit" />
                  <input className="input-field" name="availability" defaultValue={editingItem.availability} placeholder="Availability" required />
                  <input className="input-field" name="distance" defaultValue={editingItem.distance} placeholder="Distance from campus" />
                </div>
              ) : (
                <select className="input-field" name="condition" defaultValue={editingItem.condition} required>
                  {productConditions.map((condition) => <option key={condition}>{condition}</option>)}
                </select>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <input className="input-field" name="location" defaultValue={editingItem.location} placeholder="Location" required />
                <input className="input-field" name="college" defaultValue={editingItem.college} placeholder="College name" required />
              </div>
              <textarea className="input-field min-h-32" name="description" defaultValue={editingItem.description} placeholder="Description" required />
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeEditor} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary disabled:cursor-not-allowed disabled:opacity-60">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ManageListings;
