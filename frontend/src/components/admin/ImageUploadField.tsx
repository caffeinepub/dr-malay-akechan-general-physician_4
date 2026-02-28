import React, { useState } from 'react';
import { Upload, Trash2, Link, Loader2 } from 'lucide-react';

interface ImageUploadFieldProps {
  currentImageUrl?: string;
  currentImageBase64?: string;
  onUpload?: (base64: string) => Promise<void>;
  onUpdateUrl?: (url: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export default function ImageUploadField({
  currentImageUrl,
  currentImageBase64,
  onUpload,
  onUpdateUrl,
  onDelete,
}: ImageUploadFieldProps) {
  const [urlInput, setUrlInput] = useState(currentImageUrl || '');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [savingUrl, setSavingUrl] = useState(false);
  const [error, setError] = useState('');

  const displayUrl = currentImageBase64
    ? `data:image/jpeg;base64,${currentImageBase64}`
    : currentImageUrl || null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;

    if (file.size > 1.5 * 1024 * 1024) {
      setError('File size must be under 1.5MB');
      return;
    }

    setError('');
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        await onUpload(base64);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveUrl = async () => {
    if (!onUpdateUrl) return;
    setSavingUrl(true);
    try {
      await onUpdateUrl(urlInput);
    } catch {
      setError('Failed to save URL');
    } finally {
      setSavingUrl(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    try {
      await onDelete();
      setUrlInput('');
    } catch {
      setError('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Preview */}
      {displayUrl && (
        <div className="relative w-full max-w-xs">
          <img
            src={displayUrl}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border border-border"
          />
        </div>
      )}

      {/* Upload */}
      {onUpload && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Upload Image</label>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-muted border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/80 cursor-pointer transition-colors">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading...' : 'Choose File'}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <p className="text-xs text-muted-foreground mt-1">Max 1.5MB. JPG, PNG, WebP.</p>
        </div>
      )}

      {/* URL Input */}
      {onUpdateUrl && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Or Image URL</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full pl-9 pr-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <button
              onClick={handleSaveUrl}
              disabled={savingUrl}
              className="px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {savingUrl ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* Delete */}
      {onDelete && displayUrl && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/10 transition-colors disabled:opacity-60"
        >
          {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          Remove Image
        </button>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
