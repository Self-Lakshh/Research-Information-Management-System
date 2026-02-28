import React from 'react'

// ============================================
// ADMIN PANEL TYPE DEFINITIONS
// ============================================

// Record Types
export { type RecordType, type ApprovalStatus, type UserRole } from './rims.types'
import { RecordType, ApprovalStatus, UserRole } from './rims.types'

// ============================================

// ============================================
// DATA MODELS
// ============================================

export { type User, type Record as ResearchRecord } from './rims.types'
import { User, Record as ResearchRecord } from './rims.types'

export interface ApprovalRequest {
    id: string
    recordId: string
    record: ResearchRecord
    submittedBy: User
    submittedAt: string
    status: ApprovalStatus
    comments?: string
}

// ============================================
// COMPONENT PROP TYPES
// ============================================

// StatCard
export interface StatCardProps {
    label: string
    value: string | number
    trend?: {
        value: number
        direction: 'up' | 'down'
    }
    subtext?: string
    icon?: React.ReactNode
    variant?: 'primary' | 'indigo' | 'azure' | 'rose' | 'amber' | 'emerald' | 'warning' | 'default'
    className?: string
}

// Table Column Definition
export interface TableColumn<T> {
    key: keyof T | string
    label: string
    width?: string
    render?: (value: unknown, row: T) => React.ReactNode
    sortable?: boolean
}

// Modal Types
export interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    size?: 'sm' | 'md' | 'lg' | 'xl'
}

// Action Button
export interface ActionButton {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    icon?: React.ReactNode
    disabled?: boolean
}

// Chart Data
export interface ChartData {
    label: string
    value: number
    color?: string
}

// Summary Row
export interface SummaryRow {
    type: string
    total: number
    pending: number
}
