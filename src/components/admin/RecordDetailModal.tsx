import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/shadcn/ui/dialog"
import { Button } from "@/components/shadcn/ui/button"
import { ResearchRecord } from "@/@types/admin"
import { useAdminUI } from "@/utils/hooks/useAdminUI"
import { Calendar, User, FileText, ChevronRight } from 'lucide-react'
import { cn } from "@/components/shadcn/utils"

interface RecordDetailModalProps {
    isOpen: boolean
    onClose: () => void
    record: ResearchRecord | null
}

export const RecordDetailModal = ({
    isOpen,
    onClose,
    record
}: RecordDetailModalProps) => {
    const { StatusBadge, RecordTypeBadge } = useAdminUI()

    if (!record) return null

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <RecordTypeBadge type={record.type} />
                        <StatusBadge status={record.status} />
                    </div>
                    <DialogTitle className="text-xl font-bold">{record.title}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-6 my-4 p-4 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-lg border">
                            <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Author</p>
                            <p className="text-sm font-semibold">{record.author}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-lg border">
                            <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Domain</p>
                            <p className="text-sm font-semibold">{record.domain}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-lg border">
                            <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Year</p>
                            <p className="text-sm font-semibold">{record.year}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-lg border">
                            <Calendar className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Submitted</p>
                            <p className="text-sm font-semibold">{new Date(record.submittedAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Description</h4>
                        <p className="text-sm text-foreground/80 leading-relaxed bg-muted/10 p-4 rounded-lg border border-dashed">
                            {record.description || "No description provided."}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Detailed Data</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Object.entries(record.data).map(([key, value]) => (
                                <div key={key} className="flex justify-between p-2 border-b text-sm">
                                    <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                    <span className="font-medium">{String(value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-6 border-t pt-4">
                    <Button variant="outline" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
