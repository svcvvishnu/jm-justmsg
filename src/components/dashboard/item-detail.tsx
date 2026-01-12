'use client'

import { useState } from 'react'
import { ArrowLeft, MessageSquare, Clock, MapPin, Edit, Share2 } from 'lucide-react'
import QRCodeGenerator from '@/components/qr/qr-code-generator'

type ItemDetailProps = {
    item: any
    messages: any[]
    onBack: () => void
}

export default function ItemDetail({ item, messages, onBack }: ItemDetailProps) {
    const [activeTab, setActiveTab] = useState<'details' | 'messages'>('details')

    return (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 animate-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="relative h-64 group">
                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />

                {item.image_url ? (
                    <img
                        src={item.image_url}
                        alt={item.display_name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                        <span className="text-6xl filter drop-shadow-lg">
                            {item.category === 'Bag' ? '🎒' :
                                item.category === 'Bottle' ? '💧' :
                                    item.category === 'Bike' ? '🚲' :
                                        item.category === 'Car' ? '🚗' :
                                            item.category === 'Identity' ? '🆔' : '📦'}
                        </span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                <button
                    onClick={onBack}
                    className="absolute top-4 left-4 z-20 p-2.5 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all shadow-lg border border-white/10"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <div className="flex items-end justify-between">
                        <div>
                            <span className="inline-block px-2.5 py-1 mb-2 text-xs font-bold text-white bg-blue-500/80 backdrop-blur-md rounded-lg shadow-sm border border-white/10 uppercase tracking-wide">
                                {item.category}
                            </span>
                            <h1 className="text-3xl font-bold text-white leading-tight mb-1 shadow-black/50 drop-shadow-md">
                                {item.display_name}
                            </h1>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md border ${item.status === 'lost'
                                ? 'bg-red-500/20 border-red-500/30 text-red-200'
                                : 'bg-green-500/20 border-green-500/30 text-green-200'
                            }`}>
                            {item.status}
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Tabs */}
            <div className="flex p-1.5 mx-4 mt-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl relative">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 relative z-10 ${activeTab === 'details'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('messages')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-300 relative z-10 ${activeTab === 'messages'
                            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                >
                    Messages
                    {messages.length > 0 && (
                        <span className="absolute top-1 right-3 min-w-[1.25rem] h-5 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center shadow-sm">
                            {messages.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {activeTab === 'details' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-700/50 relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <MapPin className="h-12 w-12 text-slate-900 dark:text-white" />
                                </div>
                                <div className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider mb-1">Total Scans</div>
                                <div className="text-3xl font-bold text-slate-900 dark:text-white flex items-baseline gap-1">
                                    {item.scan_count || 0}
                                    <span className="text-sm font-normal text-slate-400">views</span>
                                </div>
                            </div>
                            <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30 relative overflow-hidden group">
                                <div className="absolute right-0 top-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Share2 className="h-12 w-12 text-blue-600" />
                                </div>
                                <div className="text-blue-600/70 dark:text-blue-400/70 text-xs uppercase font-bold tracking-wider mb-1">Last Active</div>
                                <div className="text-lg font-bold text-blue-700 dark:text-blue-300">
                                    Just now
                                </div>
                            </div>
                        </div>

                        {/* Public Message */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-blue-500" />
                                Public Message
                            </h3>
                            <div className="p-5 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800/50 dark:to-slate-800/30 rounded-2xl text-sm text-slate-600 dark:text-slate-300 italic border border-slate-100 dark:border-slate-700 shadow-sm relative leading-relaxed">
                                <span className="absolute top-2 left-2 text-4xl text-slate-200 dark:text-slate-700 font-serif leading-none select-none">"</span>
                                <span className="relative z-10 px-2">{item.public_message}</span>
                                <span className="absolute bottom-[-10px] right-4 text-4xl text-slate-200 dark:text-slate-700 font-serif leading-none select-none">"</span>
                            </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 text-center">Your Smart QR Code</h3>
                            <div className="transform hover:scale-105 transition-transform duration-300">
                                <QRCodeGenerator
                                    url={`${window.location.origin}/s/${item.id}`}
                                    title={item.display_name}
                                    category={item.category}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                                    <MessageSquare className="h-8 w-8 opacity-50" />
                                </div>
                                <p className="font-medium text-slate-600 dark:text-slate-300">No messages yet</p>
                                <p className="text-xs mt-1 max-w-[200px] text-center">Messages from people who scan your QR code will appear here.</p>
                            </div>
                        ) : (
                            messages.map((msg: any) => (
                                <div key={msg.id} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all group">
                                    <div className="flex items-start gap-3">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                            <MessageSquare className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
                                                "{msg.content}"
                                            </p>
                                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-50 dark:border-slate-700/50">
                                                <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded-md">
                                                    <Clock className="h-3 w-3" />
                                                    {new Date(msg.created_at).toLocaleDateString()}
                                                </div>
                                                {msg.sender_contact && (
                                                    <div className="font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">
                                                        {msg.sender_contact}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
