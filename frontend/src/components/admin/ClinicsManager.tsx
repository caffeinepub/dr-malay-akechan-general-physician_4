import { useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useGetAllContent, useAddClinic, useUpdateClinic, useDeleteClinic } from '../../hooks/useQueries';
import type { Clinic } from '../../backend';

interface ClinicsManagerProps {
  sessionToken: string;
}

const emptyForm = {
  name: '',
  address: '',
  phone: '',
  description: '',
  mapUrl: '',
  bookingUrl: '',
};

export default function ClinicsManager({ sessionToken }: ClinicsManagerProps) {
  const { data: content } = useGetAllContent();
  const clinics = content?.clinics || [];

  const addClinic = useAddClinic();
  const updateClinic = useUpdateClinic();
  const deleteClinic = useDeleteClinic();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');

  const handleEdit = (id: bigint, clinic: Clinic) => {
    setEditingId(id);
    setForm({
      name: clinic.name,
      address: clinic.address,
      phone: clinic.phone,
      description: clinic.description,
      mapUrl: clinic.mapUrl,
      bookingUrl: clinic.bookingUrl,
    });
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
    if (!form.name.trim()) {
      setFormError('Clinic name is required');
      return;
    }
    setFormError('');
    try {
      if (editingId !== null) {
        await updateClinic.mutateAsync({ id: editingId, clinic: form, sessionToken });
      } else {
        await addClinic.mutateAsync({ clinic: form, sessionToken });
      }
      handleCancel();
    } catch (e: any) {
      setFormError(e?.message || 'Failed to save clinic');
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Delete this clinic?')) return;
    try {
      await deleteClinic.mutateAsync({ id, sessionToken });
    } catch (e: any) {
      alert(e?.message || 'Failed to delete');
    }
  };

  const isPending = addClinic.isPending || updateClinic.isPending;

  const fields: { key: keyof typeof emptyForm; label: string; type?: string; multiline?: boolean }[] = [
    { key: 'name', label: 'Clinic Name *' },
    { key: 'address', label: 'Address', multiline: true },
    { key: 'phone', label: 'Phone Number', type: 'tel' },
    { key: 'description', label: 'Description', multiline: true },
    { key: 'mapUrl', label: 'Google Maps Embed URL', type: 'url' },
    { key: 'bookingUrl', label: 'Booking URL', type: 'url' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <MapPin className="w-4 h-4 text-emerald-400" />
          Clinics ({clinics.length})
        </div>
        {!showForm && (
          <Button size="sm" onClick={handleAdd} className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white">
            <Plus className="w-3.5 h-3.5" />
            Add Clinic
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="border border-emerald-500/30 rounded-xl p-4 space-y-4 bg-emerald-500/5">
          <h4 className="font-semibold text-sm text-emerald-400">
            {editingId !== null ? 'Edit Clinic' : 'New Clinic'}
          </h4>
          <div className="grid grid-cols-1 gap-3">
            {fields.map(({ key, label, type, multiline }) => (
              <div key={key}>
                <Label className="text-xs text-muted-foreground mb-1 block">{label}</Label>
                {multiline ? (
                  <Textarea
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={label.replace(' *', '')}
                    rows={2}
                    className="resize-none"
                  />
                ) : (
                  <Input
                    type={type || 'text'}
                    value={form[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    placeholder={label.replace(' *', '')}
                  />
                )}
              </div>
            ))}
          </div>
          {formError && <p className="text-xs text-destructive">{formError}</p>}
          <div className="flex gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              size="sm"
              className="gap-2 bg-emerald-500 hover:bg-emerald-600 text-white"
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

      {/* Clinics List */}
      <div className="space-y-2">
        {clinics.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-6">No clinics yet. Add one above.</p>
        )}
        {clinics.map(([id, clinic]) => (
          <div
            key={id.toString()}
            className="flex items-start gap-3 p-3 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground">{clinic.name}</p>
              <p className="text-xs text-muted-foreground truncate">{clinic.address}</p>
              {clinic.phone && <p className="text-xs text-muted-foreground">{clinic.phone}</p>}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-muted-foreground hover:text-foreground"
                onClick={() => handleEdit(id, clinic)}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-muted-foreground hover:text-destructive"
                onClick={() => handleDelete(id)}
                disabled={deleteClinic.isPending}
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
