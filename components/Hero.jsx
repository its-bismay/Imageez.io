"use client"
import Link from "next/link";
import { useEffect, useState } from "react"
import { Button } from "./ui/button";
import { FuturisticAIEditorWindow } from "./ShowcaseEditor";

const HeroSection = () => {

    const [textVisible, setTextVisible] = useState(false);
    const [demoHovered, setDemoHovered] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setTextVisible(true), 500);
        return () => clearTimeout(timer)
    }, [])
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="text-center z-10 px-6">
            <div className={`transition-all duration-100 ${textVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                <h1 className="text-6xl md:text-9xl font-black mb-6 tracking-tight">
                    <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent animate-pulse">Create</span>
                    <br />
                    <span className="text-white">Without Limits</span>
                </h1>

                <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Professional image editing powered by AI. Crop, resize, adjust colors, remove backgrounds, and enhance your images with cutting-edge technology.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
                    <Link href="/dashboard">
                        <Button variant="primary" size="xl">
                            Start Creating
                        </Button>
                    </Link>
                        <Button variant="glass" size="xl">
                            Watch Demo
                        </Button>
                </div>
            </div>

            <FuturisticAIEditorWindow 
                title="Imageez.io"
                showProcessing={true}
            />
        </div>
    </section>
  )
}
export default HeroSection