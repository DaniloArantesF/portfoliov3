import { getEntry, type CollectionEntry } from 'astro:content';

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
  if (!file.data.live && !file.data.sandbox && !file.data.github)
    throw new Error(`Could not find project url for ${file.filePath}`);
  return file.data.live
    ? file.data.live
    : file.data.sandbox || file.data.github || '';
}

export async function getProjectBySlug(slug: string) {
  const entry = await getEntry('projects', slug);
  if (!entry) {
    return null;
  }
  return entry;
}
