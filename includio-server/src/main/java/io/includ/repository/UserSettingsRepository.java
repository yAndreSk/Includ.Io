// includio-server/src/main/java/io/includ/repository/UserSettingsRepository.java
package io.includ.repository;

import io.includ.model.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
}