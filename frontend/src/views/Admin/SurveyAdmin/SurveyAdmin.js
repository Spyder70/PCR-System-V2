import React, { useEffect, useState } from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import styled from 'styled-components';

const FeedbackContainer = styled.div`
  max-width: 1000px;
  margin: auto 30px;

  .h-title {
    width: 1250px;
    border-bottom-style: solid;
    border-color: #D3D3D3;
    border-width: 0px 0px 3px 0px;
  }
  h1 {
    text-align: left;
    font-size: 24px;
    color: #000;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  table {
    width: 125%;
    border-collapse: collapse;
    margin-bottom: 20px;
    margin-top: 15px;
    border-left: 1px solid #ddd;
  }
  tr th {
    padding: 12px;
    text-align: center;
    background-color: #21ACD7;
    color: white;
  }
  
  
  th, td {
    padding: 12px;
    text-align: center;
    color: #000;
    border-bottom: 1px solid #ddd;
    border-right: 1px solid #ddd;
  }
`;


function SurveyAdmin() {
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get('http://localhost:8080/api/eventsurvey/');
        console.log('Raw Data:', data);
        setSurveys(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    getData();
  }, []);


  // Function to delete the data
  const handleDelete = async (id) => {
    try {
      // Perform the delete operation using the survey id
      await axios.delete(`http://localhost:8080/api/eventsurvey/${id}`);

      // Update the surveys state to reflect the deletion
      setSurveys((prevSurveys) => prevSurveys.filter((survey) => survey.id !== id));
    } catch (error) {
      console.error('Error deleting survey:', error);
    }
  };
  return (
    <FeedbackContainer>
      <div className='h-title'>
        <h1>Feedback Data</h1>
      </div>
      <table>
        <thead>
          <tr>
            {/*<th>ID</th>*/}
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Test Type</th>
            <th>Date Range</th>
            <th>Test date</th>
            <th>Venue</th>
            <th>Staff Behavior</th>
            <th>Equipment</th>
            <th>Overall Experience</th>
            <th>Feedback</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {surveys.map(item => (
            <tr key={item.id}>
              {/*<td>{item.id}</td>*/}
              <td>{item.fname}</td>
              <td>{item.lname}</td>
              <td>{item.email}</td>
              <td>{item.ttype}</td>
              <td>{item.formattedDateRange}</td>
              <td>{item.formattedTestDate}</td>
              <td>{item.venue}</td>
              <td>{item.staff}</td>
              <td>{item.equipment}</td>
              <td>{item.overall}</td>
              <td>{item.feedback}</td>

              {/* delete button STARTS*/}
              <td style={{ textAlign: 'center' }}>
                <button
                  style={{
                    color: '#FFFFFF',
                    padding: '8px 12px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleDelete(item.id)}
                >
                  🚫
                </button>
              </td>
              {/* delete button ENDS*/}

            </tr>
          ))}
        </tbody>
      </table>
    </FeedbackContainer>
  );
}

export default withRouter(SurveyAdmin)


