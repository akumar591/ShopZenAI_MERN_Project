const Terms = () => {
  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO SECTION */}
      <section className="relative">
        <img
          src="https://picsum.photos/1200/400"
          alt="terms"
          className="w-full h-[350px] object-cover"
        />
        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-4xl font-bold">Terms & Conditions</h1>
          <p className="mt-3 text-gray-200 max-w-xl">
            Please read carefully before using ShopZen AI platform.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-6xl mx-auto px-6 py-16 space-y-10">

        {/* CARD 1 */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-6 rounded-xl shadow">
          <img
            src="https://picsum.photos/600/400?random=1"
            alt="agreement"
            className="rounded-lg w-full h-[250px] object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-600 mt-3">
              By accessing or using ShopZen AI, you agree to be bound by these Terms & Conditions. 
              If you do not agree with any part of these terms, you must not use our platform.
            </p>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-6 rounded-xl shadow">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              2. User Responsibilities
            </h2>
            <p className="text-gray-600 mt-3">
              You are responsible for maintaining accurate account information and ensuring 
              the security of your login credentials. Any misuse, fraudulent activity, or violation 
              of policies may result in suspension or termination of your account.
            </p>
          </div>
          <img
            src="https://picsum.photos/600/400?random=2"
            alt="responsibility"
            className="rounded-lg w-full h-[250px] object-cover"
          />
        </div>

        {/* CARD 3 */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-6 rounded-xl shadow">
          <img
            src="https://picsum.photos/600/400?random=3"
            alt="products"
            className="rounded-lg w-full h-[250px] object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              3. Product Information
            </h2>
            <p className="text-gray-600 mt-3">
              We strive to provide accurate product descriptions, pricing, and availability. 
              However, errors may occur. ShopZen AI reserves the right to correct inaccuracies 
              and update product details without prior notice.
            </p>
          </div>
        </div>

        {/* CARD 4 */}
        <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-6 rounded-xl shadow">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              4. Payments & Orders
            </h2>
            <p className="text-gray-600 mt-3">
              All payments are processed securely through trusted payment gateways. 
              Orders may be canceled or refused in cases of pricing errors, stock issues, 
              or suspicious activity. Refunds will be handled as per our policy.
            </p>
          </div>
          <img
            src="https://picsum.photos/600/400?random=4"
            alt="payment"
            className="rounded-lg w-full h-[250px] object-cover"
          />
        </div>

        {/* FINAL SECTION */}
        <div className="text-center bg-indigo-600 text-white p-10 rounded-xl shadow">
          <h2 className="text-2xl font-semibold">5. Updates to Terms</h2>
          <p className="mt-3 text-gray-200 max-w-xl mx-auto">
            We may update these Terms & Conditions from time to time. Continued use of the platform 
            after changes indicates your acceptance of the updated terms.
          </p>
        </div>

      </section>
    </div>
  );
};

export default Terms;