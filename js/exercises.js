// Упражнения и практики

// ===== ДЫХАНИЕ =====
let isBreathing = false;
let currentPattern = 'calm';
let breathCycle = 0;
let breathInterval = null;

const breathPatterns = {
    calm: { inhale: 4, hold: 2, exhale: 6, text: 'Вдох 4с → Пауза → Выдох 6с' },
    energy: { inhale: 4, hold: 4, exhale: 4, text: 'Вдох 4с → Задержка 4с → Выдох 4с' },
    sleep: { inhale: 4, hold: 7, exhale: 8, text: 'Вдох 4с → Задержка 7с → Выдох 8с' }
};

function toggleBreathing() {
    const circle = document.getElementById('breathCircle');
    const textEl = circle.querySelector('.breath-text');
    const hintEl = circle.querySelector('.breath-hint');
    
    if (!isBreathing) {
        // Начинаем дыхание
        isBreathing = true;
        breathCycle = 0;
        circle.classList.add('breathing');
        
        // Убираем подсказку, показываем инструкцию
        if (hintEl) hintEl.style.display = 'none';
        
        // Запускаем цикл
        runBreathingCycle();
        
        // Обновляем счётчик
        updateBreathCounter();
        
    } else {
        // Останавливаем
        stopBreathing();
    }
}

function runBreathingCycle() {
    if (!isBreathing) return;
    
    const pattern = breathPatterns[currentPattern];
    const textEl = document.querySelector('.breath-text');
    const circle = document.getElementById('breathCircle');
    
    if (!textEl || !circle) return;
    
    // Фаза 1: Вдох
    textEl.textContent = 'Вдох...';
    
    setTimeout(() => {
        if (!isBreathing) return;
        
        // Фаза 2: Задержка (если есть)
        if (pattern.hold > 0) {
            textEl.textContent = 'Задержка...';
            
            setTimeout(() => {
                if (!isBreathing) return;
                doExhale(pattern, textEl);
            }, pattern.hold * 1000);
            
        } else {
            doExhale(pattern, textEl);
        }
        
    }, pattern.inhale * 1000);
}

function doExhale(pattern, textEl) {
    // Фаза 3: Выдох
    textEl.textContent = 'Выдох...';
    
    setTimeout(() => {
        if (!isBreathing) return;
        
        breathCycle++;
        updateBreathCounter();
        
        // Проверяем завершение
        if (breathCycle >= 5) {
            finishBreathing();
        } else {
            // Следующий цикл
            runBreathingCycle();
        }
        
    }, pattern.exhale * 1000);
}

function stopBreathing() {
    isBreathing = false;
    const circle = document.getElementById('breathCircle');
    const textEl = circle.querySelector('.breath-text');
    const hintEl = circle.querySelector('.breath-hint');
    
    circle.classList.remove('breathing');
    textEl.textContent = 'Начать';
    if (hintEl) hintEl.style.display = 'block';
    
    // Сбрасываем счётчик через 2 секунды
    setTimeout(() => {
        breathCycle = 0;
        updateBreathCounter();
    }, 2000);
}

function finishBreathing() {
    stopBreathing();
    showNotification('Отлично!', 'Вы завершили 5 циклов осознанного дыхания.');
    
    // Засчитываем практику
    if (typeof waterPlant === 'function') {
        setTimeout(waterPlant, 500);
    }
}

function updateBreathCounter() {
    const counter = document.getElementById('breathCounter');
    if (counter) {
        counter.textContent = `Цикл: ${breathCycle}/5`;
    }
}

function setBreathPattern(pattern) {
    currentPattern = pattern;
    
    // Обновляем UI кнопок
    document.querySelectorAll('.pattern-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Обновляем текст инструкции
    const instruction = document.getElementById('breathInstruction');
    if (instruction) {
        instruction.textContent = breathPatterns[pattern].text;
    }
    
    // Если дышим — останавливаем
    if (isBreathing) {
        stopBreathing();
    }
}

// ===== ЗАЗЕМЛЕНИЕ =====
let groundingStep = 1;
let groundingAnswers = {};

function nextGroundingStep(step) {
    const input = document.getElementById(`g${step}`);
    const value = input ? input.value.trim() : '';
    
    if (!value) {
        alert('Пожалуйста, напишите хотя бы одно слово — это важно для фокуса внимания');
        return;
    }
    
    groundingAnswers[step] = value;
    
    // Скрываем текущий шаг
    const currentStepEl = document.querySelector(`.grounding-step[data-step="${step}"]`);
    if (currentStepEl) currentStepEl.classList.remove('active');
    
    // Показываем следующий
    const nextStep = step + 1;
    const nextEl = document.querySelector(`.grounding-step[data-step="${nextStep}"]`);
    
    if (nextEl) {
        nextEl.classList.add('active');
        groundingStep = nextStep;
    }
}

function finishGrounding() {
    const input = document.getElementById('g5');
    if (input) groundingAnswers[5] = input.value;
    
    // Скрываем шаг 5
    const step5 = document.querySelector('.grounding-step[data-step="5"]');
    if (step5) step5.classList.remove('active');
    
    // Показываем финальный
    const step6 = document.querySelector('.grounding-step[data-step="6"]');
    if (step6) {
        step6.style.display = 'block';
        step6.classList.add('active');
    }
    
    // Засчитываем практику
    if (typeof waterPlant === 'function') waterPlant();
    
    showNotification('Прекрасно!', 'Вы успешно вернулись в настоящий момент.');
}

function resetGrounding() {
    groundingStep = 1;
    groundingAnswers = {};
    
    document.querySelectorAll('.grounding-step').forEach((step, index) => {
        step.classList.remove('active');
        if (index === 5) step.style.display = 'none';
        if (index === 0) step.classList.add('active');
        
        const input = step.querySelector('input');
        if (input) input.value = '';
    });
}

// ===== ЧЕК-ЛИСТ =====
function toggleTask(checkbox) {
    const label = checkbox.closest('label');
    
    if (checkbox.checked) {
        label.classList.add('completed');
        if (typeof waterPlant === 'function') waterPlant();
    } else {
        label.classList.remove('completed');
    }
    
    updateProgress();
}

function updateProgress() {
    const checkboxes = document.querySelectorAll('.check-input');
    const checked = document.querySelectorAll('.check-input:checked');
    
    const percent = checkboxes.length > 0 
        ? Math.round((checked.length / checkboxes.length) * 100) 
        : 0;
    
    const percentEl = document.getElementById('progressPercent');
    const barEl = document.getElementById('dailyProgressBar');
    
    if (percentEl) percentEl.textContent = `${percent}%`;
    if (barEl) barEl.style.width = `${percent}%`;
}