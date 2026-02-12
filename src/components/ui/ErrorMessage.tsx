interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = "" }: ErrorMessageProps) {
  return (
    <p className={`text-red-600 dark:text-red-400 ${className}`}>{message}</p>
  );
}
