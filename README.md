# BunForge

BunForge is an opinionated boilerplate and meta-framework for building modern SaaS applications quickly using Bun, Vite, and React. It is designed to provide a robust, modular foundation with features that enhance performance, error handling, and developer experience—all while being flexible enough to integrate with other libraries.

## Features

### Built-In Logging Service

- **Multiple Backends:** Supports console, CSV (via Bun’s file I/O), and SQLite (using Bun's built-in SQLite API) logging.
- **Easy Configuration:** Configure the logging type and paths via environment variables.
- **Detailed Logging:** Logs detailed messages, including timestamps, severity levels, and messages.

### Error Handling & Reporting

- **Integrated ErrorHandler:** Captures errors, logs them using our Logger, and optionally reports them to Sentry.
- **React Error Boundaries:** Uses an `ErrorBoundary` to catch errors in components and display a fallback UI (a generic Spinner).

### Dynamic Icon

- **Flexible Icon Imports:** A generic `Icon` component dynamically imports icons from `react-icons` based on the icon set and name.
- **Performance Optimizations:** Uses React.lazy, Suspense, and an internal caching mechanism to minimize redundant imports.
- **Seamless Styling:** Accepts props for sizing, styling, and class names to integrate with any styling library.

### Generic Utilities

- **Common Helpers:** Includes debounce, throttle, deep clone, merge objects, date formatting, query string parsing/building, and UUID generation.
- **Lightweight & Dependency-Free:** Designed to work with any library or framework without adding bloat.

### Developer Experience

- **Modern Tooling:** Built with Vite for fast development and optimized builds.
- **Code Quality:** Includes ESLint and Prettier configurations for consistency.
- **Path Aliasing:** Configured via `jsconfig.json` for a clean, maintainable import structure.
- **Comprehensive Examples:** Sample code throughout the project helps you get started quickly.

## Getting Started

### Prerequisites

- **Bun:** Ensure you have Bun installed. Visit [Bun's official website](https://bun.sh) for installation instructions.
- **(Optional) Node.js:** While Bun handles most tasks, Node.js may be useful in certain scenarios.

### Installation

#### Clone the repository (or click template above)

```bash
git clone http://github.com/Dave-Wagner/BunForge.git
cd BunForge
```

#### Install dependencies

```bash
bun i
```

**Configure Environment Variables:** Create a local environment file and modify the variables as needed (e.g., Sentry DSN, logging type, file paths).

## Running the Project

Development Server:

```bash
bun run dev
```

Open your browser at [localhost](http://localhost:3000)

Production Build:

```bash
bun run build
```

Preview the build with:

```bash
bun run preview
```

### Logging

Import and use the Logger service as follows:

```js
import Logger from '@/services/logger';
// Use Vite's environment variables via import.meta.env.
// Note: If VITE_LOGGER_TYPE is set to "sqlite" in your .env file, SQLite logging is only available on the server.
// In the browser, it will fall back to console logging.
const logger = new Logger({ type: import.meta.env.VITE_LOGGER_TYPE || "console" });
logger.log('info', 'Application started');
```

### Error Handling

Capture errors with ErrorHandler:

```js
import Logger from '@/services/logger';
const logger = new Logger({ type: process.env.VITE_LOGGER_TYPE });
logger.log('info', 'Application started');
```

### Dynamic Icon Component

Render an icon dynamically:

```js
import Icon from '@/components/Icon';

const MyComponent = () => (
  <div>
    {/* Renders a FontAwesome beer icon with a size of 32px and orange color */}
    <Icon iconSet="fa" iconName="FaBeer" size={32} style={{ color: 'orange' }} />
  </div>
);
```

### Utility Functions

Use the provided utility functions:

```js
import { debounce, throttle, deepClone, generateUUID } from '@/utils';

// Debounce Example:
const onResize = debounce(() => console.log('Resized!'), 300);
window.addEventListener('resize', onResize);

// Throttle Example:
const onScroll = throttle(() => console.log('Scrolling...'), 1000);
window.addEventListener('scroll', onScroll);

// Deep Clone & UUID Generation:
const original = { a: 1, b: { c: 2 } };
const clone = deepClone(original);
console.log('Clone:', clone);
console.log('UUID:', generateUUID());

// See /src/utils/index.js for more examples
```

## Why I Built These Features

Performance & Efficiency:
Leveraging Bun’s built-in file I/O and SQLite support reduces dependencies and speeds up operations.

### Flexibility

Components like Icon are designed to be generic and adaptable, allowing integration with any styling or component library.

### Robust Error Handling

By integrating error boundaries and a dedicated error handling service (with optional Sentry support), the template helps you quickly identify and manage runtime issues.

### Developer Experience (DX)

Modern tooling (Vite, Bun, ESLint, Prettier) and clear code examples ensure a smooth and productive development process.

### Contributing

We welcome contributions from the community! To contribute:

#### Fork the Repository

Create your own fork of the project on GitHub.

#### Create a Branch

Use a descriptive name for your branch, e.g., feature/new-utility or bugfix/logger-error.

#### Make your Changes

Follow the existing code style and include detailed comments and tests when applicable.

#### Submit a Pull Request

Open a pull request explaining your changes and the problem they solve. Please ensure your code passes linting and formatting checks.

#### Discussion

For major changes or new features, please create a thread in Discussions first to discuss your ideas.

Your contributions will help improve BunForge and make it a better starting point for your next big idea!
