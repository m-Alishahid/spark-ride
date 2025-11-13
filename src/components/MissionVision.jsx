"use client";

import React from "react";

export default function MissionVision() {
  return (
    <section className="py-20 bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-blue">
          Our Mission & Vision
        </h2>
        <p className="text-foreground-secondary text-lg max-w-3xl mx-auto mb-12">
          We aim to bring innovation and excellence to every car we touch — ensuring protection, shine, and satisfaction that lasts.
        </p>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 text-left">
          {/* Mission Card */}
          <div className="bg-card rounded-xl p-8 shadow-soft hover:shadow-hover transform hover:scale-105 transition-all glassmorphism border border-card-border hover:border-primary-blue">
            <h3 className="text-2xl font-semibold text-primary-blue mb-3">
              Mission
            </h3>
            <p className="text-foreground-secondary">
              To deliver high-end detailing experiences using advanced technology and premium products that keep cars looking flawless.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-card rounded-xl p-8 shadow-soft hover:shadow-hover transform hover:scale-105 transition-all glassmorphism border border-card-border hover:border-primary-blue">
            <h3 className="text-2xl font-semibold text-primary-blue mb-3">
              Vision
            </h3>
            <p className="text-foreground-secondary">
              To become Pakistan's #1 trusted brand for luxury car detailing, coating, and tinting services.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
