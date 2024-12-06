const exportedMethods = {
    getCurrentDateTime() {
        const now = new Date();
    
        // Format components
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');
    
        // Combine into the desired format
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}+00`;
    }

}



export default exportedMethods