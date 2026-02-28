import { cn } from "@/components/shadcn/utils"
import { LayoutGrid, List } from "lucide-react"

interface ViewSliderProps {
    viewMode: 'grid' | 'table'
    setViewMode: (mode: 'grid' | 'table') => void
}

const ViewSlider = ({ viewMode, setViewMode }: ViewSliderProps) => {
    return (
        <div className="flex items-center gap-1 p-1 bg-card rounded-2xl border border-muted/50 shadow-soft h-12">
            <button
                onClick={() => setViewMode('grid')}
                className={cn(
                    'px-3 h-full flex items-center justify-center rounded-xl transition-all duration-300',
                    viewMode === 'grid' ? 'bg-background shadow-premium text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
                title="Grid View"
            >
                <LayoutGrid className="w-4 h-4" />
            </button>
            <button
                onClick={() => setViewMode('table')}
                className={cn(
                    'px-3 h-full flex items-center justify-center rounded-xl transition-all duration-300',
                    viewMode === 'table' ? 'bg-background shadow-premium text-primary' : 'text-muted-foreground hover:text-foreground'
                )}
                title="Table View"
            >
                <List className="w-4 h-4" />
            </button>
        </div>
    )
}

export default ViewSlider