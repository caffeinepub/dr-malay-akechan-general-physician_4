import React, { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import ImageUploadField from './ImageUploadField';
import {
  useUpdateAboutSection,
  useUpdateAboutImageBase64,
  useDeleteAboutImage,
} from '../../hooks/useQueries';

interface AboutEditorProps {
  sessionToken: string;
  currentText: string;
  currentImageUrl: string;
  currentImageBase64: string;
}

export default function AboutEditor({
  sessionToken,
  currentText,
  currentImageUrl,
  currentImageBase64,
}: AboutEditorProps) {
  const [bioText, setBioText] = useState(currentText);
  const [imageUrl, setImageUrl] = useState(currentImageUrl);

  const updateAbout = useUpdateAboutSection();
  const updateImageBase64 = useUpdateAboutImageBase64();
  const deleteImage = useDeleteAboutImage();

  const handleSaveBio = async () => {
    await updateAbout.mutateAsync({ text: bioText, imageUrl, sessionToken });
  };

  const handleUploadImage = async (base64: string) => {
    await updateImageBase64.mutateAsync({ imageBase64: base64, sessionToken });
  };

  const handleUpdateUrl = async (url: string) => {
    setImageUrl(url);
    await updateAbout.mutateAsync({ text: bioText, imageUrl: url, sessionToken });
  };

  const handleDeleteImage = async () => {
    await deleteImage.mutateAsync({ sessionToken });
    setImageUrl('');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-1">About Section</h2>
        <p className="text-sm text-muted-foreground">Edit your bio and profile image.</p>
      </div>

      {/* Profile Image */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Profile Image</h3>
        <ImageUploadField
          currentImageUrl={currentImageUrl}
          currentImageBase64={currentImageBase64}
          onUpload={handleUploadImage}
          onUpdateUrl={handleUpdateUrl}
          onDelete={handleDeleteImage}
        />
      </div>

      {/* Bio */}
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Biography</h3>
        <textarea
          value={bioText}
          onChange={(e) => setBioText(e.target.value)}
          rows={8}
          className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-y"
          placeholder="Write your professional biography..."
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleSaveBio}
            disabled={updateAbout.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {updateAbout.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Bio
          </button>
        </div>
      </div>
    </div>
  );
}
