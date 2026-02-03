import type { FilterConfig } from '../types'
import { recordTypeOptions } from './recordTypeMeta'

// ============================================
// FILTER CONFIGURATIONS
// ============================================

export const recordFilters: FilterConfig[] = [
    {
        key: 'type',
        label: 'Record Type',
        type: 'multiselect',
        options: recordTypeOptions,
        placeholder: 'All Types'
    },
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Approved', value: 'approved' },
            { label: 'Rejected', value: 'rejected' },
            { label: 'Draft', value: 'draft' }
        ],
        placeholder: 'All Status'
    },
    {
        key: 'dateRange',
        label: 'Date Range',
        type: 'daterange',
        placeholder: 'Select date range'
    },
    {
        key: 'domain',
        label: 'Domain',
        type: 'select',
        options: [
            { label: 'Computer Science', value: 'cs' },
            { label: 'Electronics', value: 'ece' },
            { label: 'Mechanical', value: 'mech' },
            { label: 'Civil', value: 'civil' },
            { label: 'Biotechnology', value: 'biotech' },
            { label: 'Management', value: 'mgmt' },
            { label: 'Other', value: 'other' }
        ],
        placeholder: 'All Domains'
    },
    {
        key: 'author',
        label: 'Author',
        type: 'text',
        placeholder: 'Search by author'
    },
    {
        key: 'year',
        label: 'Year',
        type: 'select',
        options: generateYearOptions(2015, new Date().getFullYear()),
        placeholder: 'All Years'
    }
]

export const userFilters: FilterConfig[] = [
    {
        key: 'role',
        label: 'Role',
        type: 'select',
        options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Faculty', value: 'faculty' },
            { label: 'HOD', value: 'hod' },
            { label: 'Dean', value: 'dean' },
            { label: 'Viewer', value: 'viewer' }
        ],
        placeholder: 'All Roles'
    },
    {
        key: 'department',
        label: 'Department',
        type: 'select',
        options: [
            { label: 'Computer Science', value: 'cs' },
            { label: 'Electronics', value: 'ece' },
            { label: 'Mechanical', value: 'mech' },
            { label: 'Civil', value: 'civil' },
            { label: 'Biotechnology', value: 'biotech' },
            { label: 'Management', value: 'mgmt' }
        ],
        placeholder: 'All Departments'
    },
    {
        key: 'status',
        label: 'Status',
        type: 'select',
        options: [
            { label: 'Active', value: 'active' },
            { label: 'Inactive', value: 'inactive' }
        ],
        placeholder: 'All Status'
    },
    {
        key: 'search',
        label: 'Search',
        type: 'text',
        placeholder: 'Search by name or email'
    }
]

export const approvalFilters: FilterConfig[] = [
    {
        key: 'type',
        label: 'Record Type',
        type: 'multiselect',
        options: recordTypeOptions,
        placeholder: 'All Types'
    },
    {
        key: 'dateRange',
        label: 'Submitted',
        type: 'daterange',
        placeholder: 'Select date range'
    },
    {
        key: 'department',
        label: 'Department',
        type: 'select',
        options: [
            { label: 'Computer Science', value: 'cs' },
            { label: 'Electronics', value: 'ece' },
            { label: 'Mechanical', value: 'mech' },
            { label: 'Civil', value: 'civil' },
            { label: 'Biotechnology', value: 'biotech' },
            { label: 'Management', value: 'mgmt' }
        ],
        placeholder: 'All Departments'
    }
]

// Helper function to generate year options
function generateYearOptions(startYear: number, endYear: number) {
    const options = []
    for (let year = endYear; year >= startYear; year--) {
        options.push({ label: year.toString(), value: year.toString() })
    }
    return options
}

export default {
    recordFilters,
    userFilters,
    approvalFilters
}
