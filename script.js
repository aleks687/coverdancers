// Мобильное меню
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.innerHTML = navLinks.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Эффект прокрутки для навигации
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
        navbar.style.padding = '10px 0';
    } else {
        navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
        navbar.style.padding = '15px 0';
    }
});

// Имитация отправки формы
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в течение 24 часов.');
        contactForm.reset();
    });
}

// YouTube модальное окно
function openYouTubeModal(youtubeId, videoTitle = '') {
    // Проверяем, есть ли уже открытое модальное окно
    const existingModal = document.querySelector('.youtube-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Создаем модальное окно
    const modal = document.createElement('div');
    modal.className = 'youtube-modal';
    
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="close-modal" aria-label="Закрыть">
                <i class="fas fa-times"></i>
            </button>
            <div class="video-container">
                <div class="youtube-iframe">
                    <iframe 
                        src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&enablejsapi=1"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        title="${videoTitle}"
                        id="youtubePlayer"
                        loading="lazy">
                    </iframe>
                </div>
                ${videoTitle ? `<div class="video-title">${videoTitle}</div>` : ''}
            </div>
        </div>
    `;
    
    // Добавляем в body
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Анимация появления
    setTimeout(() => modal.classList.add('active'), 10);
    
    // Закрытие по кнопке
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = closeYouTubeModal;
    
    // Закрытие по клику вне видео
    modal.querySelector('.modal-overlay').onclick = closeYouTubeModal;
    
    // Закрытие по Escape
    document.addEventListener('keydown', handleEscape);
    
    function handleEscape(e) {
        if (e.key === 'Escape') {
            closeYouTubeModal();
        }
    }
    
    function closeYouTubeModal() {
        modal.classList.remove('active');
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
            document.removeEventListener('keydown', handleEscape);
        }, 300);
    }
    
    // Останавливаем видео при закрытии
    modal.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            const iframe = document.getElementById('youtubePlayer');
            if (iframe) {
                iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0');
            }
        }
    });
}

// Обработка кликов по видео-карточкам
document.addEventListener('DOMContentLoaded', function() {
    // Вешаем обработчик на все видео-карточки
    document.addEventListener('click', function(e) {
        const videoCard = e.target.closest('.video-card');
        if (videoCard) {
            e.preventDefault();
            
            const youtubeId = videoCard.getAttribute('data-youtube-id');
            const videoTitle = videoCard.querySelector('h3')?.textContent || '';
            
            if (youtubeId) {
                openYouTubeModal(youtubeId, videoTitle);
                
                // Логирование просмотра (опционально)
                console.log(`Открыто видео: ${videoTitle} (ID: ${youtubeId})`);
                
                // Можно добавить Google Analytics
                // gtag('event', 'video_play', { video_title: videoTitle });
            }
        }
    });
    
    // Альтернативный способ для старых браузеров
    const videoCards = document.querySelectorAll('.video-card');
    videoCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Воспроизвести видео');
        
        // Для клавиатуры (Enter/Space)
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const youtubeId = this.getAttribute('data-youtube-id');
                const videoTitle = this.querySelector('h3')?.textContent || '';
                if (youtubeId) openYouTubeModal(youtubeId, videoTitle);
            }
        });
    });
});