let score = 0;
let level = 1;
let isPlaying = false;
let currentExpression = '';
let currentAnswer = 0;
let expressionElement = document.getElementById('expression');
let moveSpeed = 20;
let currentSpeed = 1;
let baseSpeed = 1;

document.addEventListener('keydown', function(event) {
    if (!isPlaying) return;

    const currentLeft = parseFloat(expressionElement.style.left) || 0;
    const currentTop = parseFloat(expressionElement.style.top) || 0;

    switch(event.key) {
        case 'ArrowLeft':
            if (currentLeft > 0) {
                expressionElement.style.left = (currentLeft - moveSpeed) + 'px';
            }
            break;
        case 'ArrowRight':
            if (currentLeft < (600 - expressionElement.offsetWidth)) {
                expressionElement.style.left = (currentLeft + moveSpeed) + 'px';
            }
            break;
        case 'ArrowDown':
            currentSpeed = baseSpeed * 2;
            break;
        case 'ArrowUp':
            currentSpeed = baseSpeed * 0.5;
            break;
    }
    event.preventDefault();
});

document.addEventListener('keyup', function(event) {
    if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
        currentSpeed = baseSpeed;
    }
});

function startGame() {
    score = 0;
    level = 1;
    isPlaying = true;
    updateScore();
    setupRound();
}

function setupRound() {
    if (!isPlaying) return;

    baseSpeed = Math.min(3, 1 + level * 0.2);
    currentSpeed = baseSpeed;

    let expression = generateExpression(level);
    currentExpression = expression.text;
    currentAnswer = expression.answer;

    let answers = generateAnswerOptions(currentAnswer);
    document.getElementById('box1').textContent = answers[0];
    document.getElementById('box2').textContent = answers[1];
    document.getElementById('box3').textContent = answers[2];

    const boxWidth = 150;
    const spacing = 75;
    const totalWidth = 3 * boxWidth + 2 * spacing;
    const startX = (600 - totalWidth) / 2;

    document.querySelectorAll('.answer-box').forEach((box, index) => {
        box.style.left = (startX + index * (boxWidth + spacing)) + 'px';
    });

    expressionElement.textContent = currentExpression;
    expressionElement.style.left = Math.random() * (500 - expressionElement.offsetWidth) + 'px';
    expressionElement.style.top = '0px';

    dropExpression();
}

function generateExpression(level) {
    if (level <= 2) {
        let a = Math.floor(Math.random() * 10);
        let b = Math.floor(Math.random() * 10);
        return {
            text: `${a} + ${b}`,
            answer: a + b
        };
    } else if (level <= 4) {
        let a = Math.floor(Math.random() * 10);
        let b = Math.floor(Math.random() * 5) + 1;
        return {
            text: `${a} × ${b}`,
            answer: a * b
        };
    } else {
        let a = Math.floor(Math.random() * 10);
        let b = Math.floor(Math.random() * 10);
        let c = Math.floor(Math.random() * 5) + 1;
        return {
            text: `${c}(${a} + ${b})`,
            answer: c * (a + b)
        };
    }
}

function generateAnswerOptions(correct) {
    let options = [correct];
    while (options.length < 3) {
        let wrong = correct + Math.floor(Math.random() * 10) - 5;
        if (wrong !== correct && !options.includes(wrong)) {
            options.push(wrong);
        }
    }
    return shuffleArray(options);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function dropExpression() {
    let top = parseFloat(expressionElement.style.top);
    if (top >= 340) {
        checkAnswer();
        return;
    }
    
    expressionElement.style.top = (top + currentSpeed) + 'px';
    if (isPlaying) {
        requestAnimationFrame(dropExpression);
    }
}

function checkAnswer() {
    let expressionRect = expressionElement.getBoundingClientRect();
    let expressionCenter = expressionRect.left + expressionRect.width / 2;

    let boxes = document.querySelectorAll('.answer-box');
    for (let box of boxes) {
        let boxRect = box.getBoundingClientRect();
        if (expressionCenter >= boxRect.left && expressionCenter <= boxRect.right) {
            if (parseInt(box.textContent) === currentAnswer) {
                score += 10;
                level = Math.floor(score / 30) + 1;
            } else {
                score = Math.max(0, score - 5);
            }
            updateScore();
            break;
        }
    }
    
    setTimeout(setupRound, 1000);
}

function updateScore() {
    document.getElementById('score').textContent = `Score: ${score} (Level ${level})`;
}

function toggleInstructions() {
    const modal = document.getElementById('instructions-modal');
    modal.style.display = modal.style.display === 'none' ? 'flex' : 'none';
}