import type { MarkdownInstance } from 'astro';

export interface ProjectProps {
  description: string;
  featured: boolean;
  github?: string;
  lastUpdated: string;
  live?: string;
  image: string;
  sandbox?: string;
  subtitle: string;
  href?: string;
  slug?: string;
  // tags: Tag[];
  title: string;
  visibility?: 'visible' | 'hidden' | 'private';
  type?: 'project' | 'scene' | 'game';
}

export async function getLocalProjects(all = false) {
  // Hidden projects are only visible in production.
  // Show all if dev
  const visible = (status: string) =>
    (all || import.meta.env.DEV || status === 'visible') && status !== 'hidden';

  // Offsite projects are included from src/projects
  const projectsFiles = import.meta.glob<MarkdownInstance<ProjectProps>>(
    '/src/projects/*.md',
  );

  let projects = await Promise.all(
    Object.keys(projectsFiles).map(async (file) => await projectsFiles[file]()),
  );

  projects = projects.filter(({ frontmatter }) =>
    visible(frontmatter.visibility ?? ''),
  );

  // Demos are included here
  // Note: If a demo does not contain a readme it will not be listed
  const demoFiles = import.meta.glob<MarkdownInstance<ProjectProps>>(
    '/src/pages/projects/**/*.md',
  );
  let demos = await Promise.all(
    Object.keys(demoFiles).map(async (file) => await demoFiles[file]()),
  );

  demos = demos.filter(({ frontmatter }) =>
    visible(frontmatter.visibility ?? ''),
  );

  return [...projects, ...demos];
}
