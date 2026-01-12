'use client'

import { useEffect, useRef } from 'react'
import { incrementScanCount } from '@/app/s/actions'

export default function ScanTracker({ itemId }: { itemId: string }) {
    const hasTracked = useRef(false)

    useEffect(() => {
        if (!hasTracked.current) {
            hasTracked.current = true
            incrementScanCount(itemId)
        }
    }, [itemId])

    return null
}
