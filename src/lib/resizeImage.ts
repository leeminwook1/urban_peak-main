/**
 * 이미지를 최대 크기로 리사이징하고 WebP로 변환
 * @param file 원본 파일
 * @param maxWidth 최대 너비 (기본 1920px)
 * @param maxHeight 최대 높이 (기본 1080px)
 * @param quality 품질 0~1 (기본 0.85)
 */
export async function resizeImage(
  file: File,
  maxWidth = 1920,
  maxHeight = 1080,
  quality = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // 리사이징 필요 없으면 원본 반환
      if (width <= maxWidth && height <= maxHeight) {
        resolve(file);
        return;
      }

      // 비율 유지하며 축소
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(file); return; }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) { resolve(file); return; }
          const resized = new File(
            [blob],
            file.name.replace(/\.[^.]+$/, '.jpg'),
            { type: 'image/jpeg' }
          );
          resolve(resized);
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}
