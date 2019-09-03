import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as jsdom from 'jsdom';
import get from 'request-promise';
import * as child_process from 'child_process';
import * as argparse from 'argparse';

interface MirrorLink {
    label: string;
    link: string;
    hd: boolean;
    subbed: boolean;
}

function findMirrorLinks($: CheerioStatic): MirrorLink[] {
    return $('.collection-item').toArray()
        .map($).map(item => {
            const label: string = item.find('a').text();
            const link: string = item.find('a').attr('href');
            const hd: boolean = item.find('span:contains("HD")').length > 0;
            const subbed: boolean = item.find('span:contains("SUB")').length > 0;
            return {
                link: link,
                label: label,
                hd: hd,
                subbed: subbed
            };
        })
        .filter(link => link.link);
}

function extractVideoSourceUrl(loadScript: string): string {
    let callback: Function;
    let videoSource: string;
    const videojs = (elem: string, ops: any, cb: () => {}) => {
        callback = cb;
        return {
            src: (src: string) => {
                videoSource = src;
            },
            poster: () => { }
        };
    };
    const dom = new jsdom.JSDOM('<html></html>');
    const window = dom.window;
    const document = dom.window.document;
    const navigator = dom.window.navigator;

    try {
        eval(loadScript);
    } catch (e) { }
    callback();
    return videoSource;
}

async function downloadFromMirrorPage(mirrorUrl: string) {
    console.info("Processing mirror url:", mirrorUrl);
    let data = await get(mirrorUrl);
    let $ = cheerio.load(data);
    const embeddedIframe = $('iframe[src*="mp4upload"]').attr('src');

    data = await get(embeddedIframe);
    $ = cheerio.load(data);
    const loadScript = $('script:contains("eval")').html();
    return extractVideoSourceUrl(loadScript);
}

async function downloadFromEpisodePage(episodeUrl: string) {
    console.info(`Processing episode page: ${episodeUrl}`);

    const data = await get(episodeUrl);
    const $ = cheerio.load(data);
    const mirrorLinks = findMirrorLinks($);
    const lastHdLink = mirrorLinks
        .filter(l => l.hd)
        .filter(l => l.label.indexOf('MP4Upload') >= 0)
        .pop();

    const videoTitle = $('title').text().replace(' - NW Anime', '');
    const videoUrl = await downloadFromMirrorPage(lastHdLink.link);

    const fileName = `videos/${videoTitle}.mp4`;
    console.info('Downloading ', videoUrl, '->', fileName);
    child_process.spawnSync('curl', [videoUrl, '-o', fileName], {
        stdio: "inherit"
    });
}

async function downloadFromMainPage(mainUrl: string) {
    console.info(`Processing main page: ${mainUrl}`);

    const data = await get(mainUrl);
    const $ = cheerio.load(data);

    const links = $('a');
    const processed: Map<string, boolean> = new Map();
    for (let i = 0; i < links.length; i++) {
        const link = $(links[i]).attr('href');
        if (/.*\/watch\/.*/.test(link) && !processed.get(link)) {
            processed.set(link, true);
            await downloadFromEpisodePage(link);
        }
    }
}

let argParser = new argparse.ArgumentParser();
argParser.addArgument(['--page', '-p'], {
    action: 'storeTrue',
    defaultValue: false
});
argParser.addArgument(['--episode', '-e'], {
    action: 'storeTrue',
    defaultValue: false
});
argParser.addArgument('url');

let args = argParser.parseArgs();

if (args.page) {
    downloadFromMainPage(args.url)
        .then(() => console.info("Done"))
        .catch(console.error);
} else if (args.episode) {
    downloadFromEpisodePage(args.url)
        .then(() => console.info("Done"))
        .catch(console.error);
}
