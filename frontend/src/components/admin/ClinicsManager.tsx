import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, X, Check } from 'lucide-react';
import {
  useGetAllContent,
  useAddClinic,
  useUpdateClinic,
  useDeleteClinic,
} from '../../hooks/useQueries';

interface ClinicsManagerProps {
  sessionToken: string;
}

interface ClinicForm {
  name: string;
  description: string;
  address: string;
  phone: string;
  mapUrl: string;
  bookingUrl: string;
}

const emptyForm: ClinicForm = { name: '', description: '', address: '', phone: '', mapUrl: '', bookingUrl: '' };

export default function ClinicsManager({ sessionToken }: ClinicsManagerProps) {
  const { data: content, isLoading } = useGetAllContent();
  const addClinic = useAddClinic();
  const updateClinic = useUpdateClinic();
  const deleteClinic = useDeleteClinic();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<ClinicForm>(emptyForm);
  const [editForm, setEditForm] = useState<ClinicForm>(emptyForm);

  const handleAdd = async () => {
    await addClinic.mutateAsync({ clinic: form, sessionToken });
    setForm(emptyForm);
    setShowAddForm(false);
  };

  const handleUpdate = async (id: bigint) => {
    await updateClinic.mutateAsync({ id, clinic: editForm, sessionToken });
    setEditingId(null);
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Delete this clinic?')) return;
    await deleteClinic.mutateAsync({ id, sessionToken });
  };

  const ClinicFormFields = ({ data, onChange }: { data: ClinicForm; onChange: (d: ClinicForm) => void }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { key: 'name', label: 'Clinic Name', type: 'text', placeholder: 'Main Clinic' },
        { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 234 567 8900' },
        { key: 'address', label: 'Address', type: 'text', placeholder: '123 Medical St' },
        { key: 'mapUrl', label: 'Map URL', type: 'url', placeholder: 'https://maps.google.com/...' },
        { key: 'bookingUrl', label: 'Booking URL', type: 'url', placeholder: 'https://booking.example.com' },
      ].map(({ key, label, type, placeholder }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
          <input
            type={type}
            value={data[key as keyof ClinicForm]}
            onChange={(e) => onChange({ ...data, [key]: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder={placeholder}
          />
        </div>
      ))}
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={3}
          className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
          placeholder="Clinic description"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-foreground mb-1">Clinics</h2>
          <p className="text-sm text-muted-foreground">Manage your clinic locations.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Clinic
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl border border-primary/30 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">New Clinic</h3>
            <button onClick={() => setShowAddForm(false)} className="text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          <ClinicFormFields data={form} onChange={setForm} />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={addClinic.isPending || !form.name}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {addClinic.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Add Clinic
            </button>
          </div>
        </div>
      )}

      {/* Clinics List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : content?.clinics.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No clinics yet. Add your first clinic above.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {content?.clinics.map(([id, clinic]) => (
            <div key={id.toString()} className="bg-white rounded-xl border border-border p-5">
              {editingId === id ? (
                <div className="space-y-4">
                  <ClinicFormFields data={editForm} onChange={setEditForm} />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdate(id)}
                      disabled={updateClinic.isPending}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      {updateClinic.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-foreground">{clinic.name}</h4>
                    <p className="text-sm text-muted-foreground mt-0.5">{clinic.address}</p>
                    {clinic.phone && <p className="text-sm text-muted-foreground">{clinic.phone}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingId(id);
                        setEditForm({
                          name: clinic.name,
                          description: clinic.description,
                          address: clinic.address,
                          phone: clinic.phone,
                          mapUrl: clinic.mapUrl,
                          bookingUrl: clinic.bookingUrl,
                        });
                      }}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(id)}
                      disabled={deleteClinic.isPending}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
