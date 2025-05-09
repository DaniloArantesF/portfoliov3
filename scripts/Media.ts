import type { AstroIntegration } from 'astro';
import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
// import { getLocalProjects } from '~/pages/projects.astro';

/**
 *
 * @param url URL of the picture to be downloaded
 * @param refNumber Unique reference number for the product represented by this picture
 * @param parentDir Directory where the picture will be saved
 * @param fileType Filetype to be saved
 * @returns filepath
 */
export const downloadPicture = async (
  url: string,
  savePath: string,
  fileName: string,
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    const res = await fetch(url);
    const fileStream = fs.createWriteStream(`${savePath}/${fileName}`);
    if (!fs.existsSync(savePath)) {
      // Create Directory if it doesn't exist
      await fs.promises
        .mkdir(savePath, { recursive: true })
        // eslint-disable-next-line no-console
        .catch(console.error);
    }
    const pipe = promisify(pipeline);
    await pipe(res.body as any, fileStream);
    resolve(`${savePath}/${fileName}`);
  });
};

const createMediaIntegration = (): AstroIntegration => ({
  name: 'Media',
  hooks: {
    'astro:build:start': async () => {
      const projects = [] as any[]; //await getLocalProjects();
      for (const project of projects) {
        const projectDir = path.join('public', 'assets', 'projects');
        const pictureUrl = `${process.env.ASTRO_URL}/${project.image}`;
        if (!pictureUrl) {
          continue;
        }
        await downloadPicture(pictureUrl, projectDir, `${project.slug}.webp`);
      }
    },
  },
});

export default createMediaIntegration;
