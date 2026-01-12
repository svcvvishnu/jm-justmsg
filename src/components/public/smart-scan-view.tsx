'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { MapPin, MessageSquare, AlertTriangle, Phone, Mail, User, ShieldCheck } from 'lucide-react'

type SmartScanViewProps = {
    item: any
}

export default function SmartScanView({ item }: SmartScanViewProps) {
    const [message, setMessage] = useState('')
    const [contact, setContact] = useState('')
    const [sent, setSent] = useState(false)
    const [sending, setSending] = useState(false)
    const [locationShared, setLocationShared] = useState(false)

    // Identity Mode: Only show profile if category is Identity
    const isIdentity = item.category === 'Identity'

    // Lost Mode: Status is lost
    const isLost = item.status === 'lost'

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        setSending(true)

        const supabase = createClient()

        let gpsData = {}

        // If lost mode and user permits, we try to get location
        // Actually location button is separate usually, but let's see if we can bundle it or keep separate
        // For now location is separate action

        const { error } = await supabase.from('messages').insert({
            item_id: item.id,
            content: message,
            sender_contact: contact
        })

        if (!error) {
            setSent(true)
        }
        setSending(false)
    }

    const handleShareLocation = async () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser')
            return
        }

        setSending(true)
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords

            const supabase = createClient()
            const { error } = await supabase.from('messages').insert({
                item_id: item.id,
                content: '📍 I found your item here! (Location Shared)',
                sender_contact: 'Anonymous',
                gps_lat: latitude,
                gps_long: longitude
            })

            if (!error) {
                setLocationShared(true)
                // Also trigger scan count increment if separate
            }
            setSending(false)

        }, (error) => {
            console.error(error)
            alert('Could not get location. Please allow access.')
            setSending(false)
        })
    }

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl text-center max-w-sm w-full animate-in zoom-in-95 duration-500">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h2>
                    <p className="text-slate-500 dark:text-slate-400">The owner has been notified. Thank you for helping.</p>
                </div>
            </div>
        )
    }

    // -- IDENTITY VIEW --
    if (isIdentity) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    {/* Header Image Pattern */}
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    </div>

                    <div className="px-8 pb-8 -mt-16 text-center relative z-10">
                        {/* Profile Pic Placeholder */}
                        <div className="w-32 h-32 mx-auto bg-white dark:bg-slate-800 rounded-full p-2 shadow-xl mb-4">
                            {item.image_url ? (
                                <img src={item.image_url} className="w-full h-full rounded-full object-cover" alt="Profile" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-4xl">
                                    👤
                                </div>
                            )}
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                            {item.display_name}
                        </h2>
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                            <ShieldCheck className="h-3 w-3" /> Verified Identity
                        </span>

                        <div className="space-y-4 text-left">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase text-xs mb-1">About</p>
                                <p className="text-slate-700 dark:text-slate-200 text-sm italic">
                                    "{item.public_message}"
                                </p>
                            </div>

                            {/* Actions */}
                            <button
                                onClick={() => setMessage(prev => prev ? '' : 'Hi, nice to meet you!')}
                                className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl shadow-lg hover:translate-y-[-2px] transition-transform"
                            >
                                <MessageSquare className="h-4 w-4" />
                                Send Message
                            </button>

                            {/* If message box is toggled open */}
                            {message !== '' && (
                                <form onSubmit={handleSendMessage} className="animate-in fade-in slide-in-from-top-2 pt-2">
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Write a message..."
                                        rows={3}
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                        required
                                    />
                                    <input
                                        type="text"
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value)}
                                        placeholder="Your Contact Info (Optional)"
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <button type="submit" disabled={sending} className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold text-sm">
                                        {sending ? 'Sending...' : 'Send'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // -- LOST MODE & STANDARD VIEW --
    return (
        <div className={`min-h-screen p-4 flex flex-col items-center justify-center ${isLost ? 'bg-red-50 dark:bg-red-950/20' : 'bg-slate-50 dark:bg-slate-950'}`}>
            <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className={`p-8 text-center ${isLost ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'}`}>
                    <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl shadow-lg mb-4 ${isLost ? 'bg-white/20 backdrop-blur-md' : 'bg-white dark:bg-slate-700'}`}>
                        {item.category === 'Bag' ? '🎒' :
                            item.category === 'Bottle' ? '💧' :
                                item.category === 'Bike' ? '🚲' :
                                    item.category === 'Identity' ? '🆔' : '📦'}
                    </div>
                    <h1 className="text-2xl font-bold mb-1">{item.display_name}</h1>
                    {isLost ? (
                        <div className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                            <AlertTriangle className="h-3 w-3" /> Lost Item
                        </div>
                    ) : (
                        <p className="text-xs font-medium uppercase tracking-wider opacity-60">Property of Owner</p>
                    )}
                </div>

                {/* Body */}
                <div className="p-8">
                    <div className="mb-8 text-center">
                        <p className="text-lg font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic">
                            "{item.public_message || "This item belongs to me. If found, please contact me."}"
                        </p>
                    </div>

                    {isLost && !locationShared && (
                        <button
                            onClick={handleShareLocation}
                            disabled={sending}
                            className="w-full mb-6 flex items-center justify-center gap-2 py-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold rounded-2xl border-2 border-red-500/20 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        >
                            {sending ? 'Sending...' : (
                                <>
                                    <MapPin className="h-5 w-5" />
                                    Share My Location
                                </>
                            )}
                        </button>
                    )}

                    {isLost && locationShared && (
                        <div className="w-full mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-2xl text-center text-sm font-bold border border-green-200 dark:border-green-800 flex items-center justify-center gap-2">
                            <MapPin className="h-4 w-4" /> Location Sent!
                        </div>
                    )}

                    <form onSubmit={handleSendMessage} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message Owner</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="I found your item..."
                                rows={4}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder="Your Email/Phone (Optional)"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={sending}
                            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] ${isLost ? 'bg-red-600 hover:bg-red-700 shadow-red-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                                }`}
                        >
                            {sending ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
