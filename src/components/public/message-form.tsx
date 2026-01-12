'use client'

import { useState } from 'react'
import { Send, CheckCircle2, Phone } from 'lucide-react'
import { sendMessage } from '@/app/s/actions'

export default function MessageForm({ itemId }: { itemId: string }) {
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
