        document.addEventListener('DOMContentLoaded', function () {
            const loginBtn = document.getElementById('loginBtn');
            const loginBtnText = loginBtn.querySelector('span');
            const loading = document.getElementById('loading');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const togglePassword = document.getElementById('togglePassword');
            const emailError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');
            const successMessage = document.getElementById('successMessage');
            const forgotPasswordLink = document.getElementById('forgotPassword');

            const correctEmail = "amritanature@gmail.com";
            const correctPassword = "nature";

            // Forgot Password link click handler
            forgotPasswordLink.addEventListener('click', function (event) {
                event.preventDefault();
                alert("Hint: The password is related to Amrita and is a common word for the environment (6 letters).");
            });

            // Password visibility toggle
            togglePassword.addEventListener('click', function () {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    togglePassword.classList.remove('fa-eye');
                    togglePassword.classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    togglePassword.classList.remove('fa-eye-slash');
                    togglePassword.classList.add('fa-eye');
                }
            });

            // Clear error messages when typing
            emailInput.addEventListener('input', function () {
                emailError.style.display = 'none';
            });

            passwordInput.addEventListener('input', function () {
                passwordError.style.display = 'none';
            });

            // Login button click handler
            loginBtn.addEventListener('click', function (event) {
                event.preventDefault();

                const email = emailInput.value.trim();
                const password = passwordInput.value.trim();
                let isValid = true;

                // Reset error messages
                emailError.style.display = 'none';
                passwordError.style.display = 'none';

                // Validate email
                if (!email) {
                    emailError.textContent = 'Please enter your email';
                    emailError.style.display = 'block';
                    emailInput.parentElement.classList.add('shake');
                    setTimeout(() => {
                        emailInput.parentElement.classList.remove('shake');
                    }, 500);
                    isValid = false;
                } else if (email !== correctEmail) {
                    emailError.textContent = 'Invalid faculty email';
                    emailError.style.display = 'block';
                    emailInput.parentElement.classList.add('shake');
                    setTimeout(() => {
                        emailInput.parentElement.classList.remove('shake');
                    }, 500);
                    isValid = false;
                }

                // Validate password
                if (!password) {
                    passwordError.textContent = 'Please enter your password';
                    passwordError.style.display = 'block';
                    passwordInput.parentElement.classList.add('shake');
                    setTimeout(() => {
                        passwordInput.parentElement.classList.remove('shake');
                    }, 500);
                    isValid = false;
                } else if (password !== correctPassword) {
                    passwordError.textContent = 'Incorrect password';
                    passwordError.style.display = 'block';
                    passwordInput.parentElement.classList.add('shake');
                    setTimeout(() => {
                        passwordInput.parentElement.classList.remove('shake');
                    }, 500);
                    isValid = false;
                }

                if (isValid) {
                    // Show loading
                    loginBtnText.style.display = 'none';
                    loading.style.display = 'block';

                    // Simulate login process
                    setTimeout(() => {
                        // Show success message
                        successMessage.classList.add('show');

                        // Redirect to feedback page after showing success message
                        setTimeout(() => {
                            window.location.href = 'perfectstatus.html';
                        }, 1500);
                    }, 1000);
                }
            });
        });