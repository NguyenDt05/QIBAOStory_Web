import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../../api/statsService';

export default function Dashboard() {
  const [statCards, setStatCards] = useState([]);
  useEffect(() => { getDashboardStats().then(setStatCards); }, []);

  return (
    <div className="container-fluid">
      <div className="row g-4">
        {statCards.map(card => (
          <div key={card.title} className="col-12 col-sm-6 col-xl-3">
            <Link to={card.link} className="text-decoration-none">
              <div className="stat-card" style={{ cursor: 'pointer' }}>
                <div className="stat-header">{card.title}</div>
                <div className="stat-body">
                  <div className="stat-number">{card.count}</div>
                  <small className="text-muted">{card.description}</small>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
