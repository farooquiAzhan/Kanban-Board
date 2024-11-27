import React, { useState } from 'react';
import Columns from './Columns';
import useTickets from './useTickets'; // Importing the custom hook

const KanbanBoard = () => {
  const [grouping, setGrouping] = useState('Status'); // Default grouping: by status
  const [sorting, setSorting] = useState('Priority'); // Default sorting: by priority

  // Get the grouped tickets from the custom hook
  const { groupedTickets } = useTickets(grouping, sorting);

  return (
    <div className="kanban-board">
      <div className="controls">
        <div>
          <label>Display</label>
          <select onChange={(e) => setGrouping(e.target.value)} value={grouping}>
            <option value="Status">Group by Status</option>
            <option value="User">Group by User</option>
            <option value="Priority">Group by Priority</option>
          </select>
        </div>
        <div>
          <label>Ordering</label>
          <select onChange={(e) => setSorting(e.target.value)} value={sorting}>
            <option value="Priority">Order by Priority</option>
            <option value="Title">Order by Title</option>
          </select>
        </div>
      </div>
      <Columns groupedTickets={groupedTickets} />
    </div>
  );
};

export default KanbanBoard;
