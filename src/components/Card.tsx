import { useRef, useEffect, useState } from 'react';
import { cn } from '~/utils/utils';
import type { CollectionEntry } from 'astro:content';
import { motion } from 'motion/react';
import { GlowingEffect } from './GlowingEffect';
import { ExternalLinkIcon } from 'lucide-react';


export type CardProps = CollectionEntry<'projects'>['data'] & {
  slug: string;
  href: string;
};

export default function Card({
  slug,
  title,
  subtitle,
  href,
  image,
  date,
  description,
  live,
  github,
  sandbox,
}: CardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    let rafId: number | null = null;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let currentX = 0.5;
    let currentY = 0.5;
    const maxRotate = 5;
    const lerp = 0.1;
    let isMouseOver = false;

    const animate = () => {
      currentX += (mouseX - currentX) * lerp;
      currentY += (mouseY - currentY) * lerp;

      const rotateX = (currentY - 0.5) * maxRotate;
      const rotateY = (currentX - 0.5) * -maxRotate;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

      rafId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;
      if (!isMouseOver) {
        isMouseOver = true;
        if (rafId === null) {
          rafId = requestAnimationFrame(animate);
        }
      }
    };

    const handleMouseLeave = () => {
      mouseX = 0.5;
      mouseY = 0.5;
      isMouseOver = false;
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    rafId = requestAnimationFrame(animate);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const linkClassName = cn(
    'group relative flex items-center gap-2 h-full',
    'pointer-events-auto',
    'py-1 px-2 rounded-sm',
    'transition-all duration-200 ease-out',
    'hover:scale-105 hover:bg-surface-2 hover:text-accent',
    'bg-background text-text-main',
  );

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        'group relative flex flex-col gap-2 h-full',
        'border border-border rounded shadow-sm hover:shadow-lg',
      )}
    >
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={150}
        inactiveZone={0.01}
        borderWidth={2}
      ></GlowingEffect>
      <a
        role="link"
        href={href}
        target="_blank"
        aria-label={`${title}`}
        rel="noopener"
      >
        <div className={cn('w-full aspect-[4/3] rounded')}>
          <picture>
            <source
              height="1200"
              width="1600"
              srcSet={`/assets/projects/${image}`}
              media="(min-width: 800px)"
            />
            <img
              height="450"
              width="600"
              alt={`${title} demo`}
              src={`/assets/projects/${image}`}
            />
          </picture>
        </div>
      </a>

      <a
        role="link"
        href={href}
        target="_blank"
        aria-label={`${title}`}
        rel="noopener"
      >
        <div
          className={cn(
            'absolute top-0 left-0 w-full h-full z-30',
            'rounded-lg',
            'transition-opacity duration-200 ease-out',
            'group-hover:opacity-100 opacity-0',
            'group-hover:backdrop-blur-sm',
            'group-hover:backdrop-saturate-150',
            'group-hover:backdrop-brightness-50',
            'bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.7)_100%)]',
          )}
        ></div>
      </a>

      <div
        className={cn(
          'absolute top-0 left-0 w-full h-full z-40',
          'flex flex-col gap-2 justify-between pointer-events-none',
          'p-4',
        )}
      >
        <a
          role="link"
          href={href}
          target="_blank"
          aria-label={`${title}`}
          rel="noopener"
          className="contents"
        >
          <div className={cn('')}>
            <div
              className={cn(
                'flex flex-wrap justify-between gap-1 items-center',
              )}
            >
              <h3 className="text-lg font-bold bg-background px-2 rounded-md">
                {title}
              </h3>
              <span>{date.getFullYear()}</span>
            </div>
            <span className="text-text-sub px-2 bg-background rounded-md">
              {subtitle ?? ''}
            </span>
          </div>

          <div
            className={cn(
              'flex flex-col gap-2 mt-auto',
              'max-h-full overflow-y-auto',
              'opacity-0',
              'group-hover:opacity-100 transition-opacity duration-200 ease-out',
            )}
          >
            {description && <>{description}</>}
          </div>
        </a>

        <div className={cn('mt-auto py-4')}>
          <div className={cn('flex gap-2 mt-auto')}>
            {live && (
              <a
                target="_blank"
                href={live}
                aria-label={`Live version link`}
                rel="noopener"
                className={linkClassName}
              >
                Live{' '}
                <ExternalLinkIcon
                  className="h-4 w-4"
                  suppressHydrationWarning
                />
              </a>
            )}
            {github && (
              <a
                target="_blank"
                href={github}
                aria-label={`Github link`}
                rel="noopener"
                className={linkClassName}
              >
                Github{' '}
                <ExternalLinkIcon
                  className="h-4 w-4"
                  suppressHydrationWarning
                />
              </a>
            )}
            {sandbox && (
              <a
                target="_blank"
                href={sandbox}
                aria-label={`Sandbox link`}
                rel="noopener"
                className={linkClassName}
              >
                Sandbox{' '}
                <ExternalLinkIcon
                  className="h-4 w-4"
                  suppressHydrationWarning
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
