import React, { useState } from 'react';
import { Upload, Trash2, Link, Loader2, Image } from 'lucide-react';
import { useGetImages, useUpdateHeroBackgroundImage, useDeleteHeroBackgroundImage } from '../../hooks/useQueries';

interface ImagesManagerProps {
  sessionToken: string;
}

export default function ImagesManager({ sessionToken }: ImagesManagerProps) {
  const { data: images, isLoading } = useGetImages();
  const updateMutation = useUpdateHeroBackgroundImage();
  const deleteMutation = useDeleteHeroBackgroundImage();

  const [urlInput, setUrlInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5MB');
      return;
    }
    setUploadProgress(0);
    const reader = new FileReader();
    reader.onprogress = (ev) => {
      if (ev.lengthComputable) setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
    };
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      await updateMutation.mutateAsync({ imageUrl: '', imageBase64: base64, sessionToken });
      setUploadProgress(null);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSave = async () => {
    if (!urlInput.trim()) return;
    await updateMutation.mutateAsync({ imageUrl: urlInput.trim(), imageBase64: '', sessionToken });
    setUrlInput('');
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync({ sessionToken });
  };

  const currentImage = images?.heroBackgroundBase64
    ? `data:image/jpeg;base64,${images.heroBackgroundBase64}`
    : images?.heroBackgroundUrl || null;

  const inputClass = "w-full px-3 py-2 rounded-sharp tech-input text-sm";
  const labelClass = "block text-xs font-medium font-body text-slate-400 uppercase tracking-wider mb-1.5";

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 text-slate-400 py-8">
        <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
        <span className="font-body text-sm">Loading images...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-display font-semibold text-white text-sm mb-4 pb-2 border-b border-slate-700/50">
          Hero Background Image
        </h3>

        {/* Current Preview */}
        {currentImage ? (
          <div className="mb-4 relative rounded-card overflow-hidden border border-cyan-500/20">
            <img src={currentImage} alt="Hero background" className="w-full h-40 object-cover" />
            <div className="absolute inset-0 bg-navy-800/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 rounded-sharp bg-red-500/80 hover:bg-red-500 text-white text-sm font-body transition-all duration-200"
              >
                {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Remove Image
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-4 rounded-card border border-dashed border-slate-600 h-40 flex items-center justify-center">
            <div className="text-center text-slate-500">
              <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-body">No image set</p>
            </div>
          </div>
        )}

        {/* Upload */}
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Upload Image (max 5MB)</label>
            <label className="flex items-center gap-2 px-4 py-2.5 rounded-sharp border border-slate-600 hover:border-cyan-500/50 bg-navy-800 hover:bg-cyan-500/5 text-slate-300 hover:text-cyan-400 text-sm font-body cursor-pointer transition-all duration-200 w-fit">
              <Upload className="w-4 h-4" />
              Choose File
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
            {uploadProgress !== null && (
              <div className="mt-2">
                <div className="h-1 bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-500 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 font-body mt-1">{uploadProgress}%</p>
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>Or Enter Image URL</label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={`flex-1 ${inputClass}`}
              />
              <button
                onClick={handleUrlSave}
                disabled={updateMutation.isPending || !urlInput.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-sharp bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-navy-800 font-display font-semibold text-sm transition-all duration-200"
              >
                {updateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link className="w-4 h-4" />}
                Set URL
              </button>
            </div>
          </div>

          {currentImage && (
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 rounded-sharp border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-red-300 text-sm font-body transition-all duration-200"
            >
              {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
