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
            className={`fixed inset-y-0 right-0 w-80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-2xl transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) z-50 border-l border-slate-200/50 dark:border-slate-800/50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
        >
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-slate-100/50 dark:border-slate-800/50 flex justify-between items-center bg-transparent">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
                            <span className="font-bold">{user?.email?.[0].toUpperCase()}</span>
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                                {user?.email?.split('@')[0]}
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified User</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="flex items-center justify-between px-2 pb-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            My Items
                        </h3>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 rounded-full text-blue-700 dark:text-blue-300 font-bold">
                            {items.length}
                        </span>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                            <Package className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                            <p className="text-sm font-medium text-slate-500">No items yet</p>
                            <p className="text-xs text-slate-400 mt-1">Tap the + button to create one</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => onItemClick(item)}
                                    className="bg-white/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-3 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all cursor-pointer group flex items-center gap-4"
                                >
                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center text-2xl shadow-inner">
                                        {item.category === 'Bag' ? '🎒' :
                                            item.category === 'Bottle' ? '💧' :
                                                item.category === 'Bike' ? '🚲' :
                                                    item.category === 'Car' ? '🚗' :
                                                        item.category === 'Identity' ? '🆔' : '📦'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                                            {item.display_name}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className={`inline-block w-2 h-2 rounded-full ${item.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
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
