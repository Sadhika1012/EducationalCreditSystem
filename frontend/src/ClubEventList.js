import React, { useState, useEffect } from 'react';
import './ClubEventList.css';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { TARGET_URL } from './Config.js';

const ClubEventList = () => {
  const [modifyButtonVisible, setModifyButtonVisible] = useState(false);
  const [participantButtonVisible, setParticipantButtonVisible] = useState(false);
  const [facultyButtonVisible, setFacultyButtonVisible] = useState(false);
  const [addEventButtonVisible, setAddEventButtonVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState([]);
  const history = useHistory();

  const handleAddEvent = () => {
    history.push('/AddEvent');
    window.location.reload();
  };

  const handleEventDetails = (event) => {
    history.push('/EventDetails', { event });
    window.location.reload();
  };

  const handleParticipants = (eventId, eventName) => {
    history.push('/Participants', { eventId, eventName });
    window.location.reload();
  };

  const handleOrgCommittee = (eventId) => {
    history.push('/OrgCommittee', { eventId });
    window.location.reload();
  };

  const handleModify = (event) => {
    const { id, name } = event;
    history.push('/FormDetails', { id, name });
    window.location.reload();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          TARGET_URL + '/events/get/',
          {
            cookies: document.cookie,
          },
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          setEvents(response.data['events']);
          if (response.data['group'] === 'clubs') {
            setModifyButtonVisible(true);
            setAddEventButtonVisible(true);
            setParticipantButtonVisible(true);
            setFacultyButtonVisible(true);
          } else if (response.data['group'] === 'faculties' || response.data['group'] === 'student') {
            setParticipantButtonVisible(true);
          }
          if (response.data['group'] === 'faculties') {
            setFacultyButtonVisible(true);
          }
        }
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEventList = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="clubeventlist-container">
      <h2 className="clubeventlist-title">Club Event List</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by event name..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
      </div>
      <table className="clubeventlist-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Date</th>
            <th>Details</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredEventList.map((event) => (
            <tr key={event.id}>
              <td>
                <button onClick={() => handleEventDetails(event)} className="ButtonStyle">
                  {event.name}
                </button>
              </td>
              <td>{event.date}</td>
              <td>{event.details}</td>
              <td>
                {participantButtonVisible && (
                  <button onClick={() => handleParticipants(event.id, event.name)} className="ButtonStyle">
                    Participants
                  </button>
                )}
              </td>
              <td>
                {facultyButtonVisible && (
                  <button onClick={() => handleOrgCommittee(event.id)} className="ButtonStyle">
                    Organising Committee
                  </button>
                )}
              </td>
              {/* <td>
                {modifyButtonVisible && (
                  <button onClick={() => handleModify(event)} className="ButtonStyle">
                    Modify
                  </button>
                )}
              </td> */}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="add-event-container">
        {addEventButtonVisible && (
          <button onClick={handleAddEvent} className="ButtonStyle">
            Add Event
          </button>
        )}
      </div>
    </div>
  );
};

export default ClubEventList;
