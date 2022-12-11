import {
  BaseSyntheticEvent,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import tagsMap, { Tag } from '../utils/tags';
import gsap from 'gsap';
import '../styles/card.scss';

export interface Props {
  title: string;
  picture: string;
  subtitle?: string;
  href: string;
  date?: string | number;
  description?: string;
  tags: string[];
  live?: string;
  github?: string;
  sandbox?: string;
}

export function useGsapContext(scope?: string | object | Element) {
  const ctx = useMemo(() => gsap.context(() => {}, scope), [scope]);
  return ctx;
}

export default function Card({
  title,
  subtitle,
  href,
  picture,
  date,
  description,
  tags,
  live,
  github,
  sandbox,
}: Props) {
  const [tagsData, setTagsData] = useState<Tag[]>(
    tags?.map((t) => {
      return t in tagsMap
        ? tagsMap[t as keyof typeof tagsMap]
        : { title: '', href: '' };
    }),
  );
  const cardRef = useRef(null);
  const ctx = useGsapContext(cardRef);

  useLayoutEffect(() => {
    return () => ctx.current.revert(); // cleanup
  }, []);

  function onHover({ currentTarget }: BaseSyntheticEvent) {
    const footerHeight =
      currentTarget.querySelector('.card_footer').clientHeight;
    ctx.add(() => {
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

    ctx.add(() => {
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
              srcSet={`/assets/${picture} `}
              media="(min-width: 800px)"
            />
            <img
              height="450"
              width="600"
              alt={`${title} demo`}
              src={`/assets/${
                picture.split('.')[0] + '-sm.' + picture.split('.')[1]
              }`}
            />
          </picture>
        </div>
        <div className={`card_body ${description ? 'with_description' : ''}`}>
          <div className="body_title">
            <h3>{title}</h3>
            <span>{date}</span>
          </div>
          <span>{subtitle ?? ''}</span>
        </div>
      </a>
      <div className="description">{description && <p>{description}</p>}</div>
      <div className="card_footer">
        <div className="tags">
          {tagsData &&
            tagsData.map(
              ({ title, href }) =>
                title && (
                  <a
                    key={title}
                    target="_blank"
                    role="link"
                    href={href}
                    aria-label={`${title}`}
                    rel="noopener"
                    className="tag"
                  >
                    {title}
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
        </div>
      </div>
    </div>
  );
}
