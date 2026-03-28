import { useState } from "react";
import { toast } from "react-toastify";

const Contact = () => {
  const [result, setResult] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setResult("Sending...");

    const formData = new FormData(e.target);

    // ✅ REQUIRED
    formData.append("access_key", "384f0181-c775-4790-b80a-920d2ef3da42");

    // ✅ OPTIONAL BUT IMPORTANT (helps delivery)
    formData.append("subject", "New Contact Message from ShopZen AI");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      console.log("RESPONSE:", data); // 🔥 DEBUG

      if (data.success) {
        toast.success("✅ Message sent successfully!");
        e.target.reset();
      } else {
        toast.error(data.message || "❌ Failed to send message");
      }
    } catch (err) {
      console.log(err);
      toast.error("⚠️ Network error");
    }

    setResult("");
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <section className="relative">
        <img
          src="https://picsum.photos/1200/400"
          alt="contact"
          className="w-full h-[300px] object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-center">
          <h1 className="text-4xl font-bold">Contact Us</h1>
          <p className="mt-2 text-gray-200">
            We’d love to hear from you 🚀
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10">

        {/* FORM */}
        <div className="bg-white p-8 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-6">Send a Message</h2>

          <form onSubmit={onSubmit} className="space-y-4">

            {/* ✅ hidden subject */}
            <input type="hidden" name="subject" value="New Message from ShopZen" />

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full border p-3 rounded-lg"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="w-full border p-3 rounded-lg"
              required
            />

            <textarea
              rows="5"
              name="message"
              placeholder="Your Message"
              className="w-full border p-3 rounded-lg"
              required
            />

            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg"
            >
              {result ? result : "Send Message"}
            </button>

          </form>
        </div>

        {/* INFO */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">📧 Email</h3>
            <p className="text-gray-600 mt-2">support@shopzen.ai</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">📞 Phone</h3>
            <p className="text-gray-600 mt-2">+91 98765 43210</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold">📍 Location</h3>
            <p className="text-gray-600 mt-2">Bangalore, India</p>
          </div>
        </div>

      </section>
    </div>
  );
};

export default Contact;