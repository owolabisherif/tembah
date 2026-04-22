export default function useStripHTML(str: string): string {
    const result = str.replace(/<[^>]*>/g, '');

    return result;
}
