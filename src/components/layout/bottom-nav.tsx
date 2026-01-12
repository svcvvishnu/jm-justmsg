'use client'

import { Home, Plus, User, Scan } from 'lucide-react'

type BottomNavProps = {
    currentTab: string
    onTabChange: (tab: string) => void
    onAddClick: () => void
}

export default function BottomNav({ currentTab, onTabChange, onAddClick }: BottomNavProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2 pointer-events-none">
            <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl rounded-full h-16 max-w-md mx-auto flex items-center justify-between px-2 pointer-events-auto">
                <button
                    onClick={() => onTabChange('home')}
                    className={`flex-1 flex flex-col items-center justify-center h-full rounded-full transition-all duration-300 ${currentTab === 'home'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                >
                    <Home className={`h-6 w-6 mb-1 transition-transform ${currentTab === 'home' ? 'scale-110' : ''}`} />
                    <span className="text-[10px] font-bold">Home</span>
                </button>

                <div className="relative -top-6">
                    <button
                        onClick={onAddClick}
                        className="h-16 w-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center text-white ring-4 ring-slate-50 dark:ring-slate-950 transform transition-transform active:scale-95 group"
                    >
                        <Plus className="h-8 w-8 group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                </div>

                <button
                    onClick={() => onTabChange('profile')}
                    className={`flex-1 flex flex-col items-center justify-center h-full rounded-full transition-all duration-300 ${currentTab === 'profile'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                        }`}
                >
                    <User className={`h-6 w-6 mb-1 transition-transform ${currentTab === 'profile' ? 'scale-110' : ''}`} />
                    <span className="text-[10px] font-bold">Profile</span>
                </button>
            </div>
        </div>
    )
}
