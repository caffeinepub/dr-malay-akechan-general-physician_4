import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { toast } from 'sonner';
import { Save, FileText } from 'lucide-react';

interface FooterEditorProps {
  sessionToken: string;
  currentContent: string;
}

export default function FooterEditor({ sessionToken, currentContent }: FooterEditorProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [content, setContent] = useState(currentContent);

  useEffect(() => {
    setContent(currentContent);
  }, [currentContent]);

  const saveMutation = useMutation({
    mutationFn: async (text: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateFooterContent(text, sessionToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allContent'] });
      toast.success('Footer content saved');
    },
    onError: (err: any) => {
      toast.error(`Failed to save footer: ${err?.message ?? 'Unknown error'}`);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold text-foreground mb-1">Footer</h2>
        <p className="text-muted-foreground text-sm">Edit the footer content text displayed at the bottom of the site.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={16} className="text-cyan-400" />
          <h3 className="font-semibold text-foreground">Footer Content</h3>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="footer-content">
            Footer Text
          </label>
          <textarea
            id="footer-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            placeholder="Enter footer content, contact information, or a brief description..."
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-y text-sm leading-relaxed"
          />
        </div>
        <button
          onClick={() => saveMutation.mutate(content)}
          disabled={saveMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saveMutation.isPending ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
          ) : (
            <><Save size={15} />Save Footer</>
          )}
        </button>
      </div>
    </div>
  );
}
