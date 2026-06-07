import { Outlet, Link } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';

/**
 * Premium Auth Layout
 * - Split screen: Left 45% image with gradient overlay, Right 55% form area.
 * - Responsive: Collapses on mobile.
 * - Uses EnagramLogo, proper semantics, atmospheric design.
 */
export const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-surface-dim flex">
      {/* Left side — Atmospheric Image (45%) */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80" 
          alt="Premium dining atmosphere" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Quote Overlay */}
        <div className="absolute bottom-12 left-12 right-12 z-10 space-y-3">
          <h2 className="text-headline-lg text-white tracking-tight leading-tight">
            "Where every meal becomes a memory."
          </h2>
          <p className="text-label-caps text-white/40 tracking-wider">
            ENAGRAM · RESTAURANT OPERATIONS
          </p>
        </div>
      </div>

      {/* Right side — Form Area (55%) */}
      <div className="flex-1 lg:w-[55%] flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-24">
        <div className="mx-auto w-full max-w-md space-y-8 animate-in">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container rounded-sm">
            <Logo size={36} className="text-primary-container" />
            <span className="text-headline-md text-white font-bold tracking-tight">Enagram</span>
          </Link>

          {/* Forms container with ambient glow */}
          <div className="relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary-container/5 blur-[80px] pointer-events-none rounded-full" />
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
