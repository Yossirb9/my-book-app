'use client'
import { cn } from '@/lib/utils'
import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

const baseClass =
  'w-full px-4 py-3 rounded-2xl border-2 bg-white text-gray-800 font-medium ' +
  'placeholder:text-gray-400 placeholder:font-normal ' +
  'transition-all duration-200 outline-none ' +
  'border-gray-200 hover:border-gray-300 focus:border-coral-500 focus:ring-2 focus:ring-coral-100'

const errorClass = 'border-red-400 focus:border-red-500 focus:ring-red-100'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, name, ...props }, ref) => {
    const inputId = id ?? name

    return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label htmlFor={inputId} className="text-sm font-semibold text-gray-700">{label}</label>}
      <input
        ref={ref}
        id={inputId}
        className={cn(baseClass, error && errorClass, className)}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-400">{helperText}</p>}
    </div>
    )
  }
)
Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, name, ...props }, ref) => {
    const textareaId = id ?? name

    return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label htmlFor={textareaId} className="text-sm font-semibold text-gray-700">{label}</label>}
      <textarea
        ref={ref}
        id={textareaId}
        className={cn(baseClass, 'resize-none', error && errorClass, className)}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-gray-400">{helperText}</p>}
    </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export default Input
