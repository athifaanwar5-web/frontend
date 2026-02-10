"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/services/api';
import { motion } from 'framer-motion';
import { Users, Briefcase, BarChart3, TrendingUp, Filter, Plus } from 'lucide-react';
import Link from 'next/link';

export default function RecruiterDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await api.get('/recruiter/analytics/');
            if (res.ok) setStats(await res.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const cards = [
        { title: 'Total Candidates', value: stats?.total_candidates || 0, icon: <Users size={24} color="var(--primary)" />, trend: '+12% this month' },
        { title: 'Active Jobs', value: stats?.total_jobs || 0, icon: <Briefcase size={24} color="var(--secondary)" />, trend: '3 new today' },
        { title: 'Avg Match Score', value: `${stats?.avg_score || 0}%`, icon: <BarChart3 size={24} color="var(--accent)" />, trend: 'Top 10% talent' },
        { title: 'Screening Rate', value: '94%', icon: <TrendingUp size={24} color="#f59e0b" />, trend: 'AI productivity peak' },
    ];

    if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading Recruiter Data...</div>;

    return (
        <>
            <Navbar />
            <div style={{ padding: '120px 80px', maxWidth: '1400px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px' }}>
                    <div>
                        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Recruiter <span style={{ color: 'var(--primary)' }}>Insight</span></h1>
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Oversee your hiring pipeline and AI-driven metrics.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link href="/recruiter/jobs" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                            <Filter size={18} /> Manage Jobs
                        </Link>
                        <Link href="/recruiter/jobs/create" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
                            <Plus size={18} /> Create New Job
                        </Link>
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '48px' }}>
                    {cards.map((card, i) => (
                        <motion.div
                            key={i}
                            className="glass-card"
                            style={{ padding: '32px' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    {card.icon}
                                </div>
                                <span style={{ fontSize: '12px', color: '#10b981', fontWeight: 'bold' }}>{card.trend}</span>
                            </div>
                            <h4 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginBottom: '8px' }}>{card.title}</h4>
                            <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{card.value}</p>
                        </motion.div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
                    <motion.div
                        className="glass-card"
                        style={{ padding: '40px' }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1, transition: { delay: 0.4 } }}
                    >
                        <h3 style={{ marginBottom: '32px' }}>Recent Candidates</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        <th style={{ paddingBottom: '20px' }}>Name</th>
                                        <th style={{ paddingBottom: '20px' }}>Applied Position</th>
                                        <th style={{ paddingBottom: '20px' }}>Status</th>
                                        <th style={{ paddingBottom: '20px' }}>Match %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[1, 2, 3, 4].map((_, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '16px 0', fontSize: '14px' }}>Demo Candidate {i + 1}</td>
                                            <td style={{ padding: '16px 0', fontSize: '14px' }}>Senior React Dev</td>
                                            <td style={{ padding: '16px 0', fontSize: '14px' }}>
                                                <span style={{
                                                    background: 'rgba(99, 102, 241, 0.1)',
                                                    color: 'var(--primary)',
                                                    padding: '4px 10px',
                                                    borderRadius: '6px',
                                                    fontSize: '12px'
                                                }}>Applied</span>
                                            </td>
                                            <td style={{ padding: '16px 0', fontSize: '14px', fontWeight: 'bold' }}>{(90 - i * 5)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ marginTop: '24px', textAlign: 'center' }}>
                            <Link href="/recruiter/candidates" style={{ color: 'var(--primary)', fontSize: '14px', textDecoration: 'none' }}>View All Candidates</Link>
                        </div>
                    </motion.div>

                    <motion.div
                        className="glass-card"
                        style={{ padding: '40px' }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1, transition: { delay: 0.5 } }}
                    >
                        <h3 style={{ marginBottom: '32px' }}>AI Hiring Efficiency</h3>
                        <div style={{ height: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px dashed var(--border)', borderRadius: '16px' }}>
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px' }}>Chart.js Rendering Area</p>
                            <TrendingUp size={48} color="rgba(255,255,255,0.05)" style={{ marginTop: '16px' }} />
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}
