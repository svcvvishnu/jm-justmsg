'use client'

import { useState } from 'react'
import { Plus, X, ShoppingBag, Car, Bike, Package } from 'lucide-react'

type ProtractorMenuProps = {
    onCreateClick: (category: string) => void
}

export default function ProtractorMenu({ onCreateClick }: ProtractorMenuProps) {
    const [isOpen, setIsOpen] = useState(false)

    const toggleOpen = () => setIsOpen(!isOpen)

    // Menu items placed in an arc
    // Menu items placed in an arc
    const menuItems = [
        { id: 'Bag', icon: <ShoppingBag className="h-5 w-5" />, label: 'Bag', color: 'bg-orange-500' },
        { id: 'Bottle', icon: <div className="text-sm font-bold">💧</div>, label: 'Bottle', color: 'bg-cyan-500' },
        { id: 'Bike', icon: <Bike className="h-5 w-5" />, label: 'Bike', color: 'bg-green-500' },
        { id: 'Car', icon: <Car className="h-5 w-5" />, label: 'Car', color: 'bg-blue-500' },
        { id: 'Identity', icon: <div className="text-sm font-bold">🆔</div>, label: 'Identity', color: 'bg-indigo-500' },
    ]

    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center">

            {/* Arc Items */}
            <div className={`relative w-64 h-32 flex justify-center items-end transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
                {/* This container pushes items up. We use absolute positioning with transforms to place them in an arc */}

                {menuItems.map((item, index) => {
                    // Calculate vague positions for an arc 
                    // 5 items: spread across 180 degrees (-90 to 90)
                    // Angles: -72, -36, 0, 36, 72
                    const rotations = [-72, -36, 0, 36, 72]
                    const rotation = rotations[index]

                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                onCreateClick(item.id)
                                setIsOpen(false)
                            }}
                            className={`absolute bottom-0 text-white shadow-lg shadow-black/20 flex flex-col items-center justify-center transition-transform hover:scale-110`}
                            style={{
                                transform: `rotate(${rotation}deg) translateY(-100px) rotate(${-rotation}deg)`,
                                transformOrigin: 'bottom center',
                                left: '50%',
                                marginLeft: '-24px', // half width
                                bottom: '10px'
                            }}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color} mb-1`}>
                                {item.icon}
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                                {item.label}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Main FAB Trigger */}
            <button
                onClick={toggleOpen}
                className={`relative z-50 h-16 w-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isOpen ? 'bg-slate-800 text-white rotate-45' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
                    }`}
            >
                <Plus className="h-8 w-8" />
            </button>

            {/* Overlay Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}
