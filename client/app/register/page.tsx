"use client";
import { useState, useEffect } from 'react';

import Navbar from '@/components/Navbar';
import AuthService from '@/services/AuthService';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User as UserIcon, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function Register() {
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue
    } = useForm({
        defaultValues: { username: '', email: '', password: '', role: 'job_seeker' }
    });

    const currentRole = watch('role');

    useEffect(() => {
        setMounted(true);
    }, []);

    const onSubmit = async (data: any) => {
        setError(null);
        try {
            const result = await AuthService.register(data);
            if (result.success) {
                if (data.role === 'hr') {
                    router.push('/recruiter');
                } else {
                    router.push('/profile');
                }
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to connect to server. Please check if backend is running.");
        }
    };

    if (!mounted) return null;

    return (
        <>
            <Navbar />
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05) 0%, transparent 100%)'
            }}>
                <motion.div
                    className="glass-card"
                    style={{ padding: '48px', width: '100%', maxWidth: '450px' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            background: 'rgba(99, 102, 241, 0.1)',
                            borderRadius: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: '0 auto 20px',
                            border: '1px solid var(--border)'
                        }}>
                            <UserPlus color="var(--primary)" size={32} />
                        </div>
                        <h2 style={{ fontSize: '28px' }}>Create Account</h2>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginTop: '8px' }}>Start your AI-powered career journey</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            style={{
                                background: 'rgba(244, 63, 94, 0.1)',
                                color: 'var(--accent)',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                marginBottom: '24px',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                border: '1px solid rgba(244, 63, 94, 0.2)'
                            }}
                        >
                            <AlertCircle size={16} /> {error}
                        </motion.div>
                    )}

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit(onSubmit)}>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setValue('role', 'job_seeker')}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    background: currentRole === 'job_seeker' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                    color: currentRole === 'job_seeker' ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Job Seeker
                            </button>
                            <button
                                type="button"
                                onClick={() => setValue('role', 'hr')}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    background: currentRole === 'hr' ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                                    color: currentRole === 'hr' ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                HR / Recruiter
                            </button>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }}>
                                <UserIcon size={18} />
                            </span>
                            <input
                                type="text"
                                placeholder="Username"
                                {...register("username", { required: "Username is required" })}
                                style={{ paddingLeft: '48px', width: '100%' }}
                            />
                            {errors.username && <p style={{ color: 'var(--accent)', fontSize: '12px', marginTop: '4px' }}>{errors.username.message as string}</p>}
                        </div>

                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }}>
                                <Mail size={18} />
                            </span>
                            <input
                                type="email"
                                placeholder="Email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                                })}
                                style={{ paddingLeft: '48px', width: '100%' }}
                            />
                            {errors.email && <p style={{ color: 'var(--accent)', fontSize: '12px', marginTop: '4px' }}>{errors.email.message as string}</p>}
                        </div>

                        <div style={{ position: 'relative' }}>
                            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)' }}>
                                <Lock size={18} />
                            </span>
                            <input
                                type="password"
                                placeholder="Password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters" }
                                })}
                                style={{ paddingLeft: '48px', width: '100%' }}
                            />
                            {errors.password && <p style={{ color: 'var(--accent)', fontSize: '12px', marginTop: '4px' }}>{errors.password.message as string}</p>}
                        </div>


                        <button type="submit" className="btn-primary" style={{ height: '52px', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <>Register <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <p style={{ marginTop: '32px', textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                        Already have an account? <a href="/login" style={{ color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Login</a>
                    </p>
                </motion.div>
            </div>
        </>
    );
}
