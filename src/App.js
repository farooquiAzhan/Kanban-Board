import React, { useState, useEffect } from 'react';
import './App.css';
import Select from 'react-select';
import BacklogIcon from './assets/icons/Backlog.svg';
import DoneIcon from './assets/icons/Done.svg';
import ToDoIcon from './assets/icons/To-do.svg';
import HighPriorityIcon from './assets/icons/Img - High Priority.svg';
import LowPriorityIcon from './assets/icons/Img - Low Priority.svg';
import MediumPriorityIcon from './assets/icons/Img - Medium Priority.svg';
import UrgentPriorityIcon from './assets/icons/SVG - Urgent Priority colour.svg';
import DisplayIcon from './assets/icons/Display.svg';
import DownIcon from './assets/icons/down.svg';

// API URL for fetching tasks
const apiUrl = 'https://api.quicksell.co/v1/internal/frontend-assignment';

// Grouping and Sorting options
const groupOptions = [
  { value: 'status', label: 'Status' },
  { value: 'user', label: 'User' },
  { value: 'priority', label: 'Priority' },
];

const orderOptions = [
  { value: 'priority', label: 'Priority' },
  { value: 'title', label: 'Title' },
];

function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [groupBy, setGroupBy] = useState('status');
  const [orderBy, setOrderBy] = useState('priority');
  const [showDropdowns, setShowDropdowns] = useState(false); // State to manage dropdown visibility

  // Fetch tasks and users data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data && data.tickets && Array.isArray(data.tickets) && data.users && Array.isArray(data.users)) {
          setTasks(data.tickets);
          setUsers(data.users); // Save users data separately
        } else {
          console.error("Fetched data is not in the correct format");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchData();
  }, []);

  // Handle changes in Grouping and Ordering dropdowns
  const handleGroupChange = (selectedOption) => {
    setGroupBy(selectedOption.value);
  };

  const handleOrderChange = (selectedOption) => {
    setOrderBy(selectedOption.value);
  };

  // Toggle the visibility of the dropdowns when Display button is clicked
  const toggleDropdowns = () => {
    setShowDropdowns(!showDropdowns);
  };

  // Create a mapping from userId to user name
  const userMapping = users.reduce((map, user) => {
    map[user.id] = user.name; // Mapping userId to user name
    return map;
  }, {});

  // Function to group tasks by 'status', 'user', or 'priority'
  const groupTasks = (tasks, groupBy) => {
    if (groupBy === 'status') {
      return tasks.reduce((groups, task) => {
        const status = task.status ? task.status.toLowerCase() : 'backlog'; // Ensure status is lowercase
        if (!groups[status]) {
          groups[status] = [];
        }
        groups[status].push(task);
        return groups;
      }, {});
    } else if (groupBy === 'user') {
      return tasks.reduce((groups, task) => {
        const userName = userMapping[task.userId] || 'Unassigned'; // Get the user's name based on userId
        if (!groups[userName]) {
          groups[userName] = [];
        }
        groups[userName].push(task);
        return groups;
      }, {});
    } else if (groupBy === 'priority') {
      return tasks.reduce((groups, task) => {
        const priority = task.priority;
        if (!groups[priority]) {
          groups[priority] = [];
        }
        groups[priority].push(task);
        return groups;
      }, {});
    }
  };

  // Function to sort tasks based on 'priority' or 'title'
  const sortTasks = (tasks, orderBy) => {
    return [...tasks].sort((a, b) => {
      if (orderBy === 'priority') {
        return b.priority - a.priority; // Sort by priority in descending order
      } else if (orderBy === 'title') {
        return a.title.localeCompare(b.title); // Sort by title in ascending order
      }
    });
  };

  // Group and sort the tasks
  const groupedTasks = groupTasks(tasks, groupBy);
  const sortedGroupedTasks = Object.keys(groupedTasks).reduce((acc, key) => {
    acc[key] = sortTasks(groupedTasks[key], orderBy);
    return acc;
  }, {});

  // Function to get the appropriate icon for a task
  const getIconForTask = (task) => {
    if (task.status === 'backlog') return BacklogIcon;
    if (task.status === 'done') return DoneIcon;
    if (task.status === 'to-do') return ToDoIcon;
    if (task.priority === 1) return UrgentPriorityIcon;
    if (task.priority === 2) return HighPriorityIcon;
    if (task.priority === 3) return MediumPriorityIcon;
    if (task.priority === 4) return LowPriorityIcon;
    return BacklogIcon; // Default icon
  };

  return (
    <div className="App">
      <h1>Kanban Board</h1>

      {/* Display button to toggle dropdown visibility */}
      <div className="dropdowns">
        <button className="display-btn" onClick={toggleDropdowns}>
          <img src={DisplayIcon} alt="Display" />
          Display
        </button>

        {showDropdowns && (
          <>
            <Select
              options={groupOptions}
              onChange={handleGroupChange}
              placeholder={
                <span>
                  <img src={DownIcon} alt="Group By" />
                  Group By
                </span>
              }
              className="dropdown"
            />
            <Select
              options={orderOptions}
              onChange={handleOrderChange}
              placeholder={
                <span>
                  <img src={DownIcon} alt="Order By" />
                  Order By
                </span>
              }
              className="dropdown"
            />
          </>
        )}
      </div>

      {/* Kanban board rendering */}
      <div className="kanban-board">
        {Object.keys(sortedGroupedTasks).map((group, index) => (
          <div key={index} className="kanban-column">
            <h2>{group}</h2>
            <div className="kanban-column-body">
              {sortedGroupedTasks[group].map((task) => (
                <div key={task.id} className="kanban-card">
                  <img src={getIconForTask(task)} alt={`${task.status} icon`} className="task-icon" />
                  <h3>{task.title}</h3>
                  <p>Priority: {task.priority}</p>
                  <p>User: {userMapping[task.userId] || 'Unassigned'}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
