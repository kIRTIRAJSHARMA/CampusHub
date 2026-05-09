import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiImage, FiX } from "react-icons/fi";
import api from "../../services/api";
import { calculateCommission, formatCurrency } from "../../utils/commerce";
import { readImageFiles } from "../../utils/listingUtils";

const categories = ["Books", "Electronics", "Cycles", "Furniture", "Gadgets", "Notes", "Hostel Essentials"];
const conditions = ["New", "Like New", "Good", "Fair"];

const AddProduct = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [price, setPrice] = useState(0);
  const [promoted, setPromoted] = useState(false);
  const commission = calculateCommission(price, "product", promoted);

  const handleImages = async (event) => {
    try {
      const uploaded = await readImageFiles(event.target.files, 6);
      setImages(uploaded);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    if (!images.length) {
      toast.error("Please upload at least one product photo");
      return;
    }

    try {
      const { data } = await api.post("/products", {
        title: form.get("title"),
        price: Number(form.get("price")),
        category: form.get("category"),
        condition: form.get("condition"),
        location: form.get("location"),
        college: form.get("college"),
        description: form.get("description"),
        images,
        promoted,
        acceptedTerms: form.get("acceptedTerms") === "on",
      });
      toast.success("Product draft saved. Complete payment to publish.");
      navigate("/products/payment", { state: { productId: data._id, amount: data.listingFee || commission.amount, promoted } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login as a seller to save product");
    }
  };

  return (
    <div className="container-page py-10">
      <div className="card mx-auto max-w-4xl p-6">
        <h1 className="text-3xl font-extrabold">Add Product</h1>
        <p className="mt-2 text-sm text-slate-600">Create a product draft, complete payment, and publish it to the marketplace.</p>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <input className="input-field" name="title" placeholder="Product title" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="input-field" name="price" type="number" min="1" placeholder="Price" value={price || ""} onChange={(event) => setPrice(event.target.value)} required />
            <select className="input-field" name="category" required>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <select className="input-field" name="condition" required>
              {conditions.map((condition) => <option key={condition}>{condition}</option>)}
            </select>
            <input className="input-field" name="location" placeholder="Pickup location" required />
            <input className="input-field" name="college" placeholder="College name" required />
          </div>
          <textarea className="input-field min-h-32" name="description" placeholder="Description, included accessories, reason for selling..." required />
          <label className="flex items-center gap-3 rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm font-bold text-slate-800">
            <input type="checkbox" checked={promoted} onChange={(event) => setPromoted(event.target.checked)} />
            Boost this product for top placement and featured sections
          </label>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 text-sm">
            <h2 className="font-extrabold text-slate-900">Listing charges before publishing</h2>
            <div className="mt-3 grid gap-2 text-slate-700">
              <p className="flex justify-between"><span>Commission rate</span><b>{promoted ? "20%" : "10%"}</b></p>
              <p className="flex justify-between"><span>Platform commission</span><b>{formatCurrency(commission.amount)}</b></p>
              <p className="flex justify-between"><span>Seller receives after sale</span><b>{formatCurrency(commission.sellerReceives)}</b></p>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-dashed border-slate-200 p-5">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl bg-slate-50 p-8 text-center transition hover:bg-blue-50">
              <FiImage className="text-3xl text-blue-600" />
              <span className="mt-2 font-bold">Upload product photos</span>
              <span className="mt-1 text-xs text-slate-500">Add up to 6 photos, each under 2 MB.</span>
              <input type="file" accept="image/*" multiple onChange={handleImages} className="sr-only" />
            </label>
            {images.length > 0 && (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {images.map((image, index) => (
                  <div key={image.publicId} className="relative overflow-hidden rounded-xl">
                    <img src={image.url} alt={`Product ${index + 1}`} className="h-32 w-full object-cover" />
                    <button type="button" onClick={() => setImages(images.filter((_, i) => i !== index))} className="absolute right-2 top-2 rounded-full bg-white p-2 text-red-600 shadow">
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="flex items-start gap-2 text-sm font-semibold text-slate-600">
            <input type="checkbox" name="acceptedTerms" className="mt-1" required />
            I accept the Terms & Conditions before listing this product.
          </label>
          <button className="btn-primary" type="submit">Continue to Payment</button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
