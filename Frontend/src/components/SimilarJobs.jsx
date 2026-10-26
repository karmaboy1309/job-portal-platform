import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../services/jobService';
import { formatSalary } from '../utils/formatSalary';
import { BriefcaseIcon, LocationIcon } from './Icons';

/**
 * Displays recommended / similar jobs for a role based on category and skills
 */
const SimilarJobs = ({ currentJobId, category, skills = [], type }) => {
  const navigate = useNavigate();
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSimilar = async () => {
      try {
        setLoading(true);
        const res = await getJobs();
        const all = res?.data || res || [];

        const filtered = all
          .filter((j) => String(j._id) !== String(currentJobId))
          .map((j) => {
            let score = 0;
            if (category && j.category === category) score += 3;
            if (type && j.type === type) score += 2;
            if (Array.isArray(skills) && Array.isArray(j.skills)) {
              const matches = j.skills.filter((s) => skills.includes(s));
              score += matches.length;
            }
            return { job: j, score };
          })
          .filter((item) => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3)
          .map((item) => item.job);

        if (isMounted) {
          setSimilar(filtered);
        }
      } catch (err) {
        console.error('Failed to load similar jobs', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (currentJobId) {
      fetchSimilar();
    }

    return () => {
      isMounted = false;
    };
  }, [currentJobId, category, type, skills]);

  if (loading || similar.length === 0) return null;

  return (
    <div className="similar-jobs-section" style={{ marginTop: 40, borderTop: '1px solid var(--clr-border, #334155)', paddingTop: 28 }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
        Similar Opportunities
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
        {similar.map((j) => (
          <div
            key={j._id}
            className="card"
            onClick={() => navigate(`/jobs/${j._id}`)}
            style={{
              padding: 16,
              cursor: 'pointer',
              borderRadius: 'var(--radius-md, 8px)',
              background: 'var(--clr-surface-2, rgba(255,255,255,0.03))',
              border: '1px solid var(--clr-border, #334155)',
              transition: 'transform 0.2s, border-color 0.2s',
            }}
          >
            <h4 style={{ fontSize: 15, fontWeight: 600, margin: '0 0 6px 0', color: 'var(--clr-text, #ffffff)' }}>
              {j.title}
            </h4>
            <div style={{ fontSize: 13, color: 'var(--clr-text-secondary, #94a3b8)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>{j.company}</span>
              {j.location && (
                <>
                  <span>•</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <LocationIcon size={12} />
                    {j.location}
                  </span>
                </>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12 }}>
              <span className="badge badge-blue">{j.type || 'Full-time'}</span>
              <span style={{ fontWeight: 600, color: 'var(--clr-primary-light, #7c3aed)' }}>
                {formatSalary(j.salary, '$')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarJobs;
