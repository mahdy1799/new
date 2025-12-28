'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const { t } = useLanguage();
  const [cms, setCms] = useState(null);

  useEffect(() => {
    const fetchCMS = async () => {
      try {
        const res = await fetch('/api/cms');
        const data = await res.json();
        setCms(data);
      } catch (error) {
        console.error('Failed to fetch CMS:', error);
      }
    };
    fetchCMS();
  }, []);

  return (
    <section className="hero">
      <div className="container">
        <div className="grid grid-cols-2 gap-xl items-center">
          <div className="animate-fade-in">
            <p className="text-cyan uppercase tracking-wider text-sm font-semibold mb-md">
              ✦ {cms?.hero?.subtitle || t('heroSubtitle')}
            </p>
            <h1 className="hero-title">
              <span className="gradient-text">
                {cms?.hero?.title || t('heroTitle')}
              </span>
            </h1>
            <p className="hero-subtitle">
              {t('heroSubtitle')}
            </p>
            <div className="flex gap-md flex-wrap">
              <Link href="/products" className="btn btn-primary btn-lg">
                {t('exploreNow')}
                <ArrowRight size={18} />
              </Link>
              <Link href="/deals" className="btn btn-secondary btn-lg">
                {t('viewDeals')}
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-float">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
                filter: 'blur(60px)',
                transform: 'scale(1.2)',
              }}
            />
            <img
              src="/hero-image.jpg"
              alt="Secure Shopping"
              className="w-full rounded-xl relative"
              style={{ 
                maxWidth: '500px',
                boxShadow: '0 0 60px rgba(6, 182, 212, 0.3)'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
