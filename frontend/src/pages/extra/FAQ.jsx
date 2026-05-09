const faqs = [
  ["Is CampusHub only for students?", "The frontend is designed for college communities, but nearby verified student sellers and owners can also be supported later."],
  ["Do room listings require payment?", "Yes. Room, PG, hostel, and flat listings show a 20% standard or 30% boosted platform commission before publishing."],
  ["Are payments live now?", "No. This phase includes UI-only payment screens for future Razorpay or Stripe integration."],
];

const FAQ = () => (
  <div className="container-page py-12">
    <h1 className="text-4xl font-extrabold">Frequently Asked Questions</h1>
    <div className="mt-8 grid gap-4">
      {faqs.map(([q, a]) => <details key={q} className="card p-5"><summary className="cursor-pointer font-bold">{q}</summary><p className="mt-3 text-slate-600">{a}</p></details>)}
    </div>
  </div>
);

export default FAQ;
