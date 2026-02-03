// Book Loader - Load and cache book data
export class BookLoader {
    constructor() {
        this.currentBook = null;
        this.bookCache = {};
    }

    /**
     * Load a book by its ID
     * @param {string} bookId - Book identifier (e.g., "01-flight-from-the-dark")
     * @returns {Promise<Object>} Book data
     */
    async loadBook(bookId) {
        // Return cached book if available
        if (this.bookCache[bookId]) {
            this.currentBook = this.bookCache[bookId];
            return this.currentBook;
        }

        try {
            const response = await fetch(`./data/books/${bookId}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load book: ${response.statusText}`);
            }

            const bookData = await response.json();

            // Validate book data
            if (!bookData.sections) {
                throw new Error('Invalid book data: missing sections');
            }

            // Cache the book
            this.bookCache[bookId] = bookData;
            this.currentBook = bookData;

            console.log(`✅ Book loaded: ${bookData.title} (${Object.keys(bookData.sections).length} sections)`);
            return bookData;
        } catch (error) {
            console.error('❌ Failed to load book:', error);
            throw error;
        }
    }

    /**
     * Get a specific section from the current book
     * @param {number|string} sectionNumber - Section number
     * @returns {Object|null} Section data or null if not found
     */
    getSection(sectionNumber) {
        if (!this.currentBook) {
            console.error('No book loaded');
            return null;
        }

        const section = this.currentBook.sections[sectionNumber];
        if (!section) {
            console.warn(`Section ${sectionNumber} not found`);
            return null;
        }

        return section;
    }

    /**
     * Get the current loaded book
     * @returns {Object|null} Current book data or null
     */
    getCurrentBook() {
        return this.currentBook;
    }

    /**
     * Get book metadata
     * @returns {Object|null} Book metadata (id, title, author, etc.)
     */
    getBookInfo() {
        if (!this.currentBook) return null;

        return {
            bookId: this.currentBook.bookId,
            bookNumber: this.currentBook.bookNumber,
            title: this.currentBook.title,
            originalTitle: this.currentBook.originalTitle,
            author: this.currentBook.author,
            illustrator: this.currentBook.illustrator,
            sectionCount: Object.keys(this.currentBook.sections).length
        };
    }

    /**
     * Check if a section exists
     * @param {number|string} sectionNumber - Section number
     * @returns {boolean} True if section exists
     */
    hasSection(sectionNumber) {
        if (!this.currentBook) return false;
        return !!this.currentBook.sections[sectionNumber];
    }

    /**
     * Clear the book cache
     */
    clearCache() {
        this.bookCache = {};
        this.currentBook = null;
        console.log('📚 Book cache cleared');
    }
}

// Export singleton instance
export const bookLoader = new BookLoader();
