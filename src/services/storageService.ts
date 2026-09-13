/**
 * Compresses an image File or Blob to a lightweight square thumbnail data URL
 * suitable for direct storage in Google Sheets or local storage (~15-40KB).
 */
export async function uploadSiteImage(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        const targetSize = 240; // High crispness for 1:1 square cards
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        // Center crop math (object-fit: cover)
        const minDim = Math.min(img.width, img.height);
        const startX = (img.width - minDim) / 2;
        const startY = (img.height - minDim) / 2;

        ctx.drawImage(
          img,
          startX,
          startY,
          minDim,
          minDim,
          0,
          0,
          targetSize,
          targetSize
        );

        // Convert to high-efficiency WebP or JPEG
        const compressedDataUrl = canvas.toDataURL('image/webp', 0.85);
        resolve(compressedDataUrl);
      };
      img.onerror = () => {
        resolve(readerEvent.target?.result as string);
      };
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Non-blocking image delete placeholder for Google Sheets
 */
export async function deleteSiteImage(_imageUrl: string | null): Promise<void> {
  // In Google Sheets mode, image data is stored directly in the sheet row,
  // so deleting the row automatically removes the image.
  return Promise.resolve();
}
