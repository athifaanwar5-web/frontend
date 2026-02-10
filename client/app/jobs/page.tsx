"use client";
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { api } from '@/services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, MapPin, Star, AlertTriangle, ChevronRight, X } from 'lucide-react';

export default function JobMarket() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [matchingId, setMatchingId] = useState<number | null>(null);
    const [matchResult, setMatchResult] = useState<any>(null);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get('/jobs/');
            if (res.ok) setJobs(await res.json());
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleMatch = async (jobId: number) => {
        setMatchingId(jobId);
        setMatchResult(null);
        try {
            const res = await api.get(`/jobs/match/?job_id=${jobId}`);
            if (res.ok) {
                setMatchResult(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setMatchingId(null);
        }
    };

    if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;

    return (
        <>
            <Navbar />
            <div style={{ padding: '120px 80px', maxWidth: '1200px', margin: '0 auto' }}>
                <header style={{ marginBottom: '60px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>Explore <span style={{ color: 'var(--primary)' }}>Opportunities</span></h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px' }}>AI-powered matching based on your profile and skills.</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '32px' }}>
                    {jobs.map((job) => (
                        <motion.div
                            key={job.id}
                            className="glass-card"
                            style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}
                            whileHover={{ y: -8, borderColor: 'var(--primary)' }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.05)',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                    <Briefcase color="var(--primary)" size={24} />
                                </div>
                                <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                                    Full Time
                                </div>
                            </div>

                            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{job.title}</h3>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <MapPin size={14} /> {job.company} • Remote
                            </p>

                            <div style={{ flex: 1, marginBottom: '32px' }}>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>
                                    {job.description.length > 120 ? job.description.substring(0, 120) + '...' : job.description}
                                </p>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button
                                    onClick={() => handleMatch(job.id)}
                                    className="btn-primary"
                                    style={{ flex: 1, padding: '10px' }}
                                    disabled={matchingId === job.id}
                                >
                                    {matchingId === job.id ? 'Checking Match...' : 'Check Match %'}
                                </button>
                                <button className="btn-outline" style={{ padding: '10px' }}>
                                    Apply
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Match Result Modal */}
                <AnimatePresence>
                    {matchResult && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'rgba(0,0,0,0.8)',
                                zIndex: 1000,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '20px'
                            }}
                        >
                            <motion.div
                                className="glass-card"
                                style={{ width: '100%', maxWidth: '600px', padding: '48px', position: 'relative' }}
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                            >
                                <button
                                    onClick={() => setMatchResult(null)}
                                    style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', color: 'white' }}
                                >
                                    <X size={24} />
                                </button>

                                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        border: '4px solid var(--primary)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        margin: '0 auto 24px',
                                        fontSize: '32px',
                                        fontWeight: 'bold',
                                        color: 'var(--primary)'
                                    }}>
                                        {matchResult.match_score.score}%
                                    </div>
                                    <h2>AI Compatibility Score</h2>
                                </div>

                                <div style={{ marginBottom: '32px' }}>
                                    <h4 style={{ marginBottom: '12px', color: 'var(--primary)' }}>Analysis</h4>
                                    <p style={{ lineHeight: '1.6', color: 'rgba(255,255,255,0.7)' }}>{matchResult.match_score.explanation}</p>
                                </div>

                                {matchResult.match_score.missing_skills?.length > 0 && (
                                    <div style={{ marginBottom: '40px' }}>
                                        <h4 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)' }}>
                                            <AlertTriangle size={18} /> Skill Gaps
                                        </h4>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                            {matchResult.match_score.missing_skills.map((skill: string) => (
                                                <span key={skill} style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent)', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <button
                                        className="btn-primary"
                                        style={{ flex: 1 }}
                                        onClick={() => {
                                            window.location.href = `/jobs/interview-prep?job_id=${matchResult.job}`;
                                        }}
                                    >
                                        Start Interview Prep
                                    </button>
                                    <button className="btn-outline" style={{ flex: 1 }} onClick={() => setMatchResult(null)}>
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
