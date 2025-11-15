"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    webName: "Spark Ride" // Updated to match site name
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("https://car-detailling-dashboard.vercel.app/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          message: "",
          webName: "Spark Ride"
        });
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6 text-primary">
          Contact <span className="text-primary">Us</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Have a question or want to book an appointment?
          We'd love to hear from you! Fill out the form below or reach us through our contact details.
        </p>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <div className="bg-[var(--dark-bg-2)] border border-gray-700 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            Get in Touch
          </h2>
          <p className="text-muted-foreground mb-6">
            Our team is always ready to assist you with your car care needs. Whether you need detailing, ceramic coating, or window tinting, we're here to provide professional service with premium quality products.
          </p>

          <div className="space-y-4 mb-6">
            <p className="text-muted-foreground">
              📍 <span className="font-medium text-card-foreground">Address:</span> Texas, USA
            </p>
            <p className="text-muted-foreground">
              📞 <span className="font-medium text-card-foreground">Phone:</span> 817-210-3644
            </p>
            <p className="text-muted-foreground">
              ✉️ <span className="font-medium text-card-foreground">Email:</span> hometownautodetailer@gmail.com
            </p>
          </div>

          <div className="border-t border-border pt-6 mt-6">
            <h3 className="text-lg font-semibold text-primary mb-3">
              Why Choose Spark Ride?
            </h3>
            <ul className="text-muted-foreground space-y-2">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Professional eco-friendly products</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Mobile detailing services available</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Expert technicians with years of experience</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                <span>Satisfaction guaranteed</span>
              </li>
            </ul>
          </div>

          <div className="mt-6">
            <Button
              onClick={() => window.location.href = '/booking'}
              className="w-full bg-[var(--text-color)] hover:bg-[var(--text-color)]/80 text-black font-semibold py-2 rounded-lg transition"
            >
              Book Now
            </Button>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="bg-[var(--dark-bg-2)] border border-gray-700 rounded-2xl p-8 space-y-6">
          {/* Status Messages */}
          {submitStatus === "success" && (
            <div className="bg-green-900/20 border border-green-500 text-green-400 px-4 py-3 rounded">
              Thank you for your message! We'll get back to you soon.
            </div>
          )}

          {submitStatus === "error" && (
            <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded">
              Sorry, there was an error sending your message. Please try again.
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-1">
              Full Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full border border-input rounded-lg px-4 py-2 bg-background text-card-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-1">
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-input rounded-lg px-4 py-2 bg-background text-card-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-1">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              className="w-full border border-input rounded-lg px-4 py-2 bg-background text-card-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[var(--text-color)] hover:bg-[var(--text-color)]/80 disabled:bg-gray-600 text-black font-semibold py-2 rounded-lg transition"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </div>
  );
}
