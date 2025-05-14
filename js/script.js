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
    const modalDescription = document.getElementById("modal-description");
    const closeButton = document.querySelector(".close-button");

    // Combine data from skills.js, services.js, and clients.js
    const combinedData = { ...window.skills, ...window.services, ...window.clients };

    // Add click event to all boxes
    document.querySelectorAll(".service-box, .skill-box, .client-box").forEach((box) => {
        box.addEventListener("click", () => {
            const id = box.id; // Get the box ID
            const descriptionData = combinedData[id]; // Fetch description by ID

            if (descriptionData) {
                const tagsHtml = descriptionData.tags
                    .map(tag => `<span class="tag">#${tag.toLowerCase()}</span>`)
                    .join(" ");
                modalDescription.innerHTML = `
                    ${descriptionData.role ? `<h3>${descriptionData.role}</h3>` : ""}
                    <p>${descriptionData.description}</p>
                    <div class="tags-container">${tagsHtml}</div>
                `;
            } else {
                modalDescription.innerHTML = `<p>Description not available.</p>`;
            }

            modal.style.display = "flex"; // Show the modal
        });
    });

    // Close modal when clicking the close button
    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
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
});