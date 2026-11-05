
package com.studyease.backend;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StudyEaseController {

    @GetMapping("/api/test")
    public String test() {
        return "StudyEase Backend is running successfully!";
    }
}
