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
        <div className="flex flex-col h-full bg-white dark:bg-slate-900/50 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800">
            {/* Header */}
            <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
                <button
                    onClick={onBack}
                    className="absolute top-4 left-4 z-10 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-md rounded-full text-slate-700 dark:text-white hover:bg-white transition-all shadow-sm"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>

                {item.image_url ? (
                    <img src={item.image_url} alt={item.display_name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                        📦
                    </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12">
                    <h1 className="text-2xl font-bold text-white">{item.display_name}</h1>
                    <span className="text-xs text-slate-300 font-medium px-2 py-0.5 bg-white/20 rounded-md backdrop-blur-sm">
                        {item.category}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('messages')}
                    className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'messages' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'} relative`}
                >
                    Messages
                    {messages.length > 0 && (
                        <span className="absolute top-2 right-10 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                            {messages.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {activeTab === 'details' && (
                    <div className="space-y-8">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                <div className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">Scans</div>
                                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {item.scan_count || 0}
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                <div className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">Status</div>
                                <div className={`text-lg font-bold capitalize ${item.status === 'lost' ? 'text-red-500' : 'text-green-500'}`}>
                                    {item.status}
                                </div>
                            </div>
                        </div>

                        {/* Public Message Preview */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Public Message</h3>
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-slate-600 dark:text-slate-300 italic border border-blue-100 dark:border-blue-800 relative">
                                <MessageSquare className="h-4 w-4 absolute top-4 right-4 text-blue-200" />
                                "{item.public_message}"
                            </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="border-t border-slate-100 pt-6">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">QR Code</h3>
                            <QRCodeGenerator
                                url={`${window.location.origin}/s/${item.id}`}
                                title={item.display_name}
                                category={item.category}
                            />
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="space-y-4">
                        {messages.length === 0 ? (
                            <div className="text-center py-10 text-slate-400">
                                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No messages yet.</p>
                            </div>
                        ) : (
                            messages.map((msg: any) => (
                                <div key={msg.id} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-slate-800 dark:text-slate-200 text-sm mb-2">
                                        "{msg.content}"
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2 pt-2 border-t border-slate-50 dark:border-slate-700/50">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(msg.created_at).toLocaleDateString()}
                                        </div>
                                        {msg.sender_contact && (
                                            <div className="font-semibold text-blue-600 dark:text-blue-400">
                                                Contact: {msg.sender_contact}
                                            </div>
                                        )}
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
