const fs = require('fs');
const path = require('path');

async function downloadAndExtract() {
  const logos = {
    GP: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Telenor_Logo.svg',
    Robi: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Axiata_logo.svg',
    Banglalink: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Banglalink_logo.svg',
    Airtel: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Airtel_logo.svg',
    Teletalk: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Teletalk_logo.svg'
  };

  const results = {};

  for (const [key, url] of Object.entries(logos)) {
    console.log(`Fetching ${key} from ${url}...`);
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let svgText = await res.text();
      
      // Remove xml tags and comments, extract SVG content
      svgText = svgText.replace(/<\?xml[\s\S]*?\?>/g, '');
      svgText = svgText.replace(/<!--[\s\S]*?-->/g, '');
      svgText = svgText.trim();
      
      results[key] = svgText;
      console.log(`Successfully fetched ${key}! Length: ${svgText.length}`);
    } catch (err) {
      console.error(`Failed to fetch ${key}:`, err.message);
    }
  }

  // Create OperatorLogos.tsx component
  let fileContent = `import React from 'react';

// Official High-Quality SVG Logos for Bangladeshi Telecom Operators
// Fetched directly from Wikimedia Commons sources for pixel-perfect official representation

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

`;

  for (const [key, svg] of Object.entries(results)) {
    // We want to transform the SVG string to be clean and usable in React.
    // Replace SVG element attributes so they can accept className and props cleanly.
    let cleanSvg = svg;
    
    // Remove style/class attributes inside the svg tag itself if they interfere, or keep them relative.
    // We want to replace <svg ...> with a customizable React wrapper.
    // Let's extract the inner contents of the SVG or clean the SVG tag.
    // A great way is to parse the viewBox and innerHTML.
    const viewBoxMatch = cleanSvg.match(/viewBox="([^"]+)"/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 100 100';
    
    // Extract everything between the first <svg ...> and the last </svg>
    const innerStart = cleanSvg.indexOf('>', cleanSvg.indexOf('<svg')) + 1;
    const innerEnd = cleanSvg.lastIndexOf('</svg>');
    let innerContent = cleanSvg.substring(innerStart, innerEnd).trim();
    
    // Convert attributes to camelCase for React compatibility
    innerContent = innerContent
      .replace(/fill-rule=/g, 'fillRule=')
      .replace(/stroke-width=/g, 'strokeWidth=')
      .replace(/stroke-linecap=/g, 'strokeLinecap=')
      .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
      .replace(/clip-rule=/g, 'clipRule=')
      .replace(/stop-color=/g, 'stopColor=')
      .replace(/stop-opacity=/g, 'stopOpacity=')
      .replace(/fill-opacity=/g, 'fillOpacity=')
      .replace(/stroke-miterlimit=/g, 'strokeMiterlimit=')
      .replace(/stroke-dasharray=/g, 'strokeDasharray=')
      .replace(/stroke-opacity=/g, 'strokeOpacity=')
      .replace(/enable-background=/g, 'enableBackground=')
      .replace(/xml:space=/g, 'xmlSpace=')
      .replace(/clip-path=/g, 'clipPath=')
      .replace(/class=/g, 'className=');

    fileContent += `export const ${key}Logo: React.FC<LogoProps> = ({ className, ...props }) => (
  <svg
    viewBox="${viewBox}"
    className={className}
    {...props}
  >
    ${innerContent}
  </svg>
);

`;
  }

  fs.writeFileSync(path.join(__dirname, 'src', 'components', 'OperatorLogos.tsx'), fileContent, 'utf8');
  console.log('Successfully generated OperatorLogos.tsx!');
}

downloadAndExtract();
