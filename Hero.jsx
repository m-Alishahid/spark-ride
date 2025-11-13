"use client";

import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 px-4"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-off-white uppercase tracking-wider">
          Unleash Your Ride's <span className="text-brand-orange">True Shine</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-light-gray">
          Premium mobile detailing services that come to you. Experience the pinnacle of automotive care.
        </p>
        <motion.a
          href="#booking"
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px #FF5F1F" }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 inline-block bg-brand-orange text-white uppercase font-bold text-lg px-8 py-4 rounded-lg shadow-lg transition-transform"
        >
          Get a Quote
        </motion.a>
      </motion.div>
    </section>
  );
}