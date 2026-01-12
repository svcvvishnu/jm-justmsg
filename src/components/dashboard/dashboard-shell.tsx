'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/sidebar'
import ProtractorMenu from '@/components/dashboard/protractor-menu'
import CreateItemForm from '@/components/dashboard/create-item-form'
import QRCodeGenerator from '@/components/qr/qr-code-generator'
import { Menu, QrCode, ArrowLeft } from 'lucide-react'
import { signout } from '@/app/auth/actions'

import ItemDetail from '@/components/dashboard/item-detail'
import { createClient } from '@/utils/supabase/client'
import { useEffect } from 'react'
import InstallPrompt from '@/components/pwa/install-prompt'

export default function DashboardShell({ user, initialItems = [] }: { user: any, initialItems?: any[] }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [items, setItems] = useState(initialItems)
    const [currentView, setCurrentView] = useState('home') // home, create, view-qr, detail
    const [selectedCategory, setSelectedCategory] = useState('')
    const [createdItem, setCreatedItem] = useState<any>(null)
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [activeMessages, setActiveMessages] = useState<any[]>([])

    const supabase = createClient()

    // Fetch messages when an item is selected
    useEffect(() => {
        if (selectedItem) {
            const fetchMessages = async () => {
                const { data } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('item_id', selectedItem.id)
                    .order('created_at', { ascending: false })

                setActiveMessages(data || [])
            }
            fetchMessages()
        }
    }, [selectedItem])

    const handleCreateClick = (category: string) => {
        setSelectedCategory(category)
        setCurrentView('create')
    }

    const handleItemClick = (item: any) => {
        setSelectedItem(item)
        setCurrentView('detail')
        setIsSidebarOpen(false) // Close sidebar on mobile/desktop when selecting
    }

    const handleCreateSuccess = (newItem: any) => {
        // Optimistically add to list (in real app, maybe re-fetch or use real-time)
        // Since we don't have the full item object from the create action return (just ID),
        // we might need to handle this better. 
        // For now, let's assume we want to show the QR code immediately.
        // We can construct a temporary item or fetch it. 
        // Simplified: Just set the minimal info needed for QR.

        setCreatedItem(newItem)
        setCurrentView('view-qr')
        // Also update list if we had the full object, but let's refresh page next time.
        // Update local items list
        setItems([newItem, ...items])
    }

    const handleLogout = async () => {
        await signout()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950/20 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-500">

            {/* Top Bar */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-4 z-20 shadow-sm transition-all">
                <button
                    onClick={() => setCurrentView('home')}
                    className="flex items-center gap-3 group"
                >
                    <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                        <QrCode className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                        JustMsg
                    </span>
                </button>

                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center gap-3 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 p-1.5 pr-4 pl-2 rounded-full transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700/50 group"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-md group-hover:shadow-lg transition-shadow">
                        {user?.email?.[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium hidden sm:block text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {user?.email?.split('@')[0]}
                    </span>
                    <Menu className="h-4 w-4 ml-1 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-colors" />
                </button>
            </div>

            {/* Main Content Area */}
            <main className="pt-24 pb-32 px-4 max-w-4xl mx-auto min-h-screen flex flex-col">
                {/* Placeholder Content for now */}
                {currentView === 'home' && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-forwards mt-10">
                        <div className="relative group cursor-default">
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
                            <div className="relative w-40 h-40 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-2xl shadow-blue-900/10 dark:shadow-blue-900/20 border border-slate-100 dark:border-slate-800">
                                <span className="text-6xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300">👋</span>
                            </div>
                        </div>

                        <div className="space-y-2 max-w-md mx-auto">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                                Welcome Back!
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
                                Ready to organize? Tap the <span className="font-bold text-blue-600 dark:text-blue-400 mx-1">+</span> below to add a new item and create a smart QR code.
                            </p>
                        </div>
                    </div>
                )}

                {currentView === 'detail' && selectedItem && (
                    <ItemDetail
                        item={selectedItem}
                        messages={activeMessages}
                        onBack={() => setCurrentView('home')}
                    />
                )}

                {currentView === 'create' && (
                    <CreateItemForm
                        category={selectedCategory}
                        onCancel={() => setCurrentView('home')}
                        onSuccess={(newItem) => handleCreateSuccess(newItem)}
                    />
                )}

                {currentView === 'view-qr' && createdItem && (
                    <div className="flex flex-col items-center justify-center flex-1">
                        <button
                            onClick={() => setCurrentView('home')}
                            className="self-start mb-6 flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Back to Dashboard
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                                Item Published!
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                Here is your unique QR code.
                            </p>
                        </div>

                        <QRCodeGenerator
                            url={`${window.location.origin}/s/${createdItem.itemId || createdItem.id}`}
                            title={createdItem.display_name}
                            category={createdItem.category}
                        />
                    </div>
                )}
            </main>

            {/* Bottom Menu */}
            <ProtractorMenu onCreateClick={handleCreateClick} />

            {/* Sidebar - Right Pane */}
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
                items={items}
                onLogout={handleLogout}
                onItemClick={handleItemClick}
            />

            <InstallPrompt />

        </div>
    )
}
