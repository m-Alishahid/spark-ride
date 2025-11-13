"use client";

import React from "react";

export default function ExperienceStats() {
  const stats = [
    { value: "10+", label: "Years of Experience" },
    { value: "2.5K+", label: "Cars Detailed" },
    { value: "50+", label: "Corporate Clients" },
    { value: "100%", label: "Customer Satisfaction" },
  ];

  return (
    <section className="py-20 bg-background text-foreground text-center">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-10 px-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-card hover:bg-card-hover transition-all duration-300 rounded-2xl shadow-soft border border-card-border hover:border-primary-blue p-8 flex flex-col items-center justify-center glassmorphism hover:scale-105"
          >
            <h3 className="text-5xl font-extrabold text-primary-blue drop-shadow-md">
              {stat.value}
            </h3>
            <p className="text-foreground-secondary mt-3 text-lg font-medium tracking-wide">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
