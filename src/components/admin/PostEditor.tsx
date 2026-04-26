'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapImage from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

type Props = {
  value: string
  onChange: (html: string) => void
  onImageInsert?: () => void
}

const BTN = 'px-2 py-1 rounded text-sm transition-colors hover:bg-gray-100 disabled:opacity-40'
const BTN_ACTIVE = 'bg-gray-200'

export function PostEditor({ value, onChange, onImageInsert }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      TiptapImage.configure({ inline: false, allowBase64: false }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Placeholder.configure({ placeholder: 'Escribe el contenido del artículo…' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg min-h-[400px] max-w-none focus:outline-none px-6 py-5',
      },
    },
  })

  // Sync external value changes (e.g. initial load)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  if (!editor) return <div className="min-h-[400px] animate-pulse rounded-lg" style={{ backgroundColor: '#F3F4F6' }} />

  function setLink() {
    const url = window.prompt('URL del enlace:')
    if (!url) return
    if (url === '') {
      editor!.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor!.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="border rounded-xl overflow-hidden" style={{ borderColor: 'var(--color-border)' }}>
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b"
        style={{ borderColor: 'var(--color-border)', backgroundColor: '#F9FAFB' }}
      >
        <button type="button" className={`${BTN} font-bold ${editor.isActive('bold') ? BTN_ACTIVE : ''}`}
          onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button type="button" className={`${BTN} italic ${editor.isActive('italic') ? BTN_ACTIVE : ''}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button type="button" className={`${BTN} line-through ${editor.isActive('strike') ? BTN_ACTIVE : ''}`}
          onClick={() => editor.chain().focus().toggleStrike().run()}>S</button>
        <button type="button" className={`${BTN} font-mono text-xs ${editor.isActive('code') ? BTN_ACTIVE : ''}`}
          onClick={() => editor.chain().focus().toggleCode().run()}>{'</>'}</button>

        <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--color-border)' }} />

        {([2, 3, 4] as const).map((level) => (
          <button
            key={level}
            type="button"
            className={`${BTN} font-semibold ${editor.isActive('heading', { level }) ? BTN_ACTIVE : ''}`}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          >
            H{level}
          </button>
        ))}

        <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--color-border)' }} />

        <button type="button" className={`${BTN} ${editor.isActive('bulletList') ? BTN_ACTIVE : ''}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista">≡</button>
        <button type="button" className={`${BTN} ${editor.isActive('orderedList') ? BTN_ACTIVE : ''}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Lista numerada">1.</button>
        <button type="button" className={`${BTN} ${editor.isActive('blockquote') ? BTN_ACTIVE : ''}`}
          onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Cita">"</button>
        <button type="button" className={`${BTN} font-mono text-xs ${editor.isActive('codeBlock') ? BTN_ACTIVE : ''}`}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Bloque de código">{'{ }'}</button>

        <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--color-border)' }} />

        <button type="button" className={`${BTN} ${editor.isActive('link') ? BTN_ACTIVE : ''}`}
          onClick={setLink} title="Enlace">🔗</button>
        {onImageInsert && (
          <button type="button" className={BTN} onClick={onImageInsert} title="Insertar imagen">🖼</button>
        )}

        <div className="w-px h-5 mx-1" style={{ backgroundColor: 'var(--color-border)' }} />

        <button type="button" className={BTN} onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}>↩</button>
        <button type="button" className={BTN} onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}>↪</button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
