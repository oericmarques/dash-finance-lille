"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DollarSign, ArrowUpRight, ArrowDownRight, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Fluxo de Caixa", icon: DollarSign, color: "text-white" },
  { href: "/contas-a-receber", label: "Contas a Receber", icon: ArrowUpRight, color: "text-cyan-400" },
  { href: "/contas-a-pagar", label: "Contas a Pagar", icon: ArrowDownRight, color: "text-orange-400" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-[#0f172a] p-2 text-white shadow-lg lg:hidden"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-20 flex-col items-center border-r border-[#1e293b] bg-[#0f172a] py-6 transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button onClick={() => setOpen(false)} className="mb-8 text-white lg:hidden">
          <X size={18} />
        </button>

        <div className="mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 text-sm font-black text-white">
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
                className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? "bg-white/10 shadow-lg"
                    : "hover:bg-white/5"
                }`}
              >
                <item.icon size={22} className={isActive ? item.color : "text-slate-500"} />
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
