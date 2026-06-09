const FROM = 320;
const TO = 450;

async function getTitle(regionId) {
  const url =
    `https://www.lowpressure.co.uk/surftravelplanner/region.aspx?region=${regionId}`;

  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    const html = await res.text();

    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);

    return {
      regionId,
      status: res.status,
      finalUrl: res.url,
      title: titleMatch?.[1]?.replace(/\s+/g, ' ').trim() ?? '(no title)',
    };
  } catch (err) {
    return {
      regionId,
      status: 'ERROR',
      finalUrl: '',
      title: err.message,
    };
  }
}

async function main() {
  console.log('region,status,title,finalUrl');

  for (let i = FROM; i <= TO; i++) {
    const result = await getTitle(i);

    console.log(
      `${result.regionId},${result.status},"${result.title.replaceAll('"', '""')}","${result.finalUrl}"`
    );
  }
}

main();