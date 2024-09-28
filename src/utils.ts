function formatDate(dateString: string): string {
    // Create a Date object from the input date string
    const date = new Date(dateString);

    // Define options for formatting
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    };

    // Use toLocaleDateString to format the date
    return date.toLocaleDateString('en-GB', options);
}

export {
    formatDate
};
