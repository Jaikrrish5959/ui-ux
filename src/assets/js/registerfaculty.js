        document.addEventListener('DOMContentLoaded', function() {
    const registerBtn = document.getElementById('registerBtn');
    const registerBtnText = registerBtn.querySelector('span');
    const loading = document.getElementById('loading');
    const nameInput = document.getElementById('name');
    const ageInput = document.getElementById('age');
    const qualificationInput = document.getElementById('qualification');
    const experienceInput = document.getElementById('experience');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const successMessage = document.getElementById('successMessage');
    
    // Error message elements
    const nameError = document.getElementById('nameError');
    const ageError = document.getElementById('ageError');
    const qualificationError = document.getElementById('qualificationError');
    const experienceError = document.getElementById('experienceError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    
    // Clear error messages when typing
    const inputs = [nameInput, ageInput, qualificationInput, experienceInput, emailInput, phoneInput];
    const errors = [nameError, ageError, qualificationError, experienceError, emailError, phoneError];
    const namevalue = nameInput.value.trim();
    const pattern = /^[A-Za-z\s]+$/;
    
    inputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            errors[index].style.display = 'none';
            input.parentElement.classList.remove('shake');
        });
    });
    
    // Register button click handler
    registerBtn.addEventListener('click', function(event) {
        event.preventDefault();
        
        const name = nameInput.value.trim();
        const age = ageInput.value.trim();
        const qualification = qualificationInput.value.trim();
        const experience = experienceInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        
        let isValid = true;
        
        // Reset error messages
        errors.forEach(error => {
            error.style.display = 'none';
        });
        
        // Validate name
        if (!name) {
            nameError.textContent = 'Please enter your full name';
            nameError.style.display = 'block';
            nameInput.parentElement.classList.add('shake');
            isValid = false;
        }
        
        
        // Validate age
        if (!age) {
            ageError.textContent = 'Please enter your age';
            ageError.style.display = 'block';
            ageInput.parentElement.classList.add('shake');
            isValid = false;
        } else if (age < 21 || age > 65) {
            ageError.textContent = 'Age must be between 21 and 65';
            ageError.style.display = 'block';
            ageInput.parentElement.classList.add('shake');
            isValid = false;
        }
        
        // Validate qualification
        if (!qualification) {
            qualificationError.textContent = 'Please enter your qualification';
            qualificationError.style.display = 'block';
            qualificationInput.parentElement.classList.add('shake');
            isValid = false;
        }
        
        // Validate experience
        if (!experience) {
            experienceError.textContent = 'Please enter your experience';
            experienceError.style.display = 'block';
            experienceInput.parentElement.classList.add('shake');
            isValid = false;
        }
        
        // Validate email
        if (!email) {
            emailError.textContent = 'Please enter your email';
            emailError.style.display = 'block';
            emailInput.parentElement.classList.add('shake');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            emailError.style.display = 'block';
            emailInput.parentElement.classList.add('shake');
            isValid = false;
        }
        
        // Validate phone
        if (!phone) {
            phoneError.textContent = 'Please enter your phone number';
            phoneError.style.display = 'block';
            phoneInput.parentElement.classList.add('shake');
            isValid = false;
        } else if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
            phoneError.textContent = 'Please enter a valid 10-digit phone number';
            phoneError.style.display = 'block';
            phoneInput.parentElement.classList.add('shake');
            isValid = false;
        }
        
        if (isValid) {
            // Show loading animation
            registerBtnText.style.display = 'none';
            loading.style.display = 'block';
            
            // Simulate registration process
            setTimeout(() => {
                // Display alert with login credentials
                alert("Staff Login Credentials\nUsername: amritanature@gmail.com\nPassword: nature");
                
                // Show success message
                successMessage.classList.add('show');
                
                // Redirect to password page after showing success message
                setTimeout(() => {
                    window.location.href = 'password.html';
                }, 1500);
            }, 1000);
        }
        
        // Remove shake animation after a delay
        setTimeout(() => {
            inputs.forEach(input => {
                input.parentElement.classList.remove('shake');
            });
        }, 500);
    });
});