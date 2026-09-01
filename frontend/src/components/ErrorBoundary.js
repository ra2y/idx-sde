import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React render error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
    });

    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="error-boundary">
          <h1>Something went wrong</h1>

          <p>
            The application encountered an unexpected error.
          </p>

          <button onClick={this.handleReset}>
            Return to Listings
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;