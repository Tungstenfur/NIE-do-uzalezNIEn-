// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.card, .danger-item, .fact-card, .help-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Quiz functionality
let currentQuestion = 0;
let correctAnswers = 0;
const totalQuestions = 3;

const questions = document.querySelectorAll('.question');
const quizResult = document.getElementById('quiz-result');
const progressFill = document.querySelector('.progress-fill');
const currentQuestionSpan = document.getElementById('current-question');

// Handle quiz option clicks
document.querySelectorAll('.quiz-option').forEach(option => {
    option.addEventListener('click', function() {
        // Disable all options in current question
        const currentOptions = this.parentElement.querySelectorAll('.quiz-option');
        currentOptions.forEach(opt => {
            opt.style.pointerEvents = 'none';
        });

        // Check if answer is correct
        const isCorrect = this.dataset.answer === 'correct';
        
        if (isCorrect) {
            this.classList.add('correct');
            correctAnswers++;
        } else {
            this.classList.add('wrong');
            // Show the correct answer
            currentOptions.forEach(opt => {
                if (opt.dataset.answer === 'correct') {
                    opt.classList.add('correct');
                }
            });
        }

        // Move to next question after delay
        setTimeout(() => {
            currentQuestion++;
            
            if (currentQuestion < totalQuestions) {
                // Show next question
                questions.forEach(q => q.classList.remove('active'));
                questions[currentQuestion].classList.add('active');
                
                // Update progress
                const progress = ((currentQuestion + 1) / totalQuestions) * 100;
                progressFill.style.width = progress + '%';
                currentQuestionSpan.textContent = currentQuestion + 1;
            } else {
                // Show results
                showResults();
            }
        }, 1500);
    });
});

function showResults() {
    // Hide questions
    document.getElementById('quiz-area').style.display = 'none';
    document.querySelector('.quiz-progress').style.display = 'none';
    
    // Show results
    quizResult.classList.add('show');
    
    const score = (correctAnswers / totalQuestions) * 100;
    const resultScore = document.querySelector('.result-score');
    const resultMessage = document.querySelector('.result-message');
    
    resultScore.textContent = correctAnswers + ' / ' + totalQuestions;
    
    if (score === 100) {
        resultMessage.textContent = '🎉 Perfekcyjnie! Jesteś ekspertem od zdrowego życia!';
    } else if (score >= 66) {
        resultMessage.textContent = '👍 Świetnie! Masz dobrą wiedzę o zagrożeniach używek!';
    } else if (score >= 33) {
        resultMessage.textContent = '📚 Nieźle! Warto jeszcze poczytać o używkach.';
    } else {
        resultMessage.textContent = '💪 Przeczytaj artykuł jeszcze raz i spróbuj ponownie!';
    }
}

// Reset quiz
document.querySelector('.reset-quiz').addEventListener('click', function() {
    currentQuestion = 0;
    correctAnswers = 0;
    
    // Reset all options
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.classList.remove('correct', 'wrong');
        option.style.pointerEvents = 'auto';
    });
    
    // Show first question
    questions.forEach(q => q.classList.remove('active'));
    questions[0].classList.add('active');
    
    // Reset progress
    progressFill.style.width = '33.33%';
    currentQuestionSpan.textContent = '1';
    
    // Hide results, show quiz
    quizResult.classList.remove('show');
    document.getElementById('quiz-area').style.display = 'block';
    document.querySelector('.quiz-progress').style.display = 'block';
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        hero.style.opacity = 1 - scrolled / 700;
    }
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    }
});

// Trigger counter animations when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.classList.contains('animated')) {
                statNumber.classList.add('animated');
                // Extract number from text and animate
                const text = statNumber.textContent.trim();
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                if (!isNaN(number)) {
                    let current = 0;
                    const increment = number / 50;
                    const interval = setInterval(() => {
                        current += increment;
                        if (current >= number) {
                            statNumber.textContent = text;
                            clearInterval(interval);
                        } else {
                            statNumber.textContent = Math.floor(current) + text.replace(number, '');
                        }
                    }, 30);
                }
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Add floating animation to cards on hover
document.querySelectorAll('.fact-card, .help-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.animation = 'float 2s ease-in-out infinite';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.animation = 'none';
    });
});

// Console message
console.log('%c NIE do uzależNIEń! ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('%c Pamiętaj: Twoje życie, Twój wybór! 💪', 'color: #6C63FF; font-size: 14px; font-weight: bold;');
