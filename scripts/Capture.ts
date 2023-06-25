import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import type { AstroIntegration } from 'astro';
import * as Puppeteer from 'puppeteer';
import { getProjects } from '../src/api';
import type { Project } from '~/payload-types';

export function getProjectLink(project: Project, href = true) {
  return project.live
    ? project.live
    : project.codesandbox
    ? project.codesandbox
    : project.github ||
      `${!href && `http://localhost:3000/`}${
        project.type !== 'game' ? 'projects' : 'games'
      }/${project.slug}`;
}

dotenv.config();

const createIntegration = (): AstroIntegration => ({
  name: 'thumbnail',
  hooks: {
    'astro:build:done': async ({ dir, routes, pages }) => {
      console.log({ dir, routes, pages });
      // Cleanup old screenshots
      // cleanup();

      // TODO: Get all page urls
      // TODO: For each page, get the screenshot
      // TODO: Update cms media
    },
  },
});

class MediaCaptureManager {
  browser!: Puppeteer.Browser;

  constructor() {}

  async init() {
    this.browser = await Puppeteer.launch({ headless: false });
  }

  selectDevice(name: keyof typeof Puppeteer.KnownDevices) {
    return Puppeteer.KnownDevices[name];
  }

  // Captures a screenshot of a page and saves it to the specified file path
  async capture(url: string, filePath: string, device = 'Desktop') {
    const page = await this.browser.newPage();

    // Emulate device
    if (device && Object.keys(Puppeteer.KnownDevices).includes(device)) {
      await page.emulate(
        this.selectDevice(device as keyof typeof Puppeteer.KnownDevices),
      );
    }

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await page.screenshot({ path: filePath });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Failed to capture screenshot: ${error}`);
    } finally {
      await page.close();
    }
  }

  async shutdown() {
    await this.browser.close();
  }
}

function cleanup() {
  const postDir = path.resolve('src', 'posts');
  if (!fs.existsSync(postDir)) {
    return;
  }
  // const filePath = process.argv[1];
  const files = fs.readdirSync(postDir);

  for (const file of files) {
    fs.unlinkSync(path.join(postDir, file));
  }
}

// integration is being used as CLI

/**
 * Usage:
 *
 */
if (process.argv.length >= 2) {
  switch (process.argv[2]) {
    case 'capture':
      break;
    case 'clean':
      cleanup();
      break;
    default:
      (async () => {
        const manager = new MediaCaptureManager();

        const { docs: projects } = await getProjects();

        for (const project of projects) {
          const url = getProjectLink(project, false);
          const filePath = path.resolve(
            'public',
            'assets',
            'projects',
            `${project.slug}.png`,
          );

          await manager.init();
          await manager.capture(url, filePath);
          await manager.shutdown();
        }
      })();
  }
}

export default createIntegration;
