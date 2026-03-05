"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut } from 'lucide-react';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkLogin = () => {
            const token = localStorage.getItem('access_token');
            setIsLoggedIn(!!token);
            setRole(localStorage.getItem('user_role'));
        };

        checkLogin();
        // Listen for storage changes
        window.addEventListener('storage', checkLogin);

        // Custom event for same-tab login updates
        window.addEventListener('login-update', checkLogin);

        return () => {
            window.removeEventListener('storage', checkLogin);
            window.removeEventListener('login-update', checkLogin);
        };
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
            background: 'rgba(16, 5, 11, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border)'
        }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', background: 'linear-gradient(to right, #f4f4f7ff, #db12ac96)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    CareerSphere
                </div>
            </Link>

            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                <Link href="/" style={{ color: 'var(--foreground)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Home</Link>
                <Link href="/jobs" style={{ color: 'var(--foreground)', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>Job Market</Link>

                {isLoggedIn ? (
                    <>
                        <Link href={role === 'hr' ? '/recruiter' : '/profile'} style={{ color: 'var(--foreground)', textDecoration: 'none', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <User size={16} /> {role === 'hr' ? 'Dashboard' : 'Profile'}
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
