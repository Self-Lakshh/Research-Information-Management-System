import { cn } from "@/components/shadcn/utils"
import { LayoutGrid, List } from "lucide-react"

interface ViewSliderProps {
    viewMode: "grid" | "table"
    setViewMode: (mode: "grid" | "table") => void
}

const ViewSlider = ({ viewMode, setViewMode }: ViewSliderProps) => {
    return (
        <div className="relative inline-flex items-center p-1 rounded-lg border border-border/60 bg-card shadow-sm gap-1 h-10 shrink-0">
            {/* Premium Sliding Background Indicator */}
            <div
                className={cn(
                    "absolute top-1 left-1 h-8 w-8 rounded-md bg-primary/10 border border-primary/30 shadow-sm transition-transform duration-500 z-0",
                    viewMode === "table" ? "translate-x-9" : "translate-x-0"
                )}
                style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
            />

            <button
                onClick={() => setViewMode("grid")}
                className={cn(
                    "relative z-10 flex items-center justify-center w-8 h-8 rounded-md transition-colors duration-300",
                    "focus-visible:outline-none",
                    viewMode === "grid"
                        ? "text-primary font-bold drop-shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                )}
                title="Grid View"
            >
                <LayoutGrid className="w-4 h-4" />
            </button>

            <button
                onClick={() => setViewMode("table")}
                className={cn(
                    "relative z-10 flex items-center justify-center w-8 h-8 rounded-md transition-colors duration-300",
                    "focus-visible:outline-none",
                    viewMode === "table"
                        ? "text-primary font-bold drop-shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                )}
                title="Table View"
            >
                <List className="w-4 h-4" />
            </button>
        </div>
    )
}

export default ViewSlider