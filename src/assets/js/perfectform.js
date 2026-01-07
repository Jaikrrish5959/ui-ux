        let currentStep = 1;
        let uploadedImage = null;
        let map = null;
        let marker = null;
        let userLocation = { lat: 10.9223, lng: 76.9123 }; // Default to Amrita Vishwa Vidyapeetham

        // Initialize the map once DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('location-image').addEventListener('change', handleImageUpload);
            
            // Check for existing feedback data in localStorage
            const allFeedback = JSON.parse(localStorage.getItem("allFeedback"));
            if (allFeedback === null) {
                localStorage.setItem("allFeedback", JSON.stringify([]));
            }

            // Initialize map when we reach step 4
            document.querySelectorAll('.btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    if (currentStep === 4 && !map) {
                        initMap();
                    }
                });
            });
        });

        function initMap() {
            // Create map with default center
            map = L.map('map-container').setView([userLocation.lat, userLocation.lng], 13);
            
            // Add OSM tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
            
            // Add marker at default location
            marker = L.marker([userLocation.lat, userLocation.lng], {
                draggable: true
            }).addTo(map);
            
            // Update coordinates display when marker is dragged
            marker.on('dragend', function(event) {
                const position = marker.getLatLng();
                userLocation = {
                    lat: position.lat,
                    lng: position.lng
                };
                updateCoordinatesDisplay();
            });
            
            // Add click event to set marker position
            map.on('click', function(e) {
                userLocation = {
                    lat: e.latlng.lat,
                    lng: e.latlng.lng
                };
                marker.setLatLng(e.latlng);
                updateCoordinatesDisplay();
            });
            
            updateCoordinatesDisplay();
        }
        
        function getMyLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function(position) {
                        userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        
                        // Update map and marker
                        if (map) {
                            map.setView([userLocation.lat, userLocation.lng], 15);
                            marker.setLatLng([userLocation.lat, userLocation.lng]);
                            updateCoordinatesDisplay();
                        }
                    },
                    function(error) {
                        alert("Could not get your location: " + error.message);
                    }
                );
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        }
        
        function resetMap() {
            // Reset to default location
            userLocation = { lat: 10.9223, lng: 76.9123 };
            if (map) {
                map.setView([userLocation.lat, userLocation.lng], 13);
                marker.setLatLng([userLocation.lat, userLocation.lng]);
                updateCoordinatesDisplay();
            }
        }
        
        function updateCoordinatesDisplay() {
            document.getElementById('location-coords').innerHTML = 
                `Latitude: ${userLocation.lat.toFixed(6)}, Longitude: ${userLocation.lng.toFixed(6)}`;
        }

        function handleImageUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                // Save the image data
                uploadedImage = e.target.result;
                
                // Show preview
                const preview = document.getElementById('image-preview');
                preview.innerHTML = `<img src="${uploadedImage}" alt="Location Image" style="max-width: 100%; border-radius: 5px;">`;
            };
            reader.readAsDataURL(file);
        }

        function switchTab(tab) {
            // Update active tab styling
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            
            // Find the clicked tab and add active class
            document.querySelector(`.tab:nth-child(${tab === 'form' ? 1 : 2})`).classList.add('active');

            // Hide all sections
            document.getElementById('form-section').style.display = 'none';
            document.getElementById('feedback-view').style.display = 'none';

            // Show the selected section
            if (tab === 'form') {
                document.getElementById('form-section').style.display = 'block';
            } else if (tab === 'view') {
                document.getElementById('feedback-view').style.display = 'block';
                displayFeedbackList();
            }
        }

        function nextStep(step) {
            document.getElementById(`step${currentStep}`).classList.remove("active");
            currentStep = step + 1;
            document.getElementById(`step${currentStep}`).classList.add("active");
            
            // Initialize map if moving to step 4
            if (currentStep === 4 && !map) {
                setTimeout(initMap, 100); // Small delay to ensure container is visible
            }
        }

        function prevStep(step) {
            document.getElementById(`step${currentStep}`).classList.remove("active");
            currentStep = step;
            document.getElementById(`step${currentStep}`).classList.add("active");
        }

        function resetForm() {
            // Hide success message
            document.getElementById("success").style.display = "none";

            // Reset to first step
            for (let i = 1; i <= 6; i++) {
                document.getElementById(`step${i}`).classList.remove("active");
            }
            document.getElementById("step1").classList.add("active");
            currentStep = 1;

            // Clear form fields
            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.querySelectorAll('.service:checked').forEach(checkbox => {
                checkbox.checked = false;
            });
            document.getElementById("comments").value = "";
            document.getElementById("location-image").value = "";
            document.getElementById("image-preview").innerHTML = "";
            uploadedImage = null;
            
            // Reset map if initialized
            if (map) {
                resetMap();
            }
        }

        function submitForm() {
            let name = document.getElementById("name").value;
            let email = document.getElementById("email").value;

            let selectedServices = [];
            document.querySelectorAll('.service:checked').forEach(service => {
                selectedServices.push(service.value);
            });

            let comments = document.getElementById("comments").value;

            // Create a unique ID for the feedback entry
            const feedbackId = 'feedback_' + new Date().getTime();

            let feedbackData = {
                id: feedbackId,
                name: name,
                email: email,
                selectedServices: selectedServices,
                comments: comments,
                timestamp: new Date().toString(),
                status: "pending",  // All new feedback starts as pending
                response: "",  // Initialize empty response field
                location: userLocation, // Store coordinates
                locationImage: uploadedImage // Store the uploaded image data
            };

            // Get existing feedback data or initialize empty array
            let allFeedback = JSON.parse(localStorage.getItem("allFeedback")) || [];

            // Add new feedback to array
            allFeedback.push(feedbackData);

            // Save back to localStorage
            localStorage.setItem("allFeedback", JSON.stringify(allFeedback));

            // Hide all steps and show success message
            for (let i = 1; i <= 6; i++) {
                document.getElementById(`step${i}`).classList.remove("active");
            }
            document.getElementById("success").style.display = "block";
        }

        function displayFeedbackList() {
            // Get all feedback
            const allFeedback = JSON.parse(localStorage.getItem("allFeedback")) || [];

            // Get the container for feedback
            const feedbackList = document.getElementById("feedback-list");
            feedbackList.innerHTML = "";

            if (allFeedback.length === 0) {
                feedbackList.innerHTML = "<p>No complaints have been submitted yet.</p>";
                return;
            }

            // Display all feedback items
            allFeedback.forEach((feedback) => {
                const feedbackItem = document.createElement("div");
                feedbackItem.className = "feedback-item";

                // Format date
                const date = new Date(feedback.timestamp);
                const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;

                // Create status display based on current status
                let statusClass, statusText;

                switch (feedback.status) {
                    case "completed":
                        statusClass = "completed";
                        statusText = "Resolved";
                        break;
                    case "in-progress":
                        statusClass = "in-progress";
                        statusText = "In Progress";
                        break;
                    default:
                        statusClass = "pending";
                        statusText = "Pending";
                }

                // Create services HTML
                const servicesHTML = feedback.selectedServices.length > 0 ? 
                    `<div class="services-list">
                        ${feedback.selectedServices.map(service => `<span class="service-tag">${service}</span>`).join('')}
                    </div>` : '';

                // Create HTML for the feedback item with section headers
                feedbackItem.innerHTML = `
                    <div class="section-header"><strong>Complaint Details</strong></div>
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Name:</strong> ${feedback.name || 'Anonymous'}</p>
                    <p><strong>Email:</strong> ${feedback.email || 'Not provided'}</p>
                    <p><strong>Status:</strong> <span class="status ${statusClass}">${statusText}</span></p>
                    
                    <div class="section-header"><strong>Services Requested</strong></div>
                    ${servicesHTML || '<p>No services specified</p>'}
                    
                    <div class="section-header"><strong>Comments</strong></div>
                    <p>${feedback.comments || 'No comments provided'}</p>
                `;

                // If there's a location, show it
                if (feedback.location) {
                    // Create a unique map id for this feedback
                    const mapId = 'map-' + feedback.id;
                    
                    feedbackItem.innerHTML += `
                        <div class="section-header"><strong>Location</strong></div>
                        <div class="map-container">
                            <p><strong>Coordinates:</strong> Lat: ${feedback.location.lat.toFixed(6)}, Lng: ${feedback.location.lng.toFixed(6)}</p>
                            <div id="${mapId}" style="height: 200px; width: 100%; border-radius: 5px;"></div>
                        </div>
                    `;
                    
                    // Add the map after the item is added to the DOM
                    setTimeout(() => {
                        const viewMap = L.map(mapId).setView([feedback.location.lat, feedback.location.lng], 13);
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '&copy; OpenStreetMap contributors'
                        }).addTo(viewMap);
                        L.marker([feedback.location.lat, feedback.location.lng]).addTo(viewMap);
                    }, 100);
                }

                // If there's an uploaded image, show it
                if (feedback.locationImage) {
                    feedbackItem.innerHTML += `
                        <div class="section-header"><strong>Photo Evidence</strong></div>
                        <div class="image-container">
                            <img src="${feedback.locationImage}" alt="Location Image" class="location-image">
                        </div>
                    `;
                }

                // If there's a response, show it
                if (feedback.response) {
                    feedbackItem.innerHTML += `
                        <div class="section-header"><strong>Status Update</strong></div>
                        <div class="response-box">
                            <p>${feedback.response}</p>
                        </div>
                    `;
                }

                feedbackList.appendChild(feedbackItem);
            });
        }