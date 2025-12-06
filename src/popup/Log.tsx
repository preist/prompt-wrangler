import { useEffect, useState } from 'react';
import { getDetectedIssues, clearDetectedIssues } from '../utils/storage';
import type { DetectedIssue } from '../utils/detectors/types';
import Howdy from './Howdy';
import './Log.scss';

export default function Log() {
  const [issues, setIssues] = useState<DetectedIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadIssues() {
      try {
        const detectedIssues = await getDetectedIssues();
        setIssues(detectedIssues);
      } catch (error) {
        console.error('[Prompt Wrangler] Failed to load issues:', error);
      } finally {
        setLoading(false);
      }
    }

    void loadIssues();
  }, []);

  async function handleClearLogs() {
    try {
      await clearDetectedIssues();
      setIssues([]);
    } catch (error) {
      console.error('[Prompt Wrangler] Failed to clear logs:', error);
    }
  }

  if (loading) {
    return (
      <div className="log">
        <div className="log__header">
          <h1 className="log__title">Prompt Wrangler</h1>
        </div>
        <div className="log__content">
          <p className="log__loading">Loading...</p>
        </div>
      </div>
    );
  }

  if (issues.length === 0) {
    return <Howdy />;
  }

  return (
    <div className="log">
      <div className="log__header">
        <h1 className="log__title">Prompt Wrangler</h1>
        <p className="log__subtitle">Detected Emails</p>
      </div>
      <div className="log__content">
        <ul className="log__list">
          {issues.map((issue) => (
            <li key={issue.id} className="log__item">
              <span className="log__value">{issue.value}</span>
              <span className="log__timestamp">{new Date(issue.timestamp).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="log__footer">
        <button className="log__clear-button" onClick={handleClearLogs}>
          Clear Logs
        </button>
      </div>
    </div>
  );
}
