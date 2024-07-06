/**
 * Paginates an array of items based on the provided page number and page size.
 * @param {Array} items - The array of items to paginate.
 * @param {number} pageNumber - The page number (starting from 1).
 * @param {number} pageSize - The number of items per page.
 * @returns {Object} - An object containing the paginated items and pagination metadata.
 */
export function paginate(items, pageNumber = 1, pageSize = 10) {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedItems = items.slice(startIndex, endIndex);
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / pageSize);

    return {
        data: paginatedItems,
        pageNumber,
        pageSize,
        totalItems,
        totalPages
    };
}