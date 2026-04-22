export default async function useUrlToImageConverter(url: string): Promise<File | string> {
    try {
        const res = await fetch(url);
        const blob = await res.blob();

        let fileNameArray = url.split('/');
        let fileName = fileNameArray && fileNameArray.length ? fileNameArray[fileNameArray.length - 1] : '';
        let file = new File([blob], `${fileName}`, { type: blob.type });

        return file;
    } catch (err) {
        return url;
    }
}
