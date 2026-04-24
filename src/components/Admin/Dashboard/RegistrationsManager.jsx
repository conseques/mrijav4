import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../AuthContext';
import { fetchAdminRegistrations } from '../../../services/volunteerApi';
import styles from './RegistrationsManager.module.css';
import {
  filterRegistrations,
  getRegistrationSummary,
  getUniqueRegistrationValues,
  registrationsToCsv,
} from './registrationListUtils.mjs';

const formatDate = (ts) => {
  if (!ts?.seconds) return 'N/A';
  return new Date(ts.seconds * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

const RegistrationsManager = () => {
  const { backendToken } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const summary = useMemo(() => getRegistrationSummary(registrations), [registrations]);
  const filteredRegistrations = useMemo(
    () => filterRegistrations(registrations, { query, type: typeFilter, status: statusFilter }),
    [registrations, query, typeFilter, statusFilter]
  );
  const typeOptions = useMemo(() => getUniqueRegistrationValues(registrations, 'type'), [registrations]);
  const statusOptions = useMemo(() => getUniqueRegistrationValues(registrations, 'paymentState'), [registrations]);

  useEffect(() => {
    if (!backendToken) return;
    fetchAdminRegistrations(backendToken)
      .then(({ items }) => setRegistrations(items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [backendToken]);

  const handleExport = () => {
    const csv = registrationsToCsv(filteredRegistrations);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `mrija-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.managerContainer}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Registrations</h2>
          <p className={styles.subtitle}>Search, filter, and export event, course, and payment-backed registrations.</p>
        </div>
        <button
          className={styles.exportButton}
          type="button"
          onClick={handleExport}
          disabled={filteredRegistrations.length === 0}
        >
          Export CSV
        </button>
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {loading ? (
        <p>Loading registrations...</p>
      ) : (
        <>
          <div className={styles.summaryGrid}>
            <div className={styles.summaryItem}>
              <span>Total</span>
              <strong>{summary.total}</strong>
            </div>
            <div className={styles.summaryItem}>
              <span>Events</span>
              <strong>{summary.event}</strong>
            </div>
            <div className={styles.summaryItem}>
              <span>Courses</span>
              <strong>{summary.course}</strong>
            </div>
            <div className={styles.summaryItem}>
              <span>Paid</span>
              <strong>{summary.confirmedPayment}</strong>
            </div>
          </div>

          <div className={styles.toolbar}>
            <label className={styles.searchField}>
              <span>Search</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Name, email, event, or reference"
              />
            </label>
            <label className={styles.filterField}>
              <span>Type</span>
              <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
                <option value="all">All types</option>
                {typeOptions.map((type) => (
                  <option value={type} key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className={styles.filterField}>
              <span>Status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="all">All statuses</option>
                {statusOptions.map((status) => (
                  <option value={status} key={status}>{status}</option>
                ))}
              </select>
            </label>
          </div>

          <p className={styles.resultCount}>
            Showing {filteredRegistrations.length} of {registrations.length} registrations
          </p>

          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Type</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Registration</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id}>
                    <td>{formatDate(reg.createdAt)}</td>
                    <td className={styles.nameCell}>{reg.name}</td>
                    <td><a href={`mailto:${reg.email}`}>{reg.email}</a></td>
                    <td>{reg.phone || 'N/A'}</td>
                    <td><span className={styles.typeBadge}>{reg.type || 'event'}</span></td>
                    <td><span className={styles.sourceText}>{reg.source || 'website'}</span></td>
                    <td><span className={styles.statusBadge}>{reg.paymentState || 'registered'}</span></td>
                    <td>
                      <span className={styles.eventBadge}>{reg.eventName}</span>
                      {reg.paymentReference ? <p className={styles.referenceText}>{reg.paymentReference}</p> : null}
                    </td>
                  </tr>
                ))}
                {filteredRegistrations.length === 0 && (
                  <tr><td colSpan="8" className={styles.emptyState}>No registrations match these filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default RegistrationsManager;
