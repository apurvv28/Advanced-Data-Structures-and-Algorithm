import { ReactNode } from "react";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      {/* Grid pattern background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #000 0px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #000 0px, transparent 1px, transparent 40px)",
        }}
      />

      <header className="fixed top-0 w-full px-6 py-4 z-40 bg-background border-b-brutal">
        <div className="max-w-7xl mx-auto flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 border-brutal bg-primary flex items-center justify-center shadow-brutal-sm">
              <Zap className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-tight">
              DSA<span className="text-accent-blue">.vis</span>
            </h1>
          </Link>
        </div>
      </header>

      <main className="relative z-10 pt-24 min-h-screen">{children}</main>
    </div>
  );
}
