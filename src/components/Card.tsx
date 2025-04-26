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

  return (
    <a
      role="link"
      href={href}
      target="_blank"
      aria-label={`${title}`}
      rel="noopener"
    >
      <div ref={cardRef} className={cn('relative flex flex-col gap-2 h-full')}>
        <div className={cn('w-full aspect-[4/3] rounded-lg overflow-hidden')}>
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

        <div className={cn('')}>
          <div className={cn('flex flex-wrap justify-between gap-1')}>
            <h3>{title}</h3>
            <span>{date.getFullYear()}</span>
          </div>

          <span>{subtitle ?? ''}</span>
        </div>

        <div className={cn('flex flex-col gap-2')}>
          {description && <>{description}</>}
        </div>

        <div
          className={cn(
            'mt-auto py-4',
            'border-t border-[var(--color-text-sub)]',
          )}
        >
          <div className={cn('flex gap-2 mt-auto')}>
            {live && (
              <a
                target="_blank"
                href={live}
                aria-label={`Live version link`}
                rel="noopener"
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
              >
                Sandbox
              </a>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
