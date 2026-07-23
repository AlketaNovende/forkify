import type { ReactNode } from 'react';
import Icon, { type IconName } from './Icon';

interface StatusMessageProps {
  children: ReactNode;
  icon?: IconName;
  variant?: 'message' | 'error';
}

export function Spinner() {
  return (
    <div className="spinner" role="status" aria-label="Loading">
      <Icon name="loader" />
    </div>
  );
}

export default function StatusMessage({
  children,
  icon = 'smile',
  variant = 'message',
}: StatusMessageProps) {
  return (
    <div className={variant}>
      <div>
        <Icon name={icon} />
      </div>
      <p>{children}</p>
    </div>
  );
}
