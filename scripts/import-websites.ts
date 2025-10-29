import { readFileSync } from 'fs';
import { parse } from 'csv-parse/sync';

const CSV_PATH = 'attached_assets/columns_A_B_only_no_source_1761556802113.csv';
const API_URL = 'http://localhost:5000/api/websites';

interface CSVRow {
  Name: string;
  URL: string;
}

function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

function cleanUrl(url: string): string {
  return url.trim().replace(/\n/g, '');
}

function cleanName(name: string): string {
  return name.trim().replace(/:$/, '');
}

async function importWebsites() {
  const fileContent = readFileSync(CSV_PATH, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  }) as CSVRow[];

  const websites: Array<{ name: string; url: string }> = [];
  const seen = new Set<string>();

  for (const record of records) {
    const name = cleanName(record.Name);
    let url = cleanUrl(record.URL);

    // Skip empty names or URLs
    if (!name || !url) continue;

    // Skip section headers
    if (url === 'DATABASE' || url === name) continue;

    // Handle duplicate URLs in same field (e.g., "urlurl")
    if (url.includes('https://') && url.lastIndexOf('https://') > 0) {
      url = url.substring(url.lastIndexOf('https://'));
    }

    // Validate URL
    if (!isValidUrl(url)) continue;

    // Avoid duplicates
    const key = `${name}|${url}`;
    if (seen.has(key)) continue;
    seen.add(key);

    websites.push({ name, url });
  }

  console.log(`Found ${websites.length} valid websites to import`);
  console.log('\nImporting websites...\n');

  let successCount = 0;
  let failCount = 0;

  for (const website of websites) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(website),
      });

      if (response.ok) {
        console.log(`✓ Added: ${website.name}`);
        successCount++;
      } else {
        const error = await response.text();
        console.log(`✗ Failed: ${website.name} - ${error}`);
        failCount++;
      }
    } catch (error) {
      console.log(`✗ Failed: ${website.name} - ${error}`);
      failCount++;
    }
  }

  console.log(`\n✓ Successfully imported: ${successCount}`);
  console.log(`✗ Failed: ${failCount}`);
  console.log(`Total: ${websites.length}`);
}

importWebsites().catch(console.error);
