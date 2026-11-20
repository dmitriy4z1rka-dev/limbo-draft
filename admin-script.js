// Загрузка бронирований из localStorage
function loadBookingsFromStorage() {
    const stored = localStorage.getItem('limbo_bookings');
    if (stored) {
        try {
            return JSON.parse(stored);
        } catch (e) {
            console.error('Error loading bookings:', e);
            return getDefaultBookings();
        }
    }
    return getDefaultBookings();
}

// Тестовые данные бронирований (для демонстрации)
function getDefaultBookings() {
    return [
        {
            id: 'BK-2024-001',
            hall: 'vip-new',
            hallName: 'VIP NEW',
            tariff: 'Ночной',
            date: '2024-11-20',
            time: '22:00',
            computer: '5',
            name: 'Алексей Иванов',
            phone: '+7 (951) 123-45-67',
            email: 'alex@mail.ru',
            comment: 'Забронировать место у окна',
            price: 900,
            status: 'new',
            createdAt: '2024-11-19 14:30'
        },
        {
            id: 'BK-2024-002',
            hall: 'vip',
            hallName: 'VIP',
            tariff: '5 часов',
            date: '2024-11-19',
            time: '18:00',
            computer: null,
            name: 'Мария Петрова',
            phone: '+7 (951) 234-56-78',
            email: '',
            comment: '',
            price: 650,
            status: 'confirmed',
            createdAt: '2024-11-18 10:15'
        },
        {
            id: 'BK-2024-003',
            hall: 'ps',
            hallName: 'PlayStation',
            tariff: 'PS - 3 часа',
            date: '2024-11-21',
            time: '15:00',
            computer: '2',
            name: 'Дмитрий Сидоров',
            phone: '+7 (951) 345-67-89',
            email: 'dmitry@gmail.com',
            comment: 'Интересует FIFA',
            price: 650,
            status: 'new',
            createdAt: '2024-11-19 16:45'
        },
        {
            id: 'BK-2024-004',
            hall: 'comfort',
            hallName: 'Comfort',
            tariff: '3 часа',
            date: '2024-11-19',
            time: '12:00',
            computer: null,
            name: 'Елена Смирнова',
            phone: '+7 (951) 456-78-90',
            email: 'elena@yandex.ru',
            comment: '',
            price: 350,
            status: 'completed',
            createdAt: '2024-11-18 08:00'
        },
        {
            id: 'BK-2024-005',
            hall: 'bootcamp',
            hallName: 'Bootcamp',
            tariff: 'Сутки на неделю',
            date: '2024-11-22',
            time: '10:00',
            computer: null,
            name: 'Игорь Козлов',
            phone: '+7 (951) 567-89-01',
            email: '',
            comment: 'Для команды 5 человек',
            price: 2500,
            status: 'confirmed',
            createdAt: '2024-11-19 09:20'
        }
    ];
}

let bookings = loadBookingsFromStorage();

// Сохранение бронирований в localStorage
function saveBookingsToStorage() {
    localStorage.setItem('limbo_bookings', JSON.stringify(bookings));
}

const hallNames = {
    'vip-new': 'VIP NEW',
    'vip': 'VIP',
    'bootcamp': 'Bootcamp',
    'comfort': 'Comfort',
    'standart': 'Standart',
    'ps': 'PlayStation'
};

const statusNames = {
    'new': 'Новая',
    'confirmed': 'Подтверждена',
    'completed': 'Завершена',
    'cancelled': 'Отменена'
};

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    loadBookings();
    updateStatistics();
    checkNewBookings();

    // Автообновление каждые 30 секунд
    setInterval(checkNewBookings, 30000);
});

function switchTab(tabName) {
    // Убираем активные классы
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Добавляем активные классы
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');

    // Обновляем данные при переходе на вкладку статистики
    if (tabName === 'statistics') {
        updateStatistics();
    }
}

function loadBookings() {
    const grid = document.getElementById('bookingsGrid');
    const statusFilter = document.getElementById('statusFilter').value;
    const hallFilter = document.getElementById('hallFilter').value;

    // Фильтрация
    let filteredBookings = bookings.filter(booking => {
        const statusMatch = statusFilter === 'all' || booking.status === statusFilter;
        const hallMatch = hallFilter === 'all' || booking.hall === hallFilter;
        return statusMatch && hallMatch;
    });

    // Сортировка по дате создания (новые первыми)
    filteredBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (filteredBookings.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>Бронирований не найдено</h3>
                <p>Попробуйте изменить фильтры</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredBookings.map(booking => `
        <div class="booking-card" onclick="showBookingDetails('${booking.id}')">
            <div class="booking-header">
                <div class="booking-id">${booking.id}</div>
                <div class="status-badge status-${booking.status}">${statusNames[booking.status]}</div>
            </div>
            <div class="booking-info">
                <div class="info-row">
                    <span class="info-label">Клиент:</span>
                    <span class="info-value">${booking.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Зал:</span>
                    <span class="info-value">${booking.hallName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Тариф:</span>
                    <span class="info-value">${booking.tariff}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Дата:</span>
                    <span class="info-value">${formatDate(booking.date)} в ${booking.time}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Сумма:</span>
                    <span class="info-value">${booking.price} ₽</span>
                </div>
            </div>
            ${booking.status === 'new' ? `
                <div class="booking-actions">
                    <button class="btn btn-small btn-confirm" onclick="event.stopPropagation(); confirmBooking('${booking.id}')">Подтвердить</button>
                    <button class="btn btn-small btn-cancel" onclick="event.stopPropagation(); cancelBooking('${booking.id}')">Отменить</button>
                </div>
            ` : ''}
        </div>
    `).join('');

    // Обновляем счётчик
    document.getElementById('bookingsCount').textContent = bookings.filter(b => b.status === 'new').length;
}

function filterBookings() {
    loadBookings();
}

function confirmBooking(id) {
    const booking = bookings.find(b => b.id === id);
    if (booking) {
        booking.status = 'confirmed';
        loadBookings();
        updateStatistics();
        showNotification('Бронирование подтверждено', 'success');

        // Здесь должна быть отправка уведомления клиенту
        console.log(`Отправка SMS на ${booking.phone}: Ваше бронирование ${id} подтверждено`);
    }
}

function cancelBooking(id) {
    if (confirm('Вы уверены, что хотите отменить это бронирование?')) {
        const booking = bookings.find(b => b.id === id);
        if (booking) {
            booking.status = 'cancelled';
            loadBookings();
            updateStatistics();
            showNotification('Бронирование отменено', 'warning');
        }
    }
}

function showBookingDetails(id) {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    const modal = document.getElementById('bookingModal');
    const details = document.getElementById('bookingDetails');

    details.innerHTML = `
        <h2>Детали бронирования ${booking.id}</h2>
        <div class="status-badge status-${booking.status}" style="margin: 20px 0;">${statusNames[booking.status]}</div>

        <div class="booking-detail-row">
            <span class="booking-detail-label">Зал:</span>
            <span class="booking-detail-value">${booking.hallName}</span>
        </div>
        <div class="booking-detail-row">
            <span class="booking-detail-label">Тариф:</span>
            <span class="booking-detail-value">${booking.tariff}</span>
        </div>
        <div class="booking-detail-row">
            <span class="booking-detail-label">Дата посещения:</span>
            <span class="booking-detail-value">${formatDate(booking.date)}</span>
        </div>
        <div class="booking-detail-row">
            <span class="booking-detail-label">Время:</span>
            <span class="booking-detail-value">${booking.time}</span>
        </div>
        <div class="booking-detail-row">
            <span class="booking-detail-label">Компьютер:</span>
            <span class="booking-detail-value">${booking.computer || 'Любой'}</span>
        </div>

        <h3 style="margin-top: 30px; margin-bottom: 15px; color: var(--primary);">Контактные данные</h3>
        <div class="booking-detail-row">
            <span class="booking-detail-label">Имя:</span>
            <span class="booking-detail-value">${booking.name}</span>
        </div>
        <div class="booking-detail-row">
            <span class="booking-detail-label">Телефон:</span>
            <span class="booking-detail-value"><a href="tel:${booking.phone.replace(/\D/g, '')}">${booking.phone}</a></span>
        </div>
        <div class="booking-detail-row">
            <span class="booking-detail-label">Email:</span>
            <span class="booking-detail-value">${booking.email || '—'}</span>
        </div>
        <div class="booking-detail-row">
            <span class="booking-detail-label">Комментарий:</span>
            <span class="booking-detail-value">${booking.comment || '—'}</span>
        </div>

        <h3 style="margin-top: 30px; margin-bottom: 15px; color: var(--primary);">Дополнительно</h3>
        <div class="booking-detail-row">
            <span class="booking-detail-label">Сумма:</span>
            <span class="booking-detail-value" style="font-size: 1.5rem; font-weight: 700; color: var(--accent);">${booking.price} ₽</span>
        </div>
        <div class="booking-detail-row">
            <span class="booking-detail-label">Создано:</span>
            <span class="booking-detail-value">${booking.createdAt}</span>
        </div>

        ${booking.status === 'new' ? `
            <div style="display: flex; gap: 15px; margin-top: 30px;">
                <button class="btn btn-primary" style="flex: 1;" onclick="confirmBooking('${booking.id}'); closeBookingModal();">Подтвердить</button>
                <button class="btn btn-cancel" style="flex: 1;" onclick="cancelBooking('${booking.id}'); closeBookingModal();">Отменить</button>
            </div>
        ` : ''}
    `;

    modal.classList.add('active');
}

function closeBookingModal() {
    document.getElementById('bookingModal').classList.remove('active');
}

function updateStatistics() {
    // Подсчёт статистики
    const total = bookings.length;
    const newCount = bookings.filter(b => b.status === 'new').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const totalRevenue = bookings
        .filter(b => b.status !== 'cancelled')
        .reduce((sum, b) => sum + b.price, 0);

    document.getElementById('totalBookings').textContent = total;
    document.getElementById('newBookings').textContent = newCount;
    document.getElementById('confirmedBookings').textContent = confirmed;
    document.getElementById('totalRevenue').textContent = totalRevenue.toLocaleString() + ' ₽';

    // Статистика по залам
    const hallStats = {};
    bookings.forEach(booking => {
        if (!hallStats[booking.hall]) {
            hallStats[booking.hall] = 0;
        }
        hallStats[booking.hall]++;
    });

    const maxCount = Math.max(...Object.values(hallStats));
    const hallsChart = document.getElementById('hallsChart');

    hallsChart.innerHTML = Object.entries(hallStats)
        .sort((a, b) => b[1] - a[1])
        .map(([hall, count]) => `
            <div class="chart-bar">
                <div class="chart-label">${hallNames[hall]}</div>
                <div class="chart-value-container">
                    <div class="chart-value-bar" style="width: ${(count / maxCount * 100)}%"></div>
                </div>
                <div class="chart-count">${count}</div>
            </div>
        `).join('');

    // Статистика по дням
    const dateStats = {};
    bookings.forEach(booking => {
        if (!dateStats[booking.date]) {
            dateStats[booking.date] = 0;
        }
        dateStats[booking.date]++;
    });

    const maxDateCount = Math.max(...Object.values(dateStats));
    const timeline = document.getElementById('bookingsTimeline');

    timeline.innerHTML = Object.entries(dateStats)
        .sort((a, b) => new Date(a[0]) - new Date(b[0]))
        .map(([date, count]) => `
            <div class="chart-bar">
                <div class="chart-label">${formatDate(date)}</div>
                <div class="chart-value-container">
                    <div class="chart-value-bar" style="width: ${(count / maxDateCount * 100)}%"></div>
                </div>
                <div class="chart-count">${count}</div>
            </div>
        `).join('');
}

function checkNewBookings() {
    // Здесь должна быть проверка новых бронирований через API
    // Имитация получения нового бронирования
    const soundEnabled = document.getElementById('soundNotifications')?.checked;

    if (soundEnabled && bookings.filter(b => b.status === 'new').length > 0) {
        // Воспроизведение звука (если включено)
        playNotificationSound();
    }
}

function playNotificationSound() {
    // Простой звуковой сигнал через Web Audio API
    // Браузер не даёт запускать звук, пока пользователь не взаимодействовал со страницей
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) {
        return;
    }
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Audio notification failed:', e);
    }
}

function saveSettings() {
    showNotification('Настройки сохранены', 'success');
}

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        window.location.href = 'index.html';
    }
}

function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}

function showNotification(message, type = 'info') {
    // Создаём простое уведомление
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? 'var(--success)' : type === 'warning' ? 'var(--warning)' : 'var(--primary)'};
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Добавляем анимации для уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Закрытие модального окна при клике вне его
document.addEventListener('click', function(e) {
    const modal = document.getElementById('bookingModal');
    if (e.target === modal) {
        closeBookingModal();
    }
});

// Симуляция получения новой заявки через 5 секунд после загрузки (для демонстрации)
setTimeout(() => {
    const newBooking = {
        id: 'BK-2024-006',
        hall: 'vip-new',
        hallName: 'VIP NEW',
        tariff: '3 часа',
        date: '2024-11-20',
        time: '20:00',
        computer: null,
        name: 'Андрей Новиков',
        phone: '+7 (951) 678-90-12',
        email: 'andrey@mail.ru',
        comment: '',
        price: 500,
        status: 'new',
        createdAt: new Date().toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).replace(',', '')
    };

    // bookings.unshift(newBooking);
    // loadBookings();
    // updateStatistics();
    // showNotification('Новая заявка на бронирование!', 'info');
    // playNotificationSound();
}, 5000);
