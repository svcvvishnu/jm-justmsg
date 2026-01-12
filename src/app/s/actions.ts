'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(formData: FormData) {
    const supabase = createClient()

    const itemId = formData.get('item_id') as string
    const content = formData.get('content') as string
    const senderContact = formData.get('sender_contact') as string

    if (!content || !itemId) {
        return { error: 'Message content is required' }
    }

    // 1. Insert Message
    const { error } = await (await supabase).from('messages').insert({
        item_id: itemId,
        content,
        sender_contact: senderContact
    })

    if (error) {
        console.error('Error sending message:', error)
        return { error: 'Failed to send message' }
    }

    // 2. Update Scan Count (Optional but requested feature)
    // We can do this here or separately. Let's increment scan count on page load usually,
    // but for now let's just focus on the message. 
    // Ideally, scan count should happen when the page opens, not when msg is sent.

    return { success: true }
}

export async function incrementScanCount(itemId: string) {
    const supabase = await createClient()

    // We can't do atomic increment easily with simple update without getting current value first or using RPC.
    // For MVP, risk race condition: get -> update.

    const { data: item } = await supabase.from('items').select('scan_count').eq('id', itemId).single()

    if (item) {
        await supabase.from('items').update({
            scan_count: (item.scan_count || 0) + 1,
            last_scan: new Date().toISOString()
        }).eq('id', itemId)
    }
}
