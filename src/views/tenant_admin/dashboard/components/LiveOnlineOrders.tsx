import React, { memo, useState } from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/shadcn/ui/card'
import { Separator } from '@/components/shadcn/ui/separator'
import { Badge } from '@/components/shadcn/ui/badge'
import { Check, Timer, X, Loader2 } from 'lucide-react'
import { cn } from '../../../../components/shadcn/utils'
import { Button } from '@/components/shadcn/ui/button'

export type OrderItem = {
  name: string
  quantity: number
}

export type OnlineCardProps = {
  orderId: string
  platform: string
  amount: number
  currency?: string
  items: OrderItem[]
  placedAgo: string
  onAccept: (orderId: string) => void
  onReject: (orderId: string) => void
  className?: string
}

const LiveOnlineOrders: React.FC<OnlineCardProps> = memo(
  ({
    orderId,
    platform,
    amount,
    currency = '$',
    items,
    placedAgo,
    onAccept,
    onReject,
    className = '',
  }) => {
    const [isProcessing, setIsProcessing] = useState(false)
    const [actionType, setActionType] = useState<'accept' | 'reject' | null>(
      null,
    )

    const itemSummary = items
      .map((i) => `${i.quantity}x ${i.name}`)
      .join(', ')

    const handleAccept = async () => {
      setIsProcessing(true)
      setActionType('accept')
      try {
        onAccept(orderId)
        await new Promise((r) => setTimeout(r, 500))
      } finally {
        setIsProcessing(false)
        setActionType(null)
      }
    }

    const handleReject = async () => {
      setIsProcessing(true)
      setActionType('reject')
      try {
        onReject(orderId)
        await new Promise((r) => setTimeout(r, 500))
      } finally {
        setIsProcessing(false)
        setActionType(null)
      }
    }

    return (
      <Card
        className={cn(
          'w-full rounded-xl border-teal-300 bg-card transition-opacity',
          isProcessing && 'opacity-60',
          className,
        )}
        style={{
          boxShadow:
            'rgba(0, 0, 0, 0.05) 0px 6px 24px, rgba(0, 0, 0, 0.08) 0px 3px 0px 1px',
        }}
      >
        {/* HEADER */}
        <CardHeader className="flex flex-row items-center justify-between p-4 pb-2 whitespace-nowrap">
          <div className="flex items-center gap-3 min-w-0 overflow-hidden">
            <span className="font-semibold text-sm truncate">{orderId}</span>
            <Badge
              variant="secondary"
              className="shrink-0 rounded-full bg-red-200 px-2 py-0.5 text-xs text-red-600"
            >
              {platform}
            </Badge>
          </div>

          <div className="shrink-0 font-bold text-base">
            {currency} {amount.toFixed(2)}
          </div>
        </CardHeader>

        <Separator />

        {/* ITEMS */}
        <CardContent className="py-3 px-4">
          <p className="text-sm font-medium text-teal-600 line-clamp-2 leading-snug">
            {itemSummary}
          </p>
        </CardContent>

        <Separator />

        {/* FOOTER */}
        <CardFooter className="flex items-center justify-between gap-2 p-3 whitespace-nowrap">
          {/* Time */}
          <div className="flex min-w-0 items-center gap-1.5 text-teal-600">
            <Timer className="h-4 w-4 shrink-0" />
            <span className="truncate text-xs">{placedAgo}</span>
          </div>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            {/* Reject */}
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7 bg-red-100 text-red-600 hover:bg-red-200 sm:h-8 sm:w-8"
              onClick={handleReject}
              disabled={isProcessing}
            >
              {isProcessing && actionType === 'reject' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>

            {/* Accept */}
            <Button
              size="sm"
              className="h-7 bg-green-600 px-2.5 text-xs text-white hover:bg-green-600/90 sm:h-8 sm:px-4 sm:text-sm"
              onClick={handleAccept}
              disabled={isProcessing}
            >
              {isProcessing && actionType === 'accept' ? (
                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
              ) : (
                <Check className="mr-1 h-3.5 w-3.5 sm:h-4 sm:w-4" />
              )}
              Accept
            </Button>
          </div>
        </CardFooter>
      </Card>
    )
  },
)

export default LiveOnlineOrders
