"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-xl border " +
            "bg-white/80 dark:bg-white/[0.04] " +
            "border-black/[0.06] dark:border-white/[0.08] " +
            "text-zinc-900 dark:text-zinc-100 " +
            "shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.5)]",
          title: "text-sm font-semibold",
          description: "text-xs text-zinc-500 dark:text-zinc-400",
          success:
            "border-emerald-200/60 dark:border-emerald-500/20 " +
            "[&_svg]:text-emerald-600 dark:[&_svg]:text-emerald-400",
          error:
            "border-red-200/60 dark:border-red-500/20 " +
            "[&_svg]:text-red-500 dark:[&_svg]:text-red-400",
          warning:
            "border-amber-200/60 dark:border-amber-500/20 " +
            "[&_svg]:text-amber-500 dark:[&_svg]:text-amber-400",
          info:
            "border-violet-200/60 dark:border-violet-500/20 " +
            "[&_svg]:text-violet-500 dark:[&_svg]:text-violet-400",
          loading:
            "border-zinc-200/60 dark:border-zinc-500/20 " +
            "[&_svg]:text-zinc-500 dark:[&_svg]:text-zinc-400",
          actionButton:
            "bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-lg hover:opacity-90",
          cancelButton:
            "text-muted-foreground text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-muted",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
