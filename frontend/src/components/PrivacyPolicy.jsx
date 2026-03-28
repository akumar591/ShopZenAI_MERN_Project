const PrivacyPolicy = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO SECTION */}
      <section className="relative">
        <img
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
          alt="privacy"
          className="w-full h-[350px] object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="mt-3 text-gray-200 max-w-xl">
            Your privacy is our priority at ShopZen AI. We ensure your data is safe and secure.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-16 space-y-10">

        {/* CARD 1 */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-6 rounded-xl shadow">
          <img
            src="https://images.unsplash.com/photo-1555949963-aa79dcee981c"
            alt="data"
            className="rounded-lg"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              1. Information We Collect
            </h2>
            <p className="text-gray-600 mt-3">
              We collect user data such as name, email, browsing behavior,
              and preferences to improve your shopping experience.
            </p>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-6 rounded-xl shadow">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              2. How We Use Data
            </h2>
            <p className="text-gray-600 mt-3">
              Data is used for personalized recommendations, improving UI,
              and enhancing product discovery using AI.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&auto=format&fit=crop"
            alt="ai"
            className="rounded-lg"
          />
        </div>

        {/* CARD 3 */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-6 rounded-xl shadow">
          <img
            src="https://images.unsplash.com/photo-1563986768609-322da13575f3"
            alt="security"
            className="rounded-lg"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              3. Data Security
            </h2>
            <p className="text-gray-600 mt-3">
              We implement secure systems and encryption to protect your
              personal information.
            </p>
          </div>
        </div>

        {/* CARD 4 */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-6 rounded-xl shadow">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              4. Third Party Services
            </h2>
            <p className="text-gray-600 mt-3">
              We may use trusted third-party tools for analytics and payments.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="services"
            className="rounded-lg"
          />
        </div>

        {/* CARD 5 */}
        <div className="text-center bg-indigo-600 text-white p-10 rounded-xl shadow">
          <h2 className="text-2xl font-semibold">5. Updates</h2>
          <p className="mt-3 text-gray-200 max-w-xl mx-auto">
            This policy may be updated anytime. Users will be notified accordingly.
          </p>
        </div>

      </section>
    </div>
  );
};

export default PrivacyPolicy;