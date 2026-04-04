const fs = require('fs');
const path = require('path');
const https = require('https');

const inputPath = 'C:/Users/Islam/.gemini/antigravity/brain/46d58d72-cda8-4c50-a4a2-227a8b19bf44/.system_generated/steps/59/output.txt';
const appDir = path.join(__dirname, 'app');

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function sanitizeName(title) {
  return title.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
}

async function run() {
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const links = [];

  for (const screen of data.screens) {
    if (screen.htmlCode && screen.htmlCode.downloadUrl) {
      console.log(`Downloading ${screen.title}...`);
      let html = await download(screen.htmlCode.downloadUrl);
      
      const routeName = sanitizeName(screen.title);
      const pageDir = path.join(appDir, routeName);
      if (!fs.existsSync(pageDir)) {
        fs.mkdirSync(pageDir, { recursive: true });
      }

      // Write HTML safely as a JSON encoded string
      const componentCode = `export default function Page() {
  return (
    <div dangerouslySetInnerHTML={{ __html: ${JSON.stringify(html)} }} />
  );
}`;

      fs.writeFileSync(path.join(pageDir, 'page.tsx'), componentCode);
      links.push({ title: screen.title, route: routeName });
      console.log(`Saved ${routeName}`);
    }
  }

  // Create an index page
  const indexCode = `import Link from 'next/link';

export default function Home() {
  const links = ${JSON.stringify(links, null, 2)};
  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-6">BidJobs Screens</h1>
      <ul className="space-y-2">
        {links.map((l: any) => (
          <li key={l.route}>
            <Link href={'/' + l.route} className="text-blue-600 hover:underline">
              {l.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}`;

  fs.writeFileSync(path.join(appDir, 'page.tsx'), indexCode);
  console.log('All done!');
}

run().catch(console.error);
