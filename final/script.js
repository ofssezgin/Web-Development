let studentList = [];    //Array is too long so I created this array bottom of the page.
let lectureList = [{ name: '3507 Web Development and Programming', gradingScale: 1},
                   { name: 'Database Design', gradingScale: 2},
                   { name: 'Software Engineering', gradingScale: 1}];
let selectedLectureIndex = -1;
let globalStudentIdCounter = 1;

function calculateLetterGrade(grade, gradingScale) {      // Calculate letter grade according to grading scale.
  if (gradingScale === 1) {
    if (grade >= 90 && grade <= 100) {
      return 'A';
    } else if (grade >= 80 && grade < 90) {
      return 'B';
    } else if (grade >= 70 && grade < 80) {
      return 'C';
    } else if (grade >= 60 && grade < 70) {
      return 'D';
    } else if (grade >= 0 && grade < 60) {
      return 'F';
    } else {
      return 'Error: Invalid Grade';
    }
  } else if (gradingScale === 2) {
    if (grade >= 93 && grade <= 100) {
      return 'A';
    } else if (grade >= 85 && grade < 93) {
      return 'B';
    } else if (grade >= 77 && grade < 85) {
      return 'C';
    } else if (grade >= 70 && grade < 77) {
      return 'D';
    } else if (grade >= 0 && grade < 70) {
      return 'F';
    } else {
      return 'Error: Invalid Grade';
    }
}
}

function calculateGPA(letterGrade) {            // Calculate GPA
  switch (letterGrade) {
    case 'A':
      return 4.0;
    case 'B':
      return 3.0;
    case 'C':
      return 2.0;
    case 'D':
      return 1.0;
    case 'F':
      return 0.0;
    default:
      return 0.0;
  }
}

function populateTable() {              // Populate table
  const tableBody = document.getElementById('tableBody');
  tableBody.innerHTML = '';

  studentList.forEach((student, index) => {
    if (selectedLectureIndex === -1 || student.lectureIndex === selectedLectureIndex) {
      const row = tableBody.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      const cell4 = row.insertCell(3);
      const cell5 = row.insertCell(4);
      const cell6 = row.insertCell(5);

      cell1.textContent = student.id;
      cell2.textContent = student.name;
      cell3.textContent = student.midtermScore;
      cell4.textContent = student.finalScore;
      cell5.textContent = calculateLetterGrade((student.midtermScore * 0.4) + (student.finalScore * 0.6), student.gradingScale);

      cell6.innerHTML += `<button onclick="deleteStudent(${index})">Delete</button>`;
    }
  });

  updateGPA();
}

function deleteStudent(index) {           // Delete student
  studentList.splice(index, 1);
  populateTable();
}


function addStudent() {           // Add student
    const studentIdInput = document.getElementById('studentId');
    const studentNameInput = document.getElementById('studentName');
    const midtermScoreInput = document.getElementById('midtermScore');
    const finalScoreInput = document.getElementById('finalScore');
  
    const id = studentIdInput.value.trim();
    const name = studentNameInput.value.trim();
    const midtermScore = parseInt(midtermScoreInput.value);
    const finalScore = parseInt(finalScoreInput.value);
  
    // Check if the entered student ID is a valid integer
    if (!isNaN(id) && Number.isInteger(parseFloat(id)) && selectedLectureIndex !== -1 &&
      id !== '' &&
      name !== '' &&
      !isNaN(midtermScore) &&
      midtermScore >= 0 &&
      midtermScore <= 100 &&
      !isNaN(finalScore) &&
      finalScore >= 0 &&
      finalScore <= 100
    ) {
      // Check if the entered student ID is unique across all students
      inputId = parseInt(id);
      if (isUniqueStudentId(inputId, name, selectedLectureIndex)) {
        const selectedLecture = lectureList[selectedLectureIndex];
        const totalScore = (midtermScore * 0.4) + (finalScore * 0.6);
        const letterGrade = calculateLetterGrade(totalScore, selectedLecture.gradingScale);
  
        const newStudent = {
          id: inputId,
          name: name,
          midtermScore: midtermScore,
          finalScore: finalScore,
          gradingScale: selectedLecture.gradingScale,
          lectureIndex: selectedLectureIndex,
          letterGrade: letterGrade
        };
  
        studentList.push(newStudent);
        // Populate table after adding a new student.
        populateTable();
        
        // Clear the input fields
        studentIdInput.value = '';
        studentNameInput.value = '';
        midtermScoreInput.value = '';
        finalScoreInput.value = '';
      } else {
        alert('Student ID must be a unique integer for each student.');
      }
    } else {
      alert('Please enter a valid integer ID, name, midterm score, final score, and select a lecture.');
    }
  }
  // Check if student ID is unique across all students or is there anyone with the same name and ID in the same lecture.
  function isUniqueStudentId(inputId, name, selectedLectureIndex) {
    for (let i = 0; i < studentList.length; i++) {
      let student = studentList[i];
      
      if ((student.id === inputId && student.name !== name) || (student.id === inputId && student.lectureIndex === selectedLectureIndex)) {
          return false;
      }
  }
      return true;
  }

function updateGPA() {
  const gpaContainer = document.getElementById('gpaContainer');
  const studentGPA = document.getElementById('studentGPA');

  if (selectedLectureIndex !== -1) {
    const selectedLecture = lectureList[selectedLectureIndex];
    const studentsForLecture = studentList.filter(student => student.lectureIndex === selectedLectureIndex);

    if (studentsForLecture.length > 0) {
      const totalGPA = studentsForLecture.reduce((acc, student) => acc + calculateGPA(student.letterGrade), 0);
      const averageGPA = totalGPA / studentsForLecture.length;
      studentGPA.textContent = `Average GPA for ${selectedLecture.name}: ${averageGPA.toFixed(2)}`;
      gpaContainer.style.display = 'block';
    } else {
      gpaContainer.style.display = 'none';
    }
  } else {
    gpaContainer.style.display = 'none';
  }
}

function addLecture() {           // Add lecture
  const lectureNameInput = prompt('Enter lecture name:');
  const gradingScaleInput = prompt('Enter grading scale (1 or 2):');
  const gradingScale = parseInt(gradingScaleInput);

  if (lectureNameInput !== null && gradingScaleInput !== null && !isNaN(gradingScale) && (gradingScale === 1 || gradingScale === 2)) {
    // Check if the lecture name already exists in the lecture list
    const existingLecture = lectureList.find(lecture => lecture.name === lectureNameInput);
    if (existingLecture) {
      alert('Lecture already exists. Please enter another lecture.');
      return;
    }

    const newLecture = {
      name: lectureNameInput,
      gradingScale: gradingScale
    };

    lectureList.push(newLecture);
    // Populate table after adding a new lecture.
    updateLectureList();
  } else {
    alert('Invalid input. Please enter a valid lecture name and grading scale (1 or 2).');
  }
}

// Function to calculate the mean score of a group of students
function calculateMeanScore(students) {
  const totalScore = students.reduce((sum, student) => sum + (student.midtermScore * 0.4 + student.finalScore * 0.6), 0);
  return totalScore / students.length;
}

// Function to display a table of students
function displayStudentTable(students) {
  const tableContainer = document.getElementById('studentsTable');
  tableContainer.innerHTML = '';

  if (students.length > 0) {
    const table = document.createElement('table');
    table.className = 'result-table';

    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Student ID', 'Student Name', 'Midterm Score', 'Final Score', 'Letter Grade'];
    
    headers.forEach(headerText => {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table body
    const tbody = document.createElement('tbody');
    
    students.forEach(student => {
      const row = document.createElement('tr');
      const data = [student.id, student.name, student.midtermScore, student.finalScore, student.letterGrade];
      
      data.forEach(cellData => {
        const td = document.createElement('td');
        td.textContent = cellData;
        row.appendChild(td);
      });

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
  } else {
    tableContainer.textContent = 'No data available.';
  }
}
// Funtion to update lecture list.
function updateLectureList() {
  const lectureListContainer = document.getElementById('lectureList');
  lectureListContainer.innerHTML = '';

  lectureList.forEach((lecture, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = lecture.name;

    const deleteButton = document.createElement('button1');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
      deleteLecture(index);
    };

    const selectButton = document.createElement('button2');
    selectButton.textContent = 'Select';
    selectButton.onclick = function() {
      selectLecture(index);
    };

    listItem.appendChild(deleteButton);
    listItem.appendChild(selectButton);
    lectureListContainer.appendChild(listItem);
  });
}
// Function to display all students' results for the selected lecture
function viewAllStudentsResults() {
  if (selectedLectureIndex !== -1) {
    const selectedLecture = lectureList[selectedLectureIndex];
    const studentsInLecture = studentList.filter(student => student.lectureIndex === selectedLectureIndex);

    if (studentsInLecture.length > 0) {
      const resultString = studentsInLecture.map(student => {
        return `Student: ${student.id}, ${student.name}, ${student.letterGrade}`;
      }).join('\n');

      alert(`All Students' Results for ${selectedLecture.name}:\n\n${resultString}`);
    } else {
      alert('No student data available for the selected lecture.');
    }
  } else {
    alert('Please select a lecture first.');
  }
}


// Function to filter and display failed students for the selected lecture
function viewFailedStudents() {
  if (selectedLectureIndex !== -1) {
    const selectedLecture = lectureList[selectedLectureIndex];
    const studentsInLecture = studentList.filter(student => student.lectureIndex === selectedLectureIndex);
    const failedStudents = studentsInLecture.filter(student => student.letterGrade === 'F');

    if (failedStudents.length > 0) {
      const resultString = failedStudents.map(student => {
        return `Student: ${student.id}, ${student.name}, ${student.letterGrade}`;
      }).join('\n');

      alert(`Failed Students for ${selectedLecture.name}:\n\n${resultString}`);
    } else {
      alert(`No failed students for ${selectedLecture.name}.`);
    }
  } else {
    alert('Please select a lecture first.');
  }
}


// Function to filter and display passed students for the selected lecture
function viewPassedStudents() {
  if (selectedLectureIndex !== -1) {
    const selectedLecture = lectureList[selectedLectureIndex];
    const studentsInLecture = studentList.filter(student => student.lectureIndex === selectedLectureIndex);
    const passedStudents = studentsInLecture.filter(student => student.letterGrade !== 'F');

    if (passedStudents.length > 0) {
      const resultString = passedStudents.map(student => {
        return `Student: ${student.id}, ${student.name}, ${student.letterGrade}`;
      }).join('\n');

      alert(`Passed Students for ${selectedLecture.name}:\n\n${resultString}`);
    } else {
      alert(`No passed students for ${selectedLecture.name}.`);
    }
  } else {
    alert('Please select a lecture first.');
  }
}


// Function to view detailed statistics for the selected lecture
function viewLectureDetails() {
  if (selectedLectureIndex !== -1) {
    const selectedLecture = lectureList[selectedLectureIndex];
    const studentsInLecture = studentList.filter(student => student.lectureIndex === selectedLectureIndex);
    
    const passedStudents = studentsInLecture.filter(student => student.letterGrade !== 'F');
    const failedStudents = studentsInLecture.filter(student => student.letterGrade === 'F');
    
    const meanScore = calculateMeanScore(studentsInLecture);

    alert(`Lecture Details for ${selectedLecture.name}:
      - Number of Passed Students: ${passedStudents.length}
      - Number of Failed Students: ${failedStudents.length}
      - Mean Score of the Entire Class: ${meanScore.toFixed(2)}`);
  } else {
    alert('Please select a lecture first.');
  }
}
// Function to delete lecture.
function deleteLecture(index) {
  lectureList.splice(index, 1);
  updateLectureList();
  populateTable(); // Update the table after deleting a lecture
}
// Function to select lecture.
function selectLecture(index) {
  selectedLectureIndex = index;
  updateLectureList();
  showAddStudentContainer();
  populateTable();
}

function showAddStudentContainer() {
  const addStudentContainer = document.getElementById('addStudentContainer');
  addStudentContainer.style.display = 'block';
}

// Initial population of lecture list
updateLectureList();

const randomStudents = [
{ id: 1, name: 'Aylin Kaya', midtermScore: 87, finalScore: 96, lectureIndex: 0},
{ id: 2, name: 'Berkay Yıldırım', midtermScore: 37, finalScore: 53, lectureIndex: 0},
{ id: 3, name: 'Ceren Demir', midtermScore: 65, finalScore: 72, lectureIndex: 1},
{ id: 4, name: 'Deniz Arslan', midtermScore: 79, finalScore: 88, lectureIndex: 2},
{ id: 5, name: 'Emre Öztürk', midtermScore: 45, finalScore: 61, lectureIndex: 2},
{ id: 6, name: 'Figen Gül', midtermScore: 92, finalScore: 84, lectureIndex: 1},
{ id: 7, name: 'Gökhan Yıldız', midtermScore: 54, finalScore: 73, lectureIndex: 0},
{ id: 8, name: 'Hande Tekin', midtermScore: 68, finalScore: 79, lectureIndex: 1},
{ id: 9, name: 'Irmak Korkmaz', midtermScore: 78, finalScore: 91, lectureIndex: 2},
{ id: 10, name: 'Jale Özcan', midtermScore: 60, finalScore: 68, lectureIndex: 2},
{ id: 11, name: 'Kaan Yılmaz', midtermScore: 42, finalScore: 55, lectureIndex: 1},
{ id: 12, name: 'Leyla Çelik', midtermScore: 73, finalScore: 82, lectureIndex: 0},
{ id: 13, name: 'Mustafa Şahin', midtermScore: 58, finalScore: 64, lectureIndex: 0},
{ id: 14, name: 'Nur Kaya', midtermScore: 85, finalScore: 78, lectureIndex: 1},
{ id: 15, name: 'Orhan Güler', midtermScore: 50, finalScore: 66, lectureIndex: 2},
{ id: 16, name: 'Pelin Yılmaz', midtermScore: 62, finalScore: 70, lectureIndex: 2},
{ id: 17, name: 'Ramazan Demir', midtermScore: 72, finalScore: 86, lectureIndex: 1},
{ id: 18, name: 'Sevda Çetin', midtermScore: 57, finalScore: 67, lectureIndex: 0},
{ id: 19, name: 'Tolga Arı', midtermScore: 80, finalScore: 92, lectureIndex: 1},
{ id: 20, name: 'Umut Kaya', midtermScore: 48, finalScore: 58, lectureIndex: 2},
{ id: 21, name: 'Vildan Yıldırım', midtermScore: 66, finalScore: 74, lectureIndex: 2},
{ id: 22, name: 'Zeynep Korkmaz', midtermScore: 95, finalScore: 89, lectureIndex: 1},
{ id: 23, name: 'Ahmet Yılmaz', midtermScore: 64, finalScore: 77, lectureIndex: 0},
{ id: 24, name: 'Burak Tekin', midtermScore: 77, finalScore: 83, lectureIndex: 1},
{ id: 25, name: 'Derya Çelik', midtermScore: 52, finalScore: 63, lectureIndex: 2},
{ id: 26, name: 'Eren Yıldız', midtermScore: 69, finalScore: 75, lectureIndex: 2},
{ id: 27, name: 'Fulya Kaya', midtermScore: 89, finalScore: 94, lectureIndex: 1},
{ id: 28, name: 'Gürkan Yılmaz', midtermScore: 75, finalScore: 80, lectureIndex: 0},
{ id: 29, name: 'Hülya Demir', midtermScore: 56, finalScore: 62, lectureIndex: 0},
{ id: 30, name: 'İsmail Arslan', midtermScore: 71, finalScore: 88, lectureIndex: 1},
{ id: 31, name: 'Jülide Öztürk', midtermScore: 49, finalScore: 54, lectureIndex: 2},
{ id: 32, name: 'Kadir Gül', midtermScore: 63, finalScore: 72, lectureIndex: 2},
{ id: 33, name: 'Lale Tekin', midtermScore: 72, finalScore: 85, lectureIndex: 1},
{ id: 34, name: 'Mehmet Korkmaz', midtermScore: 59, finalScore: 66, lectureIndex: 0},
{ id: 35, name: 'Nihan Yıldırım', midtermScore: 61, finalScore: 74, lectureIndex: 1},
{ id: 36, name: 'Oğuzhan Demir', midtermScore: 68, finalScore: 78, lectureIndex: 2},
{ id: 37, name: 'Pınar Yılmaz', midtermScore: 44, finalScore: 59, lectureIndex: 2},
{ id: 38, name: 'Recep Arı', midtermScore: 67, finalScore: 80, lectureIndex: 1},
{ id: 39, name: 'Şule Kaya', midtermScore: 83, finalScore: 91, lectureIndex: 0},
{ id: 40, name: 'Tarkan Yıldız', midtermScore: 54, finalScore: 62, lectureIndex: 0},
{ id: 41, name: 'Ümit Tekin', midtermScore: 75, finalScore: 84, lectureIndex: 1},
{ id: 42, name: 'Vildan Arslan', midtermScore: 46, finalScore: 57, lectureIndex: 2},
{ id: 43, name: 'Yusuf Gür', midtermScore: 62, finalScore: 70, lectureIndex: 2},
{ id: 44, name: 'Zeynep Demir', midtermScore: 79, finalScore: 86, lectureIndex: 1},
{ id: 45, name: 'Ahmet Tekin', midtermScore: 58, finalScore: 65, lectureIndex: 0},
{ id: 46, name: 'Burcu Yıldırım', midtermScore: 66, finalScore: 74, lectureIndex: 0},
{ id: 47, name: 'Cihan Kaya', midtermScore: 43, finalScore: 58, lectureIndex: 1},
{ id: 48, name: 'Deniz Arı', midtermScore: 71, finalScore: 79, lectureIndex: 2},
{ id: 49, name: 'Ece Gür', midtermScore: 53, finalScore: 63, lectureIndex: 2},
{ id: 50, name: 'Fatih Tekin', midtermScore: 68, finalScore: 77, lectureIndex: 1},
];
// Function to add students from the list
function addStudentFromList() {
  randomStudents.forEach(student => {
    const selectedLecture = lectureList[student.lectureIndex];
    const totalScore = (student.midtermScore * 0.4) + (student.finalScore * 0.6);
    const letterGrade = calculateLetterGrade(totalScore, selectedLecture.gradingScale);

    const newStudent = {
      id: student.id,
      name: student.name,
      midtermScore: student.midtermScore,
      finalScore: student.finalScore,
      gradingScale: selectedLecture.gradingScale,
      lectureIndex: student.lectureIndex,
      letterGrade: letterGrade
    };

    studentList.push(newStudent);
  });

  populateTable();
}
addStudentFromList();
