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
        className="fixed left-3 top-3 z-50 rounded-lg bg-nav-bg p-2.5 text-white shadow-lg lg:hidden"
      >
        <Menu size={18} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[72px] flex-col items-center bg-nav-bg py-5 transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button onClick={() => setOpen(false)} className="mb-6 text-white/60 lg:hidden">
          <X size={16} />
        </button>

        <div className="mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-xs font-black text-white">
            L
          </div>
        </div>

        <nav className="flex flex-1 flex-col items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                title={item.label}
                className={`group relative flex h-11 w-11 items-center justify-center rounded-lg transition-all ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/30 hover:bg-white/5 hover:text-white/60"
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="absolute left-full ml-3 hidden rounded-md bg-nav-bg px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg group-hover:block whitespace-nowrap">
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
