"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import SedanCarDetailing from "@/app/images/SedanCarDetailing.jpeg";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-background via-background-secondary to-background-tertiary pt-16">
      {/* Background Image with Light Overlay */}
      <div className="absolute inset-0">
        <Image
          src={SedanCarDetailing}
          alt="Premium Car Detailing"
          fill
          className="object-cover opacity-50"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/60 to-white/80" />
      </div>

      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-screen px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="space-y-8"
        >
          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-4xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 font-['Poppins']"
          >
            <span className="text-foreground block">Sparkle Your Ride</span>
            <span className="text-primary-blue block">with Perfection</span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="text-lg md:text-xl lg:text-2xl text-foreground-secondary max-w-4xl leading-relaxed font-['Inter'] font-light"
          >
            Transform your vehicle into a showroom masterpiece with our comprehensive car wash, detailing, and ceramic coating services.
            Experience the ultimate in automotive care with eco-friendly products and certified professionals.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 mt-12 justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-[#0E9AC3] text-white rounded-full px-8 py-4 text-lg font-semibold shadow-soft hover:shadow-hover transition-all duration-300 hover:scale-105"
              onClick={() => window.location.href = '/booking'}
            >
              Book Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-full px-8 py-4 text-lg font-semibold shadow-soft hover:shadow-hover transition-all duration-300 hover:scale-105"
            >
              View Our Services
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute top-20 left-10 w-32 h-32 bg-primary-blue/10 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 right-20 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl"
        animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 left-1/4 w-20 h-20 bg-primary-blue/5 rounded-full blur-xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />

      {/* Bottom Wave */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      />
    </section>
  );
}
