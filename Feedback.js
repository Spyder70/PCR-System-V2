import React, { useState } from 'react';
import axios from 'axios'
import '../views/feedback.css'
import styled from 'styled-components';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';
import Topbar from '../layouts/ClientMain/components/Topbar/Topbar';


// CSS container to enhace looks of our form
const FeedbackContainer = styled.div`

form {
  position: absolute;
  top: 53%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 600px;
  width: 100%;
  max-height: 600px; 
  overflow-y: auto; 
  padding: 20px;
  border: 1px solid #ccc;
  box-sizing: border-box; 
  margin: 50px auto; 
}

h1 {
  text-align: center; 
  font-size: 24px; 
  color: #000; 
}

h2 {
  text-align: center;
  color: #333;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
}

input,
select,
textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 15px;
}

th, td {
  padding: 12px;
  text-align: center;
}

table input[type="radio"] {
  border: none;
}

button {
  background-color: rgb(31, 6, 168);
  color: #fff;
  padding: 14px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #1e2df6;
}

@media only screen and (max-width: 600px) {
  form {
    width: 90%;
  }
}

@media only screen and (max-width: 600px) {
  /* Adjust the max-width value as needed */
  body {
    overflow-x: auto;
  }
}

`;
// The CSS will be ending here
const Feedback = () => {

  const history = useHistory();

  const [values, setValues] = useState({
    fname: '',
    lname: '',
    email: '',
    ttype: '',
    dateRange: '',
    testDate: '',
    venue: '',
    staff: '',
    equipment: '',
    overall: '',
    feedback: '',
  });
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:8081/pcr3', values)
      .then(res => {
        console.log("Data sent Successfully!");
        toast.success("Thank you for your valuable Feedback 🙇");
        // Reset the form
        setValues({
          fname: '',
          lname: '',
          email: '',
          ttype: '',
          dateRange: '',
          testDate: '',
          venue: '',
          staff: '',
          equipment: '',
          overall: '',
          feedback: '',
        });
        history.push("/occasions");

      })
      .catch(err => {
        console.log(err);
        toast.error("Oops something went wrong!");
      });
  };

  return (
    <div>
   <Topbar/>
      {/* The image section added */}
      <div className="flex h-screen">
        <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3 xl:w-1/3 p-5 mx-auto bg-white animate__animated animate__fadeIn">
          <div className="flex mb-4">
            <img
              src="/logo.png"
              alt=""
              className="mx-auto"
              style={{ maxHeight: "60px" }}
            />
          </div>
          <div className="text-center mb-10">
            <p style={{ fontSize: 18 }} className="whitespace-pre-wrap">
              {process.env.REACT_APP_SYSTEM_NAME}
            </p>
          </div>
        </div>
      </div>
      {/* The image section added */}
      <FeedbackContainer>
        <form onSubmit={handleSubmit}>
          <h1>Event-Servey</h1>
          <div>
            <label>Name</label>
            <input type="text" name="fname" onChange={handleChange} placeholder='First Name' required />
          </div>
          <div>
            <input type="text" name="lname" onChange={handleChange} placeholder='Last Name' required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} placeholder='email' required />
          </div>
          <div>
            <div>
              <label>Test category</label>
              <select name="ttype" onChange={handleChange} required>
                <option value="">Select...</option>
                <option value="PCR-Test">PCR Test</option>
                <option value="Antigent-Test">Antigent-Test</option>
              </select>
            </div>
            <div>
              <label>Select the Date Range</label>
              <input
                type="date"
                name="dateRange"
                value={values.dateRange}
                onInput={handleChange}
                required
              />
            </div>
            <div>
              <label>Test Date</label>
              <input
                type="date"
                name="testDate"
                value={values.testDate}
                onInput={handleChange}
                required
              />
            </div>
            <label><center>Rate the following criteria for service excellence</center></label>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>Excellent</th>
                  <th>Good</th>
                  <th>Satisfactory</th>
                  <th>Poor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Venue</td>
                  <td><input type="radio" name="venue" value="Excellent" onChange={handleChange} required /></td>
                  <td><input type="radio" name="venue" value="Good" onChange={handleChange} required /></td>
                  <td><input type="radio" name="venue" value="Satisfactory" onChange={handleChange} required /></td>
                  <td><input type="radio" name="venue" value="Poor" onChange={handleChange} required /></td>
                </tr>
                <tr required>
                  <td>Staff Behavior</td>
                  <td><input type="radio" name="staff" value="Excellent" onChange={handleChange} required /></td>
                  <td><input type="radio" name="staff" value="Good" onChange={handleChange} required /></td>
                  <td><input type="radio" name="staff" value="Satisfactory" onChange={handleChange} required /></td>
                  <td><input type="radio" name="staff" value="Poor" onChange={handleChange} required /></td>
                </tr>
                <tr required>
                  <td>Equipment</td>
                  <td><input type="radio" name="equipment" value="Excellent" onChange={handleChange} required /></td>
                  <td><input type="radio" name="equipment" value="Good" onChange={handleChange} required /></td>
                  <td><input type="radio" name="equipment" value="Satisfactory" onChange={handleChange} required /></td>
                  <td><input type="radio" name="equipment" value="Poor" onChange={handleChange} required /></td>
                </tr>
                <tr required>
                  <td>Overall Experience</td>
                  <td><input type="radio" name="overall" value="Excellent" onChange={handleChange} required /></td>
                  <td><input type="radio" name="overall" value="Good" onChange={handleChange} required /></td>
                  <td><input type="radio" name="overall" value="Satisfactory" onChange={handleChange} required /></td>
                  <td><input type="radio" name="overall" value="Poor" onChange={handleChange} required /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <textarea name="feedback"
              onChange={handleChange}
              placeholder="Your FeedBack"
              required
            >
            </textarea>
          </div>
          <div>
            <center><button type="submit">Submit</button></center>
          </div>
        </form>
      </FeedbackContainer>
    </div>

  )
}

export default Feedback