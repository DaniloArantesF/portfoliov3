import { useRef } from 'react';

import type { CollectionEntry } from 'astro:content';
import { cn } from '~/utils/utils';

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
  const cardRef = useRef(null);
  const linkClassName = cn(
    'group relative flex flex-col gap-2 h-full py-1 px-2 rounded-sm',
    'transition-transform duration-200 ease-out',
    'hover:scale-[1.02]',
    'bg-background',
  );

  return (
    <a
      role="link"
      href={href}
      target="_blank"
      aria-label={`${title}`}
      rel="noopener"
    >
      <div
        ref={cardRef}
        className={cn(
          'group relative flex flex-col gap-2 h-full',
          'border border-border rounded shadow-sm ,hover:shadow-lg',
          'overflow-hidden',
        )}
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
        <div
          className={cn(
            'absolute top-0 left-0 w-full h-full z-40',
            'flex flex-col gap-2 justify-between',
            'p-4',
          )}
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

          <div
            className={cn(
              'mt-auto py-4',
              // 'border-t border-[var(--color-text-sub)]',
            )}
          >
            <div className={cn('flex gap-2 mt-auto')}>
              {live && (
                <a
                  target="_blank"
                  href={live}
                  aria-label={`Live version link`}
                  rel="noopener"
                  className={linkClassName}
                >
                  Live
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
                  Github
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
                  Sandbox
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}
