
"use client";
import React, { useEffect, useState } from "react";

export default function Navbar() {
  const [hasShadow, setHasShadow] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  // 🧩 Array of Nav Links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services", hasDropdown: true },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Services dropdown items
  const servicesDropdown = [
    { name: "Ceramic Coating", path: "/services/ceramic-coating" },
    { name: "Window Tinting", path: "/services/window-tinting" },
    { name: "Paint Correction", path: "/services/paint-correction" },
    { name: "All Services", path: "/services" },
  ];

  useEffect(() => {
    const handleScroll = () => setHasShadow(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hasShadow
          ? "bg-white/95 backdrop-blur-md shadow-soft border-b border-gray-200"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2 group">
              <img
                src="/sparkride.png"
                alt="Spark Ride Logo"
                className="h-10 w-10 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="text-xl font-bold text-primary-blue font-['Poppins'] group-hover:text-[#10B5DB] transition-colors duration-300">
                Spark Ride
              </span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <div key={link.name} className="relative">
                  {link.hasDropdown ? (
                    <div className="relative">
                      <button
                        onMouseEnter={() => setIsServicesOpen(true)}
                        onMouseLeave={() => setIsServicesOpen(false)}
                        className="text-foreground-secondary hover:text-primary border border-transparent hover:border-primary px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 relative group flex items-center space-x-1"
                      >
                        <span>{link.name}</span>
                        <svg className="w-4 h-4 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                      </button>

                      {/* Dropdown Menu */}
                      {isServicesOpen && (
                        <div
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                          onMouseEnter={() => setIsServicesOpen(true)}
                          onMouseLeave={() => setIsServicesOpen(false)}
                        >
                          {servicesDropdown.map((service) => (
                            <a
                              key={service.name}
                              href={service.path}
                              className="block px-4 py-3 text-sm text-foreground-secondary hover:text-primary border border-transparent hover:border-primary hover:bg-gray-50 rounded-full mx-2 my-1 transition-all duration-300"
                            >
                              {service.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={link.path === "/" ? "#home" : link.path === "/about" ? "#about" : link.path === "/contact" ? "#contact" : link.path}
                      className="text-foreground-secondary hover:text-primary border border-transparent hover:border-primary px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 relative group"
                    >
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="/booking"
              className="bg-primary text-white px-6 py-2 rounded-full font-medium hover:bg-[#0E9AC3] transition-all duration-300 hover:scale-105 shadow-soft hover:shadow-hover"
            >
              Start Booking
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-foreground-secondary hover:text-primary-blue p-2 rounded-md transition-colors duration-300"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-soft">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path === "/" ? "#home" : link.path === "/services" ? "#services" : link.path === "/about" ? "#about" : link.path === "/contact" ? "#contact" : link.path}
                  className="text-foreground-secondary hover:text-primary-blue block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-2">
                <a
                  href="#contact"
                  className="bg-primary-blue text-white block px-3 py-2 rounded-md text-base font-medium text-center hover:bg-[#0E9AC3] transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Quote
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
