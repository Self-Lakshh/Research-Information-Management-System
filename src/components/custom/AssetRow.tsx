import React from 'react'
import { FileText, Eye, X } from 'lucide-react'
import { Button } from "@/components/shadcn/ui/button"
import { cn } from "@/components/shadcn/utils"

interface AssetRowProps {
    url: string;
    fileName: string;
    label?: string;
    onDelete?: () => void;
    isExisting?: boolean;
}

export const AssetRow: React.FC<AssetRowProps> = ({ url, fileName, label, onDelete, isExisting }) => {
    const handleOpen = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (url) window.open(url, '_blank', 'noopener,noreferrer')
    }

    const truncateName = (name: string) => {
        const limit = 12;
        if (name.length <= limit + 5) return name;
        const ext = name.includes('.') ? name.split('.').pop() : '';
        const base = name.split('.')[0];
        return base.substring(0, limit) + '...' + (ext ? '.' + ext : '');
    }

    return (
        <div className="flex items-center justify-between p-3 rounded-[24px] bg-white dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 shadow-sm transition-all hover:bg-zinc-50/50 dark:hover:bg-zinc-700/30 group">
            <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-[18px] bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-xs border border-rose-100/50 dark:border-rose-500/10 shrink-0 transition-colors group-hover:bg-rose-100/50 dark:group-hover:bg-rose-500/20">
                    <FileText className="w-5 h-5" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-bold text-slate-700 dark:text-slate-100 truncate pr-2 leading-tight" title={fileName}>
                        {truncateName(fileName)}
                    </span>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                        {label || (isExisting ? 'Stored in Cloud' : 'New Asset')}
                    </span>
                </div>
            </div>
            
            <div className="flex items-center gap-1 pr-1">
                {url && (
                    <button 
                        type="button"
                        onClick={handleOpen}
                        className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-primary transition-all duration-300"
                        title="Preview"
                    >
                        <Eye className="w-5 h-5 opacity-60 group-hover:opacity-100" />
                    </button>
                )}
                {onDelete && (
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                        className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all ml-1"
                        title="Remove"
                    >
                        <X className="w-5 h-5 opacity-60 hover:opacity-100" />
                    </button>
                )}
            </div>
        </div>
    )
}
