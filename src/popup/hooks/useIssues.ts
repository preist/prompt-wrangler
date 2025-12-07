import { useContext } from 'react';
import { IssuesContext } from '../contexts/IssuesContext';

export function useIssues() {
  const context = useContext(IssuesContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within IssuesProvider');
  }
  return context;
}
