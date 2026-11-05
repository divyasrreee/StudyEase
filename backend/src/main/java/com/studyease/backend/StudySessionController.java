
package com.studyease.backend;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/sessions")
public class StudySessionController {

    private final StudySessionRepository sessionRepository;
    private final SubjectRepository subjectRepository;

    public StudySessionController(
            StudySessionRepository sessionRepository,
            SubjectRepository subjectRepository) {
        this.sessionRepository = sessionRepository;
        this.subjectRepository = subjectRepository;
    }

    @PostMapping("/{subjectId}")
    public StudySession saveSession(
            @PathVariable Long subjectId,
            @RequestBody StudySession session) {

        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Subject not found"));

        String status = session.getStatus();

        if (status == null ||
                !(status.equalsIgnoreCase("COMPLETED")
                  || status.equalsIgnoreCase("MISSED"))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Status must be COMPLETED or MISSED");
        }

        session.setStatus(status.toUpperCase());
        session.setSessionDate(LocalDateTime.now());
        session.setSubject(subject);

        return sessionRepository.save(session);
    }

    @GetMapping("/{subjectId}")
    public List<StudySession> getSessions(
            @PathVariable Long subjectId) {

        if (!subjectRepository.existsById(subjectId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Subject not found");
        }

        return sessionRepository.findBySubjectId(subjectId);
    }
}
