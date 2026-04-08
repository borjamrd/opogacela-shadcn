'use client';

import { cn } from '@/lib/utils';
import { CSSProperties } from 'react';

interface ShineBorderProps {
    borderWidth?: number;
    duration?: number;
    shineColor?: string | string[];
    className?: string;
}

/**
 * Colócalo dentro de un contenedor con `relative overflow-hidden`.
 * Muéstralo en hover con `opacity-0 group-hover:opacity-100 transition-opacity`.
 */
export function ShineBorder({
    borderWidth = 1,
    duration = 4,
    shineColor,
    className,
}: ShineBorderProps) {
    const colors = Array.isArray(shineColor)
        ? shineColor.join(', ')
        : (shineColor ?? 'hsl(var(--primary))');

    return (
        <span
            style={
                {
                    '--shine-border-width': `${borderWidth}px`,
                    '--shine-duration': `${duration}s`,
                    '--shine-color': colors,
                } as CSSProperties
            }
            className={cn(
                'pointer-events-none absolute inset-0 rounded-[inherit]',
                '[border:var(--shine-border-width)_solid_transparent]',
                '[background:conic-gradient(from_var(--shine-angle,0deg),transparent_0%,var(--shine-color)_10%,transparent_20%)_border-box]',
                '[background-origin:border-box]',
                '[mask-image:linear-gradient(transparent,transparent),linear-gradient(white,white)]',
                '[mask-clip:padding-box,border-box]',
                '[mask-composite:intersect]',
                'animate-[shine-spin_var(--shine-duration)_linear_infinite]',
                className
            )}
        />
    );
}
