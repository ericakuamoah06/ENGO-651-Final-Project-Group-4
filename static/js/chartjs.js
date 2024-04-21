$(document).ready(function () {

    fetch('https://data.calgary.ca/resource/78gh-n26t.json')
        .then(response => response.json())
        .then(data => {

            console.log('Crime statistics:', data);
            // Process the data and create the chart

            let crime_2024 = data.filter(item => item.year === '2024');
            let crime_2023 = data.filter(item => item.year === '2023');
            let crime_2022 = data.filter(item => item.year === '2023');

            const labels = ['2022', '2023', '2024'];
            const values = [crime_2022.length, crime_2023.length, crime_2024.length];

            // Create the chart
            const ctx = document.getElementById('crimeChart');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Crime Statistics',
                        data: values,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching crime statistics:', error);
        });

});


