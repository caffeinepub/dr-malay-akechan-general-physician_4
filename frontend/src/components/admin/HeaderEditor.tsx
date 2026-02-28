import React, { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import ImageUploadField from './ImageUploadField';
import {
  useUpdateSiteTitle,
  useUpdateHeaderImageBase64,
  useDeleteHeaderImage,
} from '../../hooks/useQueries';

interface HeaderEditorProps {
  sessionToken: string;
  currentText: string;
  currentImageUrl: string;
  currentImageBase64: string;
}

export default function HeaderEditor({
  sessionToken,
  currentText,
  currentImageUrl,
  currentImageBase64,
}: HeaderEditorProps) {
  const [siteTitle, setSiteTitle] = useState(currentText);

  const updateTitle = useUpdateSiteTitle();
  const updateImageBase64 = useUpdateHeaderImageBase64();
  const deleteImage = useDeleteHeaderImage();

  const handleSaveTitle = async () => {
    await updateTitle.mutateAsync({ title: siteTitle, sessionToken });
  };

  const handleUploadImage = async (base64: string) => {
    await updateImageBase64.mutateAsync({ imageBase64: base64, sessionToken });
  };

  const handleDeleteImage = async () => {
    await deleteImage.mutateAsync({ sessionToken });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-1">Site Title</h2>
        <p className="text-sm text-muted-foreground">Update your site title and hero background image.</p>
      </div>

      {/* Site Title */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Site Title / Doctor Name</h3>
        <input
          type="text"
          value={siteTitle}
          onChange={(e) => setSiteTitle(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          placeholder="Dr. Your Name"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSaveTitle}
            disabled={updateTitle.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {updateTitle.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Title
          </button>
        </div>
      </div>

      {/* Hero Background Image */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Hero Background Image</h3>
        <ImageUploadField
          currentImageUrl={currentImageUrl}
          currentImageBase64={currentImageBase64}
          onUpload={handleUploadImage}
          onDelete={handleDeleteImage}
        />
      </div>
    </div>
  );
}
