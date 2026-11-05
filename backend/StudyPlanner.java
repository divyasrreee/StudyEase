package backend;

public class StudyPlanner {

    Subject[] subjects;

    public StudyPlanner(Subject[] subjects) {
        this.subjects = subjects;
    }

    public Subject getHighestPrioritySubject() {

        Subject highestPriority = null;

        for (Subject subject : subjects) {

            if (highestPriority == null ||
                subject.calculatePriority() >
                highestPriority.calculatePriority()) {

                highestPriority = subject;
            }
        }

        return highestPriority;
    }

    public void displayPriorities() {

        System.out.println();
        System.out.println("================================");
        System.out.println("       SUBJECT PRIORITIES");
        System.out.println("================================");

        for (Subject subject : subjects) {

            System.out.println();
            System.out.println(subject.name + " -> "
                    + subject.calculatePriority()
                    + " -> "
                    + subject.getRecommendation());
        }
    }

    public void generateStudyPlan(double availableHours) {

        double remainingHours = availableHours;

        System.out.println();
        System.out.println("================================");
        System.out.println("       AUTOMATIC STUDY PLAN");
        System.out.println("================================");

        while (remainingHours > 0) {

            Subject highestPrioritySubject =
                    getHighestPrioritySubject();

            if (highestPrioritySubject == null) {
                break;
            }

            double recommendedHours =
                    highestPrioritySubject.getRecommendedStudyHours();

            double allocatedHours =
                    Math.min(remainingHours, recommendedHours);

            StudyPlan plan = new StudyPlan(
                    highestPrioritySubject,
                    allocatedHours
            );

            System.out.println();
            plan.displayPlan();

            remainingHours -= allocatedHours;

            // Temporarily remove this subject
            // so another subject gets a chance
            Subject[] remainingSubjects =
                    new Subject[subjects.length - 1];

            int index = 0;

            for (Subject subject : subjects) {

                if (subject != highestPrioritySubject) {
                    remainingSubjects[index] = subject;
                    index++;
                }
            }

            subjects = remainingSubjects;

            // If all subjects were used,
            // start another planning round
            if (subjects.length == 0) {

                // This will be handled later
                break;
            }
        }

        System.out.println();
        System.out.println("Remaining Study Hours: "
                + remainingHours);
    }
}