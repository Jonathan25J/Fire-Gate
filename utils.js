function isValidURL(string) {
    const urlPattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i')
    return urlPattern.test(string);
}

function isImageUrl(url) {
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
    return imageExtensions.test(url);
}

function isHexColor(value) {
    const hexPattern = /^#([0-9A-Fa-f]{3}){1,2}([0-9A-Fa-f]{2})?$/;
    return hexPattern.test(value);
}


module.exports = {
    isValidURL,
    isImageUrl,
    isHexColor
}