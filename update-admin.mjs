import fs from 'fs';
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// State updates
code = code.replace(
  `const [settingsPromoBanners, setSettingsPromoBanners] = useState<PromoBanner[]>(settings.promoBanners || []);`,
  `const [settingsPromoBanners, setSettingsPromoBanners] = useState<PromoBanner[]>(settings.promoBanners || []);
  const [settingsTopBannerImage, setSettingsTopBannerImage] = useState<string>(settings.topBannerImage || '');
  const [settingsOfferBanners, setSettingsOfferBanners] = useState<string[]>(settings.offerBanners || []);
  const [newTopBannerUrl, setNewTopBannerUrl] = useState('');
  const [newOfferBannerUrl, setNewOfferBannerUrl] = useState('');`
);

code = code.replace(
  `setSettingsPromoBanners(settings.promoBanners || []);`,
  `setSettingsPromoBanners(settings.promoBanners || []);
    setSettingsTopBannerImage(settings.topBannerImage || '');
    setSettingsOfferBanners(settings.offerBanners || []);`
);

code = code.replace(
  `promoBanners: settingsPromoBanners,`,
  `promoBanners: settingsPromoBanners,
    topBannerImage: settingsTopBannerImage,
    offerBanners: settingsOfferBanners,`
);

// Add unified compression helper right before handleBannerFileUpload
code = code.replace(
  `const handleBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {`,
  `const compressImages = async (files: File[]): Promise<string[]> => {
    const newCompressedImages: string[] = [];
    for (const file of files) {
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 480;
            let width = img.width;
            let height = img.height;
            canvas.width = MAX_WIDTH;
            canvas.height = MAX_HEIGHT;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              const imgAspect = width / height;
              const targetAspect = MAX_WIDTH / MAX_HEIGHT;
              let sourceX = 0, sourceY = 0, sourceWidth = width, sourceHeight = height;
              if (imgAspect > targetAspect) {
                sourceWidth = height * targetAspect;
                sourceX = (width - sourceWidth) / 2;
              } else {
                sourceHeight = width / targetAspect;
                sourceY = (height - sourceHeight) / 2;
              }
              ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, MAX_WIDTH, MAX_HEIGHT);
              newCompressedImages.push(canvas.toDataURL('image/jpeg', 0.70));
            }
            resolve();
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    }
    return newCompressedImages;
  };

  const handleTopBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;
    const compressed = await compressImages(validFiles);
    if (compressed.length > 0) {
      const img = compressed[0];
      setSettingsTopBannerImage(img);
      await onUpdateSettings({ ...getCurrentSettingsState(), topBannerImage: img });
    }
  };

  const handleOfferBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) return;
    const compressed = await compressImages(validFiles);
    if (compressed.length > 0) {
      const updated = [...settingsOfferBanners, ...compressed];
      setSettingsOfferBanners(updated);
      await onUpdateSettings({ ...getCurrentSettingsState(), offerBanners: updated });
    }
  };

  const handleBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {`
);

// Simplify handleBannerFileUpload
code = code.replace(
  `    const newCompressedImages: string[] = [];

    for (const file of validFiles) {
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            const MAX_HEIGHT = 480;
            let width = img.width;
            let height = img.height;

            canvas.width = MAX_WIDTH;
            canvas.height = MAX_HEIGHT;

            const ctx = canvas.getContext('2d');
            if (ctx) {
              const imgAspect = width / height;
              const targetAspect = MAX_WIDTH / MAX_HEIGHT;
              let sourceX = 0;
              let sourceY = 0;
              let sourceWidth = width;
              let sourceHeight = height;

              if (imgAspect > targetAspect) {
                sourceWidth = height * targetAspect;
                sourceX = (width - sourceWidth) / 2;
              } else {
                sourceHeight = width / targetAspect;
                sourceY = (height - sourceHeight) / 2;
              }

              ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, MAX_WIDTH, MAX_HEIGHT);
              const base64String = canvas.toDataURL('image/jpeg', 0.70);
              newCompressedImages.push(base64String);
            }
            resolve();
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    }`,
  `    const newCompressedImages = await compressImages(validFiles);`
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
