import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import NotificationBell from './notifications/NotificationBell';
import '../styles/navigation.css';

function Navigation() {
  const location = useLocation();
  const { pathname } = location;

  return (
    <nav className="navbar navbar-expand-lg navbar-blur fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Project Management System</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink 
                className="nav-link" 
                to="/" 
                isActive={() => pathname === '/'} 
                activeClassName="active"
              >
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className="nav-link" 
                to="/projects" 
                isActive={() => pathname.startsWith('/projects')}
                activeClassName="active"
              >
                <i className="bi bi-kanban me-1"></i> Projects
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className="nav-link" 
                to="/resources" 
                isActive={() => pathname.startsWith('/resources')}
                activeClassName="active"
              >
                <i className="bi bi-people me-1"></i> Resources
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className="nav-link" 
                to="/risks" 
                isActive={() => pathname.startsWith('/risks')}
                activeClassName="active"
              >
                <i className="bi bi-shield-exclamation me-1"></i> Risks
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className="nav-link" 
                to="/reports" 
                isActive={() => pathname.startsWith('/reports')}
                activeClassName="active"
              >
                <i className="bi bi-file-earmark-bar-graph me-1"></i> Reports
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className="nav-link" 
                to="/analytics" 
                isActive={() => pathname.startsWith('/analytics')}
                activeClassName="active"
              >
                <i className="bi bi-graph-up me-1"></i> Analytics
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className="nav-link" 
                to="/stakeholders" 
                isActive={() => pathname.startsWith('/stakeholders')}
                activeClassName="active"
              >
                <i className="bi bi-people-fill me-1"></i> Stakeholders
              </NavLink>
            </li>
          </ul>
          
          <div className="d-flex align-items-center">
            <NotificationBell />
            
            <div className="dropdown ms-3">
              <button className="btn btn-outline-light dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="bi bi-person-circle me-1"></i> User
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li><Link className="dropdown-item" to="/profile"><i className="bi bi-person me-2"></i>Profile</Link></li>
                <li><Link className="dropdown-item" to="/settings"><i className="bi bi-gear me-2"></i>Settings</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><button className="dropdown-item"><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
