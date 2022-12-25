export const isHttpAddress = urlString => {
    try {
        return urlString.toLowerCase().startsWith("http");
    }
    catch (e) {
        return false;
    }
};