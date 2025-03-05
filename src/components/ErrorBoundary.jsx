import React, { Component } from "react";
import ErrorHandler from "@/services/errorHandler.js";
import Spinner from "@/components/Spinner";

/**
 * ErrorBoundary component
 *
 * A generic error boundary that catches errors during rendering of its child components.
 * When an error occurs, it uses the provided ErrorHandler to log the error and renders a fallback UI.
 *
 * @param {Object} props - Component props.
 * @param {React.ComponentType} [props.fallback] - Optional fallback component to render if an error occurs. Defaults to Spinner.
 * @returns {JSX.Element} The children wrapped by the error boundary or the fallback UI.
 *
 * @example
 * // Wrap any component tree with ErrorBoundary
 * <ErrorBoundary fallback={<CustomFallback />}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    // Create a default ErrorHandler instance.
    this.errorHandler = new ErrorHandler();
  }

  componentDidCatch(error, info) {
    // Update state to render fallback UI.
    this.setState({ hasError: true });
    // Log the error using our ErrorHandler.
    this.errorHandler.captureError(error, info);
  }

  render() {
    if (this.state.hasError) {
      // Render the provided fallback component or default to Spinner.
      const FallbackComponent = this.props.fallback || Spinner;
      return <FallbackComponent />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
