import { db } from '../db/database';
import type { Attachment } from '../types/models';

async function decode(file: Blob): Promise<ImageBitmap> {
  try { return await createImageBitmap(file, { imageOrientation: 'from-image' }); }
  catch { return await createImageBitmap(file); }
}

async function resize(file: Blob, maxSide: number, quality: number): Promise<{ blob: Blob; width: number; height: number }> {
  const image = await decode(file);
  const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  let blob: Blob;
  if (typeof OffscreenCanvas !== 'undefined') {
    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Не удалось подготовить фотографию');
    context.drawImage(image, 0, 0, width, height);
    blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
  } else {
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Не удалось подготовить фотографию');
    context.drawImage(image, 0, 0, width, height);
    blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error('Не удалось сжать фотографию')), 'image/jpeg', quality));
    canvas.width = 1; canvas.height = 1;
  }
  image.close();
  return { blob, width, height };
}

export async function savePhoto(file: File, keepOriginal = false): Promise<Attachment> {
  if (!file.type.startsWith('image/')) throw new Error('Выбранный файл не является изображением');
  const displaySettings = await db.settings.get('display');
  const shouldKeepOriginal = keepOriginal || Boolean((displaySettings?.value as { keepOriginals?: boolean } | undefined)?.keepOriginals);
  const [documentImage, thumb] = await Promise.all([resize(file, 2800, .88), resize(file, 420, .82)]);
  const attachment: Attachment = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), name: file.name || 'Фото.jpg', mimeType: 'image/jpeg', size: documentImage.blob.size, width: documentImage.width, height: documentImage.height, documentBlob: documentImage.blob, thumbnailBlob: thumb.blob, originalBlob: shouldKeepOriginal ? file : undefined };
  await db.attachments.put(attachment);
  return attachment;
}

export async function storageEstimate(): Promise<{ usage: number; quota: number; persisted?: boolean }> {
  const estimate = await navigator.storage?.estimate?.();
  const persisted = await navigator.storage?.persisted?.();
  return { usage: estimate?.usage ?? 0, quota: estimate?.quota ?? 0, persisted };
}

export const formatBytes = (value: number) => value < 1024 ** 2 ? `${Math.round(value / 1024)} КБ` : `${(value / 1024 ** 2).toFixed(1)} МБ`;
