
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import type { JobApplication, ApplicationStatus } from '../types/JobApplication';

type NewApplication = Omit<JobApplication, 'id'>;

interface Props {
  onApplicationAdded: (application: JobApplication) => void;
  application?: JobApplication;
  onApplicationUpdated?: (application: JobApplication) => void;
  onCancel?: () => void;
}

function today() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function ApplicationForm({ onApplicationAdded, application, onApplicationUpdated, onCancel }: Props) {
  const [form, setForm] = useState<NewApplication>(() => application ? {
    company: application.company,
    position: application.position,
    status: application.status,
    salary: application.salary,
    dateApplied: application.dateApplied,
    jobUrl: application.jobUrl,
    notes: application.notes,
  } : {
    company: '',
    position: '',
    status: 'APPLIED',
    salary: null,
    dateApplied: today(),
    jobUrl: '',
    notes: '',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const companyInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (application) companyInput.current?.focus();
  }, [application]);

  function updateField<K extends keyof NewApplication>(
    field: K,
    value: NewApplication[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    if (!form.company.trim() || !form.position.trim()) {
      setError('Enter a company and position. These fields cannot contain only spaces.');
      return;
    }
    setSaving(true);
    setError('');

    try {
      const response = await fetch(application ? `/api/applications/${application.id}` : '/api/applications', {
        method: application ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, company: form.company.trim(), position: form.position.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to save application');
      }

      const saved: JobApplication = await response.json();
      if (application) {
        onApplicationUpdated?.(saved);
        return;
      }
      onApplicationAdded(saved);

      setForm({
        company: '',
        position: '',
        status: 'APPLIED',
        salary: null,
        dateApplied: today(),
        jobUrl: '',
        notes: '',
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unknown error'
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="application-form" onSubmit={handleSubmit}>
      <h2>{application ? 'Edit Application' : 'Add New Application'}</h2>
      <p className="section-description">{application ? 'Keep the details of this opportunity up to date.' : 'Found an opportunity? Give it a place here.'}</p>

      <fieldset className="application-fields" disabled={saving}>
      <div className="form-grid">
        <label>
          Company
          <input
            ref={companyInput}
            required
            value={form.company}
            onChange={(e) => updateField('company', e.target.value)}
            placeholder="e.g. Google"
          />
        </label>

        <label>
          Position
          <input
            required
            value={form.position}
            onChange={(e) => updateField('position', e.target.value)}
            placeholder="e.g. Software Engineer"
          />
        </label>

        <label>
          Status
          <select
            value={form.status}
            onChange={(e) =>
              updateField('status', e.target.value as ApplicationStatus)
            }
          >
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </label>

        <label>
          Salary
          <input
            type="number"
            min="0"
            value={form.salary ?? ''}
            onChange={(e) =>
              updateField(
                'salary',
                e.target.value === '' ? null : Number(e.target.value)
              )
            }
            placeholder="e.g. 75000"
          />
        </label>

        <label>
          Date Applied
          <input
            type="date"
            required
            value={form.dateApplied}
            onChange={(e) => updateField('dateApplied', e.target.value)}
          />
        </label>

        <label>
          Job URL
          <input
            type="url"
            value={form.jobUrl ?? ''}
            onChange={(e) => updateField('jobUrl', e.target.value)}
            placeholder="https://..."
          />
        </label>
      </div>

      <label className="notes-label">
        Notes
        <textarea
          maxLength={2000}
          rows={3}
          value={form.notes ?? ''}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Add notes about this application..."
        />
      </label>
      </fieldset>

      {error && <p className="error" role="alert">{error}</p>}

      <button type="submit" className="save-button" disabled={saving}>
        {saving ? 'Saving...' : application ? 'Save Changes' : 'Save Application'}
      </button>
      {application && (
        <button type="button" className="cancel-button" disabled={saving} onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

export default ApplicationForm;
