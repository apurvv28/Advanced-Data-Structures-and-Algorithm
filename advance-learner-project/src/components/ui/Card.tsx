"use client";

import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

interface CardProps {
  title: string;
  description: string;
  icon: ReactNode;
  accentColor: string;
  onClick: () => void;
}

export function Card({
  title,
  description,
  icon,
  accentColor,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer border-brutal bg-white p-6 shadow-brutal transition-all duration-150 hover:-translate-y-1 hover:shadow-brutal-lg active:translate-y-0 active:shadow-brutal-sm select-none"
    >
      {/* Accent top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-2 border-b-brutal"
        style={{ background: accentColor }}
      />

      <div className="flex flex-col gap-4 pt-2">
        <div
          className="w-12 h-12 border-brutal flex items-center justify-center text-white"
          style={{ background: accentColor }}
        >
          {icon}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-black uppercase tracking-tight text-black">
            {title}
          </h3>
          <p className="text-sm font-medium text-text-secondary leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-1 text-sm font-black uppercase text-black">
          Explore
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
