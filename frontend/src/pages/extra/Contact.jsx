import toast from "react-hot-toast";

const Contact = () => (
  <div className="container-page py-12">
    <div className="card mx-auto max-w-3xl p-8">
      <h1 className="text-4xl font-extrabold">Contact Us</h1>
      <form className="mt-6 grid gap-4" onSubmit={(e) => { e.preventDefault(); toast.success("Message sent"); }}>
        <input className="input-field" placeholder="Your name" />
        <input className="input-field" type="email" placeholder="Email address" />
        <textarea className="input-field min-h-32" placeholder="How can we help?" />
        <button className="btn-primary">Send Message</button>
      </form>
    </div>
  </div>
);

export default Contact;
