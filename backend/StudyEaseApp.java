package backend;

import java.util.Scanner;
public class StudyEaseApp {

    public static void main(String[] args) {
      Scanner scanner = new Scanner(System.in); 

        System.out.println("================================");
        System.out.println("        WELCOME TO STUDYEASE");
        System.out.println("================================");
        System.out.print("Enter your name: ");
String studentName = scanner.nextLine();

System.out.print("Enter available study hours today: ");
double availableHours = scanner.nextDouble();

scanner.nextLine();

System.out.print("Enter preferred study time (Morning/Afternoon/Evening): ");
String preferredTime = scanner.nextLine();

System.out.print("Enter preferred session duration (hours): ");
double sessionDuration = scanner.nextDouble();

Student student = new Student(
        studentName,
        availableHours,
        preferredTime,
        sessionDuration
);
System.out.println();
System.out.println("Enter details for Subject 1");

scanner.nextLine();

System.out.print("Subject name: ");
String subject1Name = scanner.nextLine();

System.out.print("Preparation level (0-100): ");
int subject1Preparation = scanner.nextInt();

System.out.print("Exam days remaining: ");
int subject1ExamDays = scanner.nextInt();

System.out.print("Performance (0-100): ");
int subject1Performance = scanner.nextInt();

System.out.print("Importance (1-5): ");
int subject1Importance = scanner.nextInt();

Subject java = new Subject(
        subject1Name,
        subject1Preparation,
        subject1ExamDays,
        subject1Performance,
        subject1Importance
);
System.out.println();
System.out.println("Enter details for Subject 2");

scanner.nextLine();

System.out.print("Subject name: ");
String subject2Name = scanner.nextLine();

System.out.print("Preparation level (0-100): ");
int subject2Preparation = scanner.nextInt();

System.out.print("Exam days remaining: ");
int subject2ExamDays = scanner.nextInt();

System.out.print("Performance (0-100): ");
int subject2Performance = scanner.nextInt();

System.out.print("Importance (1-5): ");
int subject2Importance = scanner.nextInt();

Subject dbms = new Subject(
        subject2Name,
        subject2Preparation,
        subject2ExamDays,
        subject2Performance,
        subject2Importance
);

System.out.println();
System.out.println("Enter details for Subject 3");

scanner.nextLine();

System.out.print("Subject name: ");
String subject3Name = scanner.nextLine();

System.out.print("Preparation level (0-100): ");
int subject3Preparation = scanner.nextInt();

System.out.print("Exam days remaining: ");
int subject3ExamDays = scanner.nextInt();

System.out.print("Performance (0-100): ");
int subject3Performance = scanner.nextInt();

System.out.print("Importance (1-5): ");
int subject3Importance = scanner.nextInt();

Subject networks = new Subject(
        subject3Name,
        subject3Preparation,
        subject3ExamDays,
        subject3Performance,
        subject3Importance
);
System.out.println();
System.out.println("1. " + java.name);
System.out.println("2. " + dbms.name);
System.out.println("3. " + networks.name);
System.out.print("Enter your choice: ");

int subjectChoice = scanner.nextInt();

Subject selectedSubject = null;

if (subjectChoice == 1) {
    selectedSubject = java;
} else if (subjectChoice == 2) {
    selectedSubject = dbms;
} else if (subjectChoice == 3) {
    selectedSubject = networks;
} else {
    System.out.println("Invalid subject choice.");
}

if (selectedSubject != null) {

    System.out.println();
    System.out.println("Did you complete the "
            + selectedSubject.name + " study session?");
    System.out.println("1. Yes");
    System.out.println("2. No");
    System.out.print("Enter your choice: ");

    int sessionChoice = scanner.nextInt();

    if (sessionChoice == 1) {

        System.out.print("Enter your performance (0-100): ");
        int performanceScore = scanner.nextInt();

        StudySession session = new StudySession(
        selectedSubject,
        selectedSubject.getRecommendedStudyHours(),
        performanceScore
);

        session.completeSession();
} else if (sessionChoice == 2) {

    StudySession session = new StudySession(
            selectedSubject,
            selectedSubject.getRecommendedStudyHours(),
            0
    );

    session.missSession();

} else {

        System.out.println("Invalid session choice.");
    }
}
Subject[] subjects = {java, dbms, networks};
System.out.println();
System.out.println("================================");
System.out.println("       SUBJECT PRIORITIES");
System.out.println("================================");

for (Subject subject : subjects) {

    System.out.println(
            subject.name + " -> "
            + subject.calculatePriority()
            + " -> "
            + subject.getRecommendation()
    );
}

StudyPlanner planner = new StudyPlanner(
        new Subject[] { java, dbms, networks }
);

planner.displayPriorities();

planner.generateStudyPlan(
        student.availableStudyHours
);

    
        System.out.println();

      java.displaySubject();
System.out.println("Priority Score: " + java.calculatePriority());
System.out.println("Recommendation: " + java.getRecommendation());

System.out.println();

dbms.displaySubject();
System.out.println("Priority Score: " + dbms.calculatePriority());
System.out.println("Recommendation: " + dbms.getRecommendation());

System.out.println();

networks.displaySubject();
System.out.println("Priority Score: " + networks.calculatePriority());
System.out.println("Recommendation: " + networks.getRecommendation());
}
}
