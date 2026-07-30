#!/usr/bin/env node
// Strips the raw sectNN.htm files (as scraped from the original site) down to
// just the section content, ready to feed into convertbook. Removes <head>,
// <header>, <footer>, <figure> (illustration wrappers, art is re-added by the
// engine), and the empty <p id="page-navigation"/> placeholder, keeping only
// what was inside <article>.
//
// Usage:
//   node scripts/clean-sections.mjs old-data/libro05

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dir = resolve(process.argv[2] ?? '.');
const files = readdirSync(dir).filter((f) => /^sect\d+\.htm$/.test(f));

if (files.length === 0) {
  console.error(`No sectNN.htm files found in ${dir}`);
  process.exit(1);
}

for (const file of files) {
  const path = join(dir, file);
  const html = readFileSync(path, 'utf8');

  const articleMatch = html.match(/<article>([\s\S]*?)<\/article>/);
  if (!articleMatch) {
    console.error(`No <article> found in ${file}, skipping`);
    continue;
  }

  const cleaned = articleMatch[1]
    .replace(/\s*<figure>[\s\S]*?<\/figure>\n?/g, '\n')
    .replace(/\s*<p id="page-navigation"\/>\n?/g, '\n')
    .trim() + '\n';

  writeFileSync(path, cleaned, 'utf8');
}

console.log(`Cleaned ${files.length} files in ${dir}`);
