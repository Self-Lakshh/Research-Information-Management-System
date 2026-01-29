import { useState, useEffect } from 'react'

export type Tab = {
    id: string
    label: string
    count?: number
    badge?: {
        value: number | string
        variant?: 'default' | 'warning' | 'success' | 'danger'
    }
}

type TabHeaderProps = {
    tabs: Tab[]
    activeTab: string
    onTabChange: (tabId: string) => void
    className?: string
    storageKey?: string
}

const TabHeader = ({
    tabs,
    activeTab: controlledActiveTab,
    onTabChange,
    className = '',
    storageKey,
}: TabHeaderProps) => {
    const [internalActiveTab, setInternalActiveTab] = useState(controlledActiveTab)

    useEffect(() => {
        if (storageKey) {
            const saved = localStorage.getItem(storageKey)
            if (saved && tabs.some((tab) => tab.id === saved)) {
                setInternalActiveTab(saved)
                onTabChange(saved)
            }
        }
    }, [storageKey])

    useEffect(() => {
        setInternalActiveTab(controlledActiveTab)
    }, [controlledActiveTab])

    const handleTabClick = (tabId: string) => {
        setInternalActiveTab(tabId)
        onTabChange(tabId)

        if (storageKey) {
            localStorage.setItem(storageKey, tabId)
        }
    }

    const getBadgeStyles = (variant?: string) => {
        switch (variant) {
            case 'warning':
                return 'bg-orange-500 text-white'
            case 'success':
                return 'bg-green-500 text-white'
            case 'danger':
                return 'bg-red-500 text-white'
            default:
                return 'bg-primary text-primary-foreground'
        }
    }

    return (
        <div className={`bg-card border-b ${className}`}>
            <div className="flex gap-2 p-4 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id)}
                        className={`
                            px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors
                            flex items-center gap-2
                            ${internalActiveTab === tab.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }
                        `}
                    >
                        {tab.label}
                        {tab.count !== undefined && (
                            <span className="text-sm">({tab.count})</span>
                        )}
                        {tab.badge && (
                            <span
                                className={`
                                px-2 py-0.5 rounded-full text-xs font-semibold
                                ${getBadgeStyles(tab.badge.variant)}
                            `}
                            >
                                {tab.badge.value}
                            </span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default TabHeader
