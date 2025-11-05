export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Appointment Booking
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Professional appointment booking platform for salons and spas.
        </p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
          Start Free Trial
        </button>
      </div>
    </div>
  );
}
