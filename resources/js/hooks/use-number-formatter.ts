const useNumberFormatter = (amount: number): any => {
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
        notation: 'compact',
    });

    return formatter.format(amount);
};


export default  useNumberFormatter;