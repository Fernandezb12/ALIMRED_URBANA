import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-xl border bg-transparent px-3 py-2 text-sm placeholder:text-texto/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vino",
        className
      )}
      {...props}
    />
  );
}
