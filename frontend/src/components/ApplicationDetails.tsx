import { useEffect, useRef } from 'react';
import type { JobApplication } from '../types/JobApplication';

interface Props {
  application: JobApplication;
  deleting: boolean;
  error: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ApplicationDetails({ application, deleting, error, onClose, onEdit, onDelete }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const jobUrl = application.jobUrl?.trim();
  let safeJobUrl: string | undefined;
  try {
    const url = new URL(jobUrl ?? '');
    if (url.protocol === 'https:' || url.protocol === 'http:') safeJobUrl = url.href;
  } catch {
    // Older records may contain an incomplete URL; display it as text.
  }

  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);

  return (
    <dialog ref={dialog} className="application-details" aria-labelledby="details-title" onCancel={(event) => {
      event.preventDefault();
      if (!deleting) onClose();
    }}>
      <h2 id="details-title">Application Details</h2>
      <dl className="details-grid">
        <div><dt>Company</dt><dd>{application.company}</dd></div>
        <div><dt>Position</dt><dd>{application.position}</dd></div>
        <div><dt>Status</dt><dd><span className={`status ${application.status.toLowerCase()}`}>{application.status}</span></dd></div>
        <div><dt>Date Applied</dt><dd>{application.dateApplied}</dd></div>
        <div><dt>Salary</dt><dd>{application.salary === null ? 'Not provided' : application.salary.toLocaleString()}</dd></div>
        <div><dt>Job URL</dt><dd>{safeJobUrl ? <a href={safeJobUrl} target="_blank" rel="noopener noreferrer">{jobUrl}</a> : jobUrl || 'Not provided'}</dd></div>
        <div className="details-notes"><dt>Notes</dt><dd>{application.notes || 'No notes added.'}</dd></div>
      </dl>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="details-actions">
        <button type="button" className="edit-button" disabled={deleting} onClick={onEdit}>Edit</button>
        <button type="button" className="delete-button" disabled={deleting} onClick={onDelete}>{deleting ? 'Deleting...' : 'Delete'}</button>
        <button type="button" className="cancel-button" disabled={deleting} onClick={onClose} autoFocus>Close</button>
      </div>
    </dialog>
  );
}

export default ApplicationDetails;
