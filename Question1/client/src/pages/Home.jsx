

import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="text-4xl font-bold text-gray-800 mb-6">
        Welcome to My Website!
      </header>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        This is a simple homepage built with React and Tailwind CSS. Start building something amazing!
      </p>
      <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl text-lg hover:bg-blue-700 transition" onClick={() => alert('Button Clicked!')}>
        start building
      </button>
    </div>
  );
};

export default Home;
