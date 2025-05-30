document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('trainingPlanForm');
    const trainingPlanDiv = document.getElementById('trainingPlan');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const weeks = parseInt(document.getElementById('weeks').value);
        const sessionsPerWeek = parseInt(document.getElementById('sessionsPerWeek').value);
        const initialVolume = parseFloat(document.getElementById('initialVolume').value);
        const targetTime = document.getElementById('targetTime').value;

        // Create training plan generator
        const generator = new TrainingPlanGenerator({
            weeks,
            sessionsPerWeek,
            initialVolume,
            raceTime: targetTime,
            distance: 5 // 5K distance
        });

        // Generate plan
        const plan = generator.generatePlan();

        // Display plan
        displayTrainingPlan(plan);
    });

    function displayTrainingPlan(plan) {
        let html = '<div class="training-plan-container">';
        
        plan.forEach(week => {
            html += `
                <div class="week-container">
                    <h3>Settimana ${week.week}</h3>
                    <p class="weekly-volume">Volume settimanale: ${week.volume} km</p>
                    <table class="training-table">
                        <thead>
                            <tr>
                                <th>Tipo</th>
                                <th>Distanza</th>
                                <th>Ritmo</th>
                                <th>Durata</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            week.sessions.forEach(session => {
                html += `
                    <tr>
                        <td>${session.type}</td>
                        <td>${session.distance} km</td>
                        <td>${session.pace}/km</td>
                        <td>${session.duration}</td>
                    </tr>
                `;
            });

            html += `
                        </tbody>
                    </table>
                </div>
            `;
        });

        html += '</div>';
        trainingPlanDiv.innerHTML = html;
        trainingPlanDiv.style.display = 'block';

        // Save plan to localStorage
        localStorage.setItem('5kTrainingPlan', JSON.stringify(plan));
    }

    // Load saved plan if exists
    const savedPlan = localStorage.getItem('5kTrainingPlan');
    if (savedPlan) {
        displayTrainingPlan(JSON.parse(savedPlan));
    }
});
