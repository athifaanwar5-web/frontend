"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkLogin = () => {
            const token = localStorage.getItem('access_token');
            setIsLoggedIn(!!token);
        };

        checkLogin();
        // Listen for storage changes (for multiple tabs)
        window.addEventListener('storage', checkLogin);
        return () => window.removeEventListener('storage', checkLogin);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setIsLoggedIn(false);
        router.push('/');
        router.refresh(); // Force re-render
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '24px 80px',
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 100,
            background: 'rgba(5, 8, 16, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border)'
        }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(to right, #6366f1, #10b981)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    AIVault
                </div>
            </Link>

            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Home</Link>
                <Link href="/jobs" style={{ color: 'var(--foreground)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Job Market</Link>

                {isLoggedIn ? (
                    <>
                        <Link href="/profile" style={{ color: 'var(--foreground)', textDecoration: 'none', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={16} /> Profile
                        </Link>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--border)',
                                color: 'var(--foreground)',
                                padding: '8px 16px',
                                borderRadius: '12px',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px'
                            }}
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" style={{ color: 'var(--foreground)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Login</Link>
                        <Link href="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '14px', textDecoration: 'none', borderRadius: '10px' }}>Get Started</Link>
                    </>
                )}
            </div>
        </nav>
    );
}
