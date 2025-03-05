// Import the Logger service.
import Logger from '@/services/logger.js';

/**
 * @typedef {Object} ErrorHandlerOptions
 * @property {Logger} [logger] - A Logger instance for logging errors. Defaults to a console logger.
 * @property {boolean} [sentryEnabled=false] - Flag to enable Sentry integration.
 * @property {string} [sentryDsn] - The DSN for Sentry initialization. Required if sentryEnabled is true.
 */

/**
 * ErrorHandler Class.
 *
 * This service handles error logging and optionally integrates with Sentry for advanced error tracking.
 * By default, it logs errors using the provided logger. When Sentry is enabled and initialized, errors are also reported to Sentry.
 */
class ErrorHandler {
    /**
     * Creates an instance of ErrorHandler.
     * @param {ErrorHandlerOptions} options - Configuration options for the error handler.
     */
    constructor(options = {}) {
        // Use the provided logger or default to a console logger.
        this.logger = options.logger || new Logger({ type: 'console' });

        // Determine if Sentry integration is enabled.
        this.sentryEnabled = options.sentryEnabled || false;
        this.sentry = null; // Will hold the Sentry object if initialized.

        // If Sentry integration is requested, ensure a DSN is provided.
        if (this.sentryEnabled) {
            if (!options.sentryDsn) {
                this.logger.log('error', "Sentry integration is enabled, but no DSN was provided.");
            } else {
                // Dynamically import Sentry to keep the default dependency free.
                import('@sentry/browser')
                    .then((SentryModule) => {
                        const Sentry = SentryModule;
                        // Initialize Sentry with the provided DSN.
                        Sentry.init({
                            dsn: options.sentryDsn,
                            // Additional Sentry options can be added here.
                        });
                        this.sentry = Sentry;
                        this.logger.log('info', 'Sentry has been initialized successfully.');
                    })
                    .catch((err) => {
                        this.logger.log('error', `Failed to load Sentry: ${err.message}`);
                    });
            }
        }
    }

    /**
     * Captures an error, logs it, and optionally reports it to Sentry.
     *
     * @param {Error} error - The error to handle.
     * @param {Object} [context={}] - Additional context or metadata related to the error.
     */
    captureError(error, context = {}) {
        // Log the error using the logger.
        this.logger.log('error', error.message || 'Unknown error');

        // If Sentry is enabled and has been initialized, report the error.
        if (this.sentryEnabled && this.sentry) {
            this.sentry.captureException(error, { extra: context });
        }
    }
}

/* ========================================================================
   Examples of Usage:
   Uncomment the examples below to test the ErrorHandler service.
   ======================================================================== */

// Example 1: Default error handling (dependency free, logs to console).
// const errorHandler = new ErrorHandler();
// try {
// Simulate an error.
//   throw new Error("Sample error for testing default error handling.");
// } catch (err) {
//   errorHandler.captureError(err, { additional: "context info" });
// }

// Example 2: Error handling with Sentry integration.
// Ensure that '@sentry/browser' is installed in your project and a valid DSN is provided.
// const errorHandlerWithSentry = new ErrorHandler({
//   sentryEnabled: true,
//   sentryDsn: 'https://examplePublicKey@o0.ingest.sentry.io/0'
// });
// try {
// Simulate an error.
//   throw new Error("Sample error for testing Sentry integration.");
// } catch (err) {
//   errorHandlerWithSentry.captureError(err, { module: "exampleModule" });
// }

export default ErrorHandler;
