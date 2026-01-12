'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function createItem(formData: FormData) {
    const supabase = await createClient()

    const category = formData.get('category') as string
    const display_name = formData.get('display_name') as string
    const public_message = formData.get('public_message') as string
    const image_url = formData.get('image_url') as string
    const status = formData.get('status') as string || 'active'

    if (!display_name || !public_message) {
        return { error: 'Display Name and Message are required' }
    }

    const { data, error } = await supabase.from('items').insert({
        category,
        display_name,
        public_message,
        image_url,
        status,
        // We will generate QR code on the client or server later, 
        // for now let's just create the item.
    }).select().single()

    if (error) {
        console.error('Error creating item:', error)
        return { error: 'Failed to create item' }
    }

    revalidatePath('/')
    return { success: true, itemId: data.id }
}
