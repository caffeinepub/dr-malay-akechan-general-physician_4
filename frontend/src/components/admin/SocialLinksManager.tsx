import { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetAllContent, useAddSocialLink, useUpdateSocialLink, useDeleteSocialLink } from '../../hooks/useQueries';
import type { SocialLink } from '../../backend';

interface SocialLinksManagerProps {
  sessionToken: string;
}

const PLATFORM_SUGGESTIONS = [
  'Facebook', 'Instagram', 'Twitter / X', 'LinkedIn', 'YouTube',
  'WhatsApp', 'Telegram', 'TikTok', 'Pinterest', 'Snapchat',
];

const emptyForm = { platform: '', url: '' };

export default function SocialLinksManager({ sessionToken }: SocialLinksManagerProps) {
  const { data: content } = useGetAllContent();
  const socialLinks = content?.socialLinks || [];

  const addLink = useAddSocialLink();
  const updateLink = useUpdateSocialLink();
  const deleteLink = useDeleteSocialLink();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const handleEdit = (id: bigint, link: SocialLink) => {
    setEditingId(id);
    setForm({ platform: link.platform, url: link.url });
    setShowForm(true);
    setFormError('');
  };

  const handleAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setFormError('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError('');
  };

  const handleSubmit = async () => {
    if (!form.platform.trim() || !form.url.trim()) {
      setFormError('Platform and URL are required');
      return;
    }
    setFormError('');
    try {
      if (editingId !== null) {
        await updateLink.mutateAsync({ id: editingId, link: form, sessionToken });
      } else {
        await addLink.mutateAsync({ link: form, sessionToken });
      }
      handleCancel();
    } catch (e: any) {
      setFormError(e?.message || 'Failed to save link');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Delete this social link?')) return;
    try {
      await deleteLink.mutateAsync({ id, sessionToken });
    } catch (e: any) {
      alert(e?.message || 'Failed to delete');
    }
  };

  const isPending = addLink.isPending || updateLink.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Share2 className="w-4 h-4 text-violet-400" />
          Social Links ({socialLinks.length})
        </div>
        {!showForm && (
          <Button size="sm" onClick={handleAdd} className="gap-2 bg-violet-500 hover:bg-violet-600 text-white">
            <Plus className="w-3.5 h-3.5" />
            Add Link
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="border border-violet-500/30 rounded-xl p-4 space-y-3 bg-violet-500/5">
          <h4 className="font-semibold text-sm text-violet-400">
            {editingId !== null ? 'Edit Link' : 'New Social Link'}
          </h4>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Platform *</Label>
            <Input
              list="platform-suggestions"
              value={form.platform}
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              placeholder="e.g. Instagram"
            />
            <datalist id="platform-suggestions">
              {PLATFORM_SUGGESTIONS.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">URL *</Label>
            <Input
              type="url"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          {formError && <p className="text-xs text-destructive">{formError}</p>}
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              size="sm"
              className="gap-2 bg-violet-500 hover:bg-violet-600 text-white"
            >
              {isPending ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              {editingId !== null ? 'Update' : 'Add'}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel} className="gap-2">
              <X className="w-3.5 h-3.5" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Links List */}
      <div className="space-y-2">
        {socialLinks.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">No social links yet. Add one above.</p>
        )}
        {socialLinks.map(([id, link]) => (
          <div
            key={id.toString()}
            className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
              <Share2 className="w-4 h-4 text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground">{link.platform}</p>
              <p className="text-xs text-muted-foreground truncate">{link.url}</p>
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-muted-foreground hover:text-foreground"
                onClick={() => handleEdit(id, link)}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-muted-foreground hover:text-destructive"
                onClick={() => handleDelete(id)}
                disabled={deleteLink.isPending}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
