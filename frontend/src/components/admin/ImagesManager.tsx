import React from 'react';
import { Loader2 } from 'lucide-react';
import ImageUploadField from './ImageUploadField';
import {
  useGetImages,
  useUpdateHeroBackgroundImage,
  useDeleteHeroBackgroundImage,
} from '../../hooks/useQueries';

interface ImagesManagerProps {
  sessionToken: string;
}

export default function ImagesManager({ sessionToken }: ImagesManagerProps) {
  const { data: images, isLoading } = useGetImages();
  const updateHeroBg = useUpdateHeroBackgroundImage();
  const deleteHeroBg = useDeleteHeroBackgroundImage();

  const handleUpload = async (base64: string) => {
    await updateHeroBg.mutateAsync({ imageUrl: '', imageBase64: base64, sessionToken });
  };

  const handleUpdateUrl = async (url: string) => {
    await updateHeroBg.mutateAsync({ imageUrl: url, imageBase64: '', sessionToken });
  };

  const handleDelete = async () => {
    await deleteHeroBg.mutateAsync({ sessionToken });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground mb-1">Images</h2>
        <p className="text-sm text-muted-foreground">Manage site images including the hero background.</p>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Hero Background Image</h3>
        <ImageUploadField
          currentImageUrl={images?.heroBackgroundUrl || ''}
          currentImageBase64={images?.heroBackgroundBase64 || ''}
          onUpload={handleUpload}
          onUpdateUrl={handleUpdateUrl}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
