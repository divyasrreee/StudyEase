
package com.studyease.backend;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudySessionRepository
        extends JpaRepository<StudySession, Long> {

    List<StudySession> findBySubjectId(Long subjectId);
}
