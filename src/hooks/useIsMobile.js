import { useState, useEffect } from 'react';

/** Returns true when window.innerWidth <= 767 (phone breakpoint) */
export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 767);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return isMobile;
}
