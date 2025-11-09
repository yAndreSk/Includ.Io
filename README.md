# 🧩 **INCLUD.IO — Acessibilidade Digital e Simulador de Download**

> **INCLUD.IO** é uma plataforma que une **acessibilidade digital**, **educação imersiva** e **tecnologia interativa**, composta por:
> - Uma **extensão de navegador** que adiciona funções inclusivas e um **simulador de download** visual.
> - Um **servidor backend em Java (Maven)** com integração ao **XAMPP/MySQL**, que processa e armazena dados.

---

## 🧠 **Sobre o Projeto**

O **INCLUD.IO** nasceu com o objetivo de tornar a navegação na web mais acessível e interativa, através de ferramentas práticas que simulam processos reais de instalação e configuração de extensões inclusivas.
O projeto serve tanto para fins **educacionais** quanto para **demonstração técnica** de integração entre **frontend (extensão)** e **backend (Java)**.

---

## 🧭 **Como usar**

### 🔹 **1. Extensão de Navegador**

A extensão **INCLUD.IO** adiciona funcionalidades de acessibilidade e um simulador visual de download no navegador.

#### 📦 Instalação

1.  Baixe o arquivo **includio-extension.zip** na aba [📥 Releases](https://github.com/yAndreSk/Includ.Io/releases/tag/version).
2.  Extraia o .zip em uma pasta de sua escolha.
3.  No navegador **Chrome** ou **Edge**, acesse: `chrome://extensions/`
4.  Ative o **Modo do desenvolvedor** (canto superior direito).
5.  Clique em **“Carregar sem compactação”**.
6.  Selecione a pasta extraída da extensão.

✅ Pronto! A extensão **INCLUD.IO** aparecerá na barra de ferramentas e estará pronta para uso.
Você poderá abrir o painel na aba release no em [📥 Simulador](https://github.com/yAndreSk/Includ.Io/releases/tag/Simulator) e testar o **Simulador de Download**, que simula a instalação da extensão.

---

### 🔹 **2. Servidor Backend (Java + Maven + XAMPP)**

O servidor é responsável por processar os dados da extensão e armazená-los no banco de dados **MySQL**.

#### 🧱 **Pré-requisitos**

Certifique-se de ter instalado e configurado:

- ☕ **[Java JDK 17+]**
- 🧰 **[Apache Maven]**
- 🧡 **[XAMPP]**
- 🔌 **MySQL JDBC Driver** *(já incluso nas dependências do pom.xml)*

---

#### ⚙️ **Passos para rodar o servidor**

1.  Baixe o arquivo **includio-server.zip** na aba [📥 Releases](https://github.com/yAndreSk/Includ.Io/releases).
2.  Extraia o projeto em um diretório de sua preferência.
3.  Abra o **XAMPP Control Panel** e inicie:
    - **MySQL**
4.  Acesse o `http://localhost/phpmyadmin` e crie o banco de dados:
    ```sql
    CREATE DATABASE includio_db;
    ```
5.  Compile e execute o servidor com o Maven no terminal:
    ```bash
    # Na raiz da pasta /includio-server
    mvn clean install
    mvn spring-boot:run
    ```

---

## 🎮 **Simulador de Download**

O Simulador de Download é um componente visual da extensão que reproduz o processo de instalação de recursos inclusivos de forma animada como se fosse da loja de extensões.

🔹 Mostra o progresso da “instalação” com barra dinâmica e efeitos visuais.

---

## 🧱 **Estrutura do Projeto**

```
INCLUD.IO/
├── includio-extension/        # Código da extensão (frontend)
├── includio-server/           # Servidor backend em Java (Maven)
├── assets/                    # Ícones, logos e imagens
├── index.html                 # Simulador de download
└── README.md                  # Documentação
```

---

## 👨‍💻 **Desenvolvido por**

- **[André (@yAndreSk)](https://github.com/yAndreSk)**
- **[Maria Eduarda (@dudabduarte)](https://github.com/dudabduarte)**
- **[Lívia (@Livia-Maschietto-Boneti)](https://github.com/Livia-Maschietto-Boneti)**

💡 Projeto experimental e educacional sobre acessibilidade digital e integração web.

---

## 🏷️ **Versão**

**v1.0** — Lançamento inicial (Extensão + Servidor Java + Simulador de Download)
📅 Publicado em 2025
