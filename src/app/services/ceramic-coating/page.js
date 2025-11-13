"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { enhancedMainServices } from "@/utils/services";
import CeramicCoating from "@/app/images/CeramicCoating.jpg";
import CeramicCoatingAfter from "@/app/images/CeramicCoatingAfter.png";
import CeramicCoatingBefore from "@/app/images/CeramicCoatingBefore.png";

export default function CeramicCoatingPage() {
  const service = enhancedMainServices.find(s => s.id === 'ceramic-coating');

  if (!service) {
    return <div>Service not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src={CeramicCoating}
          alt="Ceramic Coating Service"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-extrabold mb-6"
          >
            Ceramic Coating
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8"
          >
            Professional ceramic coating for ultimate paint protection
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              href="/contact"
              className="bg-blue-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg"
            >
              Book Now - Starting at ${service.packages[0].price}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">What is Ceramic Coating?</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {service.description} Our ceramic coating creates a chemical bond with your vehicle's paint,
              providing long-lasting protection against UV rays, chemicals, bird droppings, tree sap,
              and minor scratches. Unlike traditional wax, ceramic coating offers hydrophobic properties
              that make water bead up and roll off your vehicle.
            </p>
          </motion.div>

          {/* Before/After Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Transformation Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={CeramicCoatingBefore}
                  alt="Before Ceramic Coating"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                  Before
                </div>
              </div>
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={CeramicCoatingAfter}
                  alt="After Ceramic Coating"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
                  After
                </div>
              </div>
            </div>
          </motion.div>

          {/* Process Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {service.process.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-lg text-center"
                >
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 font-medium">{step}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Packages */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Available Packages</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {service.packages.map((pkg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white p-8 rounded-2xl shadow-lg border-2 hover:border-blue-500 transition-all duration-300 flex flex-col h-full"
                >
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">{pkg.name}</h4>
                  <div className="text-4xl font-extrabold text-blue-600 mb-6">${pkg.price}</div>
                  <ul className="space-y-2 mb-6">
                    {pkg.includes.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-600">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className="block bg-blue-500 text-white text-center py-3 rounded-full font-semibold hover:bg-blue-600 transition-all duration-300 mt-auto"
                  >
                    Choose Package
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💧</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Hydrophobic Effect</h4>
                <p className="text-gray-600">Water beads up and rolls off, keeping your car cleaner longer</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">UV Protection</h4>
                <p className="text-gray-600">Blocks harmful UV rays that cause paint fading and oxidation</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Enhanced Gloss</h4>
                <p className="text-gray-600">Brings out the depth and clarity of your vehicle's paint</p>
              </div>
            </div>
          </motion.div>

          {/* Duration & Warranty */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-2xl">
              <h3 className="text-3xl font-bold mb-4">Service Duration: {service.duration}</h3>
              <p className="text-xl mb-6">Professional application with up to 5-year warranty</p>
              <Link
                href="/contact"
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-lg"
              >
                Schedule Your Ceramic Coating Today
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
