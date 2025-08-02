// // src/components/AssignMentorTable.js

// import React, { useState, useEffect } from "react";
// import styles from "./AssignMentorTable.module.css"; // Import as a module
// import { useNavigate } from "react-router-dom";

// function AssignMentorTable() {
//   const navigate = useNavigate();
//   // States for tracking data related to mentees, mentors, assignments, and UI state

//   const [newMentee, setNewMentee] = useState(null);
//   const [newMentor, setNewMentor] = useState(null);
//   const [mentors, setMentors] = useState([]);
//   const [menteesList, setMenteesList] = useState([]);
//   const [relationships, setRelationships] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [errorMessage, setErrorMessage] = useState("");
//   // User data and theme state

//   const user = JSON.parse(sessionStorage.getItem("user"));
//   const name = user['name']
//   const adminName = name || "Admin";
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   // Function to toggle dark mode theme

//   const toggleTheme = () => {
//     setIsDarkMode(!isDarkMode);
//     document.body.className = isDarkMode ? "" : "dark-mode";
//   };
//   // Function to fetch all names and relationships via Functions written here
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         await Promise.all([
//           fetchMentorNames(),
//           fetchMenteeNames(),
//           fetchRelationships(),
//         ]);
//       } catch (error) {
//         setErrorMessage("Failed to fetch data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);
//   // Function to fetch all names and relationships via API and database

//   const fetchMentorNames = async () => {
//     const response = await fetch("http://localhost:3001/api/mentors");
//     if (response.ok) {
//       const data = await response.json();
//       setMentors(data);
//     } else {
//       setErrorMessage("Failed to fetch mentors");
//     }
//   };
//   // Fetch all mentee names from the API

//   const fetchMenteeNames = async () => {
//     const response = await fetch("http://localhost:3001/api/mentees");
//     if (response.ok) {
//       const data = await response.json();
//       setMenteesList(data);
//     } else {
//       setErrorMessage("Failed to fetch mentees");
//     }
//   };
//   // Fetch all relationship data from the API

//   const fetchRelationships = async () => {
//     const response = await fetch("http://localhost:3001/api/relationships");
//     if (response.ok) {
//       const data = await response.json();
//       setRelationships(data);
//     } else {
//       setErrorMessage("Failed to fetch relationships");
//     }
//   };
//   // Assign mentor to mentee

//   const handleAssignMentor = async () => {
//     if (newMentee && newMentor) {
//       const newAssignment = {
//         menteekey: newMentee.userid,
//         mentorkey: newMentor.userid,
//       };
//       try {
//         const response = await fetch(
//           "http://localhost:3001/api/relationships/assign",
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(newAssignment),
//           }
//         );
//         if (response.ok) {
//           await fetchRelationships();
//           setNewMentee(null);
//           setNewMentor(null);
//           setErrorMessage("");
//         } else {
//           setErrorMessage("Failed to assign mentor");
//         }
//       } catch (error) {
//         setErrorMessage("An unexpected error occurred");
//       }
//     } else {
//       setErrorMessage("Please select both a mentor and a mentee.");
//     }
//   };
//   // changes relationships for mentor to mentee

//   const handleUpdateMentor = async (menteekey, newMentorkey) => {
//     try {
//       const response = await fetch(
//         "http://localhost:3001/api/relationships/update",
//         {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ menteekey, mentorkey: newMentorkey }),
//         }
//       );
//       if (response.ok) {
//         await fetchRelationships();
//       } else {
//         setErrorMessage("Failed to update mentor");
//       }
//     } catch {
//       setErrorMessage("An unexpected error occurred");
//     }
//   };
//   // deletes mentor to mentee

//   const handleDeleteAssignment = async (relationship_id) => {
//     try {
//       const response = await fetch(
//         `http://localhost:3001/api/relationships/${relationship_id}`,
//         {
//           method: "DELETE",
//         }
//       );
//       if (response.ok) {
//         await fetchRelationships();
//       } else {
//         setErrorMessage("Failed to delete assignment");
//       }
//     } catch {
//       setErrorMessage("An unexpected error occurred");
//     }
//   };

//   return (
//     <div className={styles.assignMentor}>
//       {/* Add Assignment Section */}
//       <div className={styles.addAssignment}>
//         <select
//           className={styles.option}
//           value={newMentee ? newMentee.userid : ""}
//           onChange={(e) => {
//             const mentee = menteesList.find(
//               (m) => m.userid === e.target.value
//             );
//             setNewMentee(mentee);
//           }}
//         >
//           <option value="">-- Select Mentee --</option>
//           {menteesList.map((mentee) => (
//             <option key={mentee.userid} value={mentee.userid}>
//               {mentee.name} {mentee.lastname}
//             </option>
//           ))}
//         </select>
//         <select
//           className={styles.option}
//           value={newMentor ? newMentor.userid : ""}
//           onChange={(e) => {
//             const mentor = mentors.find((m) => m.userid === e.target.value);
//             setNewMentor(mentor);
//           }}
//         >
//           <option value="">-- Select Mentor --</option>
//           {mentors.map((mentor) => (
//             <option key={mentor.userid} value={mentor.userid}>
//               {mentor.name} {mentor.lastname}
//             </option>
//           ))}
//         </select>
//         <button className={styles.Assign} onClick={handleAssignMentor}>
//           Assign Mentor
//         </button>
//       </div>

//       {/* Error Message */}
//       {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

//       {/* Assignments Table */}
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <table className={styles.assignmentsTable}>
//           <thead>
//             <tr>
//               <th>Mentor</th>
//               <th>Mentee</th>
//               <th>Change Mentor</th>
//               <th>Delete</th>
//             </tr>
//           </thead>
//           <tbody>
//             {relationships.map((rel) => (
//               <tr key={rel.relationship_id}>
//                 <td>
//                   {rel.mentor_name} {rel.mentor_lastname}
//                 </td>
//                 <td>
//                   {rel.mentee_name} {rel.mentee_lastname}
//                 </td>
//                 <td>
//                   <select
//                     onChange={(e) => {
//                       const newMentorkey = e.target.value;
//                       if (newMentorkey)
//                         handleUpdateMentor(rel.menteekey, newMentorkey);
//                     }}
//                     className={styles.option}
//                   >
//                     <option value="">Select Mentor</option>
//                     {mentors.map((mentor) => (
//                       <option key={mentor.userid} value={mentor.userid}>
//                         {mentor.name} {mentor.lastname}
//                       </option>
//                     ))}
//                   </select>
//                 </td>
//                 <td>
//                   <button
//                     onClick={() =>
//                       handleDeleteAssignment(rel.relationship_id)
//                     }
//                     className={styles.deleteButton}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default AssignMentorTable;
