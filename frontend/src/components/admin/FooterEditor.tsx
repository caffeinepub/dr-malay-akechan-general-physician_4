import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useUpdateFooterContent } from '../../hooks/useQueries';

interface FooterEditorProps {
  sessionToken: string;
  currentContent: string;
}

export default function FooterEditor({ sessionToken, currentContent }: FooterEditorProps) {
  const [content, setContent] = useState(currentContent);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const updateFooter = useUpdateFooterContent();

  const handleSave = async () => {
    setError('');
    setSaved(false);
    try {
      await updateFooter.mutateAsync({ content, sessionToken });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    }
  };

  const labelClass = "block text-xs font-medium font-body text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>Footer Content Text</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          placeholder="Enter footer content..."
          className="w-full px-3 py-2 rounded-sharp tech-input text-sm resize-none"
        />
      </div>
      {error && <p className="text-xs text-red-400 font-body">{error}</p>}
      <button
        onClick={handleSave}
        disabled={updateFooter.isPending}
        className="flex items-center gap-2 px-5 py-2.5 rounded-sharp bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-navy-800 font-display font-semibold text-sm transition-all duration-200 glow-cyan-sm"
      >
        {updateFooter.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saved ? 'Saved!' : 'Save Footer'}
      </button>
    </div>
  );
}
