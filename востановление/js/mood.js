// Система оценки настроения

const moodData = {
    recommendations: {
        1: {
            text: 'Сейчас очень тяжело. Это нормально. Давайте попробуем технику заземления.',
            action: 'scrollToGrounding'
        },
        2: {
            text: 'Вы чувствуете упадок сил. Попробуйте активное дыхание.',
            action: 'startBreathing'
        },
        3: {
            text: 'Нейтральное состояние — хорошая база для практик.',
            action: 'showModules'
        },
        4: {
            text: 'Хорошее состояние! Отличный момент для самосострадания.',
            action: 'showCompassion'
        },
        5: {
            text: 'Отлично! Запомните это ощущение — оно станет якорем.',
            action: 'celebrate'
        }
    }
};

function selectMood(value) {
    // Убираем выделение со всех
    document.querySelectorAll('.mood-option').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Выделяем выбранное
    event.currentTarget.classList.add('selected');
    
    // Сохраняем
    const today = new Date().toDateString();
    localStorage.setItem(`mood_${today}`, value);
    saveMoodToHistory(value);
    
    // Показываем рекомендацию
    showMoodRecommendation(value);
    
    // Уведомление
    showNotification('Оценка сохранена', 'Спасибо, что делитесь своим состоянием.');
}

function showMoodRecommendation(value) {
    const rec = document.getElementById('moodRecommendation');
    const recData = moodData.recommendations[value];
    
    if (!rec || !recData) return;
    
    rec.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 1rem;">💡</div>
        <h4 style="margin-bottom: 1rem;">Рекомендация</h4>
        <p style="margin-bottom: 1.5rem; opacity: 0.95;">${recData.text}</p>
        <button onclick="executeMoodAction('${recData.action}')" class="cta-button" style="background: white; color: var(--primary);">
            ${getActionText(recData.action)}
        </button>
    `;
    
    rec.classList.add('active');
}

function getActionText(action) {
    const texts = {
        scrollToGrounding: 'Перейти к заземлению',
        startBreathing: 'Начать дыхание',
        showModules: 'Выбрать практику',
        showCompassion: 'Самосострадание',
        celebrate: 'Отметить успех'
    };
    return texts[action] || 'Продолжить';
}

function executeMoodAction(action) {
    const actions = {
        scrollToGrounding: () => {
            document.getElementById('exercises').scrollIntoView({ behavior: 'smooth' });
        },
        startBreathing: () => {
            document.getElementById('exercises').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => toggleBreathing(), 500);
        },
        showModules: () => {
            document.getElementById('modules').scrollIntoView({ behavior: 'smooth' });
        },
        showCompassion: () => {
            openModal('selfcompassion');
        },
        celebrate: () => {
            waterPlant();
            showNotification('Отлично!', 'Продолжайте в том же духе!');
        }
    };
    
    if (actions[action]) actions[action]();
}

function saveMoodToHistory(value) {
    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    history.push({
        date: new Date().toISOString(),
        value: parseInt(value)
    });
    
    // Храним только последние 30 записей
    if (history.length > 30) history.shift();
    
    localStorage.setItem('moodHistory', JSON.stringify(history));
}

function updateMoodDisplay() {
    const today = new Date().toDateString();
    const todayMood = localStorage.getItem(`mood_${today}`);
    
    if (todayMood) {
        document.querySelectorAll('.mood-option').forEach(el => {
            el.classList.remove('selected');
            if (el.getAttribute('data-value') === todayMood) {
                el.classList.add('selected');
            }
        });
        
        showMoodRecommendation(todayMood);
    }
}

function showMoodHistory() {
    const history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    
    if (history.length === 0) {
        showNotification('История пуста', 'Начните отмечать настроение каждый день.');
        return;
    }
    
    // Создаём простую визуализацию
    let html = '<h3>Ваши оценки за последние дни:</h3><div style="display: flex; gap: 0.5rem; margin: 1rem 0; flex-wrap: wrap;">';
    
    history.slice(-14).forEach(record => {
        const date = new Date(record.date);
        const emojis = ['', '😢', '😕', '😐', '🙂', '😊'];
        html += `
            <div style="text-align: center; padding: 0.5rem; background: rgba(123,158,135,0.1); border-radius: 8px;">
                <div style="font-size: 1.5rem;">${emojis[record.value]}</div>
                <div style="font-size: 0.75rem; color: var(--text-light);">${date.getDate()}.${date.getMonth()+1}</div>
            </div>
        `;
    });
    
    html += '</div>';
    
    // Статистика
    const avg = (history.reduce((a, b) => a + b.value, 0) / history.length).toFixed(1);
    html += `<p style="margin-top: 1rem;">Среднее значение: <strong>${avg}</strong></p>`;
    
    // Показываем в модальном окне
    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('modal').classList.add('active');
}