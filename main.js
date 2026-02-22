document.addEventListener('DOMContentLoaded', () => {
    const lottoContainer = document.getElementById('lotto-container');
    const generateBtn = document.getElementById('generate-btn');

    generateBtn.addEventListener('click', () => {
        lottoContainer.innerHTML = '';
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        sortedNumbers.forEach(number => {
            const ball = document.createElement('div');
            ball.classList.add('lotto-ball');
            ball.textContent = number;
            ball.style.backgroundColor = getBallColor(number);
            lottoContainer.appendChild(ball);
        });
    });

    function getBallColor(number) {
        if (number <= 10) {
            return '#fbc400'; // Yellow
        } else if (number <= 20) {
            return '#69c8f2'; // Blue
        } else if (number <= 30) {
            return '#ff7272'; // Red
        } else if (number <= 40) {
            return '#aaa'; // Gray
        } else {
            return '#b0d840'; // Green
        }
    }
});
