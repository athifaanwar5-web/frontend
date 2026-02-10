"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/services/api';
import { motion } from 'framer-motion';
import { Sparkles, Briefcase, FileText, PlusCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateJob() {
    const [formData, setFormData] = useState({ title: '', description: '', company: 'Local Corp' });
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();

    const handleGenerateAI = async () => {
        if (!formData.title) return alert('Please enter a Job Title first');
        setIsGenerating(true);
        try {
            // Create a specific endpoint for this or reuse a logic
            // For now, let's mock the AI response or call backend if implemented
            const res = await api.post('/jobs/', { ...formData, description: 'AI is generating...' }); // Dummy save to trigger AI? 
            // Actually let's add an endpoint for generating JD in backend
            // But for this demo, I will simulate it 
            await new Promise(resolve => setTimeout(resolve, 2000));
            setFormData({
                ...formData,
                description: `We are looking for a talented ${formData.title} to join our dynamic team. \n\nKey Responsibilities:\n- Develop high-quality code\n- Collaborate with cross-functional teams\n- Participate in code reviews\n\nRequirements:\n- Strong problem-solving skills\n- Experience with modern frameworks\n- Excellent communication skills`
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/jobs/', formData);
            if (res.ok) router.push('/recruiter');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Navbar />
            <div style={{ padding: '120px 20px', maxWidth: '800px', margin: '0 auto' }}>
                <Link href="/recruiter" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontSize: '14px' }}>
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
                <motion.div
                    className="glass-card"
                    style={{ padding: '48px' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Briefcase color="var(--primary)" /> Post New Position
                    </h2>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Job Title</label>
                            <input
                                placeholder="e.g. Senior Frontend Engineer"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Job Description</label>
                                <button
                                    type="button"
                                    onClick={handleGenerateAI}
                                    disabled={isGenerating}
                                    style={{
                                        background: 'rgba(16, 185, 129, 0.1)',
                                        color: 'var(--secondary)',
                                        padding: '6px 14px',
                                        fontSize: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    {isGenerating ? 'Generating...' : <><Sparkles size={14} /> AI Generate JD</>}
                                </button>
                            </div>
                            <textarea
                                rows={12}
                                placeholder="Describe the role and requirements..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ padding: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                            <PlusCircle size={20} /> Publish Job Posting
                        </button>
                    </form>
                </motion.div>
            </div>
        </>
    );
}
