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

1. Baixe o arquivo **`includio-extension.zip`** na aba [📥 Releases](https://github.com/yAndreSk/Includ.Io/releases).  
2. Extraia o `.zip` em uma pasta de sua escolha.  
3. No navegador **Chrome** ou **Edge**, acesse: chrome://extensions/
4. Ative o **Modo do desenvolvedor** (canto superior direito).  
5. Clique em **“Carregar sem compactação”**.  
6. Selecione a pasta extraída da extensão.  

✅ Pronto! A extensão **INCLUD.IO** aparecerá na barra de ferramentas e estará pronta para uso.  
Você poderá abrir o painel copiando o repositório e testar o **Simulador de Download**, que simula a instalação da extensão.

---

### 🔹 **2. Servidor Backend (Java + Maven + XAMPP)**

O servidor é responsável por processar os dados da extensão e armazená-los no banco de dados **MySQL**.

#### 🧱 **Pré-requisitos**
Certifique-se de ter instalado e configurado:

- ☕ **[Java JDK 17+]**
- 🧰 **[Apache Maven]**
- 🧡 **[XAMPP]**
- 🔌 **MySQL JDBC Driver** *(já incluso nas dependências do `pom.xml`)*

---

#### ⚙️ **Passos para rodar o servidor**

1. Baixe o arquivo **`includio-server.zip`** na aba [📥 Releases](https://github.com/yAndreSk/Includ.Io/releases).  
2. Extraia o projeto em um diretório de sua preferência.  
3. Abra o **XAMPP Control Panel** e inicie:
- **MySQL**
4. Acesse e crie o banco de dados:
```sql
CREATE DATABASE includio_db;

Compile e execute o servidor com o Maven no terminal:

mvn clean install
mvn spring-boot:run

