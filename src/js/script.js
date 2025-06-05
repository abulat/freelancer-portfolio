document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for internal links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            targetElement.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Form validation and popup for contact form
    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default form submission

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }

        // Send form data using fetch
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                }),
            });

            if (response.ok) {
                // Show success popup
                const popup = document.createElement('div');
                popup.classList.add('popup');
                popup.innerHTML = `
                    <div class="popup-content">
                        <p>Thank you, ${name}! Your message has been sent successfully.</p>
                        <button class="close-popup">Close</button>
                    </div>
                `;
                document.body.appendChild(popup);

                // Close the popup when the close button is clicked
                const closePopupButton = popup.querySelector('.close-popup');
                closePopupButton.addEventListener('click', () => {
                    popup.remove();
                });

                // Clear the form fields
                contactForm.reset();
            } else {
                throw new Error('Failed to send message.');
            }
        } catch (error) {
            // Show error popup
            const popup = document.createElement('div');
            popup.classList.add('popup');
            popup.innerHTML = `
                <div class="popup-content">
                    <p>Sorry, ${name}. Your message could not be sent. Please try again later.</p>
                    <button class="close-popup">Close</button>
                </div>
            `;
            document.body.appendChild(popup);

            // Close the popup when the close button is clicked
            const closePopupButton = popup.querySelector('.close-popup');
            closePopupButton.addEventListener('click', () => {
                popup.remove();
            });
        }
    });

    const modal = document.getElementById("modal");
    const closeButton = document.querySelector(".close-button");

    // Combine data from skills.js, services.js, and clients.js
    const combinedData = { ...window.skills, ...window.services, ...window.clients };

    // Popup stack to track open popups
    const popupStack = [];

    // Utility to open a popup and push to stack
    function openPopup(popup) {
        popup.style.display = 'flex';
        popupStack.push(popup);
    }

    // Utility to close the top popup
    function closeTopPopup() {
        if (popupStack.length > 0) {
            const topPopup = popupStack.pop();
            topPopup.style.display = 'none';
        }
    }

    // Add click event to all boxes
    document.querySelectorAll(".service-box, .skill-box, .client-box").forEach((box) => {
        box.addEventListener("click", () => {
            const id = box.id; // Get the box ID
            const descriptionData = combinedData[id]; // Fetch description by ID
            let achievementsHtml = '';
            if (descriptionData) {
                if (id.startsWith("client-")) {
                    
                    // Render Key Achievements if present
                    if (descriptionData.achievements && descriptionData.achievements.length > 0) {
                        achievementsHtml = `
                            <div class="client-achievements">
                                <h4>Key Achievements</h4>
                                <ul>
                                    ${descriptionData.achievements.map(item => `<li>${item}</li>`).join('')}
                                </ul>
                            </div>
                        `;

                    }
                    console.log(id, descriptionData.achievements);
                }
                const tagsHtml = descriptionData.tags
                    .map(tag => `<span class="tag clickable-tag">#${tag.toLowerCase()}</span>`)
                    .join(" ");
                modalDescription.innerHTML = `
                    ${descriptionData.role ? `<h3>Role: ${descriptionData.role}</h3>` : ""}
                    <p>${descriptionData.description}</p>
                    ${achievementsHtml}
                    <div class="tags-container">${tagsHtml}</div>
                `;
            } else {
                modalDescription.innerHTML = `<p>Description not available.</p>`;
            }

            // When opening a client in the modal, set data-client attribute
            if (box.classList.contains('client-box')) {
                modal.setAttribute('data-client', 'true');
            } else {
                modal.removeAttribute('data-client');
            }

            openPopup(modal); // Use openPopup utility
        });
    });

    // Close modal when clicking the close button
    closeButton.addEventListener("click", () => {
        closeTopPopup();
    });

    // Close modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeTopPopup();
        }
    });

    const testimonialsContainer = document.getElementById("testimonials-container");

    // Load testimonials from the window.testimonials object
    if (window.testimonials && Array.isArray(window.testimonials)) {
        window.testimonials.forEach(testimonial => {
            const testimonialElement = document.createElement("div");
            testimonialElement.classList.add("testimonial");

            testimonialElement.innerHTML = `
                <p class="testimonial-message">"${testimonial.message}"</p>
                <p class="testimonial-name">- ${testimonial.name}</p>
                <p class="testimonial-company">${testimonial.company}</p>
            `;

            testimonialsContainer.appendChild(testimonialElement);
        });
    }

    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-list li a'); // Select all menu links

    // Toggle the 'active' class on the nav-list when the hamburger menu is clicked
    mobileMenu.addEventListener('click', () => {
        navList.classList.toggle('active');
    });

    // Hide the menu when a menu item is clicked, but only if the hamburger menu is visible
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.getComputedStyle(mobileMenu).display !== 'none') {
                navList.classList.remove('active'); // Remove the 'active' class
            }
        });
    });

    // Delegate click for tags inside skill popups
    document.body.addEventListener('click', function (e) {
        if (e.target.classList.contains('clickable-tag')) {
            let tag = e.target.textContent.trim();
            if (tag.startsWith('#')) tag = tag.slice(1);
            tag = tag.toLowerCase();

            // --- If tag is clicked inside the client popup or modal showing client, show service & skill description ---
            if (
                e.target.closest('#client-popup') ||
                (modal.getAttribute('data-client') === 'true')
            ) {
                const services = window.services || {};
                const skills = window.skills || {};

                // Find service and skill by tag
                const matchedService = Object.values(services)
                    .find(service =>
                        (service.tags || []).some(t => t.toLowerCase() === tag)
                    );
                const matchedSkill = Object.values(skills)
                    .find(skill =>
                        (skill.tags || []).some(t => t.toLowerCase() === tag)
                    );

                let html = `<span class="close-button" id="close-services-popup" style="float:right;cursor:pointer;">&times;</span>`;
                html += `<h2>"${tag}" tagged in</h2>`;
                // Service section
                if (matchedService) {
                    html += `<div style="margin-bottom:24px;">`;
                    html += `<h3>Service</h3>`;
                    html += `<strong>${matchedService.name}</strong>`;
                    html += `<p>${matchedService.description}</p>`;
                    html += `</div>`;
                }
                
                // Skill section
                if (matchedSkill) {
                    html += `<div>`;
                    html += `<h3>Skills</h3>`;
                    html += `<strong>${matchedSkill.name}</strong>`;
                    html += `<p>${matchedSkill.description}</p>`;
                    html += `</div>`;
                }
                
                const popup = document.getElementById('services-popup');
                const content = document.getElementById('services-popup-content');
                content.className = 'clients-popup-content';
                content.innerHTML = html;
                openPopup(popup);

                document.getElementById('close-services-popup').onclick = function () {
                    closeTopPopup();
                };
                popup.onclick = function (event) {
                    if (event.target === popup) closeTopPopup();
                };
                return;
            }

            // --- Otherwise, show clients list as before ---
            const clients = window.clients || {};
            const matchedClients = Object.values(clients)
                .filter(client =>
                    (client.tags || []).some(t => t.toLowerCase() === tag)
                );

            let html = `<span class="close-button" id="close-clients-popup" style="float:right;cursor:pointer;">&times;</span>`;
            html += `<h3>Clients where "${tag}" was actively used</h3>`;
            if (matchedClients.length > 0) {
                matchedClients.forEach(client => {
                    html += `<p><strong>${client.name}</strong> &mdash; ${client.role}</p>`;
                });
            } else {
                html += '<p>No clients found for this tag.</p>';
            }

            const popup = document.getElementById('clients-popup');
            const content = document.getElementById('clients-popup-content');
            content.className = 'clients-popup-content';
            content.innerHTML = html;
            openPopup(popup);

            document.getElementById('close-clients-popup').onclick = function () {
                closeTopPopup();
            };
            popup.onclick = function (event) {
                if (event.target === popup) closeTopPopup();
            };
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeTopPopup();
        }
    });

    modal.removeAttribute('data-client');

    // Example for rendering a client box:
    Object.values(window.clients).forEach(client => {
        const clientBox = document.createElement('div');
        clientBox.className = 'client-box';
        clientBox.innerHTML = `
            <strong>${client.name}</strong>
            <div class="client-domain">
                ${client.domain ? client.domain.join(', ') : ''}
            </div>`;
        // ...append clientBox to container...
    });

    // Fill in client domains
    Object.entries(window.clients).forEach(([clientId, client]) => {
        const box = document.getElementById(clientId);
        if (box) {
            const domainDiv = box.querySelector('.client-domain');
            if (domainDiv && client.domain) {
                // Capitalize the first letter of each domain
                const capitalizedDomains = client.domain.map(d =>
                    d.charAt(0).toUpperCase() + d.slice(1)
                );
                domainDiv.textContent = capitalizedDomains.join(', ');
            }
        }
    });

    const closeBtn = document.getElementById('close-main-modal');
    if (closeBtn) {
        closeBtn.onclick = function () {
            modal.style.display = 'none';
        };
    }
});