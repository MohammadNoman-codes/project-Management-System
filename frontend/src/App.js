import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Projects from './components/Projects';
import ProjectPage from './components/ProjectPage';
import TaskPage from './components/TaskPage';
import ResourcePage from './components/resources/ResourcePage';
import ReportingDashboard from './components/reporting/ReportingDashboard';
import RiskManagement from './components/risk/RiskManagement';
import DocumentRepository from './components/documents/DocumentRepository';
import StakeholderManagement from './components/stakeholders/StakeholderManagement';
import AnalyticsPage from './components/analytics/AnalyticsPage';
import { NotificationProvider } from './contexts/NotificationContext';
import ProjectTemplateSelection from './components/ProjectTemplates';
import CreateProject from './components/CreateProject';


function App() {
  return (
    <Router>
      <NotificationProvider>
        <Navigation />
        <div className="container-fluid py-4">
          <Switch>
            <Route exact path="/" component={Dashboard} />
            <Route exact path="/projects" component={Projects} />
            <Route exact path="/projects/new" component={CreateProject} />
            <Route exact path="/projects/templates" component={ProjectTemplateSelection} />
            <Route path="/projects/:id" component={ProjectPage} />
            <Route exact path="/projects/:projectId/tasks" component={TaskPage} />
            <Route exact path="/tasks" component={() => <TaskPage />} />
            <Route path="/tasks/:taskId" component={TaskPage} />
            <Route exact path="/resources" component={ResourcePage} />
            <Route path="/projects/:projectId/resources" component={ResourcePage} />
            <Route path="/projects/:projectId/risks" component={RiskManagement} />
            <Route exact path="/risks" component={RiskManagement} />
            <Route path="/risks/:projectId" component={RiskManagement} />
            <Route path="/projects/:projectId/documents" component={DocumentRepository} />
            <Route path="/projects/:projectId/stakeholders" component={StakeholderManagement} />
            <Route path="/stakeholders" component = {StakeholderManagement} />
            <Route path="/reports" component={ReportingDashboard} />
            <Route path="/analytics" component={AnalyticsPage} />
            <Route path="/projects/:projectId/analytics" component={AnalyticsPage} />
          </Switch>
        </div>
      </NotificationProvider>
    </Router>
  );
}

export default App;
