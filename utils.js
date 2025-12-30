function isValidURL(string) {
    const urlPattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i')
    return urlPattern.test(string);
}

async function isImageUrl(url) {

    if (isTenorUrl(url)) return false;

    let res = await fetch(url, { method: 'HEAD' });

    if (!res.ok || !res.headers.get('content-type')) {
        const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
        return imageExtensions.test(url);
    }

    return res.headers
        .get('content-type')
        .startsWith('image');

}

function isHexColor(value) {
    const hexPattern = /^#([0-9A-Fa-f]{3}){1,2}([0-9A-Fa-f]{2})?$/;
    return hexPattern.test(value);
}

function isTenorUrl(url) {
    const tenorPattern = /^https?:\/\/(www\.)?tenor\.com\/.+$/i;
    return tenorPattern.test(url);
}

async function getTenorGifUrl(tenorUrl) {
    const redirectUrl = await getRedirectUrl(tenorUrl + '.gif');
    const gifId = redirectUrl.split('/')[4]
    const gifUrl = `https://c.tenor.com/${gifId}/tenor.gif`;
    return gifUrl;
}

async function getRedirectUrl(url) {
    const response = await fetch(url, { redirect: 'follow' });
    return response.url;
}

module.exports = {
    isValidURL,
    isImageUrl,
    isHexColor,
    isTenorUrl,
    getTenorGifUrl
}