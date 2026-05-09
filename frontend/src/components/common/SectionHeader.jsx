const SectionHeader = ({ eyebrow, title, description, action }) => (
  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      {eyebrow && <p className="mb-2 text-sm font-bold uppercase text-blue-600">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      {description && <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>}
    </div>
    {action}
  </div>
);

export default SectionHeader;
