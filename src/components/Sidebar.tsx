"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ArrowUpRight, ArrowDownRight, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Fluxo de Caixa", icon: BarChart3 },
  { href: "/contas-a-receber", label: "A Receber", icon: ArrowUpRight },
  { href: "/contas-a-pagar", label: "A Pagar", icon: ArrowDownRight },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-2xl bg-nav-bg text-white shadow-lg lg:hidden"
      >
        <Menu size={18} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[72px] flex-col items-center bg-nav-bg py-6 transition-transform duration-300 ease-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button onClick={() => setOpen(false)} className="mb-6 text-white/40 lg:hidden">
          <X size={16} />
        </button>

        <div className="mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-sm font-black text-white shadow-lg shadow-accent/30">
            L
          </div>
        </div>

        <nav className="flex flex-1 flex-col items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                title={item.label}
                className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-white/25 hover:bg-white/5 hover:text-white/50"
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.2 : 1.6} />
                <span className="absolute left-full ml-4 hidden rounded-xl bg-text px-3 py-2 text-[11px] font-semibold text-white shadow-lg group-hover:block whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
