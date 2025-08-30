"use client"

import HeroSection from "@/components/Hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  useAnimatedCounter,
  useIntersectionObserver,
} from "@/hooks/use-landing-hooks";
import { useEffect } from "react";
import FeaturesSection from "@/components/Features";
import Pricing from "@/components/Pricing";

const AnimatedCounter = ({ target, suffix = "", duration = 2000 }) => {
  const [ref, isVisible] = useIntersectionObserver();
  const [count, setIsActive] = useAnimatedCounter(target, duration);

  useEffect(() => {
    if (isVisible) setIsActive(true);
  }, [isVisible, setIsActive]);

  return (
    <span
      ref={ref}
      className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
    >
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default function Home() {

  const stats = [
    { label: "Images Processed", value: 10000, suffix: "+" },
    { label: "Active Users", value: 500, suffix: "+" },
    { label: "AI Transformations", value: 45000, suffix: "+" },
    { label: "User Satisfaction", value: 98, suffix: "%" },
  ];

  return (
    <div className="pt-36">

      {/* hero */}
      <HeroSection />
      {/* stats */}
      <section className="py-20 mt-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-gray-400 uppercase tracking-wider text-sm">
                {stat.label}
              </div>
            </div>
          ))}
          </div>
      </div>
    </section>
      {/* Features */}
      <FeaturesSection />
      {/* Pricing */}
      <Pricing />

      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl font-bold mb-6">
            Ready to <span className="bg-gradient-to-r from-emerald-400 to-purple-500 bg-clip-text text-transparent"> Create something Amazing?</span>
          </h2>

          <p className="text-xl text-gray-300 mb-8">
            Join thousends of creators who are already using AI to transform their images and bring their vision to life
          </p>

          <Link href={"/dashboard"}>
            <Button variant={"primary"} size={"xl"}>
              👉Start Creating Now👈
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
