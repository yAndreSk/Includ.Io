// includio-server/src/main/java/io/includ/model/User.java
package io.includ.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users") // Tabela "users"
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String passwordHash;
    
    // Construtores, Getters e Setters
    public User() {}
    public User(String email, String passwordHash) {
        this.email = email;
        this.passwordHash = passwordHash;
    }
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
}