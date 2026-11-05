package backend;

public class Subject {
   
    String name;
int preparationLevel;
int examDaysRemaining;
int performance;
int importance;

int completedSessions = 0;
int missedSessions = 0;

    public Subject(String name, int preparationLevel,
                   int examDaysRemaining, int performance,
                   int importance) {

        this.name = name;
        this.preparationLevel = preparationLevel;
        this.examDaysRemaining = examDaysRemaining;
        this.performance = performance;
        this.importance = importance;
    }

    public void displaySubject() {

        System.out.println("Subject: " + name);
        System.out.println("Preparation: " + preparationLevel + "%");
        System.out.println("Exam Days Remaining: " + examDaysRemaining);
        System.out.println("Performance: " + performance + "%");
        System.out.println("Importance: " + importance);
        System.out.println("Completed Sessions: " + completedSessions);
System.out.println("Missed Sessions: " + missedSessions);
    }
public double calculatePriority() {

    double weaknessScore = 100 - preparationLevel;

    double urgencyScore;

if (examDaysRemaining <= 1) {
    urgencyScore = 100;
} else if (examDaysRemaining <= 3) {
    urgencyScore = 90;
} else if (examDaysRemaining <= 7) {
    urgencyScore = 70;
} else if (examDaysRemaining <= 14) {
    urgencyScore = 50;
} else {
    urgencyScore = 30;
}

    double performanceRisk = 100 - performance;
    double consistencyRisk;

if (missedSessions + completedSessions == 0) {
    consistencyRisk = 0;
} else {
    consistencyRisk =
            (missedSessions * 100.0)
            / (missedSessions + completedSessions);
}
    double importanceScore = importance * 20;

double priorityScore =
        (weaknessScore * 0.25)
        + (urgencyScore * 0.25)
        + (performanceRisk * 0.20)
        + (importanceScore * 0.20)
        + (consistencyRisk * 0.10);

    return priorityScore;
}
public String getRecommendation() {

    double priority = calculatePriority();

    if (priority >= 70) {
        return "High Priority - Study this subject first";
    } else if (priority >= 50) {
        return "Medium Priority - Study this subject soon";
    } else {
        return "Low Priority - Can be studied later";
    }
}
public double getRecommendedStudyHours() {

    double priority = calculatePriority();

    if (priority >= 70) {
        return 2.0;
    } else if (priority >= 50) {
        return 1.5;
    } else {
        return 1.0;
    }
}
public void updatePerformance(int newPerformance) {

    if (newPerformance < 0) {
        newPerformance = 0;
    }

    if (newPerformance > 100) {
        newPerformance = 100;
    }

 performance = newPerformance;

// Improve preparation based on performance
if (newPerformance >= 80) {
    preparationLevel += 10;
} else if (newPerformance >= 60) {
    preparationLevel += 7;
} else if (newPerformance >= 40) {
    preparationLevel += 4;
} else {
    preparationLevel += 2;
}

if (preparationLevel > 100) {
    preparationLevel = 100;
}
}
public void missedSession() {

    // Increase priority by reducing preparation slightly
    preparationLevel -= 5;

    if (preparationLevel < 0) {
        preparationLevel = 0;
    }

    System.out.println();
    System.out.println("Study session missed!");
    System.out.println("Subject: " + name);
    System.out.println("Preparation reduced to: "
            + preparationLevel + "%");
    System.out.println("New Priority Score: "
            + calculatePriority());
}

}

