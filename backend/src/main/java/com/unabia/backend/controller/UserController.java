package com.unabia.backend.controller;

import com.unabia.backend.model.User;
import com.unabia.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null) return ResponseEntity.status(401).body("Unauthorized");
        String email = (String) authentication.getPrincipal();
        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) return ResponseEntity.status(404).body("User not found");
        User u = opt.get();
        return ResponseEntity.ok(new UserDto(u.getId(), u.getEmail(), u.getName()));
    }

    private record UserDto(Long id, String email, String name) {}
}
