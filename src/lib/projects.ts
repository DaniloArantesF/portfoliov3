// import CardList from '../components/CardList';
// import Layout from '../layouts/Layout.astro';
// import type { Tag } from '../payload-types';

// export interface ProjectProps {
//   description: string;
//   featured: boolean;
//   github?: string;
//   lastUpdated: string;
//   live?: string;
//   image: string;
//   sandbox?: string;
//   subtitle: string;
//   href?: string;
//   slug?: string;
//   tags: Tag[];
//   title: string;
//   visibility?: 'visible' | 'hidden' | 'private';
//   type?: 'project' | 'scene' | 'game';
// }

// export async function getLocalProjects(all = false) {
//   // Hidden projects are only visible in production.
//   // Show all if dev
//   const visible = (status: string) =>
//     (all || import.meta.env.DEV || status === 'visible') && status !== 'hidden';

//   // Offsite projects are included from src/projects
//   const projects = (
//     await Astro.glob<ProjectProps>('/src/projects/*.md')
//   ).filter(({ frontmatter }) => visible(frontmatter.visibility ?? ''));

//   // Demos are included here
//   // Note: If a demo does not contain a readme it will not be listed
//   const demos = (
//     await import.meta.glob<ProjectProps>('/src/pages/projects/**/*.md')
//   ).filter(({ frontmatter }) => visible(frontmatter.visibility ?? ''));

//   return [...projects, ...demos];
// }
