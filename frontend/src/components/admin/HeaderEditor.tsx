import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useUpdateSiteTitle, useUpdateHeaderImageBase64, useDeleteHeaderImage } from '../../hooks/useQueries';
import ImageUploadField from './ImageUploadField';

interface HeaderEditorProps {
  sessionToken: string;
  currentTitle?: string;
  currentHeaderImageUrl?: string;
  currentHeaderImageBase64?: string;
}

export default function HeaderEditor({
  sessionToken,
  currentTitle = '',
  currentHeaderImageUrl = '',
  currentHeaderImageBase64 = '',
}: HeaderEditorProps) {
  const [title, setTitle] = useState(currentTitle);
  const [titleSaved, setTitleSaved] = useState(false);
  const [titleError, setTitleError] = useState('');

  const updateTitleMutation = useUpdateSiteTitle();
  const updateImageMutation = useUpdateHeaderImageBase64();
  const deleteImageMutation = useDeleteHeaderImage();

  const handleSaveTitle = async () => {
    setTitleError('');
    setTitleSaved(false);
    try {
      await updateTitleMutation.mutateAsync({ title, sessionToken });
      setTitleSaved(true);
      setTimeout(() => setTitleSaved(false), 2000);
    } catch (e: any) {
      setTitleError(e?.message || 'Failed to save');
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-sharp tech-input text-sm";
  const labelClass = "block text-xs font-medium font-body text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6">
      {/* Site Title */}
      <div>
        <h3 className="font-display font-semibold text-white text-sm mb-4 pb-2 border-b border-slate-700/50">
          Site Title
        </h3>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>Title Text</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter site title..."
              className={inputClass}
            />
          </div>
          {titleError && <p className="text-xs text-red-400 font-body">{titleError}</p>}
          <button
            onClick={handleSaveTitle}
            disabled={updateTitleMutation.isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-sharp bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-navy-800 font-display font-semibold text-sm transition-all duration-200 glow-cyan-sm"
          >
            {updateTitleMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {titleSaved ? 'Saved!' : 'Save Title'}
          </button>
        </div>
      </div>

      {/* Header Image */}
      <div>
        <h3 className="font-display font-semibold text-white text-sm mb-4 pb-2 border-b border-slate-700/50">
          Hero Background Image
        </h3>
        <ImageUploadField
          label="Header / Hero Image"
          currentImageBase64={currentHeaderImageBase64}
          currentImageUrl={currentHeaderImageUrl}
          onUpload={async (base64) => {
            await updateImageMutation.mutateAsync({ imageBase64: base64, sessionToken });
          }}
          onUpdateUrl={async (_url) => {
            // headerImageUrl is not a separate field in backend, handled via base64 only
          }}
          onDelete={async () => {
            await deleteImageMutation.mutateAsync({ sessionToken });
          }}
          isUploading={updateImageMutation.isPending}
          isDeleting={deleteImageMutation.isPending}
        />
      </div>
    </div>
  );
}
