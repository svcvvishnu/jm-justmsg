import { createClient } from '@/utils/supabase/server'
import { MessageSquare, Send, CheckCircle2, Phone, User } from 'lucide-react'
import { notFound } from 'next/navigation'
import ScanTracker from '@/components/analytics/scan-tracker'
import MessageForm from '@/components/public/message-form'

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
