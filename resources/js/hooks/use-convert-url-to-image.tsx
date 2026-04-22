export async function useConvertUrlToImage(url: string): Promise<File | null> {
    const imgPath = url.trim();

    try {
        const res = await fetch(imgPath);
        const blob = await res.blob();

        let fileNameArray = imgPath?.toString().split('/');
        let fileName = fileNameArray && fileNameArray.length ? fileNameArray[fileNameArray.length - 1] : '';
        let file = new File([blob], `${fileName}`, { type: blob.type });

        return file;
    } catch (error) {
        return null;
    }
}
