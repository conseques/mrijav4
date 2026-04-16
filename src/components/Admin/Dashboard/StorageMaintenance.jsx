import React, { useState } from 'react';
import { HardDrive, RefreshCw, Trash2, TriangleAlert, Download, Database } from 'lucide-react';
import { db, storage } from '../../../firebase';
import styles from './StorageMaintenance.module.css';
import { deleteManagedStorageFiles, scanManagedStorage } from './storageMaintenanceUtils';
import { useAdminBackendToken } from '../../../hooks/useAdminBackendToken';
import { downloadSystemBackup } from '../../../services/volunteerApi';

const StorageMaintenance = () => {
  const [scanResult, setScanResult] = useState(null);
  const [loadingScan, setLoadingScan] = useState(false);
  const [cleaningUp, setCleaningUp] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const [downloadingBackup, setDownloadingBackup] = useState(false);
  const [backupError, setBackupError] = useState('');
  const { backendToken } = useAdminBackendToken();

  const handleDownloadBackup = async () => {
    if (!backendToken) {
      setBackupError('You must be logged in as an admin to download a backup.');
      return;
    }
    setDownloadingBackup(true);
    setBackupError('');
    try {
      await downloadSystemBackup(backendToken);
    } catch (err) {
      console.error('Error downloading backup:', err);
      setBackupError(err.message || 'Failed to download the system backup.');
    } finally {
      setDownloadingBackup(false);
    }
  };

  const handleScan = async () => {
    setLoadingScan(true);
    setError('');
    setStatus('');

    try {
      const result = await scanManagedStorage(db, storage);
      setScanResult(result);

      if (result.orphanedFiles.length > 0) {
        setStatus(`Found ${result.orphanedFiles.length} orphaned files that are no longer referenced in Firestore.`);
      } else {
        setStatus('No orphaned files found in the managed Firebase Storage folders.');
      }
    } catch (scanError) {
      console.error('Error scanning Firebase Storage:', scanError);
      setError('Unable to scan Firebase Storage right now. Check Storage rules, admin access, or Firebase service status.');
    } finally {
      setLoadingScan(false);
    }
  };

  const handleCleanup = async () => {
    if (!scanResult?.orphanedFiles.length) {
      setStatus('There are no orphaned files to delete.');
      return;
    }

    const confirmed = window.confirm(
      `Delete ${scanResult.orphanedFiles.length} orphaned files from Firebase Storage? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setCleaningUp(true);
    setError('');
    setStatus('');

    try {
      const cleanupResult = await deleteManagedStorageFiles(
        storage,
        scanResult.orphanedFiles.map((file) => file.fullPath)
      );

      const refreshedResult = await scanManagedStorage(db, storage);
      setScanResult(refreshedResult);

      if (cleanupResult.failedPaths.length > 0) {
        setStatus(
          `Deleted ${cleanupResult.deletedCount} orphaned files. ${cleanupResult.failedPaths.length} files could not be removed.`
        );
      } else {
        setStatus(`Deleted ${cleanupResult.deletedCount} orphaned files from Firebase Storage.`);
      }
    } catch (cleanupError) {
      console.error('Error cleaning Firebase Storage:', cleanupError);
      setError('Cleanup could not finish. Some files may still need to be removed manually in Firebase Storage.');
    } finally {
      setCleaningUp(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <div className={styles.panel}>
        <div className={styles.hero}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>Server Details</span>
            <h2 className={styles.title}>System Data Backup</h2>
            <p className={styles.description}>
              Download a complete archive of the core SQLite database and all uploaded files (events, volunteers, etc.).
              This is useful if you are migrating the backend.
            </p>
          </div>
          <div className={styles.iconWrap}>
            <Database size={28} />
          </div>
        </div>

        <div className={styles.actions} style={{ marginTop: '20px' }}>
          <button 
            className={styles.primaryBtn} 
            onClick={handleDownloadBackup} 
            disabled={downloadingBackup || !backendToken}
          >
            <Download size={16} className={downloadingBackup ? styles.spinningIcon : ''} />
            <span>{downloadingBackup ? 'Archiving & Downloading...' : 'Download Full Backup (.tar.gz)'}</span>
          </button>
        </div>

        {backupError && <p className={styles.errorMessage} style={{ marginTop: '16px' }}>{backupError}</p>}
      </div>

      <div className={styles.panel}>
        <div className={styles.hero}>
          <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>Firebase Storage</span>
          <h2 className={styles.title}>Storage maintenance</h2>
          <p className={styles.description}>
            Scan the `events`, `past_events`, `courses`, and `teachers` folders and remove files that are no longer linked
            from Firestore documents.
          </p>
        </div>
        <div className={styles.iconWrap}>
          <HardDrive size={28} />
        </div>
      </div>

      <div className={styles.notice}>
        <TriangleAlert size={18} />
        <p>
          This helps when Firebase Storage quota is exceeded because old images were left behind after edits or deletes.
          It does not change Firebase billing or Auth settings.
        </p>
      </div>

      <div className={styles.actions}>
        <button className={styles.primaryBtn} onClick={handleScan} disabled={loadingScan || cleaningUp}>
          <RefreshCw size={16} className={loadingScan ? styles.spinningIcon : ''} />
          <span>{loadingScan ? 'Scanning...' : 'Scan Storage'}</span>
        </button>
        <button
          className={styles.secondaryBtn}
          onClick={handleCleanup}
          disabled={loadingScan || cleaningUp || !scanResult?.orphanedFiles.length}
        >
          <Trash2 size={16} />
          <span>{cleaningUp ? 'Deleting...' : 'Delete Orphaned Files'}</span>
        </button>
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}
      {status && <p className={styles.statusMessage}>{status}</p>}

      {scanResult && (
        <>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Referenced files</span>
              <strong className={styles.statValue}>{scanResult.referencedFiles}</strong>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Files in Storage</span>
              <strong className={styles.statValue}>{scanResult.totalFiles}</strong>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Orphaned files</span>
              <strong className={styles.statValue}>{scanResult.orphanedFiles.length}</strong>
            </div>
          </div>

          <div className={styles.folderGrid}>
            {scanResult.folderSummaries.map((folder) => (
              <div key={folder.folder} className={styles.folderCard}>
                <span className={styles.folderName}>{folder.folder}</span>
                <p className={styles.folderMeta}>{folder.totalFiles} files in Storage</p>
                <p className={styles.folderMeta}>{folder.orphanedFiles} orphaned</p>
              </div>
            ))}
          </div>

          {scanResult.orphanedFiles.length > 0 && (
            <div className={styles.resultsCard}>
              <h3 className={styles.resultsTitle}>Files queued for cleanup</h3>
              <ul className={styles.fileList}>
                {scanResult.orphanedFiles.slice(0, 12).map((file) => (
                  <li key={file.fullPath} className={styles.fileItem}>
                    <span>{file.fullPath}</span>
                  </li>
                ))}
              </ul>
              {scanResult.orphanedFiles.length > 12 && (
                <p className={styles.helperText}>
                  Showing 12 of {scanResult.orphanedFiles.length} orphaned files. The cleanup button deletes the full list.
                </p>
              )}
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
};

export default StorageMaintenance;
