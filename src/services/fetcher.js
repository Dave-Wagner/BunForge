// Import the Logger service.
import Logger from '@/services/logger.js';

/**
 * @typedef {Object} FetchServiceOptions
 * @property {Logger} [logger] - A Logger instance to log API requests and responses. Defaults to a console logger if not provided.
 * @property {Object} [defaultOptions] - Default options for fetch requests, which will be merged with each call.
 */

/**
 * FetchService Class.
 *
 * Provides a wrapper around the native fetch API with integrated logging.
 * It logs the start, completion, and any errors for each API request.
 */
class FetchService {
    /**
     * Creates an instance of FetchService.
     * @param {FetchServiceOptions} options - Configuration options for the fetch service.
     */
    constructor(options = {}) {
        // Use the provided logger, or default to a console logger.
        this.logger = options.logger || new Logger({ type: 'console' });
        // Set default fetch options that apply to every request.
        this.defaultOptions = options.defaultOptions || {};
    }

    /**
     * Performs a fetch request and logs the process.
     *
     * @param {string} url - The URL to request.
     * @param {RequestInit} [options] - Options for the fetch request.
     * @returns {Promise<Response>} A promise that resolves to the fetch response.
     */
    async request(url, options = {}) {
        // Merge default options with the request-specific options.
        const fetchOptions = { ...this.defaultOptions, ...options };

        // Log the initiation of the request.
        this.logger.log('info', `Starting request to ${url} with options: ${JSON.stringify(fetchOptions)}`);

        try {
            // Record the start time.
            const startTime = Date.now();
            // Perform the fetch call.
            const response = await fetch(url, fetchOptions);
            // Calculate the duration of the request.
            const duration = Date.now() - startTime;

            // Log the successful response.
            this.logger.log('info', `Received response from ${url} in ${duration}ms with status: ${response.status}`);

            // Return the raw response for further processing by the caller.
            return response;
        } catch (error) {
            // Log any error encountered during the fetch call.
            this.logger.log('error', `Error during request to ${url}: ${error.message}`);
            // Propagate the error to the caller.
            throw error;
        }
    }

    /**
     * Performs a GET request.
     *
     * @param {string} url - The URL to request.
     * @param {RequestInit} [options] - Additional fetch options for the GET request.
     * @returns {Promise<Response>} A promise that resolves to the fetch response.
     */
    async get(url, options = {}) {
        return this.request(url, { ...options, method: 'GET' });
    }

    /**
     * Performs a POST request.
     *
     * @param {string} url - The URL to request.
     * @param {*} body - The payload to send with the POST request.
     * @param {RequestInit} [options] - Additional fetch options for the POST request.
     * @returns {Promise<Response>} A promise that resolves to the fetch response.
     */
    async post(url, body, options = {}) {
        // If the body is a plain object, assume JSON and set the appropriate header.
        if (typeof body === 'object' && !(body instanceof FormData)) {
            options.headers = {
                ...options.headers,
                'Content-Type': 'application/json'
            };
            body = JSON.stringify(body);
        }
        return this.request(url, { ...options, method: 'POST', body });
    }

    /**
     * Performs a PUT request.
     *
     * @param {string} url - The URL to request.
     * @param {*} body - The payload to send with the PUT request.
     * @param {RequestInit} [options] - Additional fetch options for the PUT request.
     * @returns {Promise<Response>} A promise that resolves to the fetch response.
     */
    async put(url, body, options = {}) {
        if (typeof body === 'object' && !(body instanceof FormData)) {
            options.headers = {
                ...options.headers,
                'Content-Type': 'application/json'
            };
            body = JSON.stringify(body);
        }
        return this.request(url, { ...options, method: 'PUT', body });
    }

    /**
     * Performs a DELETE request.
     *
     * @param {string} url - The URL to request.
     * @param {RequestInit} [options] - Additional fetch options for the DELETE request.
     * @returns {Promise<Response>} A promise that resolves to the fetch response.
     */
    async delete(url, options = {}) {
        return this.request(url, { ...options, method: 'DELETE' });
    }
}

/* ========================================================================
   Examples of Usage:
   Uncomment the examples below to test the FetchService with integrated logging.
   ======================================================================== */

// Create a default logger instance (console logging).
// const defaultLogger = new Logger({ type: 'console' });

// Instantiate the FetchService with the default logger.
// const apiService = new FetchService({ logger: defaultLogger });

// Example GET request.
// apiService.get('https://jsonplaceholder.typicode.com/posts/1')
//   .then(response => response.json())
//   .then(data => {
//     defaultLogger.log('info', `GET request data: ${JSON.stringify(data)}`);
//   })
//   .catch(error => {
//     defaultLogger.log('error', `GET request failed: ${error.message}`);
//   });

// Example POST request.
// apiService.post('https://jsonplaceholder.typicode.com/posts', { title: 'foo', body: 'bar', userId: 1 })
//   .then(response => response.json())
//   .then(data => {
//     defaultLogger.log('info', `POST request data: ${JSON.stringify(data)}`);
//   })
//   .catch(error => {
//     defaultLogger.log('error', `POST request failed: ${error.message}`);
//   });

export default FetchService;
