"use client";

import { useSession } from "@/lib/auth-client";
import { useTheme } from "next-themes";
import { Settings, Sun, Moon, Monitor, User, Bell } from "lucide-react";
import { motion } from "motion/react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const { theme, setTheme } = useTheme();

  const initial = user?.name?.[0]?.toUpperCase() || "U";
  const avatarUrl = user?.image && user.image.length > 0 ? user.image : null;

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Settings size={22} strokeWidth={1.5} className="text-muted-foreground" />
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>

        {/* Profile Section */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-4 flex items-center gap-2">
            <User size={14} strokeWidth={1.5} />
            Profile
          </h2>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-4">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user?.name || "User"}
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {initial}
                </div>
              )}
              <div>
                <p className="text-base font-semibold text-foreground">
                  {user?.name || "User"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-4 flex items-center gap-2">
            <Sun size={14} strokeWidth={1.5} />
            Appearance
          </h2>
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-sm text-muted-foreground mb-4">
              Choose your preferred theme for the interface.
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "light", label: "Light", icon: Sun },
                { value: "dark", label: "Dark", icon: Moon },
                { value: "system", label: "System", icon: Monitor },
              ].map(({ value, label, icon: Icon }) => (
                <motion.button
                  key={value}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTheme(value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                    theme === value
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  <Icon size={20} strokeWidth={1.5} />
                  <span className="text-xs font-medium">{label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-4 flex items-center gap-2">
            <Bell size={14} strokeWidth={1.5} />
            Notifications
          </h2>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Email notifications</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Receive updates about your deployments and account.
                </p>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
                Coming soon
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
