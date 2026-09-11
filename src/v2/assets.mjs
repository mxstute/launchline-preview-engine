import path from 'node:path';
export const assetUrl = (record, asset) => `/assets/${record.slug}/${asset.file}`;
export const assetFile = (out, record, asset) => path.join(out, 'assets', record.slug, asset.file);
