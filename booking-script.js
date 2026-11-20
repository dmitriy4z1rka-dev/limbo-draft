// Тарифы для каждого зала
const tariffs = {
    'vip-new': [
        { name: 'Ночной', price: 900, time: '22:00 — 08:00', hours: 10, badge: 'Выгодно' },
        { name: 'Сутки на неделю', price: 2700, time: '24 часа в течение недели', hours: 24, badge: 'Лучшее' },
        { name: '12 часов', price: 1600, time: '', hours: 12 },
        { name: '5 часов', price: 750, time: '', hours: 5 },
        { name: '3 часа', price: 500, time: '', hours: 3 },
        { name: '1 час', price: 200, time: '', hours: 1 }
    ],
    'vip': [
        { name: 'Ночной', price: 800, time: '22:00 — 08:00', hours: 10, badge: 'Выгодно' },
        { name: 'Сутки на неделю', price: 2500, time: '24 часа в течение недели', hours: 24, badge: 'Лучшее' },
        { name: '12 часов', price: 1400, time: '', hours: 12 },
        { name: '5 часов', price: 650, time: '', hours: 5 },
        { name: '3 часа', price: 450, time: '', hours: 3 },
        { name: '1 час', price: 180, time: '', hours: 1 }
    ],
    'bootcamp': [
        { name: 'Ночной', price: 800, time: '22:00 — 08:00', hours: 10, badge: 'Выгодно' },
        { name: 'Сутки на неделю', price: 2500, time: '24 часа в течение недели', hours: 24, badge: 'Лучшее' },
        { name: '12 часов', price: 1400, time: '', hours: 12 },
        { name: '5 часов', price: 650, time: '', hours: 5 },
        { name: '3 часа', price: 450, time: '', hours: 3 },
        { name: '1 час', price: 180, time: '', hours: 1 }
    ],
    'comfort': [
        { name: 'Ночной', price: 600, time: '22:00 — 08:00', hours: 10, badge: 'Выгодно' },
        { name: 'Сутки на неделю', price: 1800, time: '24 часа в течение недели', hours: 24, badge: 'Лучшее' },
        { name: '12 часов', price: 1050, time: '', hours: 12 },
        { name: '5 часов', price: 520, time: '', hours: 5 },
        { name: '3 часа', price: 350, time: '', hours: 3 },
        { name: '1 час', price: 140, time: '', hours: 1 }
    ],
    'standart': [
        { name: 'Ночной', price: 550, time: '22:00 — 08:00', hours: 10, badge: 'Выгодно' },
        { name: 'Сутки на неделю', price: 1700, time: '24 часа в течение недели', hours: 24, badge: 'Лучшее' },
        { name: '12 часов', price: 1000, time: '', hours: 12 },
        { name: '5 часов', price: 480, time: '', hours: 5 },
        { name: '3 часа', price: 320, time: '', hours: 3 },
        { name: '1 час', price: 130, time: '', hours: 1 }
    ],
    'ps': [
        { name: 'VIP PS - Ночной', price: 1800, time: '22:00 — 08:00', hours: 10 },
        { name: 'VIP PS - 5 часов', price: 1300, time: '', hours: 5 },
        { name: 'VIP PS - 3 часа', price: 900, time: '', hours: 3 },
        { name: 'VIP PS - 1 час', price: 400, time: '', hours: 1 },
        { name: 'PS - Ночной', price: 1500, time: '22:00 — 08:00', hours: 10 },
        { name: 'PS - 5 часов', price: 950, time: '', hours: 5 },
        { name: 'PS - 3 часа', price: 650, time: '', hours: 3 },
        { name: 'PS - 1 час', price: 300, time: '', hours: 1 }
    ]
};

const hallNames = {
    'vip-new': 'VIP NEW',
    'vip': 'VIP',
    'bootcamp': 'Bootcamp',
    'comfort': 'Comfort',
    'standart': 'Standart',
    'ps': 'PlayStation'
};

let currentStep = 1;
let bookingData = {
    hall: null,
    tariff: null,
    date: null,
    time: null,
    computer: null,
    name: null,
    phone: null,
    email: null,
    comment: null,
    price: 0
};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Установка минимальной даты (сегодня)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').setAttribute('min', today);

    // Обработчики для выбора зала
    document.querySelectorAll('input[name="hall"]').forEach(radio => {
        radio.addEventListener('change', function() {
            bookingData.hall = this.value;
            updateSummary();
            loadTariffs(this.value);
        });
    });

    // Обработчики для даты и времени
    document.getElementById('bookingDate').addEventListener('change', function() {
        bookingData.date = this.value;
        updateSummary();
    });

    document.getElementById('bookingTime').addEventListener('change', function() {
        bookingData.time = this.value;
        updateSummary();
    });

    // Форматирование телефона
    document.getElementById('userPhone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.startsWith('7')) value = value.substring(1);
        if (value.startsWith('8')) value = value.substring(1);

        let formatted = '+7 ';
        if (value.length > 0) {
            formatted += '(' + value.substring(0, 3);
        }
        if (value.length >= 4) {
            formatted += ') ' + value.substring(3, 6);
        }
        if (value.length >= 7) {
            formatted += '-' + value.substring(6, 8);
        }
        if (value.length >= 9) {
            formatted += '-' + value.substring(8, 10);
        }

        e.target.value = formatted;
    });

    // Обработка отправки формы
    document.getElementById('bookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitBooking();
    });
});

function loadTariffs(hall) {
    const container = document.getElementById('tariffsContainer');
    container.innerHTML = '';

    const hallTariffs = tariffs[hall];

    hallTariffs.forEach((tariff, index) => {
        const tariffHtml = `
            <label class="tariff-option">
                <input type="radio" name="tariff" value="${index}" data-price="${tariff.price}" data-name="${tariff.name}">
                <div class="tariff-option-content">
                    ${tariff.badge ? `<div class="tariff-badge">${tariff.badge}</div>` : ''}
                    <div class="tariff-name">${tariff.name}</div>
                    <div class="tariff-price">${tariff.price} ₽</div>
                    ${tariff.time ? `<div class="tariff-time">${tariff.time}</div>` : ''}
                </div>
            </label>
        `;
        container.innerHTML += tariffHtml;
    });

    // Добавляем обработчики для новых радио-кнопок
    container.querySelectorAll('input[name="tariff"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const tariffIndex = parseInt(this.value);
            bookingData.tariff = hallTariffs[tariffIndex].name;
            bookingData.price = hallTariffs[tariffIndex].price;
            updateSummary();
        });
    });
}

function nextStep() {
    // Валидация текущего шага
    if (!validateStep(currentStep)) {
        return;
    }

    // Переход к следующему шагу
    document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
    currentStep++;
    document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');

    // Обновление индикатора шагов
    document.querySelectorAll('.step-dot').forEach(dot => {
        const stepNum = parseInt(dot.getAttribute('data-step'));
        if (stepNum <= currentStep) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Прокрутка наверх
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep() {
    document.querySelector(`[data-step="${currentStep}"]`).classList.remove('active');
    currentStep--;
    document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');

    // Обновление индикатора шагов
    document.querySelectorAll('.step-dot').forEach(dot => {
        const stepNum = parseInt(dot.getAttribute('data-step'));
        if (stepNum <= currentStep) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep(step) {
    switch(step) {
        case 1:
            if (!bookingData.hall) {
                alert('Пожалуйста, выберите зал');
                return false;
            }
            break;
        case 2:
            if (!bookingData.tariff) {
                alert('Пожалуйста, выберите тариф');
                return false;
            }
            break;
        case 3:
            const date = document.getElementById('bookingDate').value;
            const time = document.getElementById('bookingTime').value;
            if (!date || !time) {
                alert('Пожалуйста, выберите дату и время');
                return false;
            }
            bookingData.date = date;
            bookingData.time = time;
            bookingData.computer = document.getElementById('computerNumber').value;
            break;
    }
    return true;
}

function updateSummary() {
    // Зал
    if (bookingData.hall) {
        document.getElementById('summaryHall').textContent = hallNames[bookingData.hall];
    }

    // Тариф
    if (bookingData.tariff) {
        document.getElementById('summaryTariff').textContent = bookingData.tariff;
    }

    // Дата
    if (bookingData.date) {
        const date = new Date(bookingData.date + 'T00:00:00');
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('summaryDate').textContent = date.toLocaleDateString('ru-RU', options);
    }

    // Время
    if (bookingData.time) {
        document.getElementById('summaryTime').textContent = bookingData.time;
    }

    // Итого
    if (bookingData.price > 0) {
        document.getElementById('summaryTotal').textContent = bookingData.price + ' ₽';
    }
}

function submitBooking() {
    // Собираем данные формы
    bookingData.name = document.getElementById('userName').value;
    bookingData.phone = document.getElementById('userPhone').value;
    bookingData.email = document.getElementById('userEmail').value;
    bookingData.comment = document.getElementById('userComment').value;

    // Генерируем ID бронирования
    const bookingId = 'BK-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0');

    // Формируем объект бронирования
    const booking = {
        id: bookingId,
        hall: bookingData.hall,
        hallName: hallNames[bookingData.hall],
        tariff: bookingData.tariff,
        date: bookingData.date,
        time: bookingData.time,
        computer: bookingData.computer || null,
        name: bookingData.name,
        phone: bookingData.phone,
        email: bookingData.email || '',
        comment: bookingData.comment || '',
        price: bookingData.price,
        status: 'new',
        createdAt: new Date().toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', '')
    };

    // Сохраняем в localStorage
    saveBookingToStorage(booking);

    // Показываем модальное окно успеха
    showSuccessModal();

    // В реальном приложении здесь был бы AJAX запрос к серверу.
    // На GitHub Pages сервера нет, поэтому запрос намеренно отключён —
    // при подключении backend использовать относительный путь и не показывать ошибку пользователю.
    /*
    fetch('/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking)
    })
    .then(response => response.json())
    .then(data => {
        showSuccessModal();
    })
    .catch(error => {
        alert('Ошибка при бронировании. Пожалуйста, позвоните нам.');
    });
    */
}

function saveBookingToStorage(booking) {
    // Черновик на GitHub Pages: сервера нет, заявки хранятся только в браузере.
    // Ошибки хранилища (приватный режим, повреждённые данные) не должны ломать бронирование.
    try {
        let bookings = [];
        try {
            const stored = localStorage.getItem('limbo_bookings');
            bookings = stored ? JSON.parse(stored) : [];
            if (!Array.isArray(bookings)) bookings = [];
        } catch (e) {
            bookings = [];
        }

        // Добавляем новое бронирование
        bookings.unshift(booking);

        // Сохраняем обратно в localStorage
        localStorage.setItem('limbo_bookings', JSON.stringify(bookings));
    } catch (e) {
        // Хранилище недоступно — заявка не сохранится, но пользователь увидит подтверждение
    }
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('active');

    // Сброс формы
    document.getElementById('bookingForm').reset();
    currentStep = 1;
    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    document.querySelector('[data-step="1"]').classList.add('active');
    document.querySelectorAll('.step-dot').forEach(dot => dot.classList.remove('active'));
    document.querySelector('.step-dot[data-step="1"]').classList.add('active');

    bookingData = {
        hall: null,
        tariff: null,
        date: null,
        time: null,
        computer: null,
        name: null,
        phone: null,
        email: null,
        comment: null,
        price: 0
    };

    updateSummary();
}

// Закрытие модального окна при клике вне его
document.addEventListener('click', function(e) {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeModal();
    }
});
