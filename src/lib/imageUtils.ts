export const compressImage = (base64Str: string, maxWidth = 1200, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let currentWidth = img.width;
      let currentHeight = img.height;
      let currentMaxWidth = maxWidth;
      let currentQuality = quality;

      const attemptCompression = (): string => {
        const canvas = document.createElement('canvas');
        let w = currentWidth;
        let h = currentHeight;

        if (w > currentMaxWidth) {
          h = Math.round((h * currentMaxWidth) / w);
          w = currentMaxWidth;
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        return canvas.toDataURL('image/jpeg', currentQuality);
      };

      let result = attemptCompression();
      
      // Keep result within safe bounds for Firestore (approx 900KB limit, which translates to ~900k chars of base64)
      let iterations = 0;
      while (result.length > 900000 && iterations < 5) {
        iterations++;
        currentMaxWidth = Math.round(currentMaxWidth * 0.75);
        currentQuality = Math.max(0.3, currentQuality - 0.15);
        result = attemptCompression();
      }

      resolve(result);
    };
    img.onerror = () => resolve(base64Str); // Fallback if error
  });
};
