package backend;



public class Student {

    String name;
    double availableStudyHours;
    String preferredStudyTime;
    double preferredSessionDuration;

    public Student(String name,
                   double availableStudyHours,
                   String preferredStudyTime,
                   double preferredSessionDuration) {

        this.name = name;
        this.availableStudyHours = availableStudyHours;
        this.preferredStudyTime = preferredStudyTime;
        this.preferredSessionDuration = preferredSessionDuration;
    }

    public void displayStudent() {

        System.out.println("Student Name: " + name);
        System.out.println("Available Study Hours: " + availableStudyHours);
        System.out.println("Preferred Study Time: " + preferredStudyTime);
        System.out.println("Preferred Session Duration: "
                + preferredSessionDuration + " hours");
    }
}
