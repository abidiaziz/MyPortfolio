
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded")
  
    // DOM Elements
    const urlInput = document.getElementById("url-input")
    const urlInputContainer = document.querySelector(".url-input-container")
    const urlPrefix = document.querySelector(".url-prefix")
    const sendBtn = document.getElementById("send-btn")
    const respTabBtns = document.querySelectorAll(".resp-tab-btn")
    const responseLoading = document.getElementById("response-loading")
    const responseData = document.getElementById("response-data")
    const emptyResponse = document.getElementById("empty-response")
    const jsonResponse = document.getElementById("json-response")
    const statusBadge = document.getElementById("status-badge")
    const responseTime = document.getElementById("response-time")
    const responseSize = document.getElementById("response-size")
    const codeExample = document.getElementById("code-example")
    const emptyCode = document.getElementById("empty-code")
    const codeSnippet = document.getElementById("code-snippet")
    const endpoints = document.querySelectorAll(".endpoint")
    const themeToggle = document.getElementById("theme-toggle")
    const expandBtn = document.getElementById("expand-btn")
    const logo = document.querySelector(".logo")
  
    // Debug check - make sure all elements are found
    console.log("Send button found:", sendBtn !== null)
    console.log("portfolioData available:", typeof portfolioData !== "undefined")
  
    // Add focus effect to URL input - without scaling
    urlInput.addEventListener("focus", () => {
      // Remove the scale effect as requested
      urlInputContainer.style.boxShadow = "var(--shadow)"
      urlPrefix.style.borderColor = "var(--primary-color)"
      urlPrefix.style.color = "var(--primary-color)"
    })
  
    urlInput.addEventListener("blur", () => {
      urlInputContainer.style.boxShadow = "var(--shadow-sm)"
      urlPrefix.style.borderColor = "var(--border-color)"
      urlPrefix.style.color = "var(--text-light)"
    })
  
    // Add a subtle animation to the URL bar on page load
    setTimeout(() => {
      const urlBar = document.querySelector(".url-bar")
      urlBar.style.transform = "translateY(0)"
      urlBar.style.opacity = "1"
    }, 300)
  
    // Easter Egg - Secret Code
    const secretCode = ["h", "o", "u", "d", "a"]
    let secretCodePosition = 0
  
    document.addEventListener("keydown", (e) => {
      // Check if the key pressed matches the next key in the secret code
      if (e.key.toLowerCase() === secretCode[secretCodePosition].toLowerCase()) {
        secretCodePosition++
  
        // If the entire code is entered correctly
        if (secretCodePosition === secretCode.length) {
          activateEasterEgg()
          secretCodePosition = 0 // Reset for next time
        }
      } else {
        secretCodePosition = 0 // Reset if wrong key
      }
    })
  
    // Secret endpoint easter egg
    urlInput.addEventListener("input", () => {
      if (urlInput.value.toLowerCase() === "https://api.portfolio/aziz/secret") {
        urlInput.style.color = "var(--primary-color)"
      } else {
        urlInput.style.color = "var(--text-color)"
      }
    })
  
    function activateEasterEgg() {
      console.log("Easter egg activated!")
  
      // Create the easter egg element
      const easterEgg = document.createElement("div")
      easterEgg.className = "easter-egg"
      easterEgg.innerHTML = `
              <div class="easter-egg-content">
                  <h2>🎉 You found the secret! 🎉</h2>
                  <p>Congratulations on discovering the secret code easter egg!</p>
                  <div class="matrix-animation">
                      <pre id="matrix"></pre>
                  </div>
                  <button id="close-easter-egg">Close</button>
              </div>
          `
  
      document.body.appendChild(easterEgg)
  
      // Start the Matrix animation
      const matrix = document.getElementById("matrix")
      const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%&*()!?><"
      let matrixText = ""
  
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 40; j++) {
          matrixText += matrixChars.charAt(Math.floor(Math.random() * matrixChars.length))
        }
        matrixText += "\n"
      }
  
      matrix.textContent = matrixText
  
      // Matrix animation interval
      const matrixInterval = setInterval(() => {
        let newMatrixText = ""
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 40; j++) {
            newMatrixText += matrixChars.charAt(Math.floor(Math.random() * matrixChars.length))
          }
          newMatrixText += "\n"
        }
        matrix.textContent = newMatrixText
      }, 100)
  
      // Close button functionality
      document.getElementById("close-easter-egg").addEventListener("click", () => {
        clearInterval(matrixInterval)
        document.body.removeChild(easterEgg)
      })
    }
  
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      document.body.classList.add("dark-mode")
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
    }
  
    // Make logo clickable to reset to initial state
    logo.style.cursor = "pointer"
    logo.addEventListener("click", () => {
      // Reset to initial state
      responseData.classList.add("hidden")
      emptyResponse.classList.remove("hidden")
      codeExample.classList.add("hidden")
      emptyCode.classList.remove("hidden")
    })
  
    // Theme toggle functionality
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode")
  
      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark")
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
      } else {
        localStorage.setItem("theme", "light")
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
      }
    })
  
    // Response Tab Switching
    respTabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Remove active class from all tabs
        respTabBtns.forEach((b) => b.classList.remove("active"))
        document.querySelectorAll(".resp-tab-pane").forEach((pane) => pane.classList.remove("active"))
  
        // Add active class to clicked tab
        btn.classList.add("active")
        document.getElementById(`${btn.dataset.tab}-tab`).classList.add("active")
      })
    })
  
    // Endpoint Suggestions
    endpoints.forEach((endpoint) => {
      endpoint.addEventListener("click", () => {
        urlInput.value = endpoint.dataset.url
        // Auto-send when clicking an endpoint
        handleSendRequest()
      })
    })
  
    // Send Request - Direct event handler to ensure it works
    if (sendBtn) {
      sendBtn.onclick = () => {
        console.log("Send button clicked")
  
        // Check for secret endpoint
        if (urlInput.value.toLowerCase() === "https://api.portfolio/aziz/secret") {
          activateEasterEgg()
          return
        }
  
        handleSendRequest()
      }
    } else {
      console.error("Send button not found in the DOM!")
    }
  
    // Also allow pressing Enter in the URL input to send
    urlInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        // Check for secret endpoint
        if (urlInput.value.toLowerCase() === "https://api.portfolio/aziz/secret") {
          activateEasterEgg()
          return
        }
  
        handleSendRequest()
      }
    })
  
    function handleSendRequest() {
      console.log("Handling send request")
      const url = urlInput.value  
      // Show loading state
      responseLoading.classList.remove("hidden")
      responseData.classList.add("hidden")
      emptyResponse.classList.add("hidden")
      codeExample.classList.add("hidden")
      emptyCode.classList.remove("hidden")
  
      console.log("Loading state shown, waiting for response...")
  
      // Simulate API request delay
      setTimeout(() => {
        console.log("Processing response...")
        // Parse the URL to determine what data to show
        const urlParts = url.split("/")
        console.log("URL parts:", urlParts)
  
        let result = null
        let status = "200 ok"
        let endpoint = ""
  
        if (urlParts.some((part) => part.includes("about"))) {
          result = portfolioData.about
          endpoint = "about"
        } else if (urlParts.some((part) => part.includes("skills"))) {
          result = portfolioData.skills
          endpoint = "skills"
        } else if (urlParts.some((part) => part.includes("projects"))) {
          result = portfolioData.projects
          endpoint = "projects"
        } else if (urlParts.some((part) => part.includes("contact"))) {
          result = portfolioData.contact
          endpoint = "contact"
        } else if (urlParts.some((part) => part.includes("experience"))) {
          result = portfolioData.experience
          endpoint = "experience"
        } else {
          status = 404
          endpoint = "error"
          result = {
            error: "Endpoint not found",
            message: "Try one of these endpoints: /about, /skills, /projects, /experience, /contact",
            availableEndpoints: [
              "https://api.portfolio/aziz/about",
              "https://api.portfolio/aziz/skills",
              "https://api.portfolio/aziz/projects",
              "https://api.portfolio/aziz/experience",
              "https://api.portfolio/aziz/contact",
            ],
          }
        }
  
        // Format the response with syntax highlighting
        const responseJson = JSON.stringify(result, null, 2)
  
        // Create a beautiful formatted response instead of raw JSON
        const formattedHTML = formatResponse(result, endpoint)
        jsonResponse.innerHTML = formattedHTML
  
        // Add event listeners to CTA buttons if they exist
        setTimeout(() => {
          const ctaButtons = document.querySelectorAll(".cta-button")
          if (ctaButtons.length > 0) {
            ctaButtons.forEach((button) => {
              button.addEventListener("click", function () {
                const isResume = this.textContent.includes("Resume")
                if (isResume) {
                  alert("Resume download would start here")
                } else {
                  // Redirect to contact endpoint
                  urlInput.value = "https://api.portfolio/aziz/contact"
                  handleSendRequest()
                }
              })
            })
          }
        }, 100)
  
        // Update response metadata
        statusBadge.textContent = status
        statusBadge.className = status === 200 ? "status-badge" : "status-badge error"
        responseTime.textContent = `${Math.floor(Math.random() * 100 + 50)}ms`
        responseSize.textContent = `${responseJson.length} B`
  
        // Generate code example
        generateCodeExample(url, "GET")
  
        // Hide loading, show response
        responseLoading.classList.add("hidden")
        responseData.classList.remove("hidden")
        emptyResponse.classList.add("hidden")
  
        console.log("Response displayed")
  
        // Add animation to the response
        jsonResponse.style.opacity = "0"
        setTimeout(() => {
          jsonResponse.style.opacity = "1"
          jsonResponse.style.transition = "opacity 0.3s ease"
        }, 50)
  
        // Switch to response tab
        respTabBtns.forEach((btn) => {
          if (btn.dataset.tab === "response") {
            btn.click()
          }
        })
      }, 600)
    }
  
    // Format response based on endpoint type
    function formatResponse(data, endpoint) {
      switch (endpoint) {
        case "about":
          return `
                      <div class="formatted-response about-response">
                          <div class="about-header">
                              <div class="profile-avatar">
                                  <i class="fas fa-user-circle"></i>
                              </div>
                              <div class="profile-info">
                                  <h2>${data.name}</h2>
                                  <h3>${data.title}</h3>
                                  <div class="profile-badges">
                                      <span class="profile-badge"><i class="fas fa-map-marker-alt"></i>${data.location} </span>
                                      <span class="profile-badge"><i class="fas fa-briefcase"></i> Available for hire</span>
                                      <span class="profile-badge"><i class="fas fa-code-branch"></i> Open to collaborate</span>
                                  </div>
                              </div>
                          </div>
                          
                          <div class="profile-bio-container">
                              <div class="bio-quote">
                                  <i class="fas fa-quote-left"></i>
                                  <p>Passionate about creating elegant solutions to complex problems</p>
                              </div>
                              <div class="profile-bio">
                                  <p>${data.bio}</p>
                              </div>
                          </div>
                          
                          <div class="profile-highlights">
                              <div class="highlight-item">
                                  <div class="highlight-icon">
                                      <i class="fas fa-graduation-cap"></i>
                                  </div>
                                  <div class="highlight-content">
                                      <h4>Education</h4>
                                      <p>Master's in Computer Science</p>
                                      <p class="highlight-detail">Stanford University, 2018</p>
                                  </div>
                              </div>
                              
                              <div class="highlight-item">
                                  <div class="highlight-icon">
                                      <i class="fas fa-trophy"></i>
                                  </div>
                                  <div class="highlight-content">
                                      <h4>Achievements</h4>
                                      <p>Google Developer Expert</p>
                                      <p class="highlight-detail">Web Technologies, 2020-Present</p>
                                  </div>
                              </div>
                              
                              <div class="highlight-item">
                                  <div class="highlight-icon">
                                      <i class="fas fa-heart"></i>
                                  </div>
                                  <div class="highlight-content">
                                      <h4>Interests</h4>
                                      <div class="interests-list">
                                          <span class="interest-tag">AI</span>
                                          <span class="interest-tag">Open Source</span>
                                          <span class="interest-tag">UI/UX</span>
                                          <span class="interest-tag">Web3</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          
                          <div class="profile-cta">
                              <button class="cta-button primary">
                                  <i class="fas fa-download"></i> Download Resume
                              </button>
                              <button class="cta-button secondary">
                                  <i class="fas fa-envelope"></i> Contact Me
                              </button>
                          </div>
                      </div>
                  `
  
        case "skills":
          let skillsHTML = '<div class="formatted-response skills-response">'
  
          // Frontend skills
          if (data.frontend && data.frontend.length > 0) {
            skillsHTML += `
                  <div class="skills-category">
                      <h3><i class="fas fa-laptop-code"></i> Frontend</h3>
                      <div class="skills-list">
              `
  
            data.frontend.forEach((skill) => {
              skillsHTML += `
                      <div class="skill-item">
                          <div class="skill-name">${skill.name}</div>
                          <div class="skill-level ${skill.level.toLowerCase()}">${skill.level}</div>
                          <div class="skill-years">${skill.years} years</div>
                      </div>
                  `
            })
  
            skillsHTML += "</div></div>"
          }
  
          // Backend skills
          if (data.backend && data.backend.length > 0) {
            skillsHTML += `
                  <div class="skills-category">
                      <h3><i class="fas fa-server"></i> Backend</h3>
                      <div class="skills-list">
              `
  
            data.backend.forEach((skill) => {
              skillsHTML += `
                      <div class="skill-item">
                          <div class="skill-name">${skill.name}</div>
                          <div class="skill-level ${skill.level.toLowerCase()}">${skill.level}</div>
                          <div class="skill-years">${skill.years} years</div>
                      </div>
                  `
            })
  
            skillsHTML += "</div></div>"
          }
  
          // Other skills
          if (data.other && data.other.length > 0) {
            skillsHTML += `
                  <div class="skills-category">
                      <h3><i class="fas fa-tools"></i> Other</h3>
                      <div class="skills-list">
              `
  
            data.other.forEach((skill) => {
              skillsHTML += `
                      <div class="skill-item">
                          <div class="skill-name">${skill.name}</div>
                          <div class="skill-level ${skill.level.toLowerCase()}">${skill.level}</div>
                          <div class="skill-years">${skill.years} years</div>
                      </div>
                  `
            })
  
            skillsHTML += "</div></div>"
          }
  
          // DevOps skills
          if (data.devops && data.devops.length > 0) {
            skillsHTML += `
                  <div class="skills-category">
                      <h3><i class="fas fa-cloud"></i> DevOps</h3>
                      <div class="skills-list">
              `
  
            data.devops.forEach((skill) => {
              skillsHTML += `
                      <div class="skill-item">
                          <div class="skill-name">${skill.name}</div>
                          <div class="skill-level ${skill.level.toLowerCase()}">${skill.level}</div>
                          <div class="skill-years">${skill.years} years</div>
                      </div>
                  `
            })
  
            skillsHTML += "</div></div>"
          }
  
          skillsHTML += "</div>"
          return skillsHTML
  
        case "projects":
          let projectsHTML = '<div class="formatted-response projects-response">'
  
          data.forEach((project) => {
            projectsHTML += `
                  <div class="project-card">
                      <h3>${project.title}</h3>
                      <p class="project-description">${project.description}</p>
                      
                      ${
                        project.technologies
                          ? `
                          <div class="project-technologies">
                              ${project.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")}
                          </div>
                      `
                          : ""
                      }
                      
                      <div class="project-links">
                          <a href="${project.github}" target="_blank" class="project-link">
                              <i class="fab fa-github"></i> GitHub
                          </a>
                          <a href="${project.demo}" target="_blank" class="project-link">
                              <i class="fas fa-external-link-alt"></i> Live Demo
                          </a>
                      </div>
                  </div>
              `
          })
  
          projectsHTML += "</div>"
          return projectsHTML
  
        case "experience":
          let experienceHTML = '<div class="formatted-response experience-response">'
  
          data.forEach((job) => {
            experienceHTML += `
                  <div class="experience-item">
                      <div class="experience-header">
                          <h3>${job.position}</h3>
                          <div class="company-info">
                              <span class="company-name">${job.company}</span>
                          </div>
                          <span class="job-period">${job.period}</span>
                      </div>
                      <p class="job-description">${job.description}</p>
                      
                      ${
                        job.technologies
                          ? `
                          <div class="job-technologies">
                              ${job.technologies.map((tech) => `<span class="tech-tag">${tech}</span>`).join("")}
                          </div>
                      `
                          : ""
                      }
                  </div>
              `
          })
  
          experienceHTML += "</div>"
          return experienceHTML
  
        case "contact":
          return `
              <div class="formatted-response contact-response">
                  <div class="contact-item">
                      <i class="fas fa-envelope"></i>
                      <div class="contact-detail">
                          <span class="contact-label">Email</span>
                          <span class="contact-value">${data.email}</span>
                      </div>
                  </div>
                  
                  <div class="contact-item">
                      <i class="fas fa-phone"></i>
                      <div class="contact-detail">
                          <span class="contact-label">Phone</span>
                          <span class="contact-value">${data.phone}</span>
                      </div>
                  </div>
                  
                  <div class="contact-item">
                      <i class="fas fa-map-marker-alt"></i>
                      <div class="contact-detail">
                          <span class="contact-label">Location</span>
                          <span class="contact-value">${data.location}</span>
                      </div>
                  </div>
                  
                  ${
                    data.availability
                      ? `
                      <div class="contact-item">
                          <i class="fas fa-briefcase"></i>
                          <div class="contact-detail">
                              <span class="contact-label">Availability</span>
                              <span class="contact-value">${data.availability}</span>
                          </div>
                      </div>
                  `
                      : ""
                  }
                  
                  ${
                    data.preferredContact
                      ? `
                      <div class="contact-item">
                          <i class="fas fa-comment"></i>
                          <div class="contact-detail">
                              <span class="contact-label">Preferred Contact</span>
                              <span class="contact-value">${data.preferredContact}</span>
                          </div>
                      </div>
                  `
                      : ""
                  }
                  
                  ${
                    data.message
                      ? `
                      <div class="contact-message">
                          <p>${data.message}</p>
                      </div>
                  `
                      : ""
                  }
              </div>
          `
  
        case "error":
          return `
              <div class="formatted-response error-response">
                  <div class="error-icon">
                      <i class="fas fa-exclamation-triangle"></i>
                  </div>
                  <h3 class="error-title">${data.error}</h3>
                  <p class="error-message">${data.message}</p>
                  
                  <div class="available-endpoints">
                      <h4>Available Endpoints:</h4>
                      <ul>
                          ${data.availableEndpoints
                            .map(
                              (endpoint) => `
                              <li><code>${endpoint}</code></li>
                          `,
                            )
                            .join("")}
                      </ul>
                  </div>
              </div>
          `
  
        default:
          // Fallback to JSON if we don't have a formatter for this endpoint
          return `<pre>${JSON.stringify(data, null, 2)}</pre>`
      }
    }
  
    function generateCodeExample(url, method) {
      const codeText = `// Example code to fetch this endpoint
  fetch("${url}", {
    method: "${method}",
    headers: {
      "Accept": "application/json"
    }
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    
    // Example usage based on endpoint
    ${getExampleUsage(url)}
  })
  .catch(error => {
    console.error("Error:", error);
  });`
  
      codeSnippet.textContent = codeText
      codeExample.classList.remove("hidden")
      emptyCode.classList.add("hidden")
    }
  
    function getExampleUsage(url) {
      const urlParts = url.split("/")
  
      if (urlParts.some((part) => part.includes("about"))) {
        return `// Display profile information
  const { name, title, bio } = data;
  document.getElementById('profile-name').textContent = name;
  document.getElementById('profile-title').textContent = title;
  document.getElementById('profile-bio').textContent = bio;`
      } else if (urlParts.some((part) => part.includes("skills"))) {
        return `// Render skills as a list
  const skillsList = document.getElementById('skills-list');
  data.frontend.forEach(skill => {
    const li = document.createElement('li');
    li.textContent = \`\${skill.name} - \${skill.level} (\${skill.years} years)\`;
    skillsList.appendChild(li);
  });`
      } else if (urlParts.some((part) => part.includes("projects"))) {
        return `// Create project cards
  const projectsContainer = document.getElementById('projects-container');
  data.forEach(project => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = \`
      <h3>\${project.title}</h3>
      <p>\${project.description}</p>
      <div class="project-links">
        <a href="\${project.github}" target="_blank">GitHub</a>
        <a href="\${project.demo}" target="_blank">Live Demo</a>
      </div>
    \`;
    projectsContainer.appendChild(card);
  });`
      } else if (urlParts.some((part) => part.includes("experience"))) {
        return `// Display work experience
  const experienceList = document.getElementById('experience-list');
  data.forEach(job => {
    const item = document.createElement('div');
    item.className = 'experience-item';
    item.innerHTML = \`
        <h3>\${job.position} at \${job.company}</h3>
        <p class="period">\${job.period}</p>
        <p>\${job.description}</p>
        \`;
    experienceList.appendChild(item);
  });`
      } else if (urlParts.some((part) => part.includes("contact"))) {
        return `// Populate contact information
  document.getElementById('contact-email').textContent = data.email;
  document.getElementById('contact-phone').textContent = data.phone;
  document.getElementById('contact-location').textContent = data.location;`
      } else {
        return `// Process the response data
  console.table(data);`
      }
    }
  })

  