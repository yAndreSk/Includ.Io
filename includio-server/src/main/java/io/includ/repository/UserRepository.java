// includio-server/src/main/java/io/includ/repository/UserRepository.java
package io.includ.repository;

import io.includ.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}