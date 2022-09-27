import { Client } from '@notionhq/client';
import { NotionToMarkdown } from 'notion-to-md';
import throttledQueue from 'throttled-queue';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
const DEBUG = true;
dotenv.config();

const databaseId = process.env.DATABASE_ID;
const notion = new Client({
  auth: process.env.NOTION_KEY,
});
const n2m = new NotionToMarkdown({ notionClient: notion });
const throttle = throttledQueue(2, 1000);

const parsePageProperties = (page) => ({
  title: page.properties['title'].title[0].plain_text,
  slug: page.properties['slug'].rich_text[0].plain_text,
  lastUpdated: page.last_edited_time,
  createdAt: page.created_time,
});

// Returns an array of page ids
async function getDatabasePageIds() {
  const pages = [];
  let cursor = undefined;
  while (true) {
    const { results, next_cursor } = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
    });
    pages.push(...results);
    if (!next_cursor) {
      break;
    }
    cursor = next_cursor;
  }
  return pages.map((p) => p.id);
}

async function fetchPages() {
  const startTime = Date.now();

  // Get all pages
  const pages = await getDatabasePageIds();

  // For each page, get property values and convert blocks to md
  const promises = pages.map((pageId) =>
    throttle(async () => {
      const pageData = await notion.pages.retrieve({ page_id: pageId });
      const mdblocks = await n2m.pageToMarkdown(pageId);
      const mdString = n2m.toMarkdownString(mdblocks);

      // Construct frontmatter
      const properties = parsePageProperties(pageData);
      const frontmatter =
        Object.entries(properties).reduce(
          (prev, [key, value]) => prev + `${key}: ${value}\n`,
          '---\n',
        ) + '---\n';

      // Add frontmatter to md
      const fileContents = `${frontmatter}
    ${mdString}
    `;

      // write to file
      fs.writeFile(`./src/posts/${properties.slug}.md`, fileContents, (err) => {
        err && console.error(err);
      });
    }),
  );

  await Promise.all(promises);
  const timeElapsed = Date.now() - startTime;
  if (DEBUG) console.log(`Finished saving posts. ${timeElapsed / 1000}s`);
}

function cleanup() {
  // const filePath = process.argv[1];
  const postDir = path.resolve('src', 'posts');
  const files = fs.readdirSync(postDir);

  for (const file of files) {
    fs.unlinkSync(path.join(postDir, file));
  }
}

// Integrations factory function
const createNotionIntegration = () => {
  return {
    name: 'notion',
    hooks: {
      'astro:config:setup': async ({ command }) => {
        if (command === 'build') {
          // Cleanup folder
          cleanup();

          // Fetch and write pages to src/posts/
          await fetchPages();
        }
      },
    },
  };
};

// integration is being used as CLI
if (process.argv.length > 2) {
  switch (process.argv[2]) {
    case 'pull':
      (async () => await fetchPages())();
      break;
    case 'clean':
      cleanup();
      break;
  }
}

export default createNotionIntegration;
