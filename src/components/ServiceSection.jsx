"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { enhancedMainServices } from "@/utils/services";
import CeramicCoating from "@/app/images/CeramicCoating.jpg";
import WindowTinting from "@/app/images/WindowTinting.jpg";
import PaintCorrection from "@/app/images/CarDetailing.jpg";

export default function ServiceSection() {
  // Map service IDs to images
  const serviceImages = {
    'ceramic-coating': CeramicCoating,
    'window-tinting': WindowTinting,
    'paint-correction': PaintCorrection,
  };

  // Get first 3 services for homepage display
  const displayServices = enhancedMainServices.slice(0, 3);

  return (
    <section className="bg-gray-50 py-24 px-6 md:px-12">
      {/* Heading */}
      <div className="text-center mb-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold text-blue-600 mb-6"
        >
          Our Premium Services
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-gray-600 mt-4 max-w-3xl mx-auto leading-relaxed text-lg"
        >
          Professional automotive detailing services with premium products and certified technicians.
          Transform your vehicle with our comprehensive care packages.
        </motion.p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {displayServices.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
          >
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
              <Image
                src={serviceImages[service.id] || CeramicCoating}
                alt={service.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Duration Badge */}
              <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {service.duration}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {service.name}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {service.description}
              </p>

              {/* Packages Preview */}
              {service.packages && service.packages.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Starting from:</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-blue-600">
                      ${service.packages[0].price}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {service.packages[0].name}
                    </span>
                  </div>
                </div>
              )}

              {/* Process Steps Preview */}
              {service.process && service.process.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Process:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {service.process.slice(0, 3).map((step, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="text-blue-500 mr-2">•</span>
                        {step}
                      </li>
                    ))}
                    {service.process.length > 3 && (
                      <li className="text-blue-500 font-medium">+{service.process.length - 3} more steps</li>
                    )}
                  </ul>
                </div>
              )}

              <Link
                href={`/services/${service.id}`}
                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 hover:scale-105 transition-all duration-300 shadow-lg w-full text-center"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View All Services Button */}
      <div className="text-center mt-12">
        <Link
          href="/services"
          className="inline-block bg-gray-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 hover:scale-105 transition-all duration-300 shadow-lg"
        >
          View All Services
        </Link>
      </div>
    </section>
  );
}
