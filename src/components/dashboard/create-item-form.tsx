'use client'

import { useState } from 'react'
import { createItem } from '@/app/items/actions'
import { createClient } from '@/utils/supabase/client'
import { Loader2, Upload, ArrowLeft } from 'lucide-react'

type CreateItemFormProps = {
    category: string
    onCancel: () => void
    onSuccess: (item: any) => void
}

export default function CreateItemForm({ category, onCancel, onSuccess }: CreateItemFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const supabase = createClient()

        let imageUrl = ''

        try {
            // 1. Upload Image if exists
            if (imageFile) {
                setUploading(true)
                const fileExt = imageFile.name.split('.').pop()
                const fileName = `${Math.random()}.${fileExt}`
                const filePath = `${fileName}`

                const { error: uploadError } = await supabase.storage
                    .from('item-images')
                    .upload(filePath, imageFile)

                if (uploadError) throw new Error('Image upload failed: ' + uploadError.message)

                const { data: { publicUrl } } = supabase.storage
                    .from('item-images')
                    .getPublicUrl(filePath)

                imageUrl = publicUrl
                setUploading(false)
            }

            // 2. Add Image URL to form data
            formData.append('image_url', imageUrl)

            // 3. Create Item
            const result = await createItem(formData)

            if (result?.error) {
                throw new Error(result.error)
            }

            // Construct item object to allow immediate display
            const newItem = {
                itemId: result.itemId,
                category,
                display_name: formData.get('display_name') as string,
                public_message: formData.get('public_message') as string,
                image_url: imageUrl,
                status: formData.get('status') as string || 'active'
            }

            onSuccess(newItem)

        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Something went wrong')
            setIsLoading(false)
            setUploading(false)
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-1">
            <button
                onClick={onCancel}
                className="flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-6 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
            </button>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        Create New {category}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Add details for your new item.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <input type="hidden" name="category" value={category} />

                    {/* Image Upload */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="w-full sm:w-1/3">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Item Image
                            </label>
                            <div
                                className={`relative rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden transition-all ${!imagePreview
                                    ? 'h-32 hover:bg-slate-100 dark:hover:bg-slate-900'
                                    : 'aspect-square'
                                    }`}
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center text-slate-400 p-4 text-center">
                                        <Upload className="h-8 w-8 mb-2" />
                                        <span className="text-xs">Tap to upload</span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    name="display_name"
                                    required
                                    placeholder="e.g. Red Nike Backpack"
                                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Public Message
                                </label>
                                <textarea
                                    name="public_message"
                                    required
                                    rows={4}
                                    placeholder="If found, please contact me via this app!"
                                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    This message will be visible to anyone who scans the QR code.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="lost">Lost</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || uploading}
                            className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                        >
                            {(isLoading || uploading) && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
                            Publish Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
