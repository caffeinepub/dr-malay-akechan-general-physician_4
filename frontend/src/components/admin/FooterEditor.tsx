import React, { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { useUpdateFooterContent } from '../../hooks/useQueries';

interface FooterEditorProps {
  sessionToken: string;
  currentContent: string;
}

export default function FooterEditor({ sessionToken, currentContent }: FooterEditorProps) {
  const [content, setContent] = useState(currentContent);
  const updateFooter = useUpdateFooterContent();

  const handleSave = async () => {
    await updateFooter.mutateAsync({ content, sessionToken });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-1">Footer Content</h2>
        <p className="text-sm text-muted-foreground">Edit the footer description text.</p>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Footer Description</h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-y"
          placeholder="Enter footer description text..."
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSave}
            disabled={updateFooter.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {updateFooter.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Footer
          </button>
        </div>
        {updateFooter.isSuccess && (
          <p className="mt-2 text-sm text-success text-right">Saved successfully!</p>
        )}
      </div>
    </div>
  );
}
