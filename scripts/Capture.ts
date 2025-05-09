import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import type { AstroIntegration } from 'astro';
import * as Puppeteer from 'puppeteer';
import { sleep } from '~/utils/utils';
import { getProjectUrl } from '~/lib/projects';
dotenv.config();


const createIntegration = (): AstroIntegration => ({
  name: 'thumbnail',
  hooks: {
    'astro:build:done': async ({ dir, routes, pages }) => {
      // console.log({ dir, routes, pages });
      // Cleanup old screenshots
      // cleanup();
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

      // Wait a few seconds
      await sleep(500);
      await this.removeUI(page);
      await page.screenshot({ path: filePath });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Failed to capture screenshot: ${error}`);
    } finally {
      await page.close();
    }
  }

  async removeUI(page: Puppeteer.Page) {
    await page.evaluate(() => {
      const player = document.querySelector('#audioPlayer-container');
      if (player) {
        player.remove();
      }

      const gui = document.querySelector('#gui_container');
      if (gui) {
        gui.remove();
      }
      const header = document.querySelector('header');
      if (header) {
        header.remove();
      }
    });
  }

  async shutdown() {
    await this.browser.close();
  }
}

function cleanup() {
  const postDir = path.resolve('media');
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
if (process.argv.length >= 2) {
  switch (process.argv[2]) {
    case 'update':
      (async () => {
        const manager = new MediaCaptureManager();
        const filePath = path.resolve(
          'public',
          'assets',
          'projects',
          `runner.png`,
        );

        // const { docs: projects } = await getProjects();
        const projects = [] as any[];
        for (const project of projects) {
          // TODO: test this
          // const data = await uploadMedia(filePath);
        }
      })();
      break;
    case 'clean':
      cleanup();
      break;
    default:
      (async () => {
        const manager = new MediaCaptureManager();
        // const { docs: projects } = await getProjects();
        let projects = [] as any[];

        const projectSlug = process.argv[2];
        if (projectSlug) {
          projects = projects.filter((p) => p.slug === projectSlug);
        }

        for (const project of projects) {
          let url = getProjectUrl(project);
          if (!url.startsWith('http')) {
            url = `${process.env.ASTRO_URL}/${url}`;
          }

          const filePath = path.resolve('media', `${project.slug}.webp`);

          await manager.init();
          await manager.capture(url, filePath);
          await manager.shutdown();
        }
      })();
  }
}

export default createIntegration;
