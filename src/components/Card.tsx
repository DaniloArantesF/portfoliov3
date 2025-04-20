import { type BaseSyntheticEvent, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import '../styles/card.scss';
import type { Project, Tag } from 'src/payload-types';
import { useIsomorphicLayoutEffect } from '@lib/hooks/useIsomorphicLayoutEffect';

import RichText from './RichText';
import type { ProjectProps } from '~/lib/projects';
import type { CollectionEntry } from 'astro:content';

export type CardProps = CollectionEntry<'projects'>['data'] & {
  slug: string;
  href: string;
};

export function useGsapContext(scope?: string | object | Element) {
  const ctx = useMemo(
    () => (gsap.context ? gsap.context(() => {}, scope) : null),
    [scope],
  );
  return ctx;
}

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
  const [tagsData, setTagsData] = useState<Tag[]>([]);
  const cardRef = useRef(null);
  const ctx = useGsapContext(cardRef);

  useIsomorphicLayoutEffect(() => {
    return () => ctx?.current?.revert(); // cleanup
  }, []);

  function onHover({ currentTarget }: BaseSyntheticEvent) {
    const footerHeight =
      currentTarget.querySelector('.card_footer').clientHeight;
    ctx?.add(() => {
      gsap.to(currentTarget, { y: -8, duration: 0.1 });
      gsap.to('.tag', { y: footerHeight, opacity: 0, duration: 0.1 });
      gsap.fromTo(
        '.links a',
        { y: -1 * footerHeight },
        { y: 0, opacity: 1, duration: 0.1 },
      );
    });
  }

  function onLeave({ currentTarget }: BaseSyntheticEvent) {
    const footerHeight =
      currentTarget.querySelector('.card_footer').clientHeight;

    ctx?.add(() => {
      if (!document.querySelectorAll('.links').length) return;
      gsap.to(currentTarget, { y: 0, duration: 0.1 });
      gsap.to('.tag', { y: 0, opacity: 1, duration: 0.1 });
      gsap.to('.links a', { y: -1 * footerHeight, opacity: 0, duration: 0.1 });
    });
  }

  return (
    <div
      ref={cardRef}
      className="card"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <a
        role="link"
        href={href}
        target="_blank"
        aria-label={`${title}`}
        rel="noopener"
      >
        <div className="picture">
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
        <div className={`card_body ${description ? 'with_description' : ''}`}>
          <div className="body_title">
            <h3>{title}</h3>
            <span>{date.toString()}</span>
          </div>
          <span>{subtitle ?? ''}</span>
        </div>
      </a>
      <div className="description">
        {description && (
          <>
            {typeof description === 'string' ? (
              description
            ) : (
              <RichText content={description} />
            )}
          </>
        )}
      </div>
      <div className="card_footer">
        <div className="tags">
          {tagsData &&
            tagsData.map(
              ({ label: tagTitle, url: tagHref }) =>
                title && (
                  <a
                    key={tagTitle}
                    target="_blank"
                    role="link"
                    href={tagHref}
                    aria-label={`${tagTitle}`}
                    rel="noopener"
                    className="tag"
                  >
                    {tagTitle}
                  </a>
                ),
            )}
        </div>
        <div className="links">
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
          {/* supress gsap warnings */}
          <a />
        </div>
      </div>
    </div>
  );
}
