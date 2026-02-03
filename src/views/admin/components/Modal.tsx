import { cn } from '@/components/shadcn/utils'
import { X } from 'lucide-react'
import { useEffect } from 'react'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    subtitle?: string
    children: React.ReactNode
    size?: ModalSize
    footer?: React.ReactNode
    className?: string
}

const sizeClasses: Record<ModalSize, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]'
}

export const Modal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    children,
    size = 'md',
    footer,
    className
}: ModalProps) => {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = ''
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className={cn(
                    'relative w-full bg-card rounded-xl shadow-xl',
                    'animate-in fade-in-0 zoom-in-95 duration-200',
                    'flex flex-col max-h-[85vh]',
                    sizeClasses[size],
                    className
                )}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 p-5 border-b border-border/50 flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                        {subtitle && (
                            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-md hover:bg-muted transition-colors -mr-1.5 -mt-1"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-5">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 p-5 border-t border-border/50 flex-shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}

// ============================================
// CONFIRMATION DIALOG
// ============================================

interface ConfirmDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'warning' | 'default'
    loading?: boolean
}

export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'default',
    loading = false
}: ConfirmDialogProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <p className="text-sm text-muted-foreground">{message}</p>

            <div className="flex items-center justify-end gap-3 mt-6">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className={cn(
                        'px-4 py-2 text-sm font-medium rounded-lg',
                        'bg-muted hover:bg-muted/80 text-foreground',
                        'transition-colors',
                        'disabled:opacity-50'
                    )}
                >
                    {cancelLabel}
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={cn(
                        'px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                        'disabled:opacity-50',
                        variant === 'danger' &&
                        'bg-rose-600 hover:bg-rose-700 text-white',
                        variant === 'warning' &&
                        'bg-amber-600 hover:bg-amber-700 text-white',
                        variant === 'default' &&
                        'bg-primary hover:bg-primary/90 text-primary-foreground'
                    )}
                >
                    {loading ? 'Loading...' : confirmLabel}
                </button>
            </div>
        </Modal>
    )
}

export default Modal
