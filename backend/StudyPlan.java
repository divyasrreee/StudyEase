package backend;

public class StudyPlan {

    Subject subject;
    double studyHours;

    public StudyPlan(Subject subject, double studyHours) {

        this.subject = subject;
        this.studyHours = studyHours;
    }

    public void displayPlan() {

        System.out.println("Subject: " + subject.name);
        System.out.println("Study Time: " + studyHours + " hours");
        System.out.println("Priority Score: "
                + subject.calculatePriority());
        System.out.println("Recommendation: "
                + subject.getRecommendation());
    }
}