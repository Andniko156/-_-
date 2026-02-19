// Система сада восстановления

const gardenConfig = {
    levels: [
        { name: 'Семя', min: 0, class: 'level-1' },
        { name: 'Росток', min: 3, class: 'level-2' },
        { name: 'Дерево', min: 7, class: 'level-3' },
        { name: 'Цветение', min: 14, class: 'level-4' }
    ]
};

function updateGarden() {
    const practices = parseInt(localStorage.getItem('totalPractices') || '0');
    const streak = calculateStreak();
    const weekly = getWeeklyPractices();
    
    // Обновляем счётчики
    const totalEl = document.getElementById('totalPractices');
    const streakEl = document.getElementById('currentStreak');
    const weeklyEl = document.getElementById('weeklyGoal');
    
    if (totalEl) totalEl.textContent = practices;
    if (streakEl) streakEl.textContent = streak;
    if (weeklyEl) weeklyEl.textContent = `${weekly}/7`;
    
    // Определяем уровень
    let currentLevel = gardenConfig.levels[0];
    for (let level of gardenConfig.levels) {
        if (practices >= level.min) currentLevel = level;
    }
    
    // Обновляем CSS-дерево
    updateTreeVisual(practices, currentLevel);
    
    // Обновляем стадии
    gardenConfig.levels.forEach((level, index) => {
        const el = document.getElementById(`stage${index + 1}`);
        if (el) {
            if (practices >= level.min) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        }
    });
    
    // Обновляем текст
    const nameEl = document.getElementById('plantName');
    const stageEl = document.getElementById('plantStage');
    
    if (nameEl) nameEl.textContent = currentLevel.name;
    if (stageEl) stageEl.textContent = `${practices} практик`;
}

function updateTreeVisual(practices, level) {
    const tree = document.getElementById('gardenTree');
    if (!tree) {
        console.error('Дерево не найдено!');
        return;
    }
    
    // Удаляем старые классы уровней
    tree.classList.remove('level-1', 'level-2', 'level-3', 'level-4', 'blooming');
    
    // Добавляем текущий класс
    tree.classList.add(level.class);
    
    // Если 14+ практик — добавляем цветение
    if (practices >= 14) {
        tree.classList.add('blooming');
    }
}

function waterPlant() {
    let practices = parseInt(localStorage.getItem('totalPractices') || '0');
    let weekly = parseInt(localStorage.getItem('weeklyPractices') || '0');
    
    const oldLevel = getCurrentLevel(practices);
    
    practices++;
    weekly++;
    
    localStorage.setItem('totalPractices', practices);
    localStorage.setItem('weeklyPractices', weekly);
    localStorage.setItem('lastPractice', new Date().toISOString());
    
    const newLevel = getCurrentLevel(practices);
    
    // Анимация полива
    showWaterAnimation();
    
    // Если уровень изменился — анимация роста
    if (oldLevel.name !== newLevel.name) {
        const tree = document.getElementById('gardenTree');
        if (tree) {
            tree.classList.add('growing');
            setTimeout(() => tree.classList.remove('growing'), 600);
        }
        
        showNotification('🎉 Уровень повышен!', `Ваше дерево теперь "${newLevel.name}"!`);
    } else {
        showNotification('💧 Практика засчитана!', 'Продолжайте в том же духе.');
    }
    
    updateGarden();
    checkAchievements(practices);
}

function getCurrentLevel(practices) {
    for (let i = gardenConfig.levels.length - 1; i >= 0; i--) {
        if (practices >= gardenConfig.levels[i].min) {
            return gardenConfig.levels[i];
        }
    }
    return gardenConfig.levels[0];
}

function showWaterAnimation() {
    const tree = document.getElementById('gardenTree');
    if (!tree) return;
    
    // Создаём капли воды
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const drop = document.createElement('div');
            drop.className = 'water-animation';
            drop.textContent = '💧';
            drop.style.left = (40 + i * 30) + '%';
            drop.style.animationDelay = (i * 0.2) + 's';
            tree.appendChild(drop);
            
            setTimeout(() => drop.remove(), 1000);
        }, i * 200);
    }
}

function calculateStreak() {
    const lastPractice = localStorage.getItem('lastPractice');
    if (!lastPractice) return 0;
    
    const last = new Date(lastPractice);
    const today = new Date();
    const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
        return parseInt(localStorage.getItem('currentStreak') || '0');
    }
    return 0;
}

function getWeeklyPractices() {
    const lastReset = localStorage.getItem('weeklyReset');
    const now = new Date();
    
    if (!lastReset) {
        localStorage.setItem('weeklyReset', now.toISOString());
        return 0;
    }
    
    const lastResetDate = new Date(lastReset);
    const daysSinceReset = Math.floor((now - lastResetDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceReset >= 7) {
        localStorage.setItem('weeklyPractices', '0');
        localStorage.setItem('weeklyReset', now.toISOString());
        return 0;
    }
    
    return parseInt(localStorage.getItem('weeklyPractices') || '0');
}

function checkAchievements(practices) {
    const achievements = {
        1: 'Первый шаг! Начало пути.',
        3: 'Росток появился!',
        7: 'Неделя практик!',
        14: 'Цветение!',
        30: 'Месяц практик!',
        50: 'Полпути!',
        100: 'Сто практик!'
    };
    
    if (achievements[practices]) {
        setTimeout(() => {
            showNotification('🎉 Достижение!', achievements[practices], 5000);
        }, 1000);
    }
}

function showGardenInfo() {
    const practices = parseInt(localStorage.getItem('totalPractices') || '0');
    const nextLevel = gardenConfig.levels.find(l => l.min > practices);
    
    let message = `У вас ${practices} практик. `;
    if (nextLevel) {
        message += `До "${nextLevel.name}" осталось ${nextLevel.min - practices} практик.`;
    } else {
        message += 'Вы достигли максимального уровня!';
    }
    
    showNotification('🌳 О саде', message);
}