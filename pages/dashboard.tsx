import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';

const Dashboard = () => {
  // State hooks
  const [students, setStudents] = useState(JSON.parse(process.env.STUDENTS_JSON || '[]'));
  const [chats, setChats] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');

  // Fetch chat history when selectedStudent changes
  useEffect(() => {
    if (selectedStudent) {
      axios.get(`/api/chat_history?user_id=${selectedStudent}`)
        .then(response => {
          setChats(response.data);
        })
        .catch(error => {
          console.error('Error fetching chat history:', error);
        });
    }
  }, [selectedStudent]);

  // Function to filter and display chats based on selected student
  const displayChats = (studentId) => {
    setSelectedStudent(studentId);
  };

  return (
    <>
      <Head>
        <title>Teacher Dashboard</title>
      </Head>

      <h1>Teacher Dashboard</h1>
      <h2>Select a student to view their chat history:</h2>
      <select onChange={(e) => displayChats(e.target.value)}>
        <option value="">--Select--</option>
        {students.map((student, index) => (
          <option key={index} value={student.user_id}>{student.student_name}</option>
        ))}
      </select>

      <div className="chat">
        {chats.map((chat, index) => (
          <div key={index}>
            <strong>{chat.timestamp}:</strong> <em>{chat.question}</em> <span>{chat.response}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default Dashboard;
