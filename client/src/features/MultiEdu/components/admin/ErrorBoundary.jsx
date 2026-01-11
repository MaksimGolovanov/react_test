import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error rendering content:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24 }}>
          <p>Произошла ошибка при загрузке контента. Пожалуйста, обновите страницу.</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;