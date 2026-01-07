        function showPaymentDetails() {
            const paymentMethod = document.getElementById('method').value;
            const qrCodeSection = document.getElementById('qrCodeSection');
            const creditCardSection = document.getElementById('creditCardSection');
            const paypalSection = document.getElementById('paypalSection');
            const donateButton = document.getElementById('donateButton');

            // Hide all payment sections first
            qrCodeSection.style.display = 'none';
            creditCardSection.style.display = 'none';
            paypalSection.style.display = 'none';

            // Show the appropriate section based on selection
            if (paymentMethod === 'upi') {
                qrCodeSection.style.display = 'block';
                donateButton.style.display = 'none'; // Hide the Donate Now button for UPI
            } else if (paymentMethod === 'credit_card') {
                creditCardSection.style.display = 'block';
                donateButton.style.display = 'block';
            } else if (paymentMethod === 'paypal') {
                paypalSection.style.display = 'block';
                donateButton.style.display = 'block';
            }
        }

        // Show credit card section by default
        document.addEventListener('DOMContentLoaded', function () {
            showPaymentDetails();
        });

        // Handle form submission
        document.getElementById('donationForm').addEventListener('submit', function (e) {
            e.preventDefault();

            const amount = document.getElementById('amount').value;
            const paymentMethod = document.getElementById('method').value;

            if (paymentMethod === 'credit_card' || paymentMethod === 'paypal') {
                alert('Amount accepted. Thank you for your donation of $' + amount + '!');
                this.reset();
                showPaymentDetails();
            }
        });

        // Handle UPI "Done" button click
        function handleUpiDone() {
            const amount = document.getElementById('amount').value;
            alert('Amount accepted. Thank you for your donation of $' + amount + '!');
            document.getElementById('donationForm').reset();
            showPaymentDetails();
        }