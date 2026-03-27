import React, { useState, useEffect } from 'react';
import { getReportData, updateReportData } from '../../../services/reportService';
import styles from './ReportManager.module.css';

const ReportManager = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportData = await getReportData();
        setData(reportData);
      } catch (err) {
        console.error("Error fetching report data:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleMetricChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: name === 'totalAmountRaised' || name === 'goalAmount' || name === 'livesImpacted' || name === 'activeProjects' 
        ? Number(value) 
        : value
    }));
  };

  const handleDistChange = (category, value) => {
    setData(prev => ({
      ...prev,
      distribution: {
        ...prev.distribution,
        [category]: Number(value)
      }
    }));
  };

  const calculatePercentages = () => {
    if (!data || !data.distribution) return {};
    const total = Object.values(data.distribution).reduce((sum, val) => sum + val, 0);
    if (total === 0) return { militaryAid: 0, humanitarianAid: 0, otherOrgsSupport: 0, other: 0 };
    
    return {
      militaryAid: Math.round((data.distribution.militaryAid / total) * 100),
      humanitarianAid: Math.round((data.distribution.humanitarianAid / total) * 100),
      otherOrgsSupport: Math.round((data.distribution.otherOrgsSupport / total) * 100),
      other: Math.round((data.distribution.other / total) * 100),
      totalDist: total
    };
  };

  const handleAddAllocation = () => {
    const newAllocation = {
      id: Date.now().toString(),
      project: "",
      categoryKey: "militaryAidTitle",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      amount: "0.00"
    };
    setData(prev => ({
      ...prev,
      recentAllocations: [...prev.recentAllocations, newAllocation]
    }));
  };

  const handleAllocationChange = (id, field, value) => {
    setData(prev => ({
      ...prev,
      recentAllocations: prev.recentAllocations.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleDeleteAllocation = (id) => {
    setData(prev => ({
      ...prev,
      recentAllocations: prev.recentAllocations.filter(item => item.id !== id)
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateReportData(data);
      alert("Report data saved successfully!");
    } catch (err) {
      console.error("Error saving report data:", err);
      alert("Error saving report data.");
    }
    setSaving(false);
  };

  if (loading) return <div className={styles.managerContainer}>Loading report data...</div>;
  if (!data) return <div className={styles.managerContainer}>Error loading data.</div>;

  const percentages = calculatePercentages();

  return (
    <div className={styles.managerContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Detailed Report Manager</h2>
        <button 
          className={styles.saveBtn} 
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </div>

      {/* Main Stats */}
      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>Main Statistics</h3>
        <div className={styles.grid}>
          <div className={styles.inputGroup}>
            <label>Total Collected (NOK)</label>
            <input 
              type="number" 
              name="totalAmountRaised" 
              value={data.totalAmountRaised} 
              onChange={handleMetricChange} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Donation Goal (NOK)</label>
            <input 
              type="number" 
              name="goalAmount" 
              value={data.goalAmount} 
              onChange={handleMetricChange} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Lives Impacted</label>
            <input 
              type="number" 
              name="livesImpacted" 
              value={data.livesImpacted} 
              onChange={handleMetricChange} 
            />
          </div>
          <div className={styles.inputGroup}>
            <label>Active Projects</label>
            <input 
              type="number" 
              name="activeProjects" 
              value={data.activeProjects} 
              onChange={handleMetricChange} 
            />
          </div>
        </div>
      </div>

      {/* Distribution */}
      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>Distribution of Funds (Auto-calculated %)</h3>
        <p style={{fontSize: '13px', color: '#64748b', marginBottom: '16px'}}>
          Enter the absolute amounts in NOK for each category. Percentages will update automatically based on the sum: 
          <strong> {percentages.totalDist?.toLocaleString()} NOK</strong>
        </p>
        <div className={styles.distributionGrid}>
          <div className={styles.distItem}>
            <span className={styles.percentBadge}>{percentages.militaryAid}%</span>
            <div className={styles.inputGroup}>
              <label>Military Aid (NOK)</label>
              <input 
                type="number" 
                value={data.distribution.militaryAid} 
                onChange={(e) => handleDistChange('militaryAid', e.target.value)} 
              />
            </div>
          </div>
          <div className={styles.distItem}>
            <span className={styles.percentBadge}>{percentages.humanitarianAid}%</span>
            <div className={styles.inputGroup}>
              <label>Humanitarian Aid (NOK)</label>
              <input 
                type="number" 
                value={data.distribution.humanitarianAid} 
                onChange={(e) => handleDistChange('humanitarianAid', e.target.value)} 
              />
            </div>
          </div>
          <div className={styles.distItem}>
            <span className={styles.percentBadge}>{percentages.otherOrgsSupport}%</span>
            <div className={styles.inputGroup}>
              <label>Other Vol. Orgs Support (NOK)</label>
              <input 
                type="number" 
                value={data.distribution.otherOrgsSupport} 
                onChange={(e) => handleDistChange('otherOrgsSupport', e.target.value)} 
              />
            </div>
          </div>
          <div className={styles.distItem}>
            <span className={styles.percentBadge}>{percentages.other}%</span>
            <div className={styles.inputGroup}>
              <label>Other (NOK)</label>
              <input 
                type="number" 
                value={data.distribution.other} 
                onChange={(e) => handleDistChange('other', e.target.value)} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Allocations */}
      <div className={styles.sectionCard}>
        <h3 className={styles.sectionTitle}>Recent Project Allocations</h3>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Project/Recipient</th>
                <th>Category</th>
                <th>Date</th>
                <th>Amount (NOK)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.recentAllocations.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input 
                      type="text" 
                      value={item.project} 
                      onChange={(e) => handleAllocationChange(item.id, 'project', e.target.value)} 
                      style={{width: '90%'}}
                    />
                  </td>
                  <td>
                    <select 
                      value={item.categoryKey} 
                      onChange={(e) => handleAllocationChange(item.id, 'categoryKey', e.target.value)}
                    >
                      <option value="militaryAidTitle">Military Aid</option>
                      <option value="humanitarianAidTitle">Humanitarian Aid</option>
                      <option value="otherOrgsTitle">Other Orgs Support</option>
                      <option value="otherTitle">Other</option>
                    </select>
                  </td>
                  <td>
                    <input 
                      type="text" 
                      value={item.date} 
                      onChange={(e) => handleAllocationChange(item.id, 'date', e.target.value)} 
                      style={{width: '90%'}}
                    />
                  </td>
                  <td>
                    <input 
                      type="text" 
                      value={item.amount} 
                      onChange={(e) => handleAllocationChange(item.id, 'amount', e.target.value)} 
                      style={{width: '90%'}}
                    />
                  </td>
                  <td>
                    <button 
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteAllocation(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className={styles.addBtn} onClick={handleAddAllocation}>
          + Add New Project Allocation
        </button>
      </div>
    </div>
  );
};

export default ReportManager;
