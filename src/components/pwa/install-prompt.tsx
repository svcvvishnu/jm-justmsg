'use client'

import { useState, useEffect } from 'react'
import { Download, X, Share } from 'lucide-react'

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [isIOS, setIsIOS] = useState(false)
    const [isStandalone, setIsStandalone] = useState(false)
    const [showIOSHint, setShowIOSHint] = useState(true)

    useEffect(() => {
        // Check if already in standalone mode
        if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
            setIsStandalone(true)
        }

        // Check if iOS
        const userAgent = window.navigator.userAgent.toLowerCase()
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent)
        setIsIOS(isIosDevice)

        // Listen for install prompt (Android/Desktop)
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault()
            setDeferredPrompt(e)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        }
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return

        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice
        if (outcome === 'accepted') {
            setDeferredPrompt(null)
        }
    }

    if (isStandalone) return null

    // iOS Instruction Banner
    if (isIOS && showIOSHint) {
        return (
            <div className="fixed bottom-24 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-2xl z-50 flex items-start gap-4 animate-in slide-in-from-bottom-10 fade-in duration-500">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                    <Share className="h-6 w-6" />
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Install JustMsg</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Tap the <span className="font-bold mx-1">Share</span> button below and select <span className="font-bold mx-1">"Add to Home Screen"</span> to install the app.
                    </p>
                </div>
                <button
                    onClick={() => setShowIOSHint(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }

    // Android/Desktop Install Button
    if (deferredPrompt) {
        return (
            <button
                onClick={handleInstallClick}
                className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full shadow-xl shadow-slate-900/20 dark:shadow-white/10 z-50 flex items-center gap-2.5 font-bold transition-all hover:scale-105 active:scale-95 animate-in zoom-in fade-in duration-300"
            >
                <Download className="h-5 w-5" />
                Install App
            </button>
        )
    }

    return null
}
