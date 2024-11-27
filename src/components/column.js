import React from 'react';
import Ticket from './Ticket'; // Assuming a Ticket component is used to display individual tickets

function Columns({ groupedTickets }) {
  return (
    <div className="columns">
      {groupedTickets.map((group, index) => (
        <div key={index} className="column">
          <h2>{group.group}</h2>
          {group.tickets.map((ticket) => (
            <Ticket key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Columns;
