export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Salon management dashboard for appointment booking platform.
        </p>
        <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700">
          View Dashboard
        </button>
      </div>
    </div>
  );
}
