// Основное приложение Восстановление

// Инициализация
document.addEventListener('DOMContentLoaded', function () {
    console.log('Восстановление: приложение запущено');

    if (!localStorage.getItem('firstVisit')) {
        localStorage.setItem('firstVisit', new Date().toISOString());
        showNotification('Добро пожаловать!', 'Начните с оценки вашего состояния.');
    }

    updateAll();

    // Плавная прокрутка с проверкой
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // ИСПРАВЛЕНИЕ: проверяем пустой href
            if (!href || href === '#' || href.length < 2) return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });
});

// ИСПРАВЛЕНИЕ: Мобильное меню
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

function updateAll() {
    if (typeof updateGarden === 'function') updateGarden();
    if (typeof updateMoodDisplay === 'function') updateMoodDisplay();
}

function showNotification(title, text, duration = 4000) {
    const notif = document.getElementById('notification');
    if (!notif) return;

    notif.innerHTML = '<strong style="color: var(--primary); display: block; margin-bottom: 0.5rem;">' + title + '</strong><p style="margin: 0; color: var(--text-light);">' + text + '</p>';
    notif.classList.add('show');

    setTimeout(function () {
        notif.classList.remove('show');
    }, duration);
}

function openModal(type) {
    const modal = document.getElementById('modal');
    const body = document.getElementById('modalBody');
    if (body) body.innerHTML = getModalContent(type);
    if (modal) modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) modal.classList.remove('active');
}

function getModalContent(type) {
    var contents = {
        breathing: '<h2>🫁 Дыхание</h2><p>Осознанное дыхание активирует парасимпатическую нервную систему.</p><ol><li>Вдох на 4 счёта</li><li>Пауза</li><li>Выдох на 6-8</li></ol>',
        grounding: '<h2>🌍 Заземление 5-4-3-2-1</h2><p>Техника для выхода из диссоциации.</p><ul><li>5 вещей, которые видите</li><li>4 ощущения</li><li>3 звука</li><li>2 запаха</li><li>1 вкус</li></ul>',
        cbt: '<h2>🧠 CBT</h2><p>Когнитивно-поведенческая терапия.</p><p>Используйте чатбот для практики.</p>',
        bodyscan: '<h2>🧍 Сканирование тела</h2><p>Лягте и последовательно сканируйте тело от пальцев ног до макушки.</p>',
        movement: '<h2>🌊 Движение</h2><p>Простые ритмичные движения стабилизируют нервную систему.</p>',
        selfcompassion: '<h2>💚 Самосострадание</h2><p>Будьте к себе так же добры, как к близкому другу.</p>'
    };
    return contents[type] || '<p>Загрузка...</p>';
}

function toggleEducation(card) {
    var content = card.querySelector('.education-content');
    if (content) content.classList.toggle('active');
}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
});