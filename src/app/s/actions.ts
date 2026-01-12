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

    // Use RPC function to increment safely without RLS issues for anonymous users
    const { error } = await supabase.rpc('increment_scan_count', { row_id: itemId })

    if (error) {
        console.error('Error incrementing scan count:', error)
    }
}
