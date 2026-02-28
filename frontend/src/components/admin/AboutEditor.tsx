import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import {
  useUpdateAboutSection,
  useUpdateAboutImageBase64,
  useDeleteAboutImage,
} from '../../hooks/useQueries';
import ImageUploadField from './ImageUploadField';

interface AboutEditorProps {
  sessionToken: string;
  currentText: string;
  currentImageUrl: string;
  currentImageBase64?: string;
}

export default function AboutEditor({
  sessionToken,
  currentText,
  currentImageUrl,
  currentImageBase64,
}: AboutEditorProps) {
  const [text, setText] = useState(currentText);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const updateAbout = useUpdateAboutSection();
  const updateAboutImage = useUpdateAboutImageBase64();
  const deleteAboutImage = useDeleteAboutImage();

  const handleSave = async () => {
    setError('');
    setSaved(false);
    try {
      await updateAbout.mutateAsync({ text, imageUrl: currentImageUrl, sessionToken });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setError(e?.message || 'Failed to save');
    }
  };

  const labelClass = "block text-xs font-medium font-body text-slate-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="space-y-6">
      {/* Bio Text */}
      <div>
        <h3 className="font-display font-semibold text-white text-sm mb-4 pb-2 border-b border-slate-700/50">
          Bio Text
        </h3>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>About Section Content</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder="Write about the doctor..."
              className="w-full px-3 py-2 rounded-sharp tech-input text-sm resize-none"
            />
          </div>
          {error && <p className="text-xs text-red-400 font-body">{error}</p>}
          <button
            onClick={handleSave}
            disabled={updateAbout.isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-sharp bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-navy-800 font-display font-semibold text-sm transition-all duration-200 glow-cyan-sm"
          >
            {updateAbout.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Bio'}
          </button>
        </div>
      </div>

      {/* Profile Image */}
      <div>
        <h3 className="font-display font-semibold text-white text-sm mb-4 pb-2 border-b border-slate-700/50">
          Profile Image
        </h3>
        <ImageUploadField
          label="Doctor Profile Photo"
          currentImageBase64={currentImageBase64}
          currentImageUrl={currentImageUrl}
          onUpload={async (base64) => {
            await updateAboutImage.mutateAsync({ imageBase64: base64, sessionToken });
          }}
          onUpdateUrl={async (url) => {
            await updateAbout.mutateAsync({ text, imageUrl: url, sessionToken });
          }}
          onDelete={async () => {
            await deleteAboutImage.mutateAsync({ sessionToken });
          }}
          isUploading={updateAboutImage.isPending}
          isDeleting={deleteAboutImage.isPending}
        />
      </div>
    </div>
  );
}
