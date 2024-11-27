import { useState, useEffect } from 'react';

const useTickets = (grouping, sorting) => {
  const [tickets, setTickets] = useState([]);
  const [groupedTickets, setGroupedTickets] = useState([]);

  // Fetch tickets from the API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);  // Set loading state to true before fetching
    
        const response = await fetch('https://api.quicksell.co/v1/internal/frontend-assignment');
        const result = await response.json();
    
        // Log the fetched data to inspect its structure
        console.log('Fetched Data:', result);
    
        // Check if the result contains the 'tickets' array
        if (result && Array.isArray(result.tickets)) {
          setTasks(result.tickets);  // Set the fetched tasks to state
          setError('');  // Reset error state if data is valid
        } else {
          console.error('Fetched data does not contain an array of tickets:', result);
          setError('Failed to fetch tasks. Data is not in the correct format.');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);  // Set loading to false when done
      }
    };
    
    fetchTickets();
  }, []);

  // Group tickets by status, user, or priority
  useEffect(() => {
    const groupTickets = () => {
      let grouped = [];

      switch (grouping) {
        case 'Status':
          grouped = groupBy(tickets, 'status');
          break;
        case 'User':
          grouped = groupBy(tickets, 'assignedTo');
          break;
        case 'Priority':
          grouped = groupBy(tickets, 'priority');
          break;
        default:
          grouped = tickets; // If no grouping, just show all tickets
      }

      // Sort tickets within each group
      grouped = grouped.map((group) => ({
        ...group,
        tickets: sortTickets(group.tickets, sorting),
      }));

      setGroupedTickets(grouped);
    };

    if (tickets.length > 0) {
      groupTickets();
    }
  }, [tickets, grouping, sorting]);

  // Helper function to group tickets by a key
  const groupBy = (array, key) => {
    return array.reduce((result, ticket) => {
      const groupKey = ticket[key] || 'No Group'; // Handle null or undefined values
      if (!result[groupKey]) {
        result[groupKey] = { group: groupKey, tickets: [] };
      }
      result[groupKey].tickets.push(ticket);
      return result;
    }, []);
  };

  // Helper function to sort tickets by priority or title
  const sortTickets = (tickets, sorting) => {
    if (sorting === 'Priority') {
      return tickets.sort((a, b) => b.priority - a.priority);
    } else if (sorting === 'Title') {
      return tickets.sort((a, b) => a.title.localeCompare(b.title));
    }
    return tickets; // Default, no sorting
  };

  return { groupedTickets };
};

export default useTickets;
