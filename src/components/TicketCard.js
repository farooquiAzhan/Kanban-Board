import React from 'react';

function Ticket({ ticket }) {
  return (
    <div className="ticket">
      <h3>{ticket.title}</h3>
      <p>Priority: {ticket.priority}</p>
      <p>Assigned to: {ticket.assignedTo}</p>
    </div>
  );
}

export default Ticket;
