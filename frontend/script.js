// ==========================================
// STUDYEASE - ADAPTIVE STUDY PLANNER
// Saves and restores student data using localStorage
// ==========================================

let studySubjects = [];
let completedSessions = 0;
let missedSessions = 0;
// ==========================================
// SAVE SUBJECTS TO MYSQL
// ==========================================

async function saveSubjectsToBackend(subjects) {
    const studentId = localStorage.getItem("studyEaseStudentId");

    if (!studentId) {
        console.warn("Please save student details before saving subjects.");
        return;
    }

    try {
        for (const subject of subjects) {
            const response = await fetch(
                `http://localhost:8080/api/subjects/${studentId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name: subject.name,
                        preparation: subject.preparation,
                        examDays: subject.examDays,
                        performance: subject.performance,
                        importance: subject.importance,
                        inputIndex: subject.inputIndex,
                        completed: subject.completed,
                        missed: subject.missed,
                        studyHours: subject.studyHours
                    })
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Failed to save subject: " + subject.name
                );
            }

            const savedSubject = await response.json();

            // Retain the MySQL subject ID for session tracking
            subject.databaseId = savedSubject.id;
        }

        console.log("Subjects saved to MySQL successfully.");
        saveAllData();

    } catch (error) {
        console.error("Error saving subjects to MySQL:", error);
        alert(
            "Subjects are saved locally, but saving to MySQL failed. " +
            "Please check the backend."
        );
    }
}

 // ==========================================
 // SAVE COMPLETED OR MISSED SESSIONS TO MYSQL
 // ==========================================

async function saveSessionToBackend(subject, status) {
    if (!subject.databaseId) {
        console.error(
            "Subject database ID is missing for:",
            subject.name
        );
        alert(
            "Please wait for subjects to finish saving, then try again."
        );
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:8080/api/sessions/${subject.databaseId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: status
                })
            }
        );

        if (!response.ok) {
            throw new Error("Failed to save study session.");
        }

        console.log(
            status + " session saved to MySQL for " + subject.name
        );

    } catch (error) {
        console.error("Error saving study session:", error);
        alert(
            "The session could not be saved to MySQL. " +
            "Please check the backend."
        );
    }
}

async function syncSubjectDatabaseIds() {
    const studentId = localStorage.getItem("studyEaseStudentId");

    if (!studentId) {
        console.warn("Student ID not found.");
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:8080/api/subjects/${studentId}`
        );

        if (!response.ok) {
            throw new Error("Could not load subjects from MySQL.");
        }

        const savedSubjects = await response.json();

        studySubjects.forEach(subject => {
            const savedSubject = savedSubjects.find(
                item =>
                    Number(item.inputIndex) === Number(subject.inputIndex)
            );

            if (savedSubject) {
                subject.databaseId = savedSubject.id;
            }
        });

        saveAllData();
        console.log("Subject database IDs synchronized.");

    } catch (error) {
        console.error("Error synchronizing subject IDs:", error);
    }
}



const STORAGE_KEYS = {
    studentName: "studentName",
    studyHours: "studyHours",
    studyTime: "studyTime",
    subjects: "studyEaseSubjects",
    completed: "completedSessions",
    missed: "missedSessions"
};


// ==========================================
// SAVE ALL DATA
// ==========================================

function saveAllData() {
    try {
        localStorage.setItem(
            STORAGE_KEYS.studentName,
            document.getElementById("studentName").value.trim()
        );

        localStorage.setItem(
            STORAGE_KEYS.studyHours,
            document.getElementById("studyHours").value
        );

        localStorage.setItem(
            STORAGE_KEYS.studyTime,
            document.getElementById("studyTime").value
        );

        // Save the latest subject form values
        const subjectsToSave = [];

        for (let i = 1; i <= 3; i++) {
            const existing = studySubjects.find(
                subject => subject.inputIndex === i
            );

            
subjectsToSave.push({
    name: document.getElementById("subject" + i + "Name").value.trim(),
    preparation: document.getElementById("subject" + i + "Preparation").value,
    examDays: document.getElementById("subject" + i + "ExamDays").value,
    performance: document.getElementById("subject" + i + "Performance").value,
    importance: document.getElementById("subject" + i + "Importance").value,
    inputIndex: i,
    databaseId: existing ? existing.databaseId : null,
    completed: existing ? Number(existing.completed) || 0 : 0,
    missed: existing ? Number(existing.missed) || 0 : 0,
    studyHours: existing ? Number(existing.studyHours) || 0 : 0
});

        }

        localStorage.setItem(
            STORAGE_KEYS.subjects,
            JSON.stringify(subjectsToSave)
        );

        localStorage.setItem(
            STORAGE_KEYS.completed,
            String(completedSessions)
        );

        localStorage.setItem(
            STORAGE_KEYS.missed,
            String(missedSessions)
        );

    } catch (error) {
        console.error("Error saving StudyEase data:", error);
        alert("Unable to save data. Please check your browser storage settings.");
    }
}


// ==========================================
// SAVE STUDENT INFORMATION
// ==========================================

async function saveStudent() {
    const name = document.getElementById("studentName").value.trim();
    const hoursValue = document.getElementById("studyHours").value;
    const hours = Number(hoursValue);
    const time = document.getElementById("studyTime").value;

    if (
        name === "" ||
        hoursValue === "" ||
        !Number.isFinite(hours) ||
        hours <= 0
    ) {
        alert("Please enter your name and valid available study hours.");
        return;
    }

    document.getElementById("displayHours").textContent =
        hours + " hours";

    document.getElementById("displayTime").textContent = time;

    document.getElementById("dashboard").style.display = "block";

    // Keep existing localStorage functionality
    saveAllData();
    updateSubjectProgress();

    // Save student details to the Spring Boot backend
    try {
        const response = await fetch("http://localhost:8080/api/students", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                preferredStudyTime: time,
                availableHours: hours
            })
        });

        if (!response.ok) {
            throw new Error("Failed to save student details");
        }
        const savedStudent = await response.json();
localStorage.setItem("studyEaseStudentId", savedStudent.id);

        alert("Welcome to StudyEase, " + name +
              "! Your details have been saved successfully.");

    } catch (error) {
        console.error("Backend connection error:", error);

        alert("Your details are saved locally, but the backend could not save them. Please check that the backend is running.");
    }
}


// ==========================================
// GENERATE ADAPTIVE STUDY PLAN
// ==========================================

function generatePlan() {
    const oldSubjects = studySubjects;
    const newSubjects = [];

    // Read all three subjects
    for (let i = 1; i <= 3; i++) {
        const name = document.getElementById("subject" + i + "Name").value.trim();

        const preparationValue =
            document.getElementById("subject" + i + "Preparation").value;

        const examDaysValue =
            document.getElementById("subject" + i + "ExamDays").value;

        const performanceValue =
            document.getElementById("subject" + i + "Performance").value;

        const importanceValue =
            document.getElementById("subject" + i + "Importance").value;

        if (name === "") {
            alert("Please enter the name for Subject " + i + ".");
            return;
        }

        if (
            preparationValue === "" ||
            examDaysValue === "" ||
            performanceValue === "" ||
            importanceValue === ""
        ) {
            alert("Please complete all fields for Subject " + i + ".");
            return;
        }

        const preparation = Number(preparationValue);
        const examDays = Number(examDaysValue);
        const performance = Number(performanceValue);
        const importance = Number(importanceValue);

        if (
            !Number.isFinite(preparation) ||
            preparation < 0 ||
            preparation > 100 ||
            !Number.isFinite(examDays) ||
            examDays < 0 ||
            !Number.isFinite(performance) ||
            performance < 0 ||
            performance > 100 ||
            !Number.isFinite(importance) ||
            importance < 1 ||
            importance > 5
        ) {
            alert(
                "Check Subject " + i +
                ": preparation and performance must be 0–100, " +
                "exam days cannot be negative, and importance must be 1–5."
            );
            return;
        }

        const previousSubject = oldSubjects.find(
            subject => subject.inputIndex === i
        );

        newSubjects.push({
            name: name,
            preparation: preparation,
            examDays: examDays,
            performance: performance,
            importance: importance,
            inputIndex: i,
            completed: previousSubject
                ? Number(previousSubject.completed) || 0
                : 0,
            missed: previousSubject
                ? Number(previousSubject.missed) || 0
                : 0,
            studyHours: 0
        });
    }

    studySubjects = newSubjects;

    // Calculate total session counts from individual subjects
    completedSessions = studySubjects.reduce(
        (sum, subject) => sum + subject.completed, 0
    );

    missedSessions = studySubjects.reduce(
        (sum, subject) => sum + subject.missed, 0
    );

    // ======================================
    // CALCULATE PRIORITY SCORES
    // ======================================

    studySubjects.forEach(subject => {
        const weaknessScore = 100 - subject.preparation;

        let urgencyScore;

        if (subject.examDays <= 1) {
            urgencyScore = 100;
        } else if (subject.examDays <= 3) {
            urgencyScore = 90;
        } else if (subject.examDays <= 7) {
            urgencyScore = 70;
        } else if (subject.examDays <= 14) {
            urgencyScore = 50;
        } else {
            urgencyScore = 30;
        }

        const performanceRisk = 100 - subject.performance;

        const totalSessions =
            subject.completed + subject.missed;

        const consistencyRisk = totalSessions > 0
            ? (subject.missed * 100) / totalSessions
            : 0;

        const importanceScore = subject.importance * 20;

        subject.priority =
            (weaknessScore * 0.25) +
            (urgencyScore * 0.25) +
            (performanceRisk * 0.20) +
            (importanceScore * 0.20) +
            (consistencyRisk * 0.10);

        if (subject.priority >= 70) {
            subject.recommendation =
                "High Priority - Study this subject first";
            subject.baseHours = 2;

        } else if (subject.priority >= 50) {
            subject.recommendation =
                "Medium Priority - Study this subject soon";
            subject.baseHours = 1.5;

        } else {
            subject.recommendation =
                "Low Priority - Can be studied later";
            subject.baseHours = 1;
        }
    });

    // Sort subjects by highest priority
    const sortedSubjects = [...studySubjects].sort(
        (a, b) => b.priority - a.priority
    );

    const hoursValue = document.getElementById("studyHours").value;
    const availableHours = Number(hoursValue);

    if (
        hoursValue === "" ||
        !Number.isFinite(availableHours) ||
        availableHours <= 0
    ) {
        alert("Please enter valid available study hours.");
        return;
    }

    // ======================================
    // ALLOCATE AVAILABLE HOURS
    // ======================================

    let usedHours = 0;

    sortedSubjects.forEach(subject => {
        subject.studyHours = subject.baseHours;
        usedHours += subject.baseHours;
    });

    if (usedHours > availableHours) {
        // Give hours to the highest-priority subjects first
        let remaining = availableHours;

        sortedSubjects.forEach(subject => {
            const allocated = Math.max(
                0,
                Math.min(subject.baseHours, remaining)
            );

            subject.studyHours = allocated;
            remaining -= allocated;
        });

    } else {
        // Distribute all extra time in blocks up to 0.5 hours
        let remainingExtra = availableHours - usedHours;
        let index = 0;

        while (
            remainingExtra > 0.000001 &&
            sortedSubjects.length > 0
        ) {
            const extra = Math.min(0.5, remainingExtra);

            sortedSubjects[index].studyHours += extra;
            remainingExtra -= extra;

            index = (index + 1) % sortedSubjects.length;
        }
    }

    // ======================================
    // BUILD STUDY PLAN
    // ======================================

    let planHTML = `
        <section class="card" id="adaptivePlan">
            <h2>Today's Adaptive Study Plan</h2>

            <p>
                Your study plan is based on weakness, exam urgency,
                performance, importance and study consistency.
            </p>
    `;

    sortedSubjects.forEach((subject, index) => {
        if (subject.studyHours <= 0) {
            return;
        }

        let priorityLabel;

        if (subject.priority >= 70) {
            priorityLabel = "High Priority";
        } else if (subject.priority >= 50) {
            priorityLabel = "Medium Priority";
        } else {
            priorityLabel = "Low Priority";
        }

        let reason;

        if (subject.examDays <= 3) {
            reason = subject.name +
                " has an upcoming exam in " +
                subject.examDays + " day(s).";

        } else if (subject.preparation < 50) {
            reason = subject.name +
                " has a low preparation level of " +
                subject.preparation + "%.";

        } else if (subject.performance < 50) {
            reason = subject.name +
                " has a low performance score of " +
                subject.performance + "%.";

        } else if (subject.missed > 0) {
            reason = subject.name +
                " has missed " + subject.missed +
                " study session(s).";

        } else if (subject.importance >= 4) {
            reason = subject.name +
                " has a high importance level of " +
                subject.importance + "/5.";

        } else {
            reason = subject.name +
                " needs regular study to maintain progress.";
        }

        const safeName = escapeHTML(subject.name);
        const safeReason = escapeHTML(reason);
        const safeRecommendation = escapeHTML(subject.recommendation);

        planHTML += `
            <div class="plan-item">
                <h3>${index + 1}. ${safeName}</h3>

                <p>
                    <strong>Study Time:</strong>
                    ${subject.studyHours.toFixed(1)} hours
                </p>

                <p>
                    <strong>Priority Score:</strong>
                    ${subject.priority.toFixed(1)}
                </p>

                <p><strong>${priorityLabel}</strong></p>

                <p>${safeRecommendation}</p>

                <p>
                    <strong>Preparation:</strong>
                    ${subject.preparation}%
                </p>

                <p>
                    <strong>Performance:</strong>
                    ${subject.performance}%
                </p>

                <p>
                    <strong>Completed:</strong> ${subject.completed}
                    &nbsp;&nbsp;
                    <strong>Missed:</strong> ${subject.missed}
                </p>

                <p>
                    💡 <strong>Why StudyEase selected this subject:</strong>
                </p>

                <p>${safeReason}</p>

                <button
                    type="button"
                    onclick="completeSubject(${subject.inputIndex})"
                >
                    ✅ Completed
                </button>

                <button
                    type="button"
                    onclick="missSubject(${subject.inputIndex})"
                >
                    ❌ Missed
                </button>
            </div>
        `;
    });

    const totalAllocatedHours = sortedSubjects.reduce(
        (sum, subject) => sum + subject.studyHours, 0
    );

    const remainingHours = Math.max(
        0,
        availableHours - totalAllocatedHours
    );

    planHTML += `
        <div class="plan-summary">
            <strong>Total Available Study Hours:</strong>
            ${availableHours.toFixed(1)} hours

            <br><br>

            <strong>Total Allocated Study Hours:</strong>
            ${totalAllocatedHours.toFixed(1)} hours

            <br><br>

            <strong>Remaining Study Hours:</strong>
            ${remainingHours.toFixed(1)} hours
        </div>
        </section>
    `;

    // Remove the old plan
    const oldPlan = document.getElementById("adaptivePlan");

    if (oldPlan) {
        oldPlan.remove();
    }

    const dashboard = document.getElementById("dashboard");

    if (!dashboard) {
        alert("Dashboard not found.");
        return;
    }

    // Display the new plan
    dashboard.insertAdjacentHTML("afterend", planHTML);

    document.getElementById("displayHours").textContent =
        availableHours + " hours";

    document.getElementById("displayTime").textContent =
        document.getElementById("studyTime").value;

    dashboard.style.display = "block";

    updateProgress();
updateSubjectProgress();
saveAllData();

// Save subjects to MySQL without changing planner calculations
saveSubjectsToBackend(studySubjects);

document.getElementById("planStatus").textContent = "Updated";
}


// ==========================================
// SAFELY DISPLAY USER-ENTERED TEXT
// ==========================================

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const replacements = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return replacements[character];
    });
}


// ==========================================
// COMPLETED SESSION
// ==========================================

function completeSubject(inputIndex) {
    const subject = studySubjects.find(
        item => item.inputIndex === inputIndex
    );

    if (!subject) {
        alert("Subject information not found.");
        return;
    }

    const performanceInput = prompt(
        "Enter your performance (0-100):",
        subject.performance
    );

    if (performanceInput === null) {
        return;
    }

    if (performanceInput.trim() === "") {
        alert("Please enter a performance between 0 and 100.");
        return;
    }

    const newPerformance = Number(performanceInput);

    if (
        !Number.isFinite(newPerformance) ||
        newPerformance < 0 ||
        newPerformance > 100
    ) {
        alert("Please enter a performance between 0 and 100.");
        return;
    }

    subject.completed++;
    subject.performance = newPerformance;

    if (newPerformance >= 80) {
        subject.preparation += 10;
    } else if (newPerformance >= 60) {
        subject.preparation += 7;
    } else if (newPerformance >= 40) {
        subject.preparation += 4;
    } else {
        subject.preparation += 2;
    }

    subject.preparation = Math.min(100, subject.preparation);

    document.getElementById(
        "subject" + inputIndex + "Performance"
    ).value = subject.performance;

    document.getElementById(
        "subject" + inputIndex + "Preparation"
    ).value = subject.preparation;

    completedSessions = studySubjects.reduce(
        (sum, item) => sum + item.completed, 0
    );

    missedSessions = studySubjects.reduce(
        (sum, item) => sum + item.missed, 0
    );


updateProgress();
updateSubjectProgress();
saveAllData();

// Save the completed session to MySQL
saveSessionToBackend(subject, "COMPLETED");

alert(
    subject.name +
    " completed! Your study plan has been updated."
);

generatePlan();

}


// ==========================================
// MISSED SESSION
// ==========================================

function missSubject(inputIndex) {
    const subject = studySubjects.find(
        item => item.inputIndex === inputIndex
    );

    if (!subject) {
        alert("Subject information not found.");
        return;
    }

    subject.missed++;

    subject.preparation = Math.max(
        0,
        subject.preparation - 5
    );

    document.getElementById(
        "subject" + inputIndex + "Preparation"
    ).value = subject.preparation;

    completedSessions = studySubjects.reduce(
        (sum, item) => sum + item.completed, 0
    );

    missedSessions = studySubjects.reduce(
        (sum, item) => sum + item.missed, 0
    );

updateProgress();
updateSubjectProgress();
saveAllData();

// Save the missed session to MySQL
saveSessionToBackend(subject, "MISSED");

alert(
    subject.name +
    " session missed! Your study plan has been updated."
);

generatePlan();

}


// ==========================================
// UPDATE DASHBOARD COUNTS
// ==========================================

function updateProgress() {
    const completedCount =
        document.getElementById("completedCount");

    const missedCount =
        document.getElementById("missedCount");

    const completionRate =
        document.getElementById("completionRate");

    const planStatus =
        document.getElementById("planStatus");

    if (completedCount) {
        completedCount.textContent = completedSessions;
    }

    if (missedCount) {
        missedCount.textContent = missedSessions;
    }

    const totalSessions = completedSessions + missedSessions;

    const rate = totalSessions > 0
        ? (completedSessions / totalSessions) * 100
        : 0;

    if (completionRate) {
        completionRate.textContent = rate.toFixed(0) + "%";
    }

    if (planStatus) {
        planStatus.textContent = "Updated";
    }
}


// ==========================================
// UPDATE SUBJECT PROGRESS BARS
// ==========================================

function updateSubjectProgress() {
    for (let i = 1; i <= 3; i++) {
        const nameInput =
            document.getElementById("subject" + i + "Name");

        const preparationInput =
            document.getElementById("subject" + i + "Preparation");

        const name = nameInput
            ? nameInput.value.trim()
            : "";

        const preparation =
            preparationInput && preparationInput.value !== ""
                ? Number(preparationInput.value)
                : 0;

        const nameElement =
            document.getElementById("progressSubject" + i + "Name");

        if (nameElement) {
            nameElement.textContent = name || "Subject " + i;
        }

        const valueElement =
            document.getElementById("progressSubject" + i + "Value");

        if (valueElement) {
            valueElement.textContent = preparation + "%";
        }

        const barElement =
            document.getElementById("progressSubject" + i + "Bar");

        if (barElement) {
            barElement.style.width =
                Math.max(0, Math.min(100, preparation)) + "%";
        }

        // These elements are optional in the current HTML.
        const subject = studySubjects.find(
            item => item.inputIndex === i
        );

        const completedElement =
            document.getElementById("progressSubject" + i + "Completed");

        const missedElement =
            document.getElementById("progressSubject" + i + "Missed");

        if (completedElement) {
            completedElement.textContent =
                subject ? subject.completed : 0;
        }

        if (missedElement) {
            missedElement.textContent =
                subject ? subject.missed : 0;
        }
    }
}


// ==========================================
// RESTORE SAVED DATA AFTER REFRESH
// ==========================================

function loadAllData() {
    try {
        const savedName =
            localStorage.getItem(STORAGE_KEYS.studentName);

        const savedHours =
            localStorage.getItem(STORAGE_KEYS.studyHours);

        const savedTime =
            localStorage.getItem(STORAGE_KEYS.studyTime);

        const savedSubjects =
            localStorage.getItem(STORAGE_KEYS.subjects);

        const savedCompleted =
            localStorage.getItem(STORAGE_KEYS.completed);

        const savedMissed =
            localStorage.getItem(STORAGE_KEYS.missed);

        // Restore student details
        if (savedName !== null) {
            document.getElementById("studentName").value =
                savedName;
        }

        if (savedHours !== null) {
            document.getElementById("studyHours").value =
                savedHours;
        }

        if (savedTime !== null) {
            document.getElementById("studyTime").value =
                savedTime;
        }

        // Restore all subject details
        if (savedSubjects) {
            const parsedSubjects = JSON.parse(savedSubjects);

            if (Array.isArray(parsedSubjects)) {
                studySubjects = parsedSubjects
                    .filter(subject =>
                        subject &&
                        Number.isInteger(Number(subject.inputIndex))
                    )
                    
.map(subject => ({
    ...subject,
    inputIndex: Number(subject.inputIndex),
    databaseId: subject.databaseId
        ? Number(subject.databaseId)
        : null,
    completed: Number(subject.completed) || 0,
    missed: Number(subject.missed) || 0
}));


                studySubjects.forEach(subject => {
                    const i = subject.inputIndex;

                    if (i < 1 || i > 3) {
                        return;
                    }

                    document.getElementById(
                        "subject" + i + "Name"
                    ).value = subject.name ?? "";

                    document.getElementById(
                        "subject" + i + "Preparation"
                    ).value = subject.preparation ?? "";

                    document.getElementById(
                        "subject" + i + "ExamDays"
                    ).value = subject.examDays ?? "";

                    document.getElementById(
                        "subject" + i + "Performance"
                    ).value = subject.performance ?? "";

                    document.getElementById(
                        "subject" + i + "Importance"
                    ).value = subject.importance ?? "";
                });
            }
        }

        // Restore counts
        if (studySubjects.length > 0) {
            completedSessions = studySubjects.reduce(
                (sum, subject) => sum + subject.completed, 0
            );

            missedSessions = studySubjects.reduce(
                (sum, subject) => sum + subject.missed, 0
            );
        } else {
            completedSessions = Number(savedCompleted) || 0;
            missedSessions = Number(savedMissed) || 0;
        }

        // Show dashboard when student information exists
        const hasStudentProfile =
            Boolean(savedName && savedHours && Number(savedHours) > 0);

        if (hasStudentProfile) {
            document.getElementById("displayHours").textContent =
                Number(savedHours) + " hours";

            document.getElementById("displayTime").textContent =
                savedTime || "Morning";

            document.getElementById("dashboard").style.display =
                "block";
        }

        updateProgress();
        updateSubjectProgress();

        // Regenerate the plan only when all three subjects are complete
        const hasAllThreeSubjects = [1, 2, 3].every(index => {
            const subject = studySubjects.find(
                item => item.inputIndex === index
            );

            return subject &&
                String(subject.name || "").trim() !== "" &&
                subject.preparation !== "" &&
                subject.preparation !== null &&
                subject.examDays !== "" &&
                subject.examDays !== null &&
                subject.performance !== "" &&
                subject.performance !== null &&
                subject.importance !== "" &&
                subject.importance !== null;
        });

        if (hasStudentProfile && hasAllThreeSubjects) {
            generatePlan();
        }

    } catch (error) {
        console.error("Error restoring StudyEase data:", error);

        alert(
            "Some saved StudyEase data could not be restored. " +
            "Please check the browser console."
        );
    }
}


// ==========================================
// AUTO-SAVE AND PAGE INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    // Automatically save student information when changed
    ["studentName", "studyHours", "studyTime"].forEach(id => {
        const element = document.getElementById(id);

        if (element) {
            element.addEventListener("change", saveAllData);
        }
    });

    // Automatically save subject details when changed
    for (let i = 1; i <= 3; i++) {
        [
            "Name",
            "Preparation",
            "ExamDays",
            "Performance",
            "Importance"
        ].forEach(field => {
            const element =
                document.getElementById("subject" + i + field);

            if (element) {
                element.addEventListener("change", saveAllData);
            }
        });
    }

    // Load saved details and rebuild the plan
    // Load saved details and rebuild the plan
loadAllData();

// Synchronize subject IDs with MySQL
syncSubjectDatabaseIds();
});