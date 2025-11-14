"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Shield, Sparkles } from "lucide-react";
import WindowTinting from "@/app/images/WindowTinting.jpg";
import ProfessionalCeramicCoating from "@/app/images/ProfessionalCeramicCoating.jpg";
import CarDetailing from "@/app/images/CarDetailing.jpg";

export default function PackageServices() {
  const packages = [
    {
      id: 1,
      title: "Luxury Car Detailing",
      price: "From $129",
      description: "Transform your ride with deep interior cleaning and a mirror-gloss exterior finish — right at your doorstep.",
      features: [
        "Full Interior Shampoo & Vacuum",
        "Engine Bay & Wheel Deep Clean",
        "Hand Wax & Paint Protection",
        "Door Jamb & Trim Restoration",
      ],
      image: CarDetailing,
      icon: <Star className="w-8 h-8 text-primary-blue" />,
      badge: "Most Popular",
      badgeColor: "bg-primary-blue",
    },
    {
      id: 2,
      title: "Premium Window Tinting",
      price: "From $249",
      description: "Stay cool and stylish with our high-performance tint films that offer UV defense and privacy protection.",
      features: [
        "99% UV & Heat Blockage",
        "Enhanced Night Visibility",
        "Scratch-Resistant Nano Film",
        "Factory Finish Guarantee",
      ],
      image: WindowTinting,
      icon: <Shield className="w-8 h-8 text-primary-blue" />,
      badge: "Best Seller",
      badgeColor: "bg-primary-blue",
    },
    {
      id: 3,
      title: "Elite Ceramic Coating",
      price: "From $699",
      description: "Shield your vehicle with advanced 9H ceramic technology that locks in a glossy, hydrophobic shine for years.",
      features: [
        "Long-Lasting 5-Year Protection",
        "Water & Dirt Repellent Coating",
        "UV Fade Resistance",
        "Gloss Enhancement Finish",
      ],
      image: ProfessionalCeramicCoating,
      icon: <Sparkles className="w-8 h-8 text-primary-blue" />,
      badge: "Premium",
      badgeColor: "bg-primary-blue",
    },
  ];

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-background py-16 px-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background-secondary via-background-tertiary to-background"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_25%_25%,_var(--primary-blue)_0%,_transparent_70%)] opacity-5"></div>
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_75%_75%,_var(--primary-blue)_0%,_transparent_70%)] opacity-5"></div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-5xl md:text-7xl font-extrabold text-primary-blue mb-6 leading-tight font-['Poppins']">
            Premium Packages
          </h2>
          <p className="text-xl md:text-2xl text-foreground-secondary max-w-4xl mx-auto leading-relaxed font-['Inter']">
            Choose the perfect package to give your car the luxury care it deserves — with our expert team and professional-grade products.
          </p>
        </motion.div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group relative bg-card border border-card-border rounded-3xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-700 hover:scale-105 hover:-translate-y-2 glassmorphism"
            >
              {/* Badge */}
              <div className={`absolute top-4 right-4 z-20 ${pkg.badgeColor} text-white px-4 py-2 rounded-full text-sm font-bold shadow-soft`}>
                {pkg.badge}
              </div>

              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 z-10 p-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-soft">
                  {pkg.icon}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col justify-between h-full">
                <div>
                  <motion.h3
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold mb-3 text-foreground font-['Poppins']"
                  >
                    {pkg.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-foreground-secondary mb-6 leading-relaxed font-['Inter']"
                  >
                    {pkg.description}
                  </motion.p>
                  <motion.ul
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3 mb-8"
                  >
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-primary-blue rounded-full flex-shrink-0"></div>
                        <span className="text-foreground-secondary text-sm font-medium">{feature}</span>
                      </li>
                    ))}
                  </motion.ul>
                </div>

                {/* Price + Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-center justify-between mt-auto"
                >
                  <span className="text-primary-blue font-extrabold text-2xl font-['Poppins']">
                    {pkg.price}
                  </span>
                  <Link
                    href="/contact"
                    className="px-6 py-3 bg-primary-blue text-white rounded-xl font-bold hover:bg-[#0E9AC3] transition-all duration-300 hover:scale-105 shadow-soft hover:shadow-hover"
                  >
                    Book Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
