import { createClient } from '@/utils/supabase/server'
import { MessageSquare, Send, CheckCircle2, Phone, User } from 'lucide-react'
import { sendMessage } from '@/app/s/actions'
import { notFound } from 'next/navigation'
import ScanTracker from '@/components/analytics/scan-tracker'

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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <ScanTracker itemId={item.id} />
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">

                {/* Header Image */}
                <div className="relative h-64 bg-slate-200 dark:bg-slate-800">
                    {item.image_url ? (
                        <img
                            src={item.image_url}
                            alt={item.display_name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-6xl">
                            📦
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                        <div>
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-600/90 text-white text-xs font-bold mb-2 backdrop-blur-sm">
                                {item.category}
                            </span>
                            <h1 className="text-3xl font-bold text-white shadow-sm">
                                {item.display_name}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Status Badge */}
                    <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/50">
                        <div className="h-10 w-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300">
                            <MessageSquare className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">Owner's Message</h3>
                            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                                "{item.public_message}"
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                            Found this item?
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                            Please send a message to the owner to help them get it back.
                        </p>

                        <MessageForm itemId={item.id} />
                    </div>

                </div>

                {/* Footer */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 text-center text-xs text-slate-400">
                    Powered by <span className="font-bold text-slate-600 dark:text-slate-500">JustMsg</span>
                </div>
            </div>
        </div>
    )
}

// Client Component for the Form to handle state
'use client'
import { useState } from 'react'

function MessageForm({ itemId }: { itemId: string }) {
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        await sendMessage(formData)
        setLoading(false)
        setSent(true)
    }

    if (sent) {
        return (
            <div className="text-center py-8 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900/50">
                <div className="inline-flex h-12 w-12 rounded-full bg-green-100 dark:bg-green-800 items-center justify-center text-green-600 dark:text-green-300 mb-3">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-green-800 dark:text-green-200">Message Sent!</h3>
                <p className="text-green-600 dark:text-green-400 text-sm">
                    The owner has been notified.
                </p>
            </div>
        )
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <input type="hidden" name="item_id" value={itemId} />

            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                    Your Message
                </label>
                <textarea
                    name="content"
                    required
                    placeholder="Hi, I found your item at..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all resize-none h-24 text-slate-900 dark:text-white"
                />
            </div>

            <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                    Contact Info (Optional)
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        name="sender_contact"
                        placeholder="Phone or Email"
                        className="w-full pl-10 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all text-slate-900 dark:text-white"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-95"
            >
                {loading ? 'Sending...' : (
                    <>
                        <Send className="h-5 w-5" />
                        Send Message
                    </>
                )}
            </button>
        </form>
    )
}
