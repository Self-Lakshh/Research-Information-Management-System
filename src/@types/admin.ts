import React from 'react'

// ============================================
// ADMIN PANEL TYPE DEFINITIONS
// ============================================

// Record Types
export { type RecordType, type ApprovalStatus, type UserRole } from './rims.types'
import { RecordType, ApprovalStatus, UserRole } from './rims.types'

// ============================================
// FIELD CONFIGURATION TYPES
// ============================================

export type FieldType =
    | 'text'
    | 'textarea'
    | 'number'
    | 'date'
    | 'select'
    | 'multiselect'
    | 'file'
    | 'url'

export interface FieldConfig {
    key: string
    label: string
    type: FieldType
    required?: boolean
    placeholder?: string
    options?: { label: string; value: string }[]
    gridSpan?: 1 | 2 // For form layout
}

export interface RecordTypeConfig {
    type: RecordType
    label: string
    pluralLabel: string
    icon: string
    color: string
    fields: FieldConfig[]
}

// ============================================
// DATA MODELS
// ============================================

export interface User {
    id: string
    name: string
    email: string
    user_role: UserRole
    faculty: string
    created_at: string
    avatar?: string
    status: 'active' | 'inactive'
}

export interface ResearchRecord {
    id: string
    title: string
    type: RecordType
    author: string
    authorId: string
    domain: string
    date: string
    year: number
    status: ApprovalStatus
    description?: string
    submittedAt: string
    updatedAt: string
    data: Record<string, unknown>
}

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

// Filter Definition
export interface FilterConfig {
    key: string
    label: string
    type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text'
    options?: { label: string; value: string }[]
    placeholder?: string
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
