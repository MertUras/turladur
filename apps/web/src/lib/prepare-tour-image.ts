/**
 * Client-side center-crop + resize before tour image upload.
 * Shrinks payload so tour cards load faster with many images on a page.
 */

export type PrepareTourImageOptions = {
  /** width / height — cover cards use 16/10 */
  aspectRatio?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  outputType?: 'image/jpeg' | 'image/webp';
};

const COVER_DEFAULTS: Required<PrepareTourImageOptions> = {
  aspectRatio: 16 / 10,
  maxWidth: 1600,
  maxHeight: 1000,
  quality: 0.82,
  outputType: 'image/jpeg',
};

const GALLERY_DEFAULTS: Required<PrepareTourImageOptions> = {
  aspectRatio: 16 / 10,
  maxWidth: 1200,
  maxHeight: 750,
  quality: 0.8,
  outputType: 'image/jpeg',
};

export const TOUR_COVER_IMAGE_OPTIONS = COVER_DEFAULTS;
export const TOUR_GALLERY_IMAGE_OPTIONS = GALLERY_DEFAULTS;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Görsel okunamadı'));
    };
    image.src = url;
  });
}

function extensionForMime(mime: string): string {
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/png') return 'png';
  return 'jpg';
}

/**
 * Center-crop to aspect ratio, downscale, encode as JPEG/WebP.
 * Non-image files are returned unchanged.
 */
export async function prepareTourImageFile(
  file: File,
  options: PrepareTourImageOptions = COVER_DEFAULTS,
): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  const opts = { ...COVER_DEFAULTS, ...options };
  const image = await loadImage(file);
  const srcW = image.naturalWidth || image.width;
  const srcH = image.naturalHeight || image.height;
  if (!srcW || !srcH) return file;

  const targetAspect = opts.aspectRatio;
  let cropW = srcW;
  let cropH = srcH;
  let cropX = 0;
  let cropY = 0;

  const srcAspect = srcW / srcH;
  if (srcAspect > targetAspect) {
    cropW = Math.round(srcH * targetAspect);
    cropX = Math.round((srcW - cropW) / 2);
  } else if (srcAspect < targetAspect) {
    cropH = Math.round(srcW / targetAspect);
    cropY = Math.round((srcH - cropH) / 2);
  }

  let outW = cropW;
  let outH = cropH;
  if (outW > opts.maxWidth) {
    outW = opts.maxWidth;
    outH = Math.round(outW / targetAspect);
  }
  if (outH > opts.maxHeight) {
    outH = opts.maxHeight;
    outW = Math.round(outH * targetAspect);
  }

  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;

  ctx.drawImage(image, cropX, cropY, cropW, cropH, 0, 0, outW, outH);

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), opts.outputType, opts.quality);
  });
  if (!blob) return file;

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'tour-image';
  const nextName = `${baseName}.${extensionForMime(opts.outputType)}`;
  return new File([blob], nextName, {
    type: opts.outputType,
    lastModified: Date.now(),
  });
}
