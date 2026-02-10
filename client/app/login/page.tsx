"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/services/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login/', formData);
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                router.push('/profile');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 100%)'
            }}>
                <motion.div
                    className="glass-card"
                    style={{ padding: '48px', width: '100%', maxWidth: '450px' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            borderRadius: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '0 auto 20px',
                            border: '1px solid var(--border)'
                        }}>
                            <LogIn color="var(--secondary)" size={32} />
                        </div>
                        <h2 style={{ fontSize: '28px' }}>Welcome Back</h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '8px' }}>Access your personalized AI career vault</p>
                    </div>

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>
                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }}>
                                <UserIcon size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Username"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                style={{ paddingLeft: '48px', width: '100%' }}
                                required
                            />
                        </div>

                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }}>
                                <Lock size={18} />
                            </span>
                            <input
                                type="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                style={{ paddingLeft: '48px', width: '100%' }}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-primary" style={{ height: '52px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Login <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                        Don't have an account? <a href="/register" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Register</a>
                    </p>
                </motion.div>
            </div>
        </>
    );
}
