import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gaming' | 'shimmer'
}

function Skeleton({ className, variant = 'default', ...props }: SkeletonProps) {
  const variants = {
    default: "bg-muted animate-pulse",
    gaming: "bg-gradient-to-r from-gaming-blue/20 to-gaming-purple/20 animate-shimmer",
    shimmer: "bg-gradient-to-r from-muted via-muted-foreground/20 to-muted animate-shimmer"
  }

  return (
    <div
      className={cn(
        "rounded-md",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }