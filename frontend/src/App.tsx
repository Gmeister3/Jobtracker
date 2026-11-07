
import { useEffect, useState } from 'react';
import type { JobApplication } from './types/JobApplication';
import './App.css';
import ApplicationForm from './components/Applicationform';
import ApplicationDetails from './components/ApplicationDetails';

function App() {
  const [applications, setApplications] =
    useState<JobApplication[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
  const [notice, setNotice] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewingId, setViewingId] = useState<number | null>(null);
  const viewedApplication = applications.find((application) => application.id === viewingId);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const response = await fetch('/api/applications');

        if (!response.ok) {
          throw new Error('Failed to load applications');
        }

        const data: JobApplication[] = await response.json();
        setApplications(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Unknown error'
        );
      } finally {
        setLoading(false);
      }
    }

    fetchApplications();
  }, []);

  function handleApplicationAdded(application: JobApplication) {
      setApplications((previous) => [...previous, application]);
      setNotice('Application added.');
  }

  function handleApplicationUpdated(application: JobApplication) {
    setApplications((previous) => previous.map((app) =>
      app.id === application.id ? application : app
    ));
    setEditingApplication(null);
    setNotice('Application updated.');
  }

  async function handleDelete(application: JobApplication) {
    if (deletingId !== null || editingApplication !== null) return;
    if (!window.confirm(`Delete the ${application.position} application at ${application.company}?`)) return;

    setDeletingId(application.id);
    setDeleteError('');
    setNotice('');
    try {
      const response = await fetch(`/api/applications/${application.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Unable to delete this application. Please try again.');
      }
      setApplications((previous) =>
        previous.filter((app) => app.id !== application.id)
      );
      setNotice('Application deleted.');
      setViewingId(null);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Unable to delete this application. Please try again.');
    } finally {
      setDeletingId(null);
    }
  }

  const interviews = applications.filter(
    (app) => app.status === 'INTERVIEW'
  ).length;

  const offers = applications.filter(
    (app) => app.status === 'OFFER'
  ).length;

  const query = search.trim().toLowerCase();
  const filteredApplications = applications.filter((application) =>
    (!statusFilter || application.status === statusFilter) &&
    (!query || application.company.toLowerCase().includes(query) ||
      application.position.toLowerCase().includes(query))
  );

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner"><div className="brand"><span className="brand-mark" aria-hidden="true">J</span><h1>JobTracker</h1></div><span className="workspace-label">Your career workspace</span></div>
      </header>

      <main className="container">
        <div className="dashboard-intro"><span className="eyebrow">YOUR NEXT CHAPTER</span><h2>A little more organized.<br />A step closer to your next role.</h2><p>Keep your opportunities, progress, and plans in one place.</p></div>
        <p className="notice" role="status">{notice}</p>
        <ApplicationForm
          key={editingApplication?.id ?? 'new'}
          application={editingApplication ?? undefined}
          onApplicationAdded={handleApplicationAdded}
          onApplicationUpdated={handleApplicationUpdated}
          onCancel={() => setEditingApplication(null)}
        />
        <section className="stats">
          <div className="stat-card">
            <h3>Total Applications</h3>
            <p>{applications.length}</p>
          </div>

          <div className="stat-card">
            <h3>Interviews</h3>
            <p>{interviews}</p>
          </div>

          <div className="stat-card">
            <h3>Offers</h3>
            <p>{offers}</p>
          </div>
        </section>

        <section className="applications-section">
          <h2>Your Applications</h2>
          <p className="section-description">Every opportunity, all in one view.</p>
          <div className="application-filters">
            <label>
              Search applications
              <input
                type="search"
                placeholder="Company or position"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label>
              Filter by status
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="">All statuses</option>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
                <option value="WITHDRAWN">Withdrawn</option>
              </select>
            </label>
            <button
              type="button"
              className="clear-filters-button"
              disabled={!search && !statusFilter}
              onClick={() => {
                setSearch('');
                setStatusFilter('');
              }}
            >
              Clear filters
            </button>
          </div>
          {!loading && !error && (
            <p className="filter-count" role="status">
              Showing {filteredApplications.length} of {applications.length} applications
            </p>
          )}
          {deleteError && <p className="error" role="alert">{deleteError}</p>}

          {loading ? (
            <p>Loading applications...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : applications.length === 0 ? (
            <p>No applications found.</p>
          ) : filteredApplications.length === 0 ? (
            <p>No applications match your search or status filter. Try changing or clearing the filters.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Position</th>
                  <th>Status</th>
                  <th>Date Applied</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.company}</td>
                    <td>{app.position}</td>
                    <td>
                      <span className={`status ${app.status.toLowerCase()}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>{app.dateApplied}</td>
                    <td>
                      <button
                        type="button"
                        className="details-button"
                        disabled={deletingId !== null || editingApplication !== null}
                        aria-label={`View details for ${app.position} application at ${app.company}`}
                        onClick={() => {
                          setDeleteError('');
                          setViewingId(app.id);
                        }}
                      >
                        View Details
                      </button>
                      <button
                        type="button"
                        className="edit-button"
                        disabled={deletingId !== null || editingApplication !== null}
                        aria-label={`Edit ${app.position} application at ${app.company}`}
                        onClick={() => {
                          setNotice('');
                          setEditingApplication(app);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="delete-button"
                        disabled={deletingId !== null || editingApplication !== null}
                        aria-label={`Delete ${app.position} application at ${app.company}`}
                        onClick={() => handleDelete(app)}
                      >
                        {deletingId === app.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
      {viewedApplication && (
        <ApplicationDetails
          application={viewedApplication}
          deleting={deletingId !== null}
          error={deleteError}
          onClose={() => setViewingId(null)}
          onEdit={() => {
            setViewingId(null);
            setNotice('');
            setEditingApplication(viewedApplication);
          }}
          onDelete={() => handleDelete(viewedApplication)}
        />
      )}
    </div>
  );
}

export default App;
