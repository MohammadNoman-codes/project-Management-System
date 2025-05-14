import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import ResourceAvailabilityForm from './ResourceAvailabilityForm';

// Setup the localizer for the calendar
const localizer = momentLocalizer(moment);

function ResourceCalendar({ resources: externalResources = [], purpleColors }) {
  // Purple-themed color palette for styling to match Dashboard
  const colors = purpleColors || {
    // Primary purple shades
    primary: '#6a4c93',      // Deep purple
    secondary: '#8363ac',    // Medium purple
    tertiary: '#9d80c3',     // Light purple
    quaternary: '#b39ddb',   // Lavender
    quinary: '#d1c4e9',      // Very light purple
    
    // Complementary colors
    accent1: '#4d4398',      // Blue-purple
    accent2: '#7e57c2',      // Brighter purple
    accent3: '#5e35b1',      // Deeper violet
    
    // Functional colors for status
    completed: '#7986cb',    // Blue-ish purple
    inProgress: '#9575cd',   // Medium purple
    review: '#5c6bc0',       // Blue-purple
    todo: '#673ab7',         // Deep purple
  };
  
  // Safe hexToRgb function that handles undefined values
  const safeHexToRgb = (hex) => {
    if (!hex) return '0, 0, 0'; // Default fallback for undefined/null
    try {
      // Remove the # if present
      hex = hex.replace('#', '');
      
      // Parse the hex values
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      return `${r}, ${g}, ${b}`;
    } catch (error) {
      console.error("Error in hexToRgb:", error);
      return '0, 0, 0'; // Fallback if any error occurs
    }
  };

  const [resources, setResources] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedResource, setSelectedResource] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(new Date().setMonth(new Date().getMonth() + 2)) // Default to 2 months view
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewType, setViewType] = useState('month');
  
  // Use external resources if provided, otherwise load our own
  useEffect(() => {
    if (externalResources && externalResources.length > 0) {
      setResources(externalResources);
    } else {
      // Simulate API call
      const fetchResources = async () => {
        // Mock data - in real app, this would be an API call
        const resourceData = [
          { id: 1, name: 'John Doe', department: 'Development', role: 'Senior Developer', avatar: 'https://via.placeholder.com/40' },
          { id: 2, name: 'Jane Smith', department: 'Design', role: 'UI/UX Designer', avatar: 'https://via.placeholder.com/40' },
          { id: 3, name: 'Robert Johnson', department: 'Development', role: 'Backend Developer', avatar: 'https://via.placeholder.com/40' },
          { id: 4, name: 'Emily Davis', department: 'QA', role: 'Test Engineer', avatar: 'https://via.placeholder.com/40' },
          { id: 5, name: 'Michael Wilson', department: 'Development', role: 'Frontend Developer', avatar: 'https://via.placeholder.com/40' }
        ];
        
        setResources(resourceData);
      };
      
      fetchResources();
    }
  }, [externalResources]);
  
  // Load availability events (in a real app, this would fetch from API)
  useEffect(() => {
    // Simulate API call
    const fetchEvents = async () => {
      // Create events for this month and next month to show availability
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      // Helper function to generate dates
      const generateDate = (year, month, day) => new Date(year, month, day);
      
      // Mock data - in real app, this would be an API call
      const eventData = [
        // Projects for John Doe - Resource ID 1
        {
          id: 1,
          resourceId: 1,
          title: 'Project Alpha',
          start: generateDate(currentYear, currentMonth, 5),
          end: generateDate(currentYear, currentMonth, 15),
          allDay: true,
          type: 'allocation',
          allocationPercentage: 50,
          project: { id: 101, name: 'Project Alpha' }
        },
        {
          id: 2,
          resourceId: 1,
          title: 'Project Beta',
          start: generateDate(currentYear, currentMonth, 10),
          end: generateDate(currentYear, currentMonth, 22),
          allDay: true,
          type: 'allocation',
          allocationPercentage: 30,
          project: { id: 102, name: 'Project Beta' }
        },
        {
          id: 3,
          resourceId: 1,
          title: 'Training Week',
          start: generateDate(currentYear, currentMonth + 1, 1),
          end: generateDate(currentYear, currentMonth + 1, 5),
          allDay: true,
          type: 'unavailable',
          reason: 'Technical Training'
        },
        
        // Projects for Jane Smith - Resource ID 2
        {
          id: 4,
          resourceId: 2,
          title: 'UI Design Sprint',
          start: generateDate(currentYear, currentMonth, 8),
          end: generateDate(currentYear, currentMonth, 12),
          allDay: true,
          type: 'allocation',
          allocationPercentage: 100,
          project: { id: 101, name: 'Project Alpha' }
        },
        {
          id: 5,
          resourceId: 2,
          title: 'UX Research',
          start: generateDate(currentYear, currentMonth, 18),
          end: generateDate(currentYear, currentMonth, 25),
          allDay: true,
          type: 'allocation',
          allocationPercentage: 80,
          project: { id: 103, name: 'Project Gamma' }
        },
        {
          id: 6,
          resourceId: 2,
          title: 'Annual Leave',
          start: generateDate(currentYear, currentMonth + 1, 10),
          end: generateDate(currentYear, currentMonth + 1, 20),
          allDay: true,
          type: 'unavailable',
          reason: 'Vacation'
        },
        
        // Projects for Robert Johnson - Resource ID 3
        {
          id: 7,
          resourceId: 3,
          title: 'API Development',
          start: generateDate(currentYear, currentMonth, 1),
          end: generateDate(currentYear, currentMonth, 18),
          allDay: true,
          type: 'allocation',
          allocationPercentage: 70,
          project: { id: 102, name: 'Project Beta' }
        },
        {
          id: 8,
          resourceId: 3,
          title: 'On Leave',
          start: generateDate(currentYear, currentMonth, 22),
          end: generateDate(currentYear, currentMonth, 26),
          allDay: true,
          type: 'unavailable',
          reason: 'Vacation'
        },
        {
          id: 9,
          resourceId: 3,
          title: 'Database Migration',
          start: generateDate(currentYear, currentMonth + 1, 2),
          end: generateDate(currentYear, currentMonth + 1, 12),
          allDay: true,
          type: 'allocation',
          allocationPercentage: 90,
          project: { id: 104, name: 'Project Delta' }
        },
        
        // Projects for Emily Davis - Resource ID 4
        {
          id: 10,
          resourceId: 4,
          title: 'QA Testing',
          start: generateDate(currentYear, currentMonth, 15),
          end: generateDate(currentYear, currentMonth, 28),
          allDay: true,
          type: 'allocation',
          allocationPercentage: 60,
          project: { id: 101, name: 'Project Alpha' }
        },
        {
          id: 11,
          resourceId: 4,
          title: 'Training',
          start: generateDate(currentYear, currentMonth, 8),
          end: generateDate(currentYear, currentMonth, 10),
          allDay: true,
          type: 'unavailable',
          reason: 'QA Process Training'
        },
        {
          id: 12,
          resourceId: 4,
          title: 'Regression Testing',
          start: generateDate(currentYear, currentMonth + 1, 5),
          end: generateDate(currentYear, currentMonth + 1, 15),
          allDay: true,
          type: 'allocation',
          allocationPercentage: 75,
          project: { id: 102, name: 'Project Beta' }
        },
        
        // Projects for Michael Wilson - Resource ID 5
        {
          id: 13,
          resourceId: 5,
          title: 'Frontend Development',
          start: generateDate(currentYear, currentMonth, 3),
          end: generateDate(currentYear, currentMonth, 17),
          allDay: true,
          type: 'allocation',
          allocationPercentage: 85,
          project: { id: 103, name: 'Project Gamma' }
        },
        {
          id: 14,
          resourceId: 5,
          title: 'UI Component Library',
          start: generateDate(currentYear, currentMonth + 1, 1),
          end: generateDate(currentYear, currentMonth + 1, 22),
          allDay: true,
          type: 'allocation',
          allocationPercentage: 50,
          project: { id: 105, name: 'Project Epsilon' }
        }
      ];
      
      setEvents(eventData);
    };
    
    fetchEvents();
  }, []);
  
  // Get unique departments from resources
  const departments = [...new Set(resources.map(r => r.department).filter(Boolean))];
  
  // Filter events based on selected resource and date range
  const filteredEvents = events.filter(event => {
    // Filter by resource
    if (selectedResource !== 'all' && event.resourceId !== parseInt(selectedResource)) {
      return false;
    }
    
    // Filter by department
    if (selectedDepartment !== 'all') {
      const resource = resources.find(r => r.id === event.resourceId);
      if (resource?.department !== selectedDepartment) {
        return false;
      }
    }
    
    // Already filtered by date in the calendar component
    return true;
  });
  
  // Event style customization with purple palette
  const eventStyleGetter = (event) => {
    let style = {
      border: '0px',
      borderRadius: '6px',
      opacity: 0.85,
      color: 'white',
      display: 'block',
      textAlign: 'left',
      paddingLeft: '6px',
      paddingTop: '2px',
      paddingBottom: '2px',
      fontSize: '0.85rem'
    };
    
    if (event.type === 'allocation') {
      // Color based on allocation percentage
      if (event.allocationPercentage < 50) {
        style.backgroundColor = colors.completed; // Low allocation - blue/purple
      } else if (event.allocationPercentage < 100) {
        style.backgroundColor = colors.tertiary; // Medium allocation - lighter purple
      } else {
        style.backgroundColor = colors.accent2; // Full allocation - bright purple
      }
    } else if (event.type === 'unavailable') {
      style.backgroundColor = colors.quaternary; // Unavailable - lavender
    }
    
    return {
      style
    };
  };
  
  // Handle calendar view change
  const handleViewChange = (view) => {
    setViewType(view);
  };
  
  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowAddModal(true);
  };
  
  // Handle date selection (for adding new availability/allocation)
  const handleSelectSlot = ({ start, end }) => {
    setSelectedDate({ start, end });
    setSelectedEvent(null);
    setShowAddModal(true);
  };
  
  // Handle saving availability/allocation
  const handleSaveAvailability = (data) => {
    if (selectedEvent) {
      // Update existing event
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === selectedEvent.id ? { ...event, ...data } : event
        )
      );
    } else {
      // Add new event
      const newEvent = {
        id: Date.now(),
        ...data
      };
      setEvents(prevEvents => [...prevEvents, newEvent]);
    }
    
    setShowAddModal(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };
  
  // Format event title for display
  const formatEventTitle = (event) => {
    if (event.type === 'allocation') {
      return `${event.title} (${event.allocationPercentage}%)`;
    }
    return event.title;
  };

  return (
    <div className="resource-calendar">
      <div className="dashboard-card mb-4">
        <div className="card-header bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="dashboard-section-title mb-0">
              <i className="bi bi-calendar3-week me-2"></i>Resource Calendar
            </h5>
            <div className="btn-group">
              <button 
                className={`btn btn-sm ${viewType === 'month' ? 'btn-primary' : 'btn-outline-primary'} rounded-start`}
                onClick={() => handleViewChange('month')}
                style={viewType === 'month' ? {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary
                } : {
                  borderColor: colors.primary,
                  color: colors.primary
                }}
              >
                Month
              </button>
              <button 
                className={`btn btn-sm ${viewType === 'week' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleViewChange('week')}
                style={viewType === 'week' ? {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary
                } : {
                  borderColor: colors.primary,
                  color: colors.primary
                }}
              >
                Week
              </button>
              <button 
                className={`btn btn-sm ${viewType === 'day' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => handleViewChange('day')}
                style={viewType === 'day' ? {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary
                } : {
                  borderColor: colors.primary,
                  color: colors.primary
                }}
              >
                Day
              </button>
              <button 
                className={`btn btn-sm ${viewType === 'agenda' ? 'btn-primary' : 'btn-outline-primary'} rounded-end`}
                onClick={() => handleViewChange('agenda')}
                style={viewType === 'agenda' ? {
                  backgroundColor: colors.primary,
                  borderColor: colors.primary
                } : {
                  borderColor: colors.primary,
                  color: colors.primary
                }}
              >
                Agenda
              </button>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3 mb-2 mb-md-0">
              <div className="input-group">
                <span className="input-group-text" style={{ color: colors.primary }}>
                  <i className="bi bi-person"></i>
                </span>
                <select 
                  className="form-select"
                  value={selectedResource}
                  onChange={(e) => setSelectedResource(e.target.value)}
                >
                  <option value="all">All Resources</option>
                  {resources.map(resource => (
                    <option key={resource.id} value={resource.id}>
                      {resource.name} - {resource.role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="col-md-3 mb-2 mb-md-0">
              <div className="input-group">
                <span className="input-group-text" style={{ color: colors.primary }}>
                  <i className="bi bi-building"></i>
                </span>
                <select
                  className="form-select"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="all">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="col-md-6 text-md-end">
              <button 
                className="btn btn-primary rounded-pill w-100 w-md-auto"
                onClick={() => {
                  setSelectedEvent(null);
                  setSelectedDate({ start: new Date(), end: new Date(new Date().setDate(new Date().getDate() + 1)) });
                  setShowAddModal(true);
                }}
                style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
              >
                <i className="bi bi-plus-circle me-1"></i> Add Allocation/Unavailability
              </button>
            </div>
          </div>
          
          <div className="calendar-container" style={{ height: '700px' }}>
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              titleAccessor={(event) => formatEventTitle(event)}
              style={{ 
                height: '100%',
                fontFamily: "'Inter', 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" 
              }}
              views={['month', 'week', 'day', 'agenda']}
              view={viewType}
              onView={handleViewChange}
              selectable
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              eventPropGetter={eventStyleGetter}
              dayPropGetter={(date) => ({
                style: {
                  backgroundColor: date.getDate() === new Date().getDate() && 
                                  date.getMonth() === new Date().getMonth() && 
                                  date.getFullYear() === new Date().getFullYear() 
                    ? `rgba(${safeHexToRgb(colors.quinary)}, 0.2)` 
                    : undefined
                }
              })}
              popup
            />
          </div>
        </div>
      </div>
      
      <div className="dashboard-card mb-4">
        <div className="card-header bg-white">
          <h5 className="dashboard-section-title mb-0">
            <i className="bi bi-info-circle me-2"></i>Legend
          </h5>
        </div>
        <div className="card-body">
          <div className="d-flex flex-wrap">
            <div className="me-4 mb-2">
              <span className="badge p-2 me-2" style={{ backgroundColor: colors.completed, opacity: 0.85 }}>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className="small">Low Allocation (&lt;50%)</span>
            </div>
            <div className="me-4 mb-2">
              <span className="badge p-2 me-2" style={{ backgroundColor: colors.tertiary, opacity: 0.85 }}>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className="small">Medium Allocation (50-99%)</span>
            </div>
            <div className="me-4 mb-2">
              <span className="badge p-2 me-2" style={{ backgroundColor: colors.accent2, opacity: 0.85 }}>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className="small">Full Allocation (100%)</span>
            </div>
            <div className="mb-2">
              <span className="badge p-2 me-2" style={{ backgroundColor: colors.quaternary, opacity: 0.85 }}>&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className="small">Unavailable (Leave, Training, etc.)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal for adding/editing availability */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header" style={{ borderBottom: `1px solid rgba(${safeHexToRgb(colors.primary)}, 0.2)` }}>
                <h5 className="modal-title" style={{ color: colors.primary }}>
                  <i className="bi bi-calendar-plus me-2"></i>
                  {selectedEvent ? 'Edit' : 'Add'} Resource Allocation
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <ResourceAvailabilityForm 
                  event={selectedEvent}
                  date={selectedDate}
                  resources={resources}
                  onSave={handleSaveAvailability}
                  onCancel={() => setShowAddModal(false)}
                  purpleColors={colors}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResourceCalendar;
