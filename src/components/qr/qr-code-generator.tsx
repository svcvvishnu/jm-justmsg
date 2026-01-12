'use client'

import { QRCodeCanvas } from 'qrcode.react'
import { Download, Share2, Copy } from 'lucide-react'
import { useRef } from 'react'

type QRCodeGeneratorProps = {
    url: string
    title: string
    category: string
}

export default function QRCodeGenerator({ url, title, category }: QRCodeGeneratorProps) {
    const qrRef = useRef<HTMLDivElement>(null)

    const downloadQR = () => {
        const canvas = qrRef.current?.querySelector('canvas')
        if (canvas) {
            const pngUrl = canvas.toDataURL('image/png')
            const downloadLink = document.createElement('a')
            downloadLink.href = pngUrl
            downloadLink.download = `${title.replace(/\s+/g, '_')}_qr.png`
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
        }
    }

    const shareQR = async () => {
        const canvas = qrRef.current?.querySelector('canvas')
        if (canvas) {
            try {
                const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'))
                if (!blob) return

                const file = new File([blob], `${title.replace(/\s+/g, '_')}_qr.png`, { type: 'image/png' })

                if (navigator.share) {
                    await navigator.share({
                        title: `QR Code for ${title}`,
                        text: `Scan this QR code to send me a message regarding ${title}.`,
                        files: [file]
                    })
                } else {
                    // Fallback for desktop/unsupported
                    alert('Sharing is not supported on this device/browser. Please use the Save button.')
                }
            } catch (error) {
                console.error('Error sharing:', error)
            }
        }
    }

    return (
        <div className="flex flex-col items-center space-y-6 p-6 max-w-sm mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
            <div className="text-center space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Scan to send a message
                </p>
            </div>

            <div
                ref={qrRef}
                className="p-4 bg-white rounded-xl shadow-inner border border-slate-100"
            >
                <QRCodeCanvas
                    value={url}
                    size={200}
                    level={"H"}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    imageSettings={{
                        src: "/icon.png",
                        x: undefined,
                        y: undefined,
                        height: 40,
                        width: 40,
                        excavate: true,
                    }}
                />
            </div>

            <div className="flex w-full gap-2">
                <button
                    onClick={downloadQR}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    <Download className="h-4 w-4" />
                    Save
                </button>
                <button
                    onClick={shareQR}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                    <Share2 className="h-4 w-4" />
                    Share QR
                </button>
            </div>

            <p className="text-xs text-center text-slate-400">
                Print this and attach it to your {category.toLowerCase()}.
            </p>
        </div>
    )
}
