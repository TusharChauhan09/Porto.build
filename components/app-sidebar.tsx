"use client";

import { useSession, signOut } from "@/lib/auth-client";
import {
  PanelLeftClose,
  PanelLeft,
  FileText,
  LayoutTemplate,
  FileUser,
  Settings,
  MessageSquare,
  HelpCircle,
  LogOut,
  ChevronDown,
  ExternalLink,
  Sun,
  Moon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const { data: session } = useSession();
  const user = session?.user;
  const pathname = usePathname();

  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isExpanded = !collapsed;

  const initial = user?.name?.[0]?.toUpperCase() || "U";
  const avatarUrl = user?.image && user.image.length > 0 ? user.image : null;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.aside
      animate={{ width: isExpanded ? 220 : 52 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="h-full bg-sidebar border-r border-sidebar-border flex flex-col flex-shrink-0 overflow-hidden"
    >
      {/* Top bar — brand + collapse toggle */}
      <div className="px-3.5 pt-3.5 pb-1.5 flex justify-between items-center">
        <AnimatePresence mode="wait" initial={false}>
          {isExpanded ? (
            <motion.div
              key="expanded-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex justify-between items-center w-full"
            >
              <Link href="/arena" className="text-[14px] font-semibold text-sidebar-foreground tracking-tight whitespace-nowrap">
                <span className="font-bold text-xl">Porto</span><span className="italic-main font-semibold text-xl">.build</span>
              </Link>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setCollapsed(true)}
                className="text-muted-foreground hover:text-sidebar-foreground transition-colors"
              >
                <PanelLeftClose size={20} strokeWidth={1.5} />
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              key="collapsed-header"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => setCollapsed(false)}
              className="w-[30px] h-[30px] text-muted-foreground hover:text-sidebar-foreground transition-colors flex items-center justify-center mx-auto"
            >
              <PanelLeft size={20} strokeWidth={1.5} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Divider */}
      <div className="mx-3.5 border-t border-sidebar-border" />

      {/* Documentation */}
      <div className="mt-2.5 mb-1">
        <nav className="space-y-[1px] px-2">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href="/arena/docs"
              className={`flex items-center ${isExpanded ? "gap-2.5 px-2.5" : "justify-center"} py-1.5 text-[12px] rounded-lg transition-colors ${
                pathname === "/arena/docs"
                  ? "text-sidebar-accent-foreground font-medium bg-sidebar-accent"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <FileText size={14} strokeWidth={1.5} className="flex-shrink-0" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    Documentation
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>
        </nav>
      </div>

      {/* Divider */}
      <div className="mx-3.5 border-t border-sidebar-border" />

      {/* Tools section */}
      <div className="flex-1 overflow-y-auto mt-2.5">
        <AnimatePresence>
          {isExpanded && (
            <motion.h3
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              className="px-3.5 mb-1 text-[9px] font-semibold text-muted-foreground tracking-wider whitespace-nowrap overflow-hidden"
            >
              TOOLS
            </motion.h3>
          )}
        </AnimatePresence>
        <nav className="space-y-[1px] px-2">
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href="/arena/templates"
              className={`flex items-center ${isExpanded ? "gap-2.5 px-2.5" : "justify-center"} py-1.5 text-[12px] rounded-lg transition-colors ${
                pathname.startsWith("/arena/templates")
                  ? "text-sidebar-accent-foreground font-medium bg-sidebar-accent"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <LayoutTemplate size={14} strokeWidth={1.5} className="flex-shrink-0" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    Templates
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>
          <motion.div whileTap={{ scale: 0.97 }}>
            <Link
              href="/arena/cv-maker"
              className={`flex items-center ${isExpanded ? "gap-2.5 px-2.5" : "justify-center"} py-1.5 text-[12px] rounded-lg transition-colors ${
                pathname === "/arena/cv-maker"
                  ? "text-sidebar-accent-foreground font-medium bg-sidebar-accent"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              }`}
            >
              <FileUser size={14} strokeWidth={1.5} className="flex-shrink-0" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    CV Maker
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>
        </nav>
      </div>

      {/* Bottom user profile + dropdown */}
      <div className="relative" ref={dropdownRef}>
        {/* Dropdown menu */}
        <AnimatePresence>
          {dropdownOpen && isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
              className="absolute bottom-full left-3.5 right-3.5 mb-2 bg-popover border border-border rounded-xl shadow-lg overflow-hidden z-50"
            >
              {/* User header */}
              <div className="px-3.5 py-2.5 border-b border-border flex items-center gap-2.5">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={user?.name || "User"} className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-[11px]">
                    {initial}
                  </div>
                )}
                <div>
                  <p className="text-[12px] font-semibold text-foreground whitespace-nowrap">
                    {user?.name || "User"}
                  </p>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-0.5">
                <motion.button whileTap={{ scale: 0.97 }} className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[12px] text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors whitespace-nowrap">
                  <Settings size={14} strokeWidth={1.5} />
                  Settings
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[12px] text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors whitespace-nowrap"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={theme}
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center"
                    >
                      {theme === "dark" ? <Sun size={14} strokeWidth={1.5} /> : <Moon size={14} strokeWidth={1.5} />}
                    </motion.span>
                  </AnimatePresence>
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </motion.button>
              </div>

              {/* Feedback & Support */}
              <div className="border-t border-border py-0.5">
                <motion.button whileTap={{ scale: 0.97 }} className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[12px] text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors whitespace-nowrap">
                  <MessageSquare size={14} strokeWidth={1.5} />
                  Submit feedback
                  <ExternalLink size={10} strokeWidth={1.5} className="ml-auto text-muted-foreground" />
                </motion.button>
                <motion.button whileTap={{ scale: 0.97 }} className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[12px] text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors whitespace-nowrap">
                  <HelpCircle size={14} strokeWidth={1.5} />
                  Help & support
                </motion.button>
              </div>

              {/* Logout */}
              <div className="border-t border-border py-0.5">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() =>
                    signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          window.location.href = "/auth/signin";
                        },
                      },
                    })
                  }
                  className="w-full px-3.5 py-1.5 flex items-center gap-2.5 text-[12px] text-destructive hover:bg-destructive/10 transition-colors whitespace-nowrap"
                >
                  <LogOut size={14} strokeWidth={1.5} />
                  Log out
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User row trigger */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => isExpanded && setDropdownOpen(!dropdownOpen)}
          className={`py-3 border-t border-sidebar-border flex items-center cursor-pointer hover:bg-sidebar-accent/50 transition-colors group ${
            isExpanded ? "px-3.5 gap-2.5" : "justify-center px-0"
          }`}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={user?.name || "User"} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-[11px] flex-shrink-0">
              {initial}
            </div>
          )}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden flex-1 flex items-center gap-2.5"
              >
                <div className="overflow-hidden flex-1">
                  <h2 className="text-[12px] font-semibold text-sidebar-foreground leading-tight truncate">
                    {user?.name || "User"}
                  </h2>
                  <p className="text-[10px] text-muted-foreground truncate">
                    {user?.email || ""}
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown
                    size={12}
                    strokeWidth={1.5}
                    className="text-muted-foreground group-hover:text-sidebar-foreground transition-colors"
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.aside>
  );
}
