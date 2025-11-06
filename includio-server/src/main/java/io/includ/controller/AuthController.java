// includio-server/src/main/java/io/includ/controller/AuthController.java
package io.includ.controller;

import io.includ.model.User;
import io.includ.model.UserSettings;
import io.includ.repository.UserRepository;
import io.includ.repository.UserSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserSettingsRepository userSettingsRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body("Email já está em uso!");
        }

        // 1. Cria o utilizador
        User newUser = new User(email, passwordEncoder.encode(password));
        userRepository.save(newUser);

        // 2. Cria as configurações padrão para ele
        UserSettings settings = new UserSettings();
        settings.setUser(newUser);
        userSettingsRepository.save(settings);

        return ResponseEntity.ok("Utilizador registado com sucesso!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String password = payload.get("password");

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null || !passwordEncoder.matches(password, user.getPasswordHash())) {
            return ResponseEntity.status(401).body("Email ou senha inválidos.");
        }
        
        // Em um app real, você retornaria um TOKEN JWT aqui.
        // Por simplicidade, vamos apenas retornar o ID do utilizador.
        return ResponseEntity.ok(Map.of("message", "Login bem-sucedido!", "userId", user.getId()));
    }
}