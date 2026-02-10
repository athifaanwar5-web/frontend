"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/services/api';
import { motion } from 'framer-motion';
import { Sparkles, Save, User as UserIcon, Mail, Phone, Code, Briefcase, GraduationCap } from 'lucide-react';

export default function Profile() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [polishing, setPolishing] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/profile/');
            if (res.ok) {
                setProfile(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const res = await api.put('/profile/', profile);
            if (res.ok) alert('Profile updated!');
        } catch (error) {
            console.error(error);
        }
    };

    const handlePolish = async () => {
        setPolishing(true);
        try {
            const res = await api.post('/profile/polish/', { summary: profile.summary });
            if (res.ok) {
                const data = await res.json();
                setProfile({ ...profile, summary: data.polished });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setPolishing(false);
        }
    };

    if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
    if (!profile) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Please Login First</div>;

    return (
        <>
            <Navbar />
            <div style={{ padding: '120px 80px', maxWidth: '1400px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
                    {/* Left Column: Form */}
                    <motion.div
                        className="glass-card"
                        style={{ padding: '40px' }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <UserIcon color="var(--primary)" /> Smart Profile
                            </h2>
                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>AI-Extracted Content</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Full Name</label>
                                <input
                                    value={profile.full_name || ''}
                                    onChange={e => setProfile({ ...profile, full_name: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Email</label>
                                <input
                                    value={profile.email || ''}
                                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Phone</label>
                                <input
                                    value={profile.phone || ''}
                                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '48px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Summary</label>
                                <button
                                    onClick={handlePolish}
                                    disabled={polishing}
                                    style={{
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        color: 'var(--primary)',
                                        padding: '6px 14px',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        borderRadius: '8px'
                                    }}
                                >
                                    {polishing ? 'Polishing...' : <><Sparkles size={14} /> AI Polish</>}
                                </button>
                            </div>
                            <textarea
                                rows={6}
                                value={profile.summary || ''}
                                onChange={e => setProfile({ ...profile, summary: e.target.value })}
                                style={{ width: '100%', fontSize: '15px', lineHeight: '1.6' }}
                            />
                        </div>

                        <div style={{ marginBottom: '48px' }}>
                            <h3 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Briefcase size={20} color="var(--primary)" /> Work Experience
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {profile.experience?.map((exp: any, i: number) => (
                                    <div key={i} style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{exp.title}</div>
                                            <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: '600' }}>{exp.duration}</div>
                                        </div>
                                        <div style={{ color: 'var(--secondary)', fontSize: '15px', marginBottom: '12px', fontWeight: '500' }}>{exp.company}</div>
                                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>{exp.description}</p>
                                    </div>
                                ))}
                                {(!profile.experience || profile.experience.length === 0) && (
                                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>Analyze a resume to see work history.</p>
                                )}
                            </div>
                        </div>

                        <div style={{ marginBottom: '48px' }}>
                            <h3 style={{ fontSize: '20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <GraduationCap size={20} color="var(--secondary)" /> Education
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {profile.education?.map((edu: any, i: number) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{edu.degree}</div>
                                            <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{edu.institution}</div>
                                        </div>
                                        <div style={{ fontSize: '14px', color: 'var(--primary)', fontWeight: 'bold' }}>{edu.year}</div>
                                    </div>
                                ))}
                                {(!profile.education || profile.education.length === 0) && (
                                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>No education data available.</p>
                                )}
                            </div>
                        </div>

                        <button onClick={handleUpdate} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', justifyContent: 'center', padding: '16px' }}>
                            <Save size={20} /> Update Smart Profile
                        </button>
                    </motion.div>

                    {/* Right Column: Skills */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <motion.div
                            className="glass-card"
                            style={{ padding: '32px' }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <h3 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Code color="var(--secondary)" /> Skills Cloud
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {profile.skills?.map((skill: any) => (
                                    <span key={skill.id} style={{
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        color: 'var(--secondary)',
                                        padding: '8px 18px',
                                        borderRadius: '20px',
                                        fontSize: '13px',
                                        border: '1px solid rgba(16, 185, 129, 0.2)',
                                        fontWeight: '500',
                                        letterSpacing: '0.02em'
                                    }}>
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            className="glass-card"
                            style={{ padding: '32px' }}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                        >
                            <h3 style={{ marginBottom: '16px' }}>AI Model Insight</h3>
                            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: '1.6' }}>
                                Our Gemini-powered engine has extracted structured data from your technical documents. Review the details for accuracy.
                            </p>
                            <div style={{ marginTop: '24px' }}>
                                <a href="/" style={{
                                    color: 'var(--primary)',
                                    fontSize: '14px',
                                    textDecoration: 'none',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    Re-upload Resume <Code size={12} />
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </>
    );
}
