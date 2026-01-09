'use client'

import { Sparkles } from 'lucide-react'

export function GenerateAIDescriptionButton({ 
  productName, 
  onDescriptionGenerated 
}: { 
  productName: string
  onDescriptionGenerated: (desc: string) => void 
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-500"
      onClick={() => {
        console.log('AI Generation coming in Sprint 5 for:', productName)
        onDescriptionGenerated('AI generated description placeholder')
      }}
    >
      <Sparkles size={16} />
      <span>Auto-Write with AI</span>
    </button>
  )
}