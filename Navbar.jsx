"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { title: "Services", href: "#services" },
  { title: "About", href: "#about" },
  { title: "Gallery", href: "#gallery" },
  { title: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    hidden: { opacity: 0, x: "100%" },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-rich-black/70 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Spark Ride Logo"
                width={180}
                height={40}
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="text-steel-gray hover:text-brand-orange px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                  >
                    {link.title}
                  </Link>
                ))}
                <Link
                  href="/booking"
                  className="bg-brand-orange text-white px-4 py-2 rounded-md text-sm font-medium ml-4"
                >
                  Book Now
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-steel-gray hover:text-white hover:bg-surface-gray focus:outline-none"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="md:hidden fixed inset-0 z-40 bg-rich-black pt-20"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={toggleMenu}
                  className="text-steel-gray hover:text-brand-orange block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                >
                  {link.title}
                </Link>
              ))}
              <Link
                href="/booking"
                onClick={toggleMenu}
                className="bg-brand-orange text-white px-5 py-3 rounded-md text-base font-medium mt-4"
              >
                Book Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
