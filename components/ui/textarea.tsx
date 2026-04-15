import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-20 w-full rounded-xl border bg-transparent px-3 py-2 text-sm placeholder:text-texto/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vino",
        className
      )}
      {...props}
    />
  );
}
