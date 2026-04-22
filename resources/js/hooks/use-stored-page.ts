const useStoredPage = (key: string): number => {
    const exist = localStorage.getItem(key)

    if(!exist) return 1;

    return +exist;
}

export default useStoredPage