'use client'

import { LogOut, User, Settings, ShieldCheck } from 'lucide-react'

type ProfileViewProps = {
    user: any
    itemCount: number
    onLogout: () => void
}

export default function ProfileView({ user, itemCount, onLogout }: ProfileViewProps) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">My Profile</h2>

            {/* Profile Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 mb-6 flex items-center gap-5">
                <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                    {user?.email?.[0].toUpperCase()}
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                        {user?.email?.split('@')[0]}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4 text-green-500" />
                        Verified Account
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-3xl">{itemCount}</span>
                    <p className="text-sm text-blue-600/70 dark:text-slate-400 font-medium uppercase tracking-wide mt-1">Active Items</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-5 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-3xl">Pro</span>
                    <p className="text-sm text-purple-600/70 dark:text-slate-400 font-medium uppercase tracking-wide mt-1">Plan</p>
                </div>
            </div>

            {/* Menu Options */}
            <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                            <Settings className="h-5 w-5" />
                        </div>
                        Settings
                    </div>
                </button>

                <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20 text-red-600 font-medium hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                            <LogOut className="h-5 w-5" />
                        </div>
                        Sign Out
                    </div>
                </button>
            </div>
        </div>
    )
}
