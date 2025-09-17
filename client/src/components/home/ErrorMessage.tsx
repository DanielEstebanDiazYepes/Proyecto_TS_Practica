type ErrorMessageProps = {
  error: string;
  clearError: () => void;
};

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, clearError }) => (
  <div className="error-message">
    <span>❌ {error}</span>
    <button onClick={clearError} className="error-close">×</button>
  </div>
);

export default ErrorMessage;
