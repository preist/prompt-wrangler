import { createContext, useState, useEffect, type ReactNode } from 'react';

export type DismissDuration = '24h' | 'forever';

export interface Issue {
  id: string;
  type: 'email' | 'phone' | 'creditCard' | 'ssn' | 'address';
  value: string;
  timestamp: number;
  batchId: string;
  dismissed?: {
    until: number | 'forever';
  };
}

export interface IssuesContextValue {
  latestIssues: Issue[];
  history: Issue[];
  dismissIssue: (id: string, duration: DismissDuration) => Promise<void>;
  deleteFromHistory: (id: string) => Promise<void>;
  clearDismissed: () => void;
}

export const IssuesContext = createContext<IssuesContextValue | undefined>(undefined);

export function IssuesProvider({ children }: { children: ReactNode }) {
  const [latestBatchId, setLatestBatchId] = useState<string | null>(null);
  const [history, setHistory] = useState<Issue[]>([]);

  // Load issues from chrome.storage on mount
  useEffect(() => {
    const loadIssues = async () => {
      const result = await chrome.storage.local.get(['issues.latestBatch', 'issues.history']);

      if (result['issues.latestBatch']) {
        setLatestBatchId(result['issues.latestBatch'] as string);
      }
      if (result['issues.history']) {
        setHistory(result['issues.history'] as Issue[]);
      }
    };

    void loadIssues();
  }, []);

  // Listen for new issues notification (storage already updated by background worker)
  useEffect(() => {
    const handleMessage = (
      message: { type: string },
      _sender: chrome.runtime.MessageSender,
      _sendResponse: (response?: unknown) => void
    ) => {
      if (message.type === 'NEW_ISSUES') {
        // Reload from storage since background worker already saved
        void chrome.storage.local.get(['issues.latestBatch', 'issues.history']).then((result) => {
          if (result['issues.latestBatch']) {
            setLatestBatchId(result['issues.latestBatch'] as string);
          }
          if (result['issues.history']) {
            setHistory(result['issues.history'] as Issue[]);
          }
        });
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  // Clean up expired 24h dismissals
  const clearDismissed = () => {
    const now = Date.now();
    const filtered = history.filter((issue) => {
      if (!issue.dismissed) return true;
      if (issue.dismissed.until === 'forever') return false;
      return issue.dismissed.until > now;
    });

    setHistory(filtered);
    void chrome.storage.local.set({ 'issues.history': filtered });
  };

  const dismissIssue = async (id: string, duration: DismissDuration) => {
    const until: number | 'forever' =
      duration === 'forever' ? 'forever' : Date.now() + 24 * 60 * 60 * 1000;

    const updated: Issue[] = history.map((issue) =>
      issue.id === id ? { ...issue, dismissed: { until } } : issue
    );

    setHistory(updated);
    await chrome.storage.local.set({ 'issues.history': updated });
  };

  const deleteFromHistory = async (id: string) => {
    const filtered = history.filter((issue) => issue.id !== id);
    setHistory(filtered);
    await chrome.storage.local.set({ 'issues.history': filtered });
  };

  // Compute latest issues from history based on latestBatchId
  const latestIssues = latestBatchId
    ? history.filter((issue) => issue.batchId === latestBatchId)
    : [];

  return (
    <IssuesContext.Provider
      value={{
        latestIssues,
        history,
        dismissIssue,
        deleteFromHistory,
        clearDismissed,
      }}
    >
      {children}
    </IssuesContext.Provider>
  );
}
