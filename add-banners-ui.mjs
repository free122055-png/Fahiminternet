import fs from 'fs';
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

const additionalUi = `
            {/* Top Banner */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">টপ ব্যানার (Top Banner)</h3>
                  <p className="text-sm text-slate-500 font-semibold">হোমপেজের একদম উপরের ব্যানার</p>
                </div>
              </div>
              <input type="file" accept="image/*" onChange={handleTopBannerFileUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              {settingsTopBannerImage && (
                <div className="relative group rounded-xl overflow-hidden border border-slate-200 mt-4 max-w-md">
                  <img src={settingsTopBannerImage} alt="Top Banner" className="w-full h-auto object-cover" />
                  <button onClick={async () => {
                    setSettingsTopBannerImage('');
                    await onUpdateSettings({ ...settings, topBannerImage: '' });
                  }} className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Trending Offer Banners */}
            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">ট্রেন্ডিং অফার ব্যানার (Trending)</h3>
                  <p className="text-sm text-slate-500 font-semibold">ট্রেন্ডিং অফার স্লাইডারের ব্যানারগুলো</p>
                </div>
              </div>
              <input type="file" accept="image/*" multiple onChange={handleOfferBannerFileUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
              {settingsOfferBanners.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {settingsOfferBanners.map((url, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200">
                      <img src={url} alt="Offer Banner" className="w-full h-32 object-cover" />
                      <button onClick={async () => {
                        const updated = settingsOfferBanners.filter((_, i) => i !== idx);
                        setSettingsOfferBanners(updated);
                        await onUpdateSettings({ ...settings, offerBanners: updated });
                      }} className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
`;

code = code.replace(
  `<div className="space-y-6 animate-fade-in">`,
  `<div className="space-y-6 animate-fade-in">` + additionalUi
);

fs.writeFileSync('src/components/AdminPanel.tsx', code);
