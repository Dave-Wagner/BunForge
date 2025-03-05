/* global Bun */  // Declare Bun as a global if available.

let Database = null;
// Conditionally load bun:sqlite only if not in a browser environment.
if (typeof window === "undefined") {
    try {
        // Dynamically import bun:sqlite. This code only runs in a server context.
        Database = (await import("bun:sqlite")).Database;
    } catch (err) {
        console.error("Failed to load bun:sqlite:", err);
    }
}

/**
 * @typedef {Object} LoggerOptions
 * @property {string} [type='console'] - The logging type to use. Options: 'console', 'csv', or 'sqlite'.
 * @property {string} [filePath] - For CSV logging, the file path to store log entries.
 * @property {string} [dbPath] - For SQLite logging, the database file path.
 */

/**
 * Logging Service Class.
 *
 * This class provides a unified interface for logging messages to different targets:
 * - Console (default): Logs messages directly to the terminal.
 * - CSV: Appends log messages in CSV format to a text file.
 * - SQLite: Inserts log messages into a SQLite database for advanced querying using Bun's built-in API.
 */
class Logger {
    /**
     * Creates an instance of the Logger.
     * @param {LoggerOptions} options - Configuration options for the logger.
     */
    constructor(options = {}) {
        // Determine the logging type, defaulting to 'console' if not specified.
        this.type = options.type || "console";

        // For CSV logging, use Bun's file I/O functions.
        if (this.type === "csv") {
            if (!options.filePath) {
                throw new Error("CSV logging requires a 'filePath' option.");
            }
            this.filePath = options.filePath;
            try {
                // Check if file exists using Bun's file I/O.
                Bun.statSync(this.filePath);
            } catch {
                // File doesn't exist; create it with a header.
                Bun.writeFileSync(this.filePath, "timestamp,level,message\n");
            }
        } else if (this.type === "sqlite") {
            // For SQLite logging, ensure we're not in the browser.
            if (typeof window !== "undefined") {
                console.warn(
                    "SQLite logging is not supported in the browser. Falling back to console logging."
                );
                this.type = "console";
            } else {
                if (!options.dbPath) {
                    throw new Error("SQLite logging requires a 'dbPath' option.");
                }
                this.dbPath = options.dbPath;
                if (!Database) {
                    console.error("Database module is not available.");
                    this.type = "console";
                } else {
                    try {
                        this.db = new Database(this.dbPath);
                        // Create the logs table if it doesn't exist.
                        this.db.run(
                            `CREATE TABLE IF NOT EXISTS logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                level TEXT,
                message TEXT
              )`
                        );
                    } catch (err) {
                        console.error("Failed to initialize SQLite database:", err);
                        this.type = "console";
                    }
                }
            }
        }
        // For console logging, nothing extra is needed.
    }

    /**
     * Logs a message with a specified severity level.
     *
     * @param {string} level - The severity level (e.g., 'info', 'warn', 'error', 'debug').
     * @param {string} message - The log message to be recorded.
     */
    log(level, message) {
        const timestamp = new Date().toISOString();
        const formattedMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

        switch (this.type) {
            case "console": {
                console.log(formattedMessage);
                break;
            }
            case "csv": {
                const safeMessage = message.replace(/"/g, '""');
                const csvLine = `"${timestamp}","${level}","${safeMessage}"\n`;
                Bun.write(this.filePath, csvLine, { append: true }).catch((err) => {
                    console.error("Failed to write to the CSV file:", err);
                });
                break;
            }
            case "sqlite": {
                try {
                    this.db.run(
                        `INSERT INTO logs (timestamp, level, message) VALUES (?, ?, ?)`,
                        [timestamp, level, message]
                    );
                } catch (err) {
                    console.error("Failed to insert log into SQLite database:", err);
                }
                break;
            }
            default: {
                console.log(formattedMessage);
                break;
            }
        }
    }

    /**
     * Closes any resources used by the logger.
     *
     * For SQLite logging, this method ensures the database connection is properly terminated.
     */
    close() {
        if (this.type === "sqlite" && this.db) {
            try {
                this.db.close();
            } catch (err) {
                console.error("Error closing the SQLite database:", err);
            }
        }
    }
}

/* ========================================================================
   Examples of Usage:
   Uncomment to test different logging types.
   ======================================================================== */

// const consoleLogger = new Logger({ type: "console" });
// consoleLogger.log("info", "Logging to console.");

// const csvLogger = new Logger({ type: "csv", filePath: "./logs.csv" });
// csvLogger.log("info", "Logging to CSV.");

// const sqliteLogger = new Logger({ type: "sqlite", dbPath: "./logs.db" });
// sqliteLogger.log("info", "Logging to SQLite using Bun.");
// sqliteLogger.close();

export default Logger;
