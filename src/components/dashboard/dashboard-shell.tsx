'use client'

import { useState, useEffect } from 'react'
import BottomNav from '@/components/layout/bottom-nav'
import ItemGrid from '@/components/dashboard/item-grid'
import ProfileView from '@/components/dashboard/profile-view'
import CreateItemForm from '@/components/dashboard/create-item-form'
import QRCodeGenerator from '@/components/qr/qr-code-generator'
import ItemDetail from '@/components/dashboard/item-detail'
import InstallPrompt from '@/components/pwa/install-prompt'
import { QrCode, ArrowLeft } from 'lucide-react'
import { signout } from '@/app/auth/actions'
import { createClient } from '@/utils/supabase/client'

export default function DashboardShell({ user, initialItems = [] }: { user: any, initialItems?: any[] }) {
    // Navigation State
    const [currentTab, setCurrentTab] = useState('home') // 'home', 'profile'
    const [viewStack, setViewStack] = useState<string[]>(['home']) // To manage history within dashboard

    // Data State
    const [items, setItems] = useState(initialItems)
    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [createdItem, setCreatedItem] = useState<any>(null)
    const [activeMessages, setActiveMessages] = useState<any[]>([])

    // Create Mode State
    const [isCreateMode, setIsCreateMode] = useState(false)
    const [createCategory, setCreateCategory] = useState('')

    const supabase = createClient()

    // Helper: Current active view is the top of the stack
    const activeView = viewStack[viewStack.length - 1]

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

    // -- Handlers --

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab)
        // Reset stack when switching tabs usually, but let's keep it simple
        if (tab === 'home') setViewStack(['home'])
        if (tab === 'profile') setViewStack(['profile'])
    }

    const handleCategorySelect = (category: string) => {
        setCreateCategory(category)
        setIsCreateMode(false) // Close menu
        setViewStack([...viewStack, 'create-form']) // Push create form
    }

    const handleItemClick = (item: any) => {
        setSelectedItem(item)
        setViewStack([...viewStack, 'detail'])
    }

    const handleCreateSuccess = (newItem: any) => {
        setCreatedItem(newItem)
        setItems([newItem, ...items]) // Update list
        // Go to QR view properties
        // Replace 'create-form' with 'view-qr' in stack
        const newStack = [...viewStack]
        newStack.pop() // remove create form
        newStack.push('view-qr')
        setViewStack(newStack)
    }

    const handleBack = () => {
        if (viewStack.length > 1) {
            const newStack = [...viewStack]
            newStack.pop()
            setViewStack(newStack)

            // Sync tab state if we popped back to root
            const top = newStack[newStack.length - 1]
            if (top === 'home') setCurrentTab('home')
            if (top === 'profile') setCurrentTab('profile')
        }
    }

    const handleLogout = async () => {
        await signout()
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white relative overflow-hidden transition-colors duration-500 pb-20">

            {/* Top Bar (Only visible on Home/Profile root) */}
            {viewStack.length === 1 && (
                <div className="fixed top-0 left-0 right-0 h-24 pt-8 pb-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-20 px-6 flex items-center justify-between transition-all">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {currentTab === 'home' ? 'My Closet' : 'Profile'}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            {currentTab === 'home' ? 'Manage your smart items' : 'Account Details'}
                        </p>
                    </div>
                    {currentTab === 'home' && (
                        <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-bold">
                            {items.length} Items
                        </div>
                    )}
                </div>
            )}

            {/* Main Content */}
            <main className={`px-4 max-w-md mx-auto min-h-screen flex flex-col ${viewStack.length === 1 ? 'pt-28' : 'pt-6'}`}>

                {activeView === 'home' && (
                    <ItemGrid items={items} onItemClick={handleItemClick} />
                )}

                {activeView === 'profile' && (
                    <ProfileView user={user} itemCount={items.length} onLogout={handleLogout} />
                )}

                {activeView === 'detail' && selectedItem && (
                    <ItemDetail
                        item={selectedItem}
                        messages={activeMessages}
                        onBack={handleBack}
                    />
                )}

                {activeView === 'create-form' && (
                    <CreateItemForm
                        category={createCategory}
                        onCancel={handleBack}
                        onSuccess={handleCreateSuccess}
                    />
                )}

                {activeView === 'view-qr' && createdItem && (
                    <div className="flex flex-col items-center justify-center flex-1 pt-10 animate-in zoom-in-95 duration-500">
                        <button
                            onClick={() => {
                                setViewStack(['home'])
                                setCurrentTab('home')
                            }}
                            className="self-start mb-6 flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-sm"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Return Home
                        </button>

                        <div className="text-center mb-8">
                            <div className="inline-block p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                                <QrCode className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                It's Live!
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                Your item has been created.
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

            {/* Floating Navigation */}
            {viewStack.length === 1 && (
                <BottomNav
                    currentTab={currentTab}
                    onTabChange={handleTabChange}
                    onAddClick={() => setIsCreateMode(true)}
                />
            )}

            {/* Custom Category Picker Overlay */}
            {isCreateMode && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setIsCreateMode(false)}>
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md mx-4 mb-4 sm:mb-0 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300" onClick={e => e.stopPropagation()}>
                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">What are we tagging?</h3>
                            <p className="text-sm text-slate-500">Select a category to get started</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: 'Bag', icon: '🎒', label: 'Bag', color: 'bg-orange-100 text-orange-600' },
                                { id: 'Bottle', icon: '💧', label: 'Bottle', color: 'bg-cyan-100 text-cyan-600' },
                                { id: 'Bike', icon: '🚲', label: 'Bike', color: 'bg-green-100 text-green-600' },
                                { id: 'Car', icon: '🚗', label: 'Car', color: 'bg-blue-100 text-blue-600' },
                                { id: 'Identity', icon: '🆔', label: 'Identity', color: 'bg-indigo-100 text-indigo-600' },
                                { id: 'Other', icon: '📦', label: 'Other', color: 'bg-slate-100 text-slate-600' },
                            ].map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategorySelect(cat.id)}
                                    className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-transform hover:scale-105 active:scale-95 ${cat.color.split(' ')[0]} dark:bg-opacity-20`}
                                >
                                    <span className="text-3xl mb-2">{cat.icon}</span>
                                    <span className={`text-xs font-bold ${cat.color.split(' ')[1]} dark:text-white`}>{cat.label}</span>
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setIsCreateMode(false)}
                            className="w-full mt-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <InstallPrompt />
        </div>
    )
}
