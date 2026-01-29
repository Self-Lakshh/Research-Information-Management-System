import { RotateCcw } from "lucide-react"
import { Button } from "../shadcn/ui/button"
import { Spinner } from "../shadcn/ui/spinner"
import { cn } from "../shadcn/utils"

interface RefetchLoaderProps {
    isRefetching: boolean
    handleRefetch: () => void
    className?: string
}

const RefetchLoader = ({ isRefetching, handleRefetch, className }: RefetchLoaderProps) => {
    return (
        <Button
            variant={'ghost'}
            disabled={isRefetching}
            className={cn('rounded-full p-2 border bg-card', className)}
            onClick={handleRefetch}
        >
            {isRefetching ? <Spinner className="size-4" /> : <RotateCcw size={18} />}
        </Button>
    )
}

export default RefetchLoader
