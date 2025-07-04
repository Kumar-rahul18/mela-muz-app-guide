
import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-orange-500 to-pink-500 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to Mela
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Your guide to the festival experience
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
