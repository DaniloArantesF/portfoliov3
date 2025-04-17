import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import styles from './Card.module.scss';
import type { ProjectProps } from '~/lib/projects';

const GithubIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.icon}
  >
    <path
      d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.84 21.49C9.34 21.581 9.52 21.272 9.52 21.007C9.52 20.769 9.512 20.004 9.508 19.128C6.726 19.756 6.14 17.786 6.14 17.786C5.684 16.647 5.027 16.339 5.027 16.339C4.121 15.691 5.096 15.703 5.096 15.703C6.102 15.772 6.634 16.762 6.634 16.762C7.534 18.268 8.972 17.832 9.54 17.577C9.629 16.898 9.889 16.462 10.175 16.219C7.954 15.972 5.62 15.137 5.62 11.285C5.62 10.201 6.01 9.316 6.654 8.625C6.553 8.374 6.209 7.379 6.751 6.041C6.751 6.041 7.598 5.773 9.496 7.031C10.294 6.811 11.152 6.701 12.006 6.697C12.858 6.701 13.716 6.811 14.516 7.031C16.412 5.773 17.256 6.041 17.256 6.041C17.8 7.379 17.456 8.374 17.355 8.625C18.001 9.316 18.387 10.201 18.387 11.285C18.387 15.149 16.049 15.969 13.821 16.21C14.172 16.51 14.49 17.105 14.49 18.016C14.49 19.318 14.474 20.677 14.474 21.007C14.474 21.275 14.652 21.587 15.161 21.489C19.137 20.165 22 16.418 22 12C22 6.477 17.523 2 12 2Z"
      fill="currentColor"
    />
  </svg>
);

const LiveIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.icon}
  >
    <path
      d="M15.536 12.9996L10.0429 18.4996C9.74858 18.794 9.74858 19.2686 10.0429 19.563C10.3373 19.8574 10.8119 19.8574 11.1063 19.563L17.2563 13.413C17.5507 13.1185 17.5507 12.644 17.2563 12.3496L11.1063 6.1996C10.8119 5.90517 10.3373 5.90517 10.0429 6.1996C9.74858 6.49403 9.74858 6.96859 10.0429 7.26302L15.536 12.9996Z"
      fill="currentColor"
    />
    <path
      d="M7.53553 12.9996L2.04245 18.4996C1.74802 18.794 1.74802 19.2686 2.04245 19.563C2.33688 19.8574 2.81145 19.8574 3.10587 19.563L9.25587 13.413C9.5503 13.1185 9.5503 12.644 9.25587 12.3496L3.10587 6.1996C2.81145 5.90517 2.33688 5.90517 2.04245 6.1996C1.74802 6.49403 1.74802 6.96859 2.04245 7.26302L7.53553 12.9996Z"
      fill="currentColor"
    />
  </svg>
);

const SandboxIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={styles.icon}
  >
    <path
      d="M20.9991 7.46V16.53C20.9991 16.92 20.8091 17.29 20.5091 17.47L12.5691 21.93C12.3991 22.02 12.1991 22.06 11.9991 22.06C11.7991 22.06 11.5991 22.02 11.4291 21.93L3.48909 17.47C3.18909 17.29 2.99909 16.92 2.99909 16.53V7.46C2.99909 7.07 3.18909 6.7 3.48909 6.52L11.4291 2.06C11.7691 1.87 12.2291 1.87 12.5691 2.06L20.5091 6.52C20.8091 6.7 20.9991 7.07 20.9991 7.46Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 22V12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 12L3 6.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20.9993 6.5L12 12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.5 4.21L16.5 9.28"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export interface CardProps {
  project: ProjectProps;
  priority?: boolean;
}

export const ProjectCard: React.FC<CardProps> = ({
  project,
  priority = false,
}) => {
  const {
    title,
    subtitle,
    description,
    tags,
    github,
    live,
    sandbox,
    featured,
    type,
    lastUpdated,
  } = project;

  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(
      cardRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
    );

    const card = cardRef.current;
    let rafId: number | null = null;
    let mouseX = 0,
      mouseY = 0;
    let currentRotateX = 0,
      currentRotateY = 0;
    const maxRotate = 5;
    const lerpFactor = 0.15;

    const animate = () => {
      const targetRotateX = (mouseY - 0.5) * maxRotate;
      const targetRotateY = (0.5 - mouseX) * maxRotate;

      currentRotateX += (targetRotateX - currentRotateX) * lerpFactor;
      currentRotateY += (targetRotateY - currentRotateY) * lerpFactor;

      gsap.set(card, {
        rotateX: currentRotateX,
        rotateY: currentRotateY,
        transformPerspective: 1000,
        transformOrigin: 'center center',
      });

      if (glowRef.current) {
        const rect = card.getBoundingClientRect();
        const glowX = mouseX * rect.width;
        const glowY = mouseY * rect.height;

        gsap.set(glowRef.current, {
          x: glowX - 150,
          y: glowY - 150,
          opacity: 0.25,
        });
      }

      // Continue animation loop
      rafId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!card) return;

      const rect = card.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = (e.clientY - rect.top) / rect.height;

      if (rafId === null) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const handleMouseEnter = () => {
      // Show description
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      if (rafId === null) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const handleMouseLeave = () => {
      if (!card) return;

      if (contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 0,
          y: 10,
          duration: 0.3,
          ease: 'power2.out',
        });
      }

      mouseX = 0.5;
      mouseY = 0.5;

      setTimeout(() => {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }

        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'power2.out',
          onComplete: () => {
            currentRotateX = 0;
            currentRotateY = 0;
          },
        });

        if (glowRef.current) {
          gsap.to(glowRef.current, {
            opacity: 0,
            duration: 0.3,
          });
        }
      }, 100);
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.card} ${featured ? styles.featured : ''}`}
    >
      <div ref={glowRef} className={styles.glow}></div>

      <div className={styles.cardInner}>
        <div className={styles.imageContainer} ref={imageRef}>
          {project.image && (
            <div className={styles.imageWrapper}>
              <img
                src={
                  project.image
                    ? `/assets/projects/${project.image}`
                    : `/assets/${project.href}.webp`
                }
                alt={`${title} preview`}
                className={styles.image}
                loading={priority ? 'eager' : 'lazy'}
              />

              <div className={styles.imageOverlay}>
                <div className={styles.titleWrapper}>
                  <h3 className={styles.title}>{title}</h3>
                  <p className={styles.subtitle}>{subtitle}</p>
                </div>

                <div className={styles.badgeContainer}>
                  {type && <span className={styles.type}>{type}</span>}
                  {featured && (
                    <span className={styles.featuredBadge}>Featured</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.content} ref={contentRef}>
          <p className={styles.description}>{description}</p>

          <div className={styles.tagsContainer} ref={tagsRef}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>

          <div className={styles.metaLinksContainer}>
            <div className={styles.meta}>
              <span className={styles.date}>
                Updated: {formatDate(lastUpdated)}
              </span>
            </div>

            <div className={styles.links} ref={linksRef}>
              {github && (
                <a
                  href={github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                  aria-label="View GitHub repository"
                >
                  <GithubIcon />
                  <span>GitHub</span>
                </a>
              )}

              {live && (
                <a
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                  aria-label="View live site"
                >
                  <LiveIcon />
                  <span>Live</span>
                </a>
              )}

              {sandbox && (
                <a
                  href={sandbox}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                  aria-label="View in sandbox"
                >
                  <SandboxIcon />
                  <span>Sandbox</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
