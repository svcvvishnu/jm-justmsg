'use client'

import { X, Package, LogOut, User } from 'lucide-react'
import { signout } from '@/app/auth/actions'

type SidebarProps = {
    isOpen: boolean
    onClose: () => void
    user: any
    items: any[]
    onLogout: () => void
    onItemClick: (item: any) => void
}

export default function Sidebar({ isOpen, onClose, user, items, onLogout, onItemClick }: SidebarProps) {
    return (
        <div
            className={`fixed inset-y-0 right-0 w-80 bg-white dark:bg-slate-900 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 border-l border-slate-200 dark:border-slate-800 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <User className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">
                                {user?.email?.split('@')[0]}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">My Profile</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            My Items
                        </h3>
                        <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-400">
                            {items.length}
                        </span>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                            <Package className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                            <p className="text-sm text-slate-500">No items yet</p>
                            <p className="text-xs text-slate-400 mt-1">Create your first item below</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => onItemClick(item)}
                                    className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-xl p-3 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl">
                                            {/* Simple emoji mapping based on category for now */}
                                            {item.category === 'Bag' ? '🎒' :
                                                item.category === 'Key' ? '🔑' :
                                                    item.category === 'Wallet' ? '👛' :
                                                        item.category === 'Laptop' ? '💻' : '📦'}
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                                                {item.display_name}
                                            </h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {item.status}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800">
                    <button
                        onClick={onLogout}
                        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-sm font-medium"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}
