// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    const isExpanded = navMenu.classList.contains('active');
    navMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', !isExpanded);
    
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

// Keyboard support for hamburger menu
hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hamburger.click();
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
let selectedQuestions = [];
const questionsToShow = 5;

// All quiz questions pool
const allQuizQuestions = [
    {
        question: "Ile minut życia średnio skraca jeden papieros?",
        options: ["3 minuty", "11 minut", "20 minut"],
        correctIndex: 1
    },
    {
        question: "Ile osób na świecie umiera rocznie z powodu palenia?",
        options: ["1 milion", "8 milionów", "15 milionów"],
        correctIndex: 1
    },
    {
        question: "Jaki procent uzależnionych rozpoczął palenie przed 18 rokiem życia?",
        options: ["50%", "70%", "90%"],
        correctIndex: 2
    },
    {
        question: "Ile substancji chemicznych zawiera papieros?",
        options: ["Około 200", "Około 1000", "Ponad 7000"],
        correctIndex: 2
    },
    {
        question: "Po jakim czasie od rzucenia palenia ryzyko chorób serca spada o 50%?",
        options: ["1 miesiąc", "6 miesięcy", "1 rok"],
        correctIndex: 2
    },
    {
        question: "Ile zgonów rocznie na świecie spowodowanych jest alkoholem?",
        options: ["500 tysięcy", "3 miliony", "10 milionów"],
        correctIndex: 1
    },
    {
        question: "O ile procent gorsze wyniki w nauce ma młodzież pijąca alkohol?",
        options: ["20%", "40%", "60%"],
        correctIndex: 1
    },
    {
        question: "Ile może kosztować palacz rocznie na papierosy?",
        options: ["5,000 zł", "15,000 zł", "25,000 zł"],
        correctIndex: 1
    },
    {
        question: "Po jakim czasie od ostatniego papierosa wraca zmysł smaku i węchu?",
        options: ["12 godzin", "48 godzin", "1 tydzień"],
        correctIndex: 1
    },
    {
        question: "Ile razy większe jest ryzyko uzależnienia od alkoholu gdy zaczyna się pić przed 15 rokiem życia?",
        options: ["2 razy", "4 razy", "6 razy"],
        correctIndex: 1
    },
    {
        question: "Jaka jest maksymalna kara więzienia za posiadanie narkotyków w Polsce?",
        options: ["1 rok", "3 lata", "5 lat"],
        correctIndex: 1
    },
    {
        question: "Ile procent przestępstw młodzieży jest popełnianych pod wpływem alkoholu?",
        options: ["30%", "50%", "70%"],
        correctIndex: 1
    }
];

// Function to select random questions
function selectRandomQuestions() {
    const shuffled = [...allQuizQuestions].sort(() => Math.random() - 0.5);
    selectedQuestions = shuffled.slice(0, questionsToShow);
}

// Function to render quiz questions
function renderQuiz() {
    const quizArea = document.getElementById('quiz-area');
    quizArea.innerHTML = '';
    
    selectedQuestions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = index === 0 ? 'question active' : 'question';
        questionDiv.dataset.question = index + 1;
        
        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `Pytanie ${index + 1}: ${q.question}`;
        
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'quiz-options';
        
        q.options.forEach((option, optIndex) => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.dataset.answer = optIndex === q.correctIndex ? 'correct' : 'wrong';
            button.textContent = option;
            optionsDiv.appendChild(button);
        });
        
        questionDiv.appendChild(questionTitle);
        questionDiv.appendChild(optionsDiv);
        quizArea.appendChild(questionDiv);
    });
    
    // Attach event listeners to new buttons
    attachQuizListeners();
}

// Function to attach quiz event listeners
function attachQuizListeners() {
    document.querySelectorAll('.quiz-option').forEach((option, index) => {
        option.setAttribute('tabindex', '0');
        option.setAttribute('role', 'button');
        option.setAttribute('aria-label', `Odpowiedź ${index + 1}: ${option.textContent}`);
        
        option.addEventListener('click', handleQuizAnswer);
        option.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleQuizAnswer.call(option, e);
            }
        });
    });
}

function handleQuizAnswer(e) {
    // Disable all options in current question
    const currentOptions = this.parentElement.querySelectorAll('.quiz-option');
    currentOptions.forEach(opt => {
        opt.style.pointerEvents = 'none';
        opt.setAttribute('aria-disabled', 'true');
    });

    // Check if answer is correct
    const isCorrect = this.dataset.answer === 'correct';
    
    if (isCorrect) {
        this.classList.add('correct');
        this.setAttribute('aria-label', this.textContent + ' - Poprawna odpowiedź');
        correctAnswers++;
    } else {
        this.classList.add('wrong');
        this.setAttribute('aria-label', this.textContent + ' - Niepoprawna odpowiedź');
        // Show the correct answer
        currentOptions.forEach(opt => {
            if (opt.dataset.answer === 'correct') {
                opt.classList.add('correct');
                opt.setAttribute('aria-label', opt.textContent + ' - To była poprawna odpowiedź');
            }
        });
    }

    // Move to next question after delay
    setTimeout(() => {
        currentQuestion++;
        
        if (currentQuestion < questionsToShow) {
            // Show next question
            const questions = document.querySelectorAll('.question');
            questions.forEach(q => q.classList.remove('active'));
            questions[currentQuestion].classList.add('active');
            
            // Update progress
            const progressFill = document.querySelector('.progress-fill');
            const progressBar = document.querySelector('.progress-bar');
            const currentQuestionSpan = document.getElementById('current-question');
            const progress = ((currentQuestion + 1) / questionsToShow) * 100;
            progressFill.style.width = progress + '%';
            progressBar.setAttribute('aria-valuenow', progress);
            currentQuestionSpan.textContent = currentQuestion + 1;
        } else {
            // Show results
            showResults();
        }
    }, 1500);
}

// Initialize quiz on page load
if (document.getElementById('quiz-area')) {
    selectRandomQuestions();
    renderQuiz();
}

function showResults() {
    // Hide questions
    document.getElementById('quiz-area').style.display = 'none';
    document.querySelector('.quiz-progress').style.display = 'none';
    
    // Show results
    const quizResult = document.getElementById('quiz-result');
    quizResult.classList.add('show');
    
    const score = (correctAnswers / questionsToShow) * 100;
    const resultScore = document.querySelector('.result-score');
    const resultMessage = document.querySelector('.result-message');
    
    resultScore.textContent = correctAnswers + ' / ' + questionsToShow;
    
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
    
    // Select new random questions
    selectRandomQuestions();
    renderQuiz();
    
    // Reset progress
    const progressFill = document.querySelector('.progress-fill');
    const currentQuestionSpan = document.getElementById('current-question');
    progressFill.style.width = (100 / questionsToShow) + '%';
    currentQuestionSpan.textContent = '1';
    
    // Hide results, show quiz
    const quizResult = document.getElementById('quiz-result');
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

// Cost Calculator
const calculateBtn = document.getElementById('calculate-btn');
if (calculateBtn) {
    calculateBtn.addEventListener('click', calculateCosts);
    
    // Also calculate on input change for better UX
    document.getElementById('cigarettes-per-day')?.addEventListener('input', calculateCosts);
    document.getElementById('pack-price')?.addEventListener('input', calculateCosts);
}

function calculateCosts() {
    const cigarettesPerDay = parseFloat(document.getElementById('cigarettes-per-day')?.value) || 0;
    const packPrice = parseFloat(document.getElementById('pack-price')?.value) || 0;
    
    // Calculate costs (20 cigarettes per pack)
    const costPerCigarette = packPrice / 20;
    const dailyCost = cigarettesPerDay * costPerCigarette;
    
    const weeklyCost = dailyCost * 7;
    const monthlyCost = dailyCost * 30;
    const yearlyCost = dailyCost * 365;
    const fiveYearCost = yearlyCost * 5;
    
    // Update results
    document.getElementById('result-week').textContent = weeklyCost.toFixed(2) + ' zł';
    document.getElementById('result-month').textContent = monthlyCost.toFixed(2) + ' zł';
    document.getElementById('result-year').textContent = yearlyCost.toFixed(2) + ' zł';
    document.getElementById('result-5years').textContent = fiveYearCost.toFixed(2) + ' zł';
    
    // Show results
    const resultsDiv = document.getElementById('calculator-results');
    if (resultsDiv) {
        resultsDiv.classList.add('show');
    }
}

// Social Sharing Functions
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('NIE do uzależNIEń! - Poznaj prawdę o używkach i podejmij mądrą decyzję 💪');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('NIE do uzależNIEń! - Poznaj prawdę o używkach');
    window.open(`https://wa.me/?text=${text} ${url}`, '_blank');
}

function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        const btn = document.querySelector('.share-btn.copy span:last-child');
        const originalText = btn.textContent;
        btn.textContent = 'Skopiowano!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Błąd kopiowania:', err);
        alert('Nie udało się skopiować linku');
    });
}

// Console message
console.log('%c NIE do uzależNIEń! ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('%c Pamiętaj: Twoje życie, Twój wybór! 💪', 'color: #6C63FF; font-size: 14px; font-weight: bold;');
