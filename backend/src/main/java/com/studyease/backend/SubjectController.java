
package com.studyease.backend;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;

    public SubjectController(
            SubjectRepository subjectRepository,
            StudentRepository studentRepository) {
        this.subjectRepository = subjectRepository;
        this.studentRepository = studentRepository;
    }

   
    
@PostMapping("/{studentId}")
public Subject saveSubject(
        @PathVariable Long studentId,
        @RequestBody Subject subject) {

    Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Student not found"));

    Subject savedSubject = subjectRepository
            .findByStudentId(studentId)
            .stream()
            .filter(existing ->
                    existing.getInputIndex() == subject.getInputIndex())
            .findFirst()
            .orElse(subject);

    savedSubject.setName(subject.getName());
    savedSubject.setPreparation(subject.getPreparation());
    savedSubject.setExamDays(subject.getExamDays());
    savedSubject.setPerformance(subject.getPerformance());
    savedSubject.setImportance(subject.getImportance());
    savedSubject.setInputIndex(subject.getInputIndex());
    savedSubject.setCompleted(subject.getCompleted());
    savedSubject.setMissed(subject.getMissed());
    savedSubject.setStudyHours(subject.getStudyHours());
    savedSubject.setStudent(student);

    return subjectRepository.save(savedSubject);
}

    @GetMapping("/{studentId}")
    public List<Subject> getSubjects(
            @PathVariable Long studentId) {

        if (!studentRepository.existsById(studentId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Student not found");
        }

        return subjectRepository.findByStudentId(studentId);
    }
}
