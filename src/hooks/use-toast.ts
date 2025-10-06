import { Toaster, toast as sonnerToast } from "sonner"

export function useToast() {
  return {
    toast: ({ title, description, variant = "default" }: {
      title?: string
      description?: string
      variant?: "default" | "destructive"
    }) => {
      sonnerToast[variant === "destructive" ? "error" : "success"]((description || title) as string, {
        description: description ? title : undefined,
      })
    },
  }
}