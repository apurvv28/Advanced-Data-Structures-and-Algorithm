"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      {/* Grid pattern background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #000 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #000 0px, transparent 1px, transparent 40px)",
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full px-6 py-4 z-40 bg-background border-b-brutal">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 border-brutal bg-primary flex items-center justify-center shadow-brutal-sm">
              <Zap className="w-5 h-5" />
            </div>
            <span className="text-xl font-black uppercase tracking-tight">
              DSA<span className="text-accent-blue">.vis</span>
            </span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-black uppercase border-brutal px-4 py-2 bg-white hover:bg-primary shadow-brutal-sm active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-block px-5 py-2 border-brutal bg-primary font-black uppercase text-sm tracking-widest shadow-brutal-sm"
          >
            Stop Memorizing. Start Understanding.
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
            Data Structures
            <br />
            <span className="text-accent-blue">Visualized.</span>
          </h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-lg md:text-xl font-bold text-text-secondary max-w-2xl mx-auto leading-relaxed"
          >
            Real understanding comes from seeing algorithms in action. Step
            through trees and graphs with interactive 3D simulations.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center pt-6"
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-3 px-8 py-4 text-lg font-black uppercase border-brutal bg-accent-green shadow-brutal-lg hover:shadow-brutal-xl active:shadow-brutal-sm active:translate-x-1 active:translate-y-1 transition-all"
            >
              Start Exploring
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Decorative squares */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-8 flex gap-3"
        >
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-4 h-4 border-brutal-thin bg-primary" />
          ))}
        </motion.div>
      </main>
    </div>
  );
}
