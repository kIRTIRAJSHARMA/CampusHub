import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiStar } from "react-icons/fi";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const ReviewPanel = ({ targetType, targetId, averageRating = 0, reviewCount = 0, initialReviews = [] }) => {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState(initialReviews);

  useEffect(() => {
    if (initialReviews.length) return;
    api.get("/reviews", { params: { targetType, targetId } })
      .then(({ data }) => setReviews(data))
      .catch(() => setReviews([]));
  }, [targetType, targetId]);

  const submitReview = async (event) => {
    event.preventDefault();
    if (!isAuthenticated) {
      toast.error("Login to write a review");
      return;
    }

    try {
      const { data } = await api.post("/reviews", { targetType, targetId, rating, comment });
      setReviews([data, ...reviews.filter((review) => review._id !== data._id)]);
      setComment("");
      toast.success("Review saved");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save review");
    }
  };

  return (
    <section className="card mt-8 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold">Ratings & Reviews</h2>
        <p className="flex items-center gap-2 font-bold text-amber-600"><FiStar /> {averageRating || 0} average · {reviewCount || reviews.length} reviews</p>
      </div>
      <form onSubmit={submitReview} className="mt-5 grid gap-3">
        <select className="input-field" value={rating} onChange={(event) => setRating(Number(event.target.value))}>
          {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} star{value > 1 ? "s" : ""}</option>)}
        </select>
        <textarea className="input-field min-h-24" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write a helpful review..." required />
        <button className="btn-secondary" type="submit">Submit Review</button>
      </form>
      <div className="mt-6 grid gap-3">
        {reviews.length ? reviews.map((review) => (
          <article key={review._id} className="rounded-2xl bg-slate-50 p-4">
            <p className="font-bold">{review.reviewer?.name || "CampusHub user"} · {review.rating}★</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{review.comment}</p>
          </article>
        )) : <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No reviews yet.</p>}
      </div>
    </section>
  );
};

export default ReviewPanel;
