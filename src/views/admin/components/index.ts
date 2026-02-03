// ============================================
// ADMIN COMPONENTS BARREL EXPORT
// ============================================

// Core Components
export { StatCard } from './StatCard'
export {
    ChartContainer,
    BarChartPlaceholder,
    DonutChartPlaceholder,
    LineChartPlaceholder
} from './DashboardCharts'
export { RecordsSummaryTable } from './RecordsSummaryTable'
export { DataTable, TableActionMenu } from './DataTable'
export { FilterBar } from './FilterBar'
export { Modal, ConfirmDialog } from './Modal'

// Page Layout
export {
    PageContainer,
    PageHeader,
    EmptyState,
    SectionCard
} from './PageLayout'

// Badges
export {
    StatusBadge,
    RecordTypeBadge,
    RoleBadge,
    UserStatusBadge
} from './Badges'

// Dynamic Renderers
export {
    DynamicFieldRenderer,
    DynamicFormRenderer
} from './DynamicFieldRenderer'

// Approval Components
export {
    RecordApprovalCard,
    ApprovalActionBar,
    CompactApprovalCard
} from './RecordApprovalCard'

// Modals
export { RecordDetailModal, UserFormModal } from './RecordDetailModal'
export type { UserFormData } from './RecordDetailModal'
