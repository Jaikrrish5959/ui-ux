        // Store maps in a global object to manage them
        const maps = {};

        // Initialize data when page loads
        document.addEventListener('DOMContentLoaded', function() {
            // Ensure localStorage has allFeedback array
            if (!localStorage.getItem("allFeedback")) {
                localStorage.setItem("allFeedback", JSON.stringify([]));
            }
            
            // Display feedback data
            displayFeedbackList();
            updateStats();
        });

        function switchTab(tab) {
            // Update active tab styling
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            event.currentTarget.classList.add('active');

            // Hide all panels
            document.getElementById('view-panel').style.display = 'none';
            document.getElementById('edit-panel').style.display = 'none';

            // Show the selected panel
            if (tab === 'view') {
                document.getElementById('view-panel').style.display = 'block';
                displayFeedbackList();
            } else if (tab === 'edit') {
                document.getElementById('edit-panel').style.display = 'block';
                displayEditList();
            }
        }

        function updateStats() {
            // Get all feedback
            const allFeedback = JSON.parse(localStorage.getItem("allFeedback")) || [];
            
            // Count statuses
            const pending = allFeedback.filter(f => f.status === "pending").length;
            const inProgress = allFeedback.filter(f => f.status === "in-progress").length;
            const completed = allFeedback.filter(f => f.status === "completed").length;
            
            // Update stats display
            const statsDiv = document.getElementById('feedback-stats');
            statsDiv.innerHTML = `
                Total: ${allFeedback.length} | 
                <span class="status-badge pending">Pending: ${pending}</span> | 
                <span class="status-badge in-progress">In Progress: ${inProgress}</span> | 
                <span class="status-badge completed">Completed: ${completed}</span>
            `;
        }

        function initMap(mapId, location) {
            // Wait for the DOM to be fully updated
            setTimeout(() => {
                try {
                    // Check if map container exists
                    const mapContainer = document.getElementById(mapId);
                    if (!mapContainer) {
                        console.error("Map container not found:", mapId);
                        return;
                    }
                    
                    // Remove existing map if any
                    if (maps[mapId]) {
                        maps[mapId].remove();
                        delete maps[mapId];
                    }
                    
                    // Create new map
                    maps[mapId] = L.map(mapId, {
                        zoomControl: true,
                        attributionControl: false
                    }).setView([location.lat, location.lng], 13);
                    
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        maxZoom: 19,
                        attribution: '&copy; OpenStreetMap contributors'
                    }).addTo(maps[mapId]);
                    
                    // Add marker
                    L.marker([location.lat, location.lng]).addTo(maps[mapId]);
                    
                    // Force a redraw by invalidating the size
                    window.addEventListener('resize', function() {
                        if (maps[mapId]) maps[mapId].invalidateSize();
                    });
                    
                    // Additional timeout to ensure the map container is fully rendered
                    setTimeout(() => {
                        if (maps[mapId]) maps[mapId].invalidateSize();
                    }, 300);
                    
                } catch (e) {
                    console.error("Error initializing map:", e);
                }
            }, 500); // Longer timeout to ensure DOM is ready
        }

        function displayFeedbackList() {
            // Get all feedback
            const allFeedback = JSON.parse(localStorage.getItem("allFeedback")) || [];

            // Get the container element
            const feedbackList = document.getElementById('feedback-list');
            feedbackList.innerHTML = '';

            // Sort feedback by timestamp (newest first)
            allFeedback.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Create feedback items
            if (allFeedback.length === 0) {
                feedbackList.innerHTML = '<p>No complaint submissions yet.</p>';
                return;
            }

            allFeedback.forEach((feedback, index) => {
                const feedbackItem = document.createElement('div');
                feedbackItem.className = 'feedback-item';

                // Format date
                const feedbackDate = new Date(feedback.timestamp);
                const formattedDate = feedbackDate.toLocaleDateString() + ' ' + feedbackDate.toLocaleTimeString();

                // Create status class
                const statusClass = feedback.status || 'pending';

                // Create services list HTML
                let servicesHTML = '';
                if (feedback.selectedServices && feedback.selectedServices.length > 0) {
                    servicesHTML = '<div class="services-list">';
                    feedback.selectedServices.forEach(service => {
                        servicesHTML += `<span class="service-tag">${service}</span>`;
                    });
                    servicesHTML += '</div>';
                }

                // Create map HTML if available
                let mapHTML = '';
                const mapId = `view-map-${index}`;
                if (feedback.location) {
                    mapHTML = `
                    <div class="section-header"><strong>Location Information</strong></div>
                    <div class="map-container">
                        <div class="map-coordinates">
                            <strong>Coordinates:</strong> Lat: ${feedback.location.lat.toFixed(6)}, Lng: ${feedback.location.lng.toFixed(6)}
                        </div>
                        <div class="map-wrapper">
                            <div id="${mapId}" style="height: 100%; width: 100%; position: relative;"></div>
                        </div>
                    </div>
                    `;
                }

                // Create image HTML if available
                let imageHTML = '';
                if (feedback.locationImage) {
                    imageHTML = `
                    <div class="section-header"><strong>Location Image</strong></div>
                    <div class="image-container">
                        <img src="${feedback.locationImage}" alt="Location Image" class="location-image">
                    </div>
                    `;
                }

                // Create response HTML if available
                let responseHTML = '';
                if (feedback.response) {
                    responseHTML = `
                    <div class="section-header"><strong>Admin Response</strong></div>
                    <div class="response-box">
                        <p>${feedback.response}</p>
                    </div>
                    `;
                }

                // Populate the feedback item
                feedbackItem.innerHTML = `
                <div class="section-header"><strong>Complaint Details</strong></div>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Name:</strong> ${feedback.name || 'Anonymous'}</p>
                <p><strong>Email:</strong> ${feedback.email || 'Not provided'}</p>
                <p><strong>Status:</strong> <span class="status ${statusClass}">${feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}</span></p>
                
                <div class="section-header"><strong>Services Requested</strong></div>
                ${servicesHTML || '<p>No services specified</p>'}
                
                <div class="section-header"><strong>Comments</strong></div>
                <p>${feedback.comments || 'No comments provided'}</p>
                
                ${mapHTML}
                ${imageHTML}
                ${responseHTML}
                `;

                feedbackList.appendChild(feedbackItem);
                
                // Initialize map if location data exists
                if (feedback.location) {
                    initMap(mapId, feedback.location);
                }
            });

            // Update statistics
            updateStats();
        }

        function displayEditList() {
            // Get all feedback
            const allFeedback = JSON.parse(localStorage.getItem("allFeedback")) || [];

            // Get the container element
            const editList = document.getElementById('edit-list');
            editList.innerHTML = '';

            // Sort feedback by timestamp (newest first)
            allFeedback.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Create editable feedback items
            if (allFeedback.length === 0) {
                editList.innerHTML = '<p>No complaint submissions to edit.</p>';
                return;
            }

            allFeedback.forEach((feedback, index) => {
                const feedbackItem = document.createElement('div');
                feedbackItem.className = 'feedback-item';

                // Format date
                const feedbackDate = new Date(feedback.timestamp);
                const formattedDate = feedbackDate.toLocaleDateString() + ' ' + feedbackDate.toLocaleTimeString();

                // Show selected services if available
                let servicesHTML = '';
                if (feedback.selectedServices && feedback.selectedServices.length > 0) {
                    servicesHTML = '<div class="services-list">';
                    feedback.selectedServices.forEach(service => {
                        servicesHTML += `<span class="service-tag">${service}</span>`;
                    });
                    servicesHTML += '</div>';
                }

                // Create map HTML if available
                let mapHTML = '';
                const mapId = `edit-map-${index}`;
                if (feedback.location) {
                    mapHTML = `
                    <div class="section-header"><strong>Location Information</strong></div>
                    <div class="map-container">
                        <div class="map-coordinates">
                            <strong>Coordinates:</strong> Lat: ${feedback.location.lat.toFixed(6)}, Lng: ${feedback.location.lng.toFixed(6)}
                        </div>
                        <div class="map-wrapper">
                            <div id="${mapId}" style="height: 100%; width: 100%; position: relative;"></div>
                        </div>
                    </div>
                    `;
                }

                // Create image HTML if available
                let imageHTML = '';
                if (feedback.locationImage) {
                    imageHTML = `
                    <div class="section-header"><strong>Location Image</strong></div>
                    <div class="image-container">
                        <img src="${feedback.locationImage}" alt="Location Image" class="location-image">
                    </div>
                    `;
                }

                // Populate the editable feedback item
                feedbackItem.innerHTML = `
                <div class="section-header"><strong>Complaint Details</strong></div>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Name:</strong> ${feedback.name || 'Anonymous'}</p>
                <p><strong>Email:</strong> ${feedback.email || 'Not provided'}</p>
                
                <div class="section-header"><strong>Services Requested</strong></div>
                ${servicesHTML || '<p>No services specified</p>'}
                
                <div class="section-header"><strong>Comments</strong></div>
                <p>${feedback.comments || 'No comments provided'}</p>
                
                ${mapHTML}
                ${imageHTML}

                <div class="section-header"><strong>Update Status</strong></div>
                <div class="status-selector">
                    <label for="status-${index}">Status:</label>
                    <select id="status-${index}">
                        <option value="pending" ${feedback.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="in-progress" ${feedback.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="completed" ${feedback.status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </div>

                <div>
                    <label for="response-${index}">Admin Response:</label>
                    <textarea id="response-${index}" rows="3">${feedback.response || ''}</textarea>
                </div>

                <div class="buttons">
                    <button class="btn" onclick="updateFeedback(${index})">Update</button>
                    <button class="btn-danger" onclick="deleteFeedback(${index})">Delete</button>
                </div>
                `;

                editList.appendChild(feedbackItem);
                
                // Initialize map if location data exists
                if (feedback.location) {
                    initMap(mapId, feedback.location);
                }
            });
        }

        function updateFeedback(index) {
            // Get all feedback
            const allFeedback = JSON.parse(localStorage.getItem("allFeedback")) || [];

            // Get the new status and response
            const newStatus = document.getElementById(`status-${index}`).value;
            const newResponse = document.getElementById(`response-${index}`).value;

            // Update the feedback
            allFeedback[index].status = newStatus;
            allFeedback[index].response = newResponse;

            // Save the updated feedback
            localStorage.setItem("allFeedback", JSON.stringify(allFeedback));

            // Refresh the displays
            displayFeedbackList();
            displayEditList();
            updateStats();

            // Show confirmation
            alert("Complaint has been updated!");
        }

        function deleteFeedback(index) {
            // Confirm deletion
            if (!confirm("Are you sure you want to delete this complaint?")) {
                return;
            }

            // Get all feedback
            const allFeedback = JSON.parse(localStorage.getItem("allFeedback")) || [];

            // Remove the feedback at the given index
            allFeedback.splice(index, 1);

            // Save the updated feedback
            localStorage.setItem("allFeedback", JSON.stringify(allFeedback));

            // Refresh the displays
            displayFeedbackList();
            displayEditList();
            updateStats();

            // Show confirmation
            alert("Complaint has been deleted!");
        }

        function clearAllData() {
            // Confirm deletion
            if (!confirm("WARNING: This will delete ALL complaint data permanently. Are you sure?")) {
                return;
            }

            // Double confirm
            if (!confirm("This action cannot be undone. Proceed with deleting all data?")) {
                return;
            }

            // Clear all feedback data
            localStorage.setItem("allFeedback", JSON.stringify([]));

            // Refresh the displays
            displayFeedbackList();
            displayEditList();
            updateStats();

            // Show confirmation
            alert("All complaint data has been cleared!");
        }