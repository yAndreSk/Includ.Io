// Ficheiro: includio-server/src/main/java/io/includ/controller/SettingsController.java
// --- VERSÃO CORRIGIDA (com verificação de nulls) ---

package io.includ.controller;

import io.includ.model.UserSettings;
import io.includ.repository.UserSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    @Autowired
    private UserSettingsRepository settingsRepository;

    // GET /api/settings/1
    @GetMapping("/{userId}")
    public ResponseEntity<UserSettings> getSettings(@PathVariable Long userId) {
        UserSettings settings = settingsRepository.findById(userId)
                .orElse(null);

        if (settings == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(settings);
    }

    // POST /api/settings/1
    @PostMapping("/{userId}")
    public ResponseEntity<UserSettings> saveSettings(@PathVariable Long userId, @RequestBody UserSettings newSettings) {
        
        UserSettings settings = settingsRepository.findById(userId)
                .orElse(null);
        
        if (settings == null) {
            return ResponseEntity.notFound().build();
        }

        // --- LÓGICA DE ATUALIZAÇÃO CORRIGIDA ---
        if (newSettings.getVoiceName() != null) {
            settings.setVoiceName(newSettings.getVoiceName());
        }
        
        settings.setRate(newSettings.getRate());
        settings.setPitch(newSettings.getPitch());
        
        settingsRepository.save(settings);
        
        return ResponseEntity.ok(settings);
    }
}