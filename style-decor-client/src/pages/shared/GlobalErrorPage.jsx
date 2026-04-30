const GlobalErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#062416]">Oops!</h1>
        <p className="text-2xl mt-4">Something went wrong</p>
        <p className="mt-2 text-gray-600">The page you're looking for doesn't exist or an error occurred.</p>
        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 btn bg-[#062416] text-white"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default GlobalErrorPage;