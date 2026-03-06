import React, { useState, useEffect } from 'react';
import { X, Save, User, Image as ImageIcon, Briefcase, Hash } from 'lucide-react';
import GlassCard from '../shared/GlassCard';
import useAppStore from '../../store/useAppStore';

export default function ProfileModal() {
    const isOpen = useAppStore(state => state.profileModalOpen);
    const setProfileModalOpen = useAppStore(state => state.setProfileModalOpen);
    const userProfile = useAppStore(state => state.userProfile);
    const setUserProfile = useAppStore(state => state.setUserProfile);

    const [formData, setFormData] = useState({
        name: userProfile.name,
        initials: userProfile.initials,
        role: userProfile.role,
        department: userProfile.department,
        avatarUrl: userProfile.avatarUrl || ''
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: userProfile.name,
                initials: userProfile.initials,
                role: userProfile.role,
                department: userProfile.department,
                avatarUrl: userProfile.avatarUrl || ''
            });
        }
    }, [isOpen, userProfile]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            // Auto-update initials if name changes
            if (name === 'name') {
                const parts = value.split(' ').filter(Boolean);
                if (parts.length > 1) {
                    newData.initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
                } else if (parts.length === 1 && parts[0].length > 1) {
                    newData.initials = value.substring(0, 2).toUpperCase();
                } else {
                    newData.initials = 'JO';
                }
            }
            return newData;
        });
    };

    const handleSave = () => {
        setUserProfile(formData);
        setProfileModalOpen(false);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={() => setProfileModalOpen(false)}
            />

            <GlassCard className="relative w-full max-w-md flex flex-col gap-6 overflow-hidden border-solid shadow-[0_10px_40px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-300">
                <button
                    onClick={() => setProfileModalOpen(false)}
                    className="absolute top-4 right-4 text-[var(--text-muted-light)] hover:text-white transition-colors z-[100] cursor-pointer"
                    title="Close"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="border-b border-[var(--border-subtle)] pb-4 pr-10">
                    <h2 className="text-white font-bold text-lg leading-tight flex items-center gap-2">
                        <User className="w-5 h-5 text-[var(--accent-cyan)]" />
                        Edit Profile
                    </h2>
                </div>

                <div className="flex flex-col gap-5">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="h-16 w-16 rounded-full overflow-hidden flex items-center justify-center bg-[rgba(0,212,255,0.1)] border border-[rgba(0,212,255,0.3)] shadow-[0_0_15px_rgba(0,212,255,0.15)] flex-shrink-0">
                            {formData.avatarUrl ? (
                                <img src={formData.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-[20px] font-bold text-[var(--accent-cyan)] select-none">
                                    {formData.initials}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col text-sm text-[var(--text-muted-light)]">
                            <span className="text-white font-medium">{formData.name || 'Anonymous'}</span>
                            <span>{formData.role || 'No Role'}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5" /> Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                className="w-full bg-[rgba(0,0,0,0.4)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[var(--accent-cyan)] focus:bg-[rgba(0,212,255,0.05)] transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                                <Briefcase className="w-3.5 h-3.5" /> Role / Title
                            </label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                placeholder="e.g. Administrator"
                                className="w-full bg-[rgba(0,0,0,0.4)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[var(--accent-cyan)] focus:bg-[rgba(0,212,255,0.05)] transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                                <Hash className="w-3.5 h-3.5" /> Department
                            </label>
                            <input
                                type="text"
                                name="department"
                                value={formData.department}
                                onChange={handleChange}
                                placeholder="e.g. Command Center"
                                className="w-full bg-[rgba(0,0,0,0.4)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[var(--accent-cyan)] focus:bg-[rgba(0,212,255,0.05)] transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5">
                                <ImageIcon className="w-3.5 h-3.5" /> Photo URL
                            </label>
                            <input
                                type="text"
                                name="avatarUrl"
                                value={formData.avatarUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/photo.jpg"
                                className="w-full bg-[rgba(0,0,0,0.4)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[var(--accent-cyan)] focus:bg-[rgba(0,212,255,0.05)] transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-[var(--border-subtle)] mt-2">
                    <button
                        onClick={() => setProfileModalOpen(false)}
                        className="px-4 py-2 rounded-lg text-sm text-[var(--text-secondary)] hover:text-white hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold text-[var(--bg-primary)] bg-[var(--accent-cyan)] hover:bg-[#33dfff] transition-colors shadow-[0_0_15px_rgba(0,212,255,0.4)]"
                    >
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </GlassCard>
        </div>
    );
}
