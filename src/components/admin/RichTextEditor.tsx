'use client'

import { useEffect, useRef } from 'react'

interface Props {
  value: string
  onChange: (val: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!editorRef.current) return
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  const execCmd = (command: string, val?: string) => {
    document.execCommand(command, false, val)
    editorRef.current?.focus()
    handleInput()
  }

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    // Paste sebagai plain text dulu, strip semua tag HTML dari clipboard
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
  }

  const tools = [
    { label: 'B', cmd: 'bold', title: 'Bold', style: 'font-bold' },
    { label: 'I', cmd: 'italic', title: 'Italic', style: 'italic' },
    { label: 'U', cmd: 'underline', title: 'Underline', style: 'underline' },
  ]

  const sizes = ['1', '2', '3', '4', '5']
  const sizeLabels = ['Kecil', 'Normal', 'Sedang', 'Besar', 'Sangat Besar']

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-green-600">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200 flex-wrap">
        {tools.map((t) => (
          <button
            key={t.cmd}
            type="button"
            title={t.title}
            onMouseDown={(e) => { e.preventDefault(); execCmd(t.cmd) }}
            className={`px-2.5 py-1 text-sm rounded hover:bg-gray-200 transition ${t.style}`}
          >
            {t.label}
          </button>
        ))}

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Font size */}
        <select
          onMouseDown={(e) => e.stopPropagation()}
          onChange={(e) => execCmd('fontSize', e.target.value)}
          className="text-xs border border-gray-200 rounded px-1.5 py-1 bg-white"
          defaultValue="3"
        >
          {sizes.map((s, i) => (
            <option key={s} value={s}>{sizeLabels[i]}</option>
          ))}
        </select>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Align */}
        <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('justifyLeft') }} className="px-2 py-1 text-xs rounded hover:bg-gray-200" title="Rata Kiri">≡</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('justifyCenter') }} className="px-2 py-1 text-xs rounded hover:bg-gray-200" title="Rata Tengah">☰</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('justifyRight') }} className="px-2 py-1 text-xs rounded hover:bg-gray-200" title="Rata Kanan">≡</button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* List */}
        <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('insertUnorderedList') }} className="px-2 py-1 text-xs rounded hover:bg-gray-200" title="Bullet List">• List</button>
        <button type="button" onMouseDown={(e) => { e.preventDefault(); execCmd('insertOrderedList') }} className="px-2 py-1 text-xs rounded hover:bg-gray-200" title="Numbered List">1. List</button>

        <div className="w-px h-5 bg-gray-300 mx-1" />

        {/* Color */}
        <label title="Warna Teks" className="flex items-center gap-1 text-xs cursor-pointer">
          <span>A</span>
          <input type="color" className="w-5 h-5 cursor-pointer border-0 p-0" onChange={(e) => execCmd('foreColor', e.target.value)} />
        </label>
      </div>

      {/* Editor area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        onPaste={handlePaste}
        data-placeholder={placeholder || 'Tulis di sini...'}
        className="min-h-[160px] px-4 py-3 text-sm text-gray-800 outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
        style={{ lineHeight: '1.7' }}
      />
    </div>
  )
}
