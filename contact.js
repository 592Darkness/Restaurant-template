document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                message: document.getElementById('contact-message').value
            };
            
            // Validate form
            const errors = {};
            let isValid = true;
            
            if (!formData.name.trim()) {
                errors.name = "Name is required";
                document.getElementById('name-error').textContent = errors.name;
                document.getElementById('name-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('name-error').style.display = 'none';
            }
            
            if (!formData.email.trim()) {
                errors.email = "Email is required";
                document.getElementById('email-error').textContent = errors.email;
                document.getElementById('email-error').style.display = 'block';
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                errors.email = "Email address is invalid";
                document.getElementById('email-error').textContent = errors.email;
                document.getElementById('email-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('email-error').style.display = 'none';
            }
            
            if (!formData.message.trim()) {
                errors.message = "Message is required";
                document.getElementById('message-error').textContent = errors.message;
                document.getElementById('message-error').style.display = 'block';
                isValid = false;
            } else {
                document.getElementById('message-error').style.display = 'none';
            }
            
            // If no errors, submit form
            if (isValid) {
                // In a real application, you would send this data to a server
                console.log('Form submission data:', formData);
                
                // Show success message
                const successMessage = document.getElementById('form-success');
                successMessage.classList.remove('hidden');
                
                // Reset form
                contactForm.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    successMessage.classList.add('hidden');
                }, 5000);
            }
        });
    }
});
