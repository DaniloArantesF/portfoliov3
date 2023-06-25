import type { PayloadCollection } from './types';
import qs from 'qs';
import type { Project } from './payload-types';
import dotenv from 'dotenv';
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
