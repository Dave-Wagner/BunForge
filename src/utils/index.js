/**
 * Utility Functions Module
 *
 * This module includes common helper functions such as debounce, throttle,
 * deep cloning, object merging, date formatting, query string parsing/building,
 * and UUID generation.
 *
 * These utilities are designed to be lightweight, dependency-free, and work
 * seamlessly with any library or framework.
 */

/**
 * Debounce function.
 *
 * Returns a debounced version of the provided function that delays its execution
 * until after a specified delay has elapsed since the last time it was invoked.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {Function} A debounced version of the provided function.
 *
 * @example
 * const debouncedLog = debounce(() => console.log('Debounced!'), 300);
 * window.addEventListener('resize', debouncedLog);
 */
export const debounce = (func, delay) => {
    let timer;
    return (...args) => {
        // Clear any existing timer.
        if (timer) clearTimeout(timer);
        // Set a new timer to execute the function after the delay.
        timer = setTimeout(() => {
            func.apply(null, args);
        }, delay);
    };
};

/**
 * Throttle function.
 *
 * Returns a throttled version of the provided function that ensures it is
 * executed at most once every specified time interval.
 *
 * @param {Function} func - The function to throttle.
 * @param {number} limit - The time interval in milliseconds.
 * @returns {Function} A throttled version of the provided function.
 *
 * @example
 * const throttledLog = throttle(() => console.log('Throttled!'), 1000);
 * window.addEventListener('scroll', throttledLog);
 */
export const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
        // If not in throttle period, execute the function.
        if (!inThrottle) {
            func.apply(null, args);
            inThrottle = true;
            // Reset the throttle flag after the specified limit.
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

/**
 * Deep clone an object.
 *
 * Creates a deep copy of an object. This implementation uses JSON methods,
 * which is simple but has limitations (e.g., it doesn't copy functions or handle special objects).
 *
 * @param {any} obj - The object to clone.
 * @returns {any} A deep copy of the object.
 *
 * @example
 * const original = { a: 1, b: { c: 2 } };
 * const clone = deepClone(original);
 * console.log(clone); // { a: 1, b: { c: 2 } }
 */
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * Merge multiple objects deeply.
 *
 * Merges source objects into a target object recursively. For any key that
 * exists in multiple objects, later sources override earlier ones.
 *
 * @param {Object} target - The target object to merge into.
 * @param {...Object} sources - One or more source objects.
 * @returns {Object} The merged object.
 *
 * @example
 * const defaults = { a: 1, b: { c: 2 } };
 * const options = { b: { d: 3 } };
 * const merged = mergeObjects({}, defaults, options);
 * console.log(merged); // { a: 1, b: { c: 2, d: 3 } }
 */
export const mergeObjects = (target, ...sources) => {
    sources.forEach((source) => {
        // Iterate over each key in the source object.
        for (let key in source) {
            if (source.hasOwnProperty(key)) {
                // If the value is an object, merge recursively.
                if (typeof source[key] === 'object' && source[key] !== null) {
                    target[key] = mergeObjects(target[key] || {}, source[key]);
                } else {
                    // Otherwise, directly assign the value.
                    target[key] = source[key];
                }
            }
        }
    });
    return target;
};

/**
 * Format a date using the browser's locale.
 *
 * Converts a given date to a localized string format.
 *
 * @param {Date|string|number} date - The date to format. Can be a Date object, date string, or timestamp.
 * @param {string} [locale='en-US'] - A locale identifier for formatting (default is 'en-US').
 * @param {Object} [options={}] - Additional options passed to toLocaleDateString.
 * @returns {string} The formatted date string.
 *
 * @example
 * const formattedDate = formatDate(new Date(), 'en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
 * console.log(formattedDate); // e.g., "Monday, 14 June 2021"
 */
export const formatDate = (date, locale = 'en-US', options = {}) =>
    new Date(date).toLocaleDateString(locale, options);

/**
 * Parse a query string into an object.
 *
 * Converts a URL query string into an object of key/value pairs.
 *
 * @param {string} queryString - The query string (e.g., "?foo=bar&baz=qux").
 * @returns {Object} An object containing the parsed query parameters.
 *
 * @example
 * const params = parseQueryString('?foo=bar&baz=qux');
 * console.log(params); // { foo: "bar", baz: "qux" }
 */
export const parseQueryString = (queryString) => {
    // Remove the leading '?' if present, then split by '&'
    return queryString
        .replace(/^\?/, '')
        .split('&')
        .reduce((acc, keyValue) => {
            // Split each key-value pair by '='
            const [key, value] = keyValue.split('=');
            // Decode and assign to the accumulator object.
            acc[decodeURIComponent(key)] = decodeURIComponent(value || '');
            return acc;
        }, {});
};

/**
 * Build a query string from an object.
 *
 * Converts an object of key/value pairs into a URL query string.
 *
 * @param {Object} params - An object containing key/value pairs.
 * @returns {string} A query string starting with "?".
 *
 * @example
 * const qs = buildQueryString({ foo: "bar", baz: "qux" });
 * console.log(qs); // "?foo=bar&baz=qux"
 */
export const buildQueryString = (params) =>
    '?' +
    Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');

/**
 * Generate a UUID (version 4).
 *
 * Generates a universally unique identifier. Uses the built-in crypto.randomUUID
 * if available; otherwise, falls back to a manual implementation.
 *
 * @returns {string} A UUID string.
 *
 * @example
 * const id = generateUUID();
 * console.log(id); // e.g., "3b12f1df-5232-4f5c-9f8a-9c1234567890"
 */
export const generateUUID = () => {
    // Use crypto.randomUUID if available (modern browsers and environments)
    if (crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // Fallback for environments without crypto.randomUUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

/**
 * Example usage:
 *
 * Debounce Example:
 * const onResize = debounce(() => console.log('Resized!'), 300);
 * window.addEventListener('resize', onResize);
 *
 * Throttle Example:
 * const onScroll = throttle(() => console.log('Scrolling...'), 1000);
 * window.addEventListener('scroll', onScroll);
 *
 * Deep Clone & Merge Example:
 * const original = { a: 1, b: { c: 2 } };
 * const clone = deepClone(original);
 * console.log(clone); // { a: 1, b: { c: 2 } }
 * const merged = mergeObjects({}, original, { b: { d: 3 } });
 * console.log(merged); // { a: 1, b: { c: 2, d: 3 } }
 *
 * Date Formatting Example:
 * const today = formatDate(new Date(), 'en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
 * console.log(today);
 *
 * Query String Parsing & Building:
 * const params = parseQueryString('?foo=bar&baz=qux');
 * console.log(params); // { foo: "bar", baz: "qux" }
 * const qs = buildQueryString({ foo: "bar", baz: "qux" });
 * console.log(qs); // "?foo=bar&baz=qux"
 *
 * UUID Generation:
 * const uuid = generateUUID();
 * console.log(uuid); // e.g., "d9428888-122b-11e1-b85c-61cd3cbb3210"
 */
