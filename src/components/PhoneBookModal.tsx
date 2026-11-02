import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Plus, Phone, Globe, MapPin, Trash2, Pencil, Search, ExternalLink, ShieldCheck } from 'lucide-react';
import { Contact } from '../types';

interface PhoneBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: Contact[];
  onSaveContact: (contact: Omit<Contact, 'id'> & { id?: string }) => void;
  onDeleteContact: (id: string) => void;
}

export const PhoneBookModal: React.FC<PhoneBookModalProps> = ({
  isOpen,
  onClose,
  contacts,
  onSaveContact,
  onDeleteContact
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingOrEditing, setIsAddingOrEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phoneNumber.includes(searchQuery) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.website.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAdd = () => {
    if (!editingId && contacts.length >= 20) {
      alert('Maximum limit of 20 contacts reached. Please delete an existing contact before adding a new one.');
      return;
    }
    setEditingId(null);
    setName('');
    setPhoneNumber('');
    setAddress('');
    setWebsite('');
    setNotes('');
    setErrorMsg('');
    setIsAddingOrEditing(true);
  };

  const handleOpenEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setPhoneNumber(contact.phoneNumber);
    setAddress(contact.address);
    setWebsite(contact.website);
    setNotes(contact.notes || '');
    setErrorMsg('');
    setIsAddingOrEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Contact name is required.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMsg('Phone number is required.');
      return;
    }

    if (!editingId && contacts.length >= 20) {
      setErrorMsg('Maximum 20 contacts limit reached (20/20). Please delete an existing contact first.');
      return;
    }

    onSaveContact({
      id: editingId || undefined,
      name: name.trim(),
      phoneNumber: phoneNumber.trim(),
      address: address.trim(),
      website: website.trim(),
      notes: notes.trim(),
      updatedAt: new Date().toISOString()
    });

    setIsAddingOrEditing(false);
    setEditingId(null);
    setName('');
    setPhoneNumber('');
    setAddress('');
    setWebsite('');
    setNotes('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-3xl bg-[#0e1310] border border-emerald-500/30 rounded-[2.5px] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-950/60 via-[#0a0f0d] to-black border-b border-emerald-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white tracking-tight">Financial &amp; Utility Phone Book</h2>
              <p className="text-xs text-slate-400 font-mono">Manage contacts, numbers, addresses &amp; websites</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar grow space-y-6">
          {!isAddingOrEditing ? (
            <>
              {/* Search & Add Action Bar */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative grow w-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, number, address, or website..."
                    className="w-full bg-black/60 border border-emerald-500/25 rounded-2xl pl-10 pr-4 py-3 text-xs text-white font-mono placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleOpenAdd}
                  disabled={contacts.length >= 20}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 shrink-0 transition-all active:scale-95"
                  title={contacts.length >= 20 ? 'Maximum 20 contacts limit reached' : 'Add new contact'}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Contact ({contacts.length}/20)</span>
                </button>
              </div>

              {/* Contacts Grid / List */}
              {filteredContacts.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-emerald-500/20 rounded-3xl bg-emerald-950/10 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-mono text-slate-300">No contacts found.</p>
                  <button
                    onClick={handleOpenAdd}
                    className="text-[11px] font-mono font-bold text-emerald-400 hover:text-emerald-300 underline uppercase tracking-wider"
                  >
                    + Add your first contact
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-[#0a0f0d]/50 to-black/80 border border-emerald-500/20 hover:border-emerald-500/40 transition-all space-y-3.5 shadow-md group relative"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                            {contact.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEdit(contact)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                            title="Edit Contact"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteContact(contact.id)}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Delete Contact"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs font-mono">
                        {contact.phoneNumber && (
                          <div className="flex items-center gap-2 text-emerald-300">
                            <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <a href={`tel:${contact.phoneNumber}`} className="hover:underline font-bold">
                              {contact.phoneNumber}
                            </a>
                          </div>
                        )}
                        {contact.address && (
                          <div className="flex items-start gap-2 text-slate-300">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed text-[11px]">{contact.address}</span>
                          </div>
                        )}
                        {contact.website && (
                          <div className="flex items-center gap-2 text-cyan-300">
                            <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <a 
                              href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="hover:underline truncate text-[11px] inline-flex items-center gap-1"
                            >
                              {contact.website} <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        )}
                        {contact.notes && (
                          <p className="text-[10px] text-slate-400 italic pt-1 border-t border-border-subtle">
                            {contact.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Add / Edit Form */
            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">
                  {editingId ? 'Edit Contact' : 'Add New Contact'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">Fill in contact details below</p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
                  {errorMsg}
                </div>
              )}

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">Contact Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Chase Bank Support or Electric Co."
                    className="w-full bg-black/70 border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">Phone Number *</label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 1-800-555-0199"
                    className="w-full bg-black/70 border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 123 Financial Way, Suite 400, New York, NY"
                    rows={2}
                    className="w-full bg-black/70 border border-emerald-500/30 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">Website</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. https://bank.example.com"
                    className="w-full bg-black/70 border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">Notes / Account # (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Support PIN: 1234 or Hours: 9am-5pm"
                    className="w-full bg-black/70 border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingOrEditing(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border border-border-subtle font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-emerald-950/50 font-mono"
                >
                  {editingId ? 'Save Changes' : 'Save Contact'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-black/80 border-t border-emerald-500/20 text-[10px] font-mono text-slate-500 flex items-center justify-between">
          <span>Capital Command Phone Book</span>
          <span className="text-emerald-400 font-bold">{contacts.length}/20 Contacts Used</span>
        </div>
      </motion.div>
    </div>
  );
};
