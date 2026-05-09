const sections = [
  ["Account roles", "Buyers may browse, save, contact sellers, review listings, and make payments. Sellers and admins may add, edit, delete, promote, and manage product or room listings."],
  ["Listing accuracy", "Sellers must provide accurate prices, photos, ownership details, availability, college/location information, and lawful descriptions for every item or room."],
  ["Platform commission", "CampusHub charges 10% commission on standard product listings or sales and 20% for promoted products. Room listings are charged 20% standard commission or 30% when promoted."],
  ["Payments", "Users must review and accept these terms before registration, listing products or rooms, buying, booking, or making payments. Payment screens show applicable platform commission before confirmation."],
  ["Contact and safety", "Users may contact sellers through listing inquiries. Spam, harassment, off-platform abuse, fake identities, or repeated unauthorized messages may lead to account restrictions."],
  ["Reviews", "Ratings and written reviews must reflect genuine experiences with products, rooms, or sellers. Fraudulent, abusive, or irrelevant reviews may be removed."],
  ["Promotions", "Paid boosts can place listings higher in search results, homepage featured areas, and recommendation sections. Promotion does not guarantee a sale, booking, or inquiry."],
  ["Moderation", "CampusHub may archive listings, suspend users, or refuse payments where content is unsafe, illegal, misleading, discriminatory, or violates campus/community rules."],
];

const Terms = () => (
  <div className="container-page py-12">
    <div className="mx-auto max-w-4xl">
      <h1 className="text-4xl font-extrabold text-slate-950">Terms & Conditions</h1>
      <p className="mt-4 leading-7 text-slate-600">These terms govern CampusHub registration, marketplace listings, room listings, seller contact, wishlist use, reviews, promotions, checkout, and listing payments.</p>
      <div className="mt-8 grid gap-4">
        {sections.map(([title, body]) => (
          <section key={title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-950">{title}</h2>
            <p className="mt-2 leading-7 text-slate-600">{body}</p>
          </section>
        ))}
      </div>
    </div>
  </div>
);

export default Terms;
