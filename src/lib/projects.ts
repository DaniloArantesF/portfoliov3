import type { MarkdownInstance } from 'astro';
import type { CollectionEntry } from 'astro:content';
import { error } from 'node_modules/astro/dist/core/logger/core';

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

/**
 * Extracts the slug of the folder containing a file
 * @param filepath
 */
export function extractSlugFromFilePath(filepath?: string) {
  if (!filepath) throw new Error('Invalid filepath');
  const lastSlashIndex = filepath.lastIndexOf('/');

  // No parent folder, return name of file instead
  if (lastSlashIndex === -1 || lastSlashIndex === 0) {
    return filepath.substring(
      lastSlashIndex === -1 ? 0 : 1,
      filepath.lastIndexOf('.'),
    );
  }

  const folderPath = filepath.substring(0, lastSlashIndex);
  const slug = folderPath.substring(folderPath.lastIndexOf('/') + 1);
  return slug;
}

export function getProjectUrl(file: CollectionEntry<'projects'>) {
  const pagesMatch = file.filePath?.match(/\/pages(\/.*?)\/[^/]*$/);
  if (pagesMatch && pagesMatch[1]) {
    return pagesMatch[1];
  }
  if (!file.data.live && !file.data.sandbox && !file.data.github) throw new Error(`Could not find project url for ${file.filePath}`);
  return file.data.live
    ? file.data.live
    : file.data.sandbox || file.data.github || "";
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
