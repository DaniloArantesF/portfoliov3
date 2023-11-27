import type { PayloadCollection } from './types';
import qs from 'qs';
import type { Project, Tag } from './payload-types';
import dotenv from 'dotenv';
import fs from 'fs';
import type { CardProps } from './components/Card';
import { ConsoleMessage } from 'puppeteer';
dotenv.config();

export function getProjectLink(project: Project, href = true) {
  const live = project.links?.find(({ source }) => source === 'custom')?.url;
  const github = project.links?.find(({ source }) => source === 'github')?.url;
  const codesandbox = project.links?.find(
    ({ source }) => source === 'codesandbox',
  )?.url;
  const codepen = project.links?.find(({ source }) => source === 'codepen')
    ?.url;

  return live
    ? live
    : codesandbox
      ? codesandbox
      : github ||
        `${project.type !== 'game' ? 'projects' : 'games'}/${project.slug}`;
}

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

  const url = import.meta?.env?.PAYLOAD_URL
    ? import.meta.env?.PAYLOAD_URL
    : process.env?.PAYLOAD_URL;
  const data = (await apiFetch(
    `${url}/api/projects${stringifiedQuery}`,
  )) as PayloadCollection<Project>;
  return data;
}

export async function getProject(slug: string): Promise<Project> {
  const url = import.meta?.env
    ? import.meta.env.PAYLOAD_URL
    : process.env.PAYLOAD_URL;

  const stringifiedQuery = qs.stringify(
    {
      where: {
        slug: { equals: slug },
      },
    },
    { addQueryPrefix: true },
  );

  const data = (await apiFetch(`${url}/api/projects${stringifiedQuery}`).catch(
  // eslint-disable-next-line no-console
    (e) => console.log(e),
  )) as PayloadCollection<Project>;
  return data?.docs[0];
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
      const live = project.links?.find(({ source }) => source === 'custom')
        ?.url;
      const github = project.links?.find(({ source }) => source === 'github')
        ?.url;
      const codesandbox = project.links?.find(
        ({ source }) => source === 'codesandbox',
      )?.url;
      const codepen = project.links?.find(({ source }) => source === 'codepen')
        ?.url;
      const href = getProjectLink(project);

      let tags: Tag[] = [];
      if (project.tags) {
        tags = (project.tags as Tag[]).filter((t) => typeof t === 'object');
      }

      return {
        slug: project.slug || '',
        title: project.title,
        subtitle: '',
        description: project.description,
        tags,
        image: project.image,
        github: github,
        live: live,
        sandbox: codesandbox,
        href,
        visibility: project.visible ? 'visible' : 'hidden',
        type: project.type ?? 'project',
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
  return data.sort(
    (a, b) =>
      parseInt((b.date as string) || '0') - parseInt((a.date as string) || '0'),
  );
}
