// Чатбот для когнитивной терапии

let chatContext = {
    step: 0,
    type: null,
    data: {}
};

function toggleChatbot() {
    const container = document.getElementById('chatbotContainer');
    const toggle = document.getElementById('chatbotToggle');
    
    if (container.classList.contains('active')) {
        container.classList.remove('active');
        toggle.style.display = 'flex';
    } else {
        container.classList.add('active');
        toggle.style.display = 'none';
    }
}

function handleChatEnter(event) {
    if (event.key === 'Enter') sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chatbotInput');
    const text = input.value.trim();
    if (!text) return;
    
    addMessage(text, 'user');
    input.value = '';
    
    setTimeout(() => {
        processMessage(text);
    }, 500);
}

function addMessage(text, sender) {
    const container = document.getElementById('chatbotMessages');
    const msg = document.createElement('div');
    msg.className = `message ${sender}`;
    msg.textContent = text;
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
}

function startScenario(type) {
    chatContext = { step: 0, type: type, data: {} };
    
    const scenarios = {
        thought: 'Давайте проверим автоматическую мысль. Что пришло вам в голову?',
        mood: 'Что сейчас вызывает эмоциональный дискомфорт?',
        anxiety: 'Что конкретно вызывает тревогу прямо сейчас?'
    };
    
    addMessage(scenarios[type], 'bot');
}

function processMessage(text) {
    // Если нет активного сценария
    if (!chatContext.type) {
        handleFreeText(text);
        return;
    }
    
    // Обработка по шагам CBT
    if (chatContext.type === 'thought') {
        processThoughtReframing(text);
    } else if (chatContext.type === 'mood' || chatContext.type === 'anxiety') {
        processMoodSupport(text);
    }
}

function processThoughtReframing(text) {
    const step = chatContext.step;
    
    switch(step) {
        case 0:
            chatContext.data.thought = text;
            addMessage(`Зафиксировали: "${text}"\\n\\nНасколько вы верите этой мысли (0-100%)?`, 'bot');
            chatContext.step = 1;
            break;
            
        case 1:
            chatContext.data.belief = text;
            addMessage('Какие эмоции вызывает эта мысль? (тревога, грусть, стыд...)', 'bot');
            chatContext.step = 2;
            break;
            
        case 2:
            chatContext.data.emotion = text;
            addMessage('Что говорит в пользу этой мысли? (факты)', 'bot');
            chatContext.step = 3;
            break;
            
        case 3:
            chatContext.data.evidenceFor = text;
            addMessage('А что говорит против? (даже маленькие детали)', 'bot');
            chatContext.step = 4;
            break;
            
        case 4:
            chatContext.data.evidenceAgainst = text;
            addMessage('Может ли быть более сбалансированный взгляд?', 'bot');
            chatContext.step = 5;
            break;
            
        case 5:
            chatContext.data.alternative = text;
            finishThoughtReframing();
            break;
    }
}

function finishThoughtReframing() {
    const d = chatContext.data;
    
    addMessage(
        `Отличная работа! Вы провели когнитивную реструктуризацию.\\n\\n` +
        `Исходная мысль: "${d.thought}"\\n` +
        `Альтернатива: "${d.alternative}"\\n\\n` +
        `Заметьте, как изменился эмоциональный отклик.`,
        'bot'
    );
    
    // Предлагаем сохранить
    addMessage(
        'Хотите сохранить эту работу?\\n' +
        '[Да, сохранить] [Нет, спасибо]',
        'bot'
    );
    
    chatContext.step = 6;
    
    // Сохраняем в localStorage
    saveThoughtRecord(d);
}

function processMoodSupport(text) {
    if (chatContext.step === 0) {
        chatContext.data.situation = text;
        addMessage(
            'Понял. Давайте попробуем одну из техник:\\n\\n' +
            '1. Дыхание 4-7-8\\n' +
            '2. Заземление 5-4-3-2-1\\n' +
            '3. Самосострадание\\n\\n' +
            'Напишите номер или "помогите выбрать"',
            'bot'
        );
        chatContext.step = 1;
    } else if (chatContext.step === 1) {
        const responses = {
            '1': 'Отлично. Сядьте удобно. Вдох 4с, задержка 7с, выдох 8с. Давайте 3 цикла.',
            '2': 'Найдите 5 вещей, которые видите прямо сейчас. Назовите их.',
            '3': 'Положите руку на сердце. Скажите: "Это тяжело. Я не один(а)."'
        };
        
        const response = responses[text] || 'Выберите 1, 2 или 3';
        addMessage(response, 'bot');
        
        if (responses[text]) {
            chatContext = {}; // Сброс
        }
    }
}

function handleFreeText(text) {
    const lower = text.toLowerCase();
    
    if (lower.includes('плохо') || lower.includes('грустно') || lower.includes('тревожно')) {
        addMessage('Мне жаль, что вам так. Хотите попробовать технику заземления или поговорить о том, что произошло?', 'bot');
    } else if (lower.includes('мысль') || lower.includes('думаю')) {
        startScenario('thought');
    } else if (lower.includes('спасибо')) {
        addMessage('Всегда пожалуйста! Вы делаете важную работу.', 'bot');
    } else {
        addMessage('Я вас слушаю. Расскажите подробнее о том, что происходит.', 'bot');
    }
}

function saveThoughtRecord(data) {
    const records = JSON.parse(localStorage.getItem('thoughtRecords') || '[]');
    records.push({
        date: new Date().toISOString(),
        ...data
    });
    localStorage.setItem('thoughtRecords', JSON.stringify(records));
}