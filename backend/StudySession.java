package backend;

public class StudySession {

    Subject subject;
    double duration;
    int performanceScore;

    public StudySession(Subject subject,
                        double duration,
                        int performanceScore) {

        this.subject = subject;
        this.duration = duration;
        this.performanceScore = performanceScore;
    }

    public void completeSession() {
        subject.completedSessions++;

        subject.updatePerformance(performanceScore);

        System.out.println();
        System.out.println("Study session completed!");
        System.out.println("Subject: " + subject.name);
        System.out.println("Study Time: " + duration + " hours");
        System.out.println("New Performance: "
                + performanceScore + "%");
                System.out.println("Updated Preparation: "
        + subject.preparationLevel + "%");

System.out.println("Updated Priority Score: "
        + subject.calculatePriority());

System.out.println("Updated Recommendation: "
        + subject.getRecommendation());
    }
    public void missSession() {
        subject.missedSessions++;

    subject.missedSession();

    System.out.println("Updated Recommendation: "
            + subject.getRecommendation());

    System.out.println("Recommended Study Time: "
            + subject.getRecommendedStudyHours()
            + " hours");
}

}