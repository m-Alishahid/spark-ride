"use client";

import Image from "next/image";
import { ShieldCheck, Car, Wrench, Star } from "lucide-react";
import AboutStory from "@/components/AboutStory";
import MissionVision from "@/components/MissionVision";
import WhyChooseUs from "@/components/WhyChooseUs";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 🔹 About Story Section */}
      <AboutStory />

      {/* 🔹 Mission & Vision Section */}
      <MissionVision />

      {/* 🔹 Why Choose Us Section */}
      <WhyChooseUs />

      {/* 🔹 Call to Action Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Experience Premium Detailing?
          </h2>
          <p className="text-xl mb-8">
            Book your appointment today and let our experts transform your vehicle.
          </p>
          <button
            onClick={() => window.location.href = '/booking'}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
          >
            Book Now
          </button>
        </div>
      </section>
    </div>
  );
}
