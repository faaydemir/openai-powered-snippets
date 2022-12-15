import path from 'path';
export default function getFileNameAndExtension(filePath) {
    const pathInfo = path.parse(filePath);
    return { extension:pathInfo.ext, fileName:pathInfo.name,fileFolder:pathInfo.dir };
}