document.addEventListener('DOMContentLoaded', function () {
            const urlParams = new URLSearchParams(window.location.search);

            const fieldsToDisplay = [
                { param: 'first', label: 'First Name' },
                { param: 'last', label: 'Last Name' },
                { param: 'email', label: 'Email' },
                { param: 'phone', label: 'Phone Number' },
                { param: 'business', label: 'Business/Organization' },
                { param: 'timestamp', label: 'Submission Date' }
            ];

            const submissionInfo = document.getElementById('submission-info');
            let displayHTML = '<dl class="submission-details">';

            fieldsToDisplay.forEach(field => {
                const value = urlParams.get(field.param);
                if (value) {
                    let displayValue = value;
                    if (field.param === 'timestamp') {
                        try {
                            const date = new Date(value);
                            displayValue = date.toLocaleString();
                        } catch (e) {
                            console.error('Error formatting date:', e);
                        }
                    }
                    displayHTML += `
                        <div class="detail-row">
                            <dt>${field.label}:</dt>
                            <dd>${displayValue}</dd>
                        </div>
                    `;
                }
            });

            displayHTML += '</dl>';
            submissionInfo.innerHTML = displayHTML;

            document.getElementById('current-year').textContent = new Date().getFullYear();
            document.getElementById('last-modified').textContent = `Last Modified: ${document.lastModified}`;
        });