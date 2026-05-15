"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ArrowRightLeft,
  Calendar,
  Building2,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/movimentacoes", label: "Movimentacoes", icon: ArrowRightLeft },
  { href: "/mensal", label: "Visao Mensal", icon: Calendar },
  { href: "/contas", label: "Contas", icon: Building2 },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-sidebar-bg p-2 text-white shadow-lg lg:hidden"
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
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-card-border bg-sidebar-bg transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">Lille</h1>
            <p className="text-xs text-accent">Finance Dashboard</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-sidebar-text lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-accent/15 text-accent"
                    : "text-sidebar-text hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-4">
          <div className="rounded-xl border border-card-border bg-card/30 px-4 py-3">
            <p className="text-xs font-medium text-accent">Lille Consulting</p>
            <p className="text-xs text-sidebar-text">Dados sigilosos</p>
          </div>
        </div>
      </aside>
    </>
  );
}
