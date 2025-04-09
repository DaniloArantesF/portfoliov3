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
  tags: string[];
  title: string;
  visibility?: 'visible' | 'hidden' | 'private';
  type?: 'project' | 'scene' | 'game';
  credits: { label: string; href: string }[];
}

export function extractProjectSlugFromFilePath() {
  // Extract the last path preceding "/readme.md"
  const slugRegex = /\/[^/]+\/([^/]*)\/[^/]+$/;
}

export function getProjectUrl(file: MarkdownInstance<ProjectProps>) {
  const project = file.frontmatter;
  let url = file.url?.replace('/readme', '') ?? '';

  // Explicit url
  url = project.href || url;
  url = project.live || url;

  return url;
}

export async function loadMarkdownFiles<T extends Record<string, any>>(
  files: Record<string, () => Promise<MarkdownInstance<T>>>,
): Promise<MarkdownInstance<T>[]> {
  return (
    await Promise.all(
      Object.keys(files).map(async (file) => {
        return await files[file]();
      }),
    )
  ).flat();
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

  let projects = await loadMarkdownFiles<ProjectProps>(projectsFiles);
  projects = projects.filter(({ frontmatter }) =>
    visible(frontmatter.visibility ?? ''),
  );

  // Demos are included here
  // Note: If a demo does not contain a readme it will not be listed
  const demoFiles = import.meta.glob<MarkdownInstance<ProjectProps>>(
    '/src/pages/projects/**/*.md',
  );
  let demos = await loadMarkdownFiles<ProjectProps>(demoFiles);
  demos = demos.filter(({ frontmatter }) =>
    visible(frontmatter.visibility ?? ''),
  );

  return [...projects, ...demos];
}

export async function getLocalProject(slug: string) {
  const files = await getLocalProjects(true);
  return files.find((f) => f.frontmatter.slug === slug);
}
