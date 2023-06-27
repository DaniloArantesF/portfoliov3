import type { PayloadCollection } from './types';
import qs from 'qs';
import type { Project, Tag } from './payload-types';
import dotenv from 'dotenv';
import fs from 'fs';
import type { CardProps } from './components/Card';
dotenv.config();

async function apiFetch(url: string, options: any = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  return fetch(url, mergedOptions).then((res) => {
    if (res.ok) {
      return res.json();
    }
    throw new Error(
      `Error fetching page data: ${res.statusText} (${res.status})}`,
    );
  });
}

export async function getProjects(
  query: any = null,
): Promise<PayloadCollection<Project>> {
  const stringifiedQuery = qs.stringify(
    { limit: 99, ...query },
    { addQueryPrefix: true },
  );

  const url = import.meta?.env
    ? import.meta.env.PAYLOAD_URL
    : process.env.PAYLOAD_URL;
  const data = await apiFetch(`${url}/api/projects${stringifiedQuery}`);
  return data;
}

export async function uploadMedia(filePath: string): Promise<Project> {
  const formData = new FormData();
  const file = fs.readFileSync(filePath);
  formData.append('file', new Blob([file]), `file.png`);

  const url = import.meta?.env
    ? import.meta.env.PAYLOAD_URL
    : process.env.PAYLOAD_URL;
  const data = await apiFetch(`${url}/api/media`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });
  return data;
}

export function getCardData(projects: Project[]) {
  const data = [
    ...projects.map((project): CardProps => {
      const href = project.live
        ? project.live
        : project.codesandbox
        ? project.codesandbox
        : project.github ||
          `${project.type !== 'game' ? 'projects' : 'games'}/${project.slug}`;

      // fix this sin
      let tags: Tag[] = [];
      if (project.tags) {
        tags = (project.tags as Tag[]).filter((t) => typeof t === 'object');
      }

      return {
        title: project.title,
        subtitle: '',
        description: project.description,
        tags,
        image: project.image,
        github: project.github,
        live: project.live,
        sandbox: project?.codesandbox,
        href,
        date: project.publishedOn?.substring(
          0,
          project.publishedOn.indexOf('-'),
        ),
      };
    }),
  ];
  data.forEach((card) => {
    if (typeof card.image === 'object') {
      card.image.url = `${import.meta.env.PAYLOAD_URL}${card.image.url}`;
    }
  });
  return data;
}
