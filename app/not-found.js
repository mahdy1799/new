import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="error-page">
            <div className="error-code animate-glow">404</div>
            <h1 className="mb-md">Page Not Found</h1>
            <p className="text-secondary mb-xl" style={{ maxWidth: '400px' }}>
                Oops! The page you're looking for doesn't exist or has been moved.
            </p>
            <Link href="/" className="btn btn-primary btn-lg">
                <Home size={20} />
                Back to Home
            </Link>
        </div>
    );
}
