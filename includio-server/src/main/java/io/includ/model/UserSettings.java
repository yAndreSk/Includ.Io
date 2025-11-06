// includio-server/src/main/java/io/includ/model/UserSettings.java
package io.includ.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_settings") // Tabela "user_settings"
public class UserSettings {
    @Id
    private Long id; // Mesmo ID do utilizador

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // Mapeia este ID para ser o mesmo da relação
    @JoinColumn(name = "id")
    private User user;

    // Configurações da extensão
    private String voiceName;
    private double rate = 1.0;
    private double pitch = 1.0;
    private String defaultContrast = "none";
    private int defaultFontSize = 100;

    // Getters e Setters
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getVoiceName() { return voiceName; }
    public void setVoiceName(String voiceName) { this.voiceName = voiceName; }
    public double getRate() { return rate; }
    public void setRate(double rate) { this.rate = rate; }
    public double getPitch() { return pitch; }
    public void setPitch(double pitch) { this.pitch = pitch; }
    public String getDefaultContrast() { return defaultContrast; }
    public void setDefaultContrast(String defaultContrast) { this.defaultContrast = defaultContrast; }
    public int getDefaultFontSize() { return defaultFontSize; }
    public void setDefaultFontSize(int defaultFontSize) { this.defaultFontSize = defaultFontSize; }
}