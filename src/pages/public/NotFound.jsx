import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiSearch } from 'react-icons/fi';

const NotFound = () => {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-6 py-16 bg-gray-50">
      <div className="max-w-xl w-full bg-white border border-gray-200 rounded-2xl p-8 md:p-10 text-center shadow-sm">
        <p className="text-sm font-semibold tracking-wide text-blue-700 uppercase">404</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold text-gray-900">Page not found</h1>
        <p className="mt-4 text-gray-600 leading-relaxed">
          The page you are looking for does not exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 font-medium transition-colors"
          >
            <FiHome size={16} />
            Go to Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 px-5 py-3 font-medium transition-colors"
          >
            <FiSearch size={16} />
            Browse Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
