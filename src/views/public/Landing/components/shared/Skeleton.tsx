import { cn } from "@/components/shadcn/utils"

interface SkeletonProps {
    className?: string
    variant?: "default" | "circular" | "text" | "image"
}

export const Skeleton = ({ className, variant = "default" }: SkeletonProps) => {
    const baseClasses = "animate-pulse bg-gradient-to-r from-muted via-muted/70 to-muted bg-[length:200%_100%] rounded"

    const variantClasses = {
        default: "",
        circular: "rounded-full",
        text: "h-4 rounded-md",
        image: "rounded-xl aspect-video"
    }

    return (
        <div
            className={cn(
                baseClasses,
                variantClasses[variant],
                "animate-shimmer",
                className
            )}
        />
    )
}

// Card Skeleton Components
export const FeatureCardSkeleton = () => (
    <div className="rounded-xl sm:rounded-2xl border shadow-sm p-4 sm:p-5 lg:p-6 space-y-3 bg-card h-full">
        <Skeleton className="h-10 w-10 sm:h-11 sm:w-11 lg:h-13 lg:w-13 rounded-full" />
        <Skeleton className="h-6 sm:h-7 w-2/3" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
        </div>
    </div>
)

export const StatCardSkeleton = () => (
    <div className="relative bg-white/55 rounded-2xl sm:rounded-[32px] px-4 sm:px-5 lg:px-6 py-4 sm:py-5 lg:py-6 shadow-sm border border-gray-100">
        <div className="flex flex-col items-start gap-2 sm:gap-3 lg:gap-4">
            <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-full" />
            <Skeleton className="h-8 sm:h-10 lg:h-12 w-20" />
            <Skeleton className="h-4 sm:h-5 w-32" />
        </div>
    </div>
)

export const DomainCardSkeleton = () => (
    <div className="rounded-xl sm:rounded-2xl overflow-hidden border shadow-sm bg-card h-full">
        <div className="m-2 sm:m-3 lg:m-4 rounded-lg overflow-hidden">
            <Skeleton className="w-full h-32 sm:h-36 lg:h-40 xl:h-45 rounded-lg" />
        </div>
        <div className="p-3 sm:p-4 lg:p-5 space-y-3">
            <Skeleton className="h-5 sm:h-6 w-3/4" />
            <div className="space-y-1.5">
                <Skeleton className="h-3 sm:h-4 w-full" />
                <Skeleton className="h-3 sm:h-4 w-5/6" />
                <Skeleton className="h-3 sm:h-4 w-4/6" />
            </div>
        </div>
    </div>
)

export const PartnerCardSkeleton = () => (
    <div className="h-[280px] sm:h-[320px] lg:h-[340px] w-full max-w-[320px] rounded-xl sm:rounded-2xl border bg-card shadow-sm p-4 sm:p-5 lg:p-6">
        <div className="mb-3 sm:mb-4 lg:mb-5">
            <Skeleton className="h-16 sm:h-18 lg:h-20 w-full rounded-lg" />
        </div>
        <Skeleton className="h-5 sm:h-6 w-1/2" />
        <div className="mt-3 space-y-2">
            <Skeleton className="h-3 sm:h-4 w-full" />
            <Skeleton className="h-3 sm:h-4 w-5/6" />
            <Skeleton className="h-3 sm:h-4 w-4/6" />
        </div>
        <div className="flex-grow" />
        <div className="my-2 sm:my-3 lg:my-4">
            <Skeleton className="h-px w-full" />
        </div>
        <Skeleton className="h-4 w-16" />
    </div>
)

export const ImageSkeleton = ({ className }: { className?: string }) => (
    <Skeleton className={cn("w-full aspect-video", className)} />
)

export const ShowcaseSkeleton = () => (
    <div className="rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden bg-muted h-[180px] sm:h-[280px] md:h-[350px] lg:h-[400px] xl:h-[450px] animate-pulse" />
)

export default Skeleton
