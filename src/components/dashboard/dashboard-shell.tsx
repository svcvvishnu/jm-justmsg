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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden">

            {/* Top Bar */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 z-20">
                <button
                    onClick={() => setCurrentView('home')}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <QrCode className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight">JustMsg</span>
                </button>

                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full transition-all pr-4 pl-2 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                        {user?.email?.[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium hidden sm:block">
                        {user?.email?.split('@')[0]}
                    </span>
                    <Menu className="h-4 w-4 ml-1 text-slate-500" />
                </button>
            </div>

            {/* Main Content Area */}
            <main className="pt-20 pb-32 px-4 max-w-4xl mx-auto min-h-screen flex flex-col">
                {/* Placeholder Content for now */}
                {currentView === 'home' && (
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50 mt-20">
                        <div className="w-48 h-48 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 animate-pulse">
                            <span className="text-4xl">👋</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-400">Welcome Back!</h2>
                        <p className="text-slate-500 max-w-xs">
                            Select an item from the menu below to get started, or check your profile.
                        </p>
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

        </div>
    )
}
