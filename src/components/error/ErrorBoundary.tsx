// src/components/ErrorBoundary.tsx
import React, { Component, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

function withRouter(Component: typeof CustomErrorBoundary) {
  function ComponentWithRouterProp(props: ErrorBoundaryProps) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  }
  return ComponentWithRouterProp;
}

class CustomErrorBoundary extends Component<
  ErrorBoundaryProps & { navigate: ReturnType<typeof useNavigate> },
  ErrorBoundaryState
> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  
  componentDidUpdate(_: ErrorBoundaryProps, prevState: ErrorBoundaryState) {
    if (!prevState.hasError && this.state.hasError) {
      this.props.navigate('/error', { replace: true, state: { source: 'runtime' } });
      this.setState({ hasError: false, error: null });
    }
  }

  public render() {
    return this.props.children;
  }
}

export const AppErrorBoundary = withRouter(CustomErrorBoundary);