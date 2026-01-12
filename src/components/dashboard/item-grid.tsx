'use client'

import { Package, MapPin } from 'lucide-react'

type ItemGridProps = {
    items: any[]
    onItemClick: (item: any) => void
}

export default function ItemGrid({ items, onItemClick }: ItemGridProps) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 bg-slate-50/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Package className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    Your closet is empty
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs">
                    Tap the <span className="font-bold text-blue-500">+</span> button to add your first smart item.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 gap-4 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {items.map((item) => (
                <button
                    key={item.id}
                    onClick={() => onItemClick(item)}
                    className="group relative aspect-[4/5] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 hover:-translate-y-1"
                >
                    {/* Image Background */}
                    {item.image_url ? (
                        <div className="absolute inset-0">
                            <img
                                src={item.image_url}
                                alt={item.display_name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center">
                            <span className="text-5xl opacity-50 transition-transform duration-300 group-hover:scale-125">
                                {item.category === 'Bag' ? '🎒' :
                                    item.category === 'Bottle' ? '💧' :
                                        item.category === 'Bike' ? '🚲' :
                                            item.category === 'Identity' ? '🆔' : '📦'}
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                        </div>
                    )}

                    {/* Status Pip */}
                    <div className="absolute top-3 right-3">
                        <span className={`flex h-3 w-3 shadow-lg rounded-full ${item.status === 'active' ? 'bg-green-500 ring-2 ring-green-500/30' :
                                item.status === 'lost' ? 'bg-red-500 animate-ping' : 'bg-slate-400'
                            }`} />
                    </div>

                    {/* Category Icon */}
                    <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-md p-1.5 rounded-full border border-white/10">
                        <span className="text-xs">
                            {item.category === 'Bag' ? '🎒' :
                                item.category === 'Bottle' ? '💧' :
                                    item.category === 'Bike' ? '🚲' :
                                        item.category === 'Identity' ? '🆔' : '📦'}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                        <h3 className="text-white font-bold text-lg leading-tight truncate shadow-black/50 drop-shadow-md">
                            {item.display_name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 text-slate-300 text-xs font-medium">
                            <MapPin className="h-3 w-3" />
                            <span>{item.scan_count || 0} scans</span>
                        </div>
                    </div>
                </button>
            ))}
        </div>
    )
}
