// find-sa-regions.js

const START = 150;
const END = 450;

const KEYWORDS = [
  'south africa',
  'cape town',
  'jeffreys bay',
  'j-bay',
  'durban',
  'port elizabeth',
  'gqeberha',
  'st francis',
  'cape st francis',
  'eastern cape',
  'western cape',
  'kwa-zulu',
  'kwazulu',
  'seal point',
  'supertubes',
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkRegion(regionId) {
  const url =
    `https://web.archive.org/web/20220630044836/https://www.lowpressure.co.uk/surftravelplanner/region.aspx?region=${regionId}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!res.ok) return;

    const html = (await res.text()).toLowerCase();

    const matches = KEYWORDS.filter(keyword =>
      html.includes(keyword.toLowerCase())
    );

    if (matches.length > 0) {
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);

      console.log(
        `FOUND region=${regionId}`,
        '\n title:',
        titleMatch?.[1] ?? '(no title)',
        '\n matches:',
        matches.join(', '),
        '\n'
      );
    }
  } catch (err) {
    console.error(`region=${regionId}`, err.message);
  }
}

async function main() {
  for (let i = START; i <= END; i++) {
    process.stdout.write(`Checking ${i}\r`);

    await checkRegion(i);

    // evita irritar o Wayback
    await sleep(250);
  }
}

main();