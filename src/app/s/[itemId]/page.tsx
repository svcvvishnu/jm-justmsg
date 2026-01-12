import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import ScanTracker from '@/components/analytics/scan-tracker'
import SmartScanView from '@/components/public/smart-scan-view'

export default async function PublicItemPage({ params }: { params: Promise<{ itemId: string }> }) {
    const { itemId } = await params
    const supabase = await createClient()

    const { data: item } = await supabase
        .from('items')
        .select('*')
        .eq('id', itemId)
        .single()

    if (!item) {
        return notFound()
    }

    return (
        <>
            <ScanTracker itemId={item.id} />
            <SmartScanView item={item} />
        </>
    )
}
