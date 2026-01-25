// ==========================================
// STATE MANAGEMENT
// ==========================================
const state = {
    currentDate: new Date(),
    currentView: 'month',
    events: [],
    categories: [
        { id: 1, name: 'Work', color: '#4285f4', visible: true },
        { id: 2, name: 'Personal', color: '#ea4335', visible: true },
        { id: 3, name: 'Meeting', color: '#34a853', visible: true },
        { id: 4, name: 'Holiday', color: '#fbbc04', visible: true }
    ],
    selectedEvent: null,
    theme: 'light',
    sidebarOpen: true
};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    initializeEventListeners();
    initializeKeyboardShortcuts();
    renderCurrentView();
    renderMiniCalendar();
    renderCategories();
    updateStatistics();
    checkReminders();
    setInterval(checkReminders, 60000); // Check every minute
});

// ==========================================
// LOCAL STORAGE
// ==========================================
function loadFromLocalStorage() {
    const savedEvents = localStorage.getItem('calendarEvents');
    const savedCategories = localStorage.getItem('calendarCategories');
    const savedTheme = localStorage.getItem('calendarTheme');

    if (savedEvents) {
        state.events = JSON.parse(savedEvents);
    }

    if (savedCategories) {
        state.categories = JSON.parse(savedCategories);
    }

    if (savedTheme) {
        state.theme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('calendarEvents', JSON.stringify(state.events));
    localStorage.setItem('calendarCategories', JSON.stringify(state.categories));
    localStorage.setItem('calendarTheme', state.theme);
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function initializeEventListeners() {
    // Navigation
    document.getElementById('prevBtn').addEventListener('click', navigatePrevious);
    document.getElementById('nextBtn').addEventListener('click', navigateNext);
    document.getElementById('todayBtn').addEventListener('click', goToToday);

    // View switching
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.currentTarget.dataset.view;
            switchView(view);
        });
    });

    // Theme toggle
    document.getElementById('themeBtn').addEventListener('click', toggleTheme);

    // Sidebar toggle
    document.getElementById('menuBtn').addEventListener('click', toggleSidebar);

    // Event modal
    document.getElementById('addEventBtn').addEventListener('click', () => openEventModal());
    document.getElementById('sidebarAddEventBtn').addEventListener('click', () => openEventModal());
    document.getElementById('closeModal').addEventListener('click', closeEventModal);
    document.getElementById('cancelBtn').addEventListener('click', closeEventModal);
    document.getElementById('eventForm').addEventListener('submit', handleEventSubmit);
    document.getElementById('deleteEventBtn').addEventListener('click', handleEventDelete);
    document.getElementById('duplicateEventBtn').addEventListener('click', handleEventDuplicate);

    // Category modal
    document.getElementById('addCategoryBtn').addEventListener('click', openCategoryModal);
    document.getElementById('closeCategoryModal').addEventListener('click', closeCategoryModal);
    document.getElementById('cancelCategoryBtn').addEventListener('click', closeCategoryModal);
    document.getElementById('categoryForm').addEventListener('submit', handleCategorySubmit);

    // Event details modal
    document.getElementById('closeDetailsModal').addEventListener('click', closeEventDetailsModal);
    document.getElementById('closeDetailsBtn').addEventListener('click', closeEventDetailsModal);
    document.getElementById('editEventBtn').addEventListener('click', handleEditFromDetails);

    // All day event checkbox
    document.getElementById('allDayEvent').addEventListener('change', (e) => {
        document.getElementById('timeInputs').style.display = e.target.checked ? 'none' : 'flex';
    });

    // Recurrence select
    document.getElementById('eventRecurrence').addEventListener('change', (e) => {
        document.getElementById('recurrenceEndGroup').style.display =
            e.target.value !== 'none' ? 'block' : 'none';
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Import/Export
    document.getElementById('exportBtn').addEventListener('click', exportEvents);
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', importEvents);
    document.getElementById('clearAllBtn').addEventListener('click', clearAllEvents);

    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            if (e.key === 'Escape') {
                e.target.blur();
            }
            return;
        }

        switch (e.key.toLowerCase()) {
            case 'n':
                openEventModal();
                break;
            case 't':
                goToToday();
                break;
            case 'arrowleft':
                navigatePrevious();
                break;
            case 'arrowright':
                navigateNext();
                break;
            case 'm':
                switchView('month');
                break;
            case 'w':
                switchView('week');
                break;
            case 'd':
                switchView('day');
                break;
            case 'a':
                switchView('agenda');
                break;
            case '/':
                e.preventDefault();
                document.getElementById('searchInput').focus();
                break;
            case '?':
                showShortcuts();
                break;
            case 'escape':
                closeAllModals();
                break;
        }
    });
}

// ==========================================
// NAVIGATION
// ==========================================
function navigatePrevious() {
    const date = state.currentDate;

    switch (state.currentView) {
        case 'month':
            state.currentDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            break;
        case 'week':
            state.currentDate = new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
        case 'day':
            state.currentDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);
            break;
        case 'agenda':
            state.currentDate = new Date(date.getFullYear(), date.getMonth() - 1, 1);
            break;
    }

    renderCurrentView();
    updateStatistics();
}

function navigateNext() {
    const date = state.currentDate;

    switch (state.currentView) {
        case 'month':
            state.currentDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
            break;
        case 'week':
            state.currentDate = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
        case 'day':
            state.currentDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
            break;
        case 'agenda':
            state.currentDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
            break;
    }

    renderCurrentView();
    updateStatistics();
}

function goToToday() {
    state.currentDate = new Date();
    renderCurrentView();
    renderMiniCalendar();
    updateStatistics();
}

function switchView(view) {
    state.currentView = view;

    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === view);
    });

    renderCurrentView();
}

// ==========================================
// RENDERING
// ==========================================
function renderCurrentView() {
    updateCurrentDateDisplay();

    switch (state.currentView) {
        case 'month':
            renderMonthView();
            break;
        case 'week':
            renderWeekView();
            break;
        case 'day':
            renderDayView();
            break;
        case 'agenda':
            renderAgendaView();
            break;
    }
}

function updateCurrentDateDisplay() {
    const date = state.currentDate;
    let displayText = '';

    switch (state.currentView) {
        case 'month':
            displayText = formatMonthYear(date);
            break;
        case 'week':
            const weekStart = getWeekStart(date);
            const weekEnd = getWeekEnd(date);
            displayText = `${formatDate(weekStart, 'MMM D')} - ${formatDate(weekEnd, 'MMM D, YYYY')}`;
            break;
        case 'day':
            displayText = formatDate(date, 'MMMM D, YYYY');
            break;
        case 'agenda':
            displayText = formatMonthYear(date);
            break;
    }

    document.getElementById('currentDate').textContent = displayText;
}

// ==========================================
// MONTH VIEW
// ==========================================
function renderMonthView() {
    const container = document.getElementById('calendarView');
    const year = state.currentDate.getFullYear();
    const month = state.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);

    const firstDayWeek = firstDay.getDay();
    const lastDate = lastDay.getDate();
    const prevLastDate = prevLastDay.getDate();

    let html = '<div class="month-view"><div class="calendar-grid">';

    // Day names
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayNames.forEach(day => {
        html += `<div class="calendar-day-name">${day}</div>`;
    });

    // Previous month days
    for (let i = firstDayWeek - 1; i >= 0; i--) {
        const day = prevLastDate - i;
        html += `<div class="calendar-day other-month" data-date="${year}-${month}-${day}">
            <div class="day-number">${day}</div>
            <div class="day-events"></div>
        </div>`;
    }

    // Current month days
    const today = new Date();
    for (let day = 1; day <= lastDate; day++) {
        const date = new Date(year, month, day);
        const isToday = isSameDay(date, today);
        const dateStr = formatDateKey(date);
        const dayEvents = getEventsForDate(date);

        html += `<div class="calendar-day ${isToday ? 'today' : ''}" data-date="${dateStr}" onclick="handleDayClick('${dateStr}')">
            <div class="day-number">${day}</div>
            <div class="day-events">`;

        const maxVisible = 3;
        dayEvents.slice(0, maxVisible).forEach(event => {
            const category = state.categories.find(c => c.id === event.categoryId);
            const color = event.color || (category ? category.color : '#4285f4');
            html += `<div class="event-item" style="background: ${color}" onclick="event.stopPropagation(); showEventDetails(${event.id})">${escapeHtml(event.title)}</div>`;
        });

        if (dayEvents.length > maxVisible) {
            html += `<div class="more-events" onclick="event.stopPropagation(); handleDayClick('${dateStr}')">+${dayEvents.length - maxVisible} more</div>`;
        }

        html += `</div></div>`;
    }

    // Next month days
    const remainingDays = 42 - (firstDayWeek + lastDate);
    for (let day = 1; day <= remainingDays; day++) {
        html += `<div class="calendar-day other-month" data-date="${year}-${month + 2}-${day}">
            <div class="day-number">${day}</div>
            <div class="day-events"></div>
        </div>`;
    }

    html += '</div></div>';
    container.innerHTML = html;
}

// ==========================================
// WEEK VIEW
// ==========================================
function renderWeekView() {
    const container = document.getElementById('calendarView');
    const weekStart = getWeekStart(state.currentDate);
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + i);
        weekDays.push(day);
    }

    const today = new Date();
    let html = '<div class="week-view">';

    // Header
    html += '<div class="week-header"><div class="week-header-cell"></div>';
    weekDays.forEach(day => {
        const isToday = isSameDay(day, today);
        html += `<div class="week-header-cell ${isToday ? 'today' : ''}">
            <div class="day-name">${formatDate(day, 'ddd')}</div>
            <div class="day-number">${day.getDate()}</div>
        </div>`;
    });
    html += '</div>';

    // Body
    html += '<div class="week-body">';

    // Time column
    html += '<div class="week-time-column">';
    for (let hour = 0; hour < 24; hour++) {
        html += `<div class="week-time-slot">${formatHour(hour)}</div>`;
    }
    html += '</div>';

    // Day columns
    weekDays.forEach(day => {
        html += '<div class="week-day-column">';
        for (let hour = 0; hour < 24; hour++) {
            const dateStr = formatDateKey(day);
            html += `<div class="week-hour-slot" data-date="${dateStr}" data-hour="${hour}" onclick="handleWeekSlotClick('${dateStr}', ${hour})"></div>`;
        }

        // Add events
        const dayEvents = getEventsForDate(day);
        dayEvents.forEach(event => {
            if (!event.allDay && event.startTime) {
                const [startHour, startMinute] = event.startTime.split(':').map(Number);
                let duration = 1;

                if (event.endTime) {
                    const [endHour, endMinute] = event.endTime.split(':').map(Number);
                    duration = (endHour + endMinute / 60) - (startHour + startMinute / 60);
                }

                const top = (startHour + startMinute / 60) * 60;
                const height = duration * 60;
                const category = state.categories.find(c => c.id === event.categoryId);
                const color = event.color || (category ? category.color : '#4285f4');

                html += `<div class="week-event" style="top: ${top}px; height: ${height}px; background: ${color}; color: white;" onclick="showEventDetails(${event.id})">
                    <strong>${escapeHtml(event.title)}</strong><br>
                    ${event.startTime} - ${event.endTime || ''}
                </div>`;
            }
        });

        html += '</div>';
    });

    html += '</div></div>';
    container.innerHTML = html;
}

// ==========================================
// DAY VIEW
// ==========================================
function renderDayView() {
    const container = document.getElementById('calendarView');
    const date = state.currentDate;
    const today = new Date();
    const isToday = isSameDay(date, today);

    let html = '<div class="day-view">';

    // Header
    html += `<div class="day-header ${isToday ? 'today' : ''}">
        <div class="day-name">${formatDate(date, 'dddd')}</div>
        <div class="day-date">${formatDate(date, 'MMMM D, YYYY')}</div>
    </div>`;

    // Body
    html += '<div class="day-body">';

    // Time column
    html += '<div class="week-time-column">';
    for (let hour = 0; hour < 24; hour++) {
        html += `<div class="week-time-slot">${formatHour(hour)}</div>`;
    }
    html += '</div>';

    // Day column
    html += '<div class="week-day-column" style="position: relative;">';
    for (let hour = 0; hour < 24; hour++) {
        const dateStr = formatDateKey(date);
        html += `<div class="week-hour-slot" data-date="${dateStr}" data-hour="${hour}" onclick="handleWeekSlotClick('${dateStr}', ${hour})"></div>`;
    }

    // Add events
    const dayEvents = getEventsForDate(date);
    dayEvents.forEach(event => {
        if (!event.allDay && event.startTime) {
            const [startHour, startMinute] = event.startTime.split(':').map(Number);
            let duration = 1;

            if (event.endTime) {
                const [endHour, endMinute] = event.endTime.split(':').map(Number);
                duration = (endHour + endMinute / 60) - (startHour + startMinute / 60);
            }

            const top = (startHour + startMinute / 60) * 60;
            const height = duration * 60;
            const category = state.categories.find(c => c.id === event.categoryId);
            const color = event.color || (category ? category.color : '#4285f4');

            html += `<div class="week-event" style="top: ${top}px; height: ${height}px; background: ${color}; color: white;" onclick="showEventDetails(${event.id})">
                <strong>${escapeHtml(event.title)}</strong><br>
                ${event.startTime} - ${event.endTime || ''}
                ${event.location ? `<br><i class="fas fa-map-marker-alt"></i> ${escapeHtml(event.location)}` : ''}
            </div>`;
        }
    });

    html += '</div></div></div>';
    container.innerHTML = html;
}

// ==========================================
// AGENDA VIEW
// ==========================================
function renderAgendaView() {
    const container = document.getElementById('calendarView');
    const year = state.currentDate.getFullYear();
    const month = state.currentDate.getMonth();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);

    const events = state.events.filter(event => {
        const eventDate = parseDate(event.date);
        return eventDate >= startDate && eventDate <= endDate;
    }).sort((a, b) => {
        const dateCompare = new Date(a.date) - new Date(b.date);
        if (dateCompare !== 0) return dateCompare;
        if (a.startTime && b.startTime) {
            return a.startTime.localeCompare(b.startTime);
        }
        return 0;
    });

    let html = '<div class="agenda-view">';

    if (events.length === 0) {
        html += `<div class="no-events">
            <i class="fas fa-calendar-check"></i>
            <p>No events scheduled for this month</p>
        </div>`;
    } else {
        let currentDate = '';

        events.forEach(event => {
            const eventDate = parseDate(event.date);
            const dateKey = formatDateKey(eventDate);

            if (dateKey !== currentDate) {
                if (currentDate) html += '</div></div>';
                currentDate = dateKey;
                html += `<div class="agenda-section">
                    <div class="agenda-date">${formatDate(eventDate, 'dddd, MMMM D, YYYY')}</div>
                    <div class="agenda-events">`;
            }

            const category = state.categories.find(c => c.id === event.categoryId);
            const color = event.color || (category ? category.color : '#4285f4');
            const timeDisplay = event.allDay ? 'All Day' : `${event.startTime || ''} ${event.endTime ? '- ' + event.endTime : ''}`;

            html += `<div class="agenda-event" style="border-left-color: ${color}" onclick="showEventDetails(${event.id})">
                <div class="agenda-event-time">${timeDisplay}</div>
                <div class="agenda-event-details">
                    <div class="agenda-event-title">${escapeHtml(event.title)}</div>
                    <div class="agenda-event-meta">`;

            if (event.location) {
                html += `<span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(event.location)}</span>`;
            }

            if (category) {
                html += `<span><i class="fas fa-tag"></i> ${escapeHtml(category.name)}</span>`;
            }

            if (event.attendees) {
                const attendeeCount = event.attendees.split(',').length;
                html += `<span><i class="fas fa-users"></i> ${attendeeCount} attendee${attendeeCount > 1 ? 's' : ''}</span>`;
            }

            html += `</div></div></div>`;
        });

        if (currentDate) html += '</div></div>';
    }

    html += '</div>';
    container.innerHTML = html;
}

// ==========================================
// MINI CALENDAR
// ==========================================
function renderMiniCalendar() {
    const container = document.getElementById('miniCalendar');
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);

    const firstDayWeek = firstDay.getDay();
    const lastDate = lastDay.getDate();
    const prevLastDate = prevLastDay.getDate();

    let html = `<div class="mini-calendar-header">
        <button class="btn btn-icon btn-sm" onclick="navigateMiniCalendar(-1)">
            <i class="fas fa-chevron-left"></i>
        </button>
        <span>${formatMonthYear(today)}</span>
        <button class="btn btn-icon btn-sm" onclick="navigateMiniCalendar(1)">
            <i class="fas fa-chevron-right"></i>
        </button>
    </div>`;

    html += '<div class="mini-calendar-grid">';

    const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    dayNames.forEach(day => {
        html += `<div class="mini-calendar-day-name">${day}</div>`;
    });

    // Previous month days
    for (let i = firstDayWeek - 1; i >= 0; i--) {
        const day = prevLastDate - i;
        html += `<div class="mini-calendar-day other-month">${day}</div>`;
    }

    // Current month days
    for (let day = 1; day <= lastDate; day++) {
        const date = new Date(year, month, day);
        const isToday = isSameDay(date, today);
        const hasEvents = getEventsForDate(date).length > 0;

        html += `<div class="mini-calendar-day ${isToday ? 'today' : ''} ${hasEvents ? 'has-events' : ''}" onclick="jumpToDate(${year}, ${month}, ${day})">${day}</div>`;
    }

    html += '</div>';
    container.innerHTML = html;
}

// ==========================================
// CATEGORIES
// ==========================================
function renderCategories() {
    const container = document.getElementById('categoriesList');
    const categorySelect = document.getElementById('eventCategory');

    let html = '';
    let selectHtml = '<option value="">None</option>';

    state.categories.forEach(category => {
        const count = state.events.filter(e => e.categoryId === category.id).length;

        html += `<div class="category-item" onclick="toggleCategoryVisibility(${category.id})">
            <div class="category-item-left">
                <div class="category-color" style="background: ${category.color}"></div>
                <span class="category-name">${escapeHtml(category.name)}</span>
            </div>
            <span class="category-count">${count}</span>
        </div>`;

        selectHtml += `<option value="${category.id}">${escapeHtml(category.name)}</option>`;
    });

    container.innerHTML = html;
    categorySelect.innerHTML = selectHtml;
}

// ==========================================
// STATISTICS
// ==========================================
function updateStatistics() {
    const totalEvents = state.events.length;

    const year = state.currentDate.getFullYear();
    const month = state.currentDate.getMonth();
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);

    const monthEvents = state.events.filter(event => {
        const eventDate = parseDate(event.date);
        return eventDate >= monthStart && eventDate <= monthEnd;
    }).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingEvents = state.events.filter(event => {
        const eventDate = parseDate(event.date);
        return eventDate >= today;
    }).length;

    document.getElementById('totalEvents').textContent = totalEvents;
    document.getElementById('monthEvents').textContent = monthEvents;
    document.getElementById('upcomingEvents').textContent = upcomingEvents;
}

// ==========================================
// EVENT MANAGEMENT
// ==========================================
function handleEventSubmit(e) {
    e.preventDefault();

    const eventData = {
        id: state.selectedEvent ? state.selectedEvent.id : Date.now(),
        title: document.getElementById('eventTitle').value,
        date: document.getElementById('eventDate').value,
        allDay: document.getElementById('allDayEvent').checked,
        startTime: document.getElementById('eventStartTime').value,
        endTime: document.getElementById('eventEndTime').value,
        description: document.getElementById('eventDescription').value,
        location: document.getElementById('eventLocation').value,
        categoryId: parseInt(document.getElementById('eventCategory').value) || null,
        color: document.getElementById('eventColor').value,
        recurrence: document.getElementById('eventRecurrence').value,
        recurrenceEnd: document.getElementById('recurrenceEnd').value,
        reminder: document.getElementById('eventReminder').value,
        url: document.getElementById('eventURL').value,
        attendees: document.getElementById('eventAttendees').value,
        createdAt: state.selectedEvent ? state.selectedEvent.createdAt : new Date().toISOString()
    };

    if (state.selectedEvent) {
        const index = state.events.findIndex(e => e.id === state.selectedEvent.id);
        state.events[index] = eventData;
        showNotification('Event updated successfully', 'success');
    } else {
        // Handle recurring events
        if (eventData.recurrence !== 'none') {
            const recurringEvents = generateRecurringEvents(eventData);
            state.events.push(...recurringEvents);
        } else {
            state.events.push(eventData);
        }
        showNotification('Event created successfully', 'success');
    }

    saveToLocalStorage();
    closeEventModal();
    renderCurrentView();
    renderMiniCalendar();
    renderCategories();
    updateStatistics();
}

function handleEventDelete() {
    if (!state.selectedEvent || !confirm('Are you sure you want to delete this event?')) {
        return;
    }

    state.events = state.events.filter(e => e.id !== state.selectedEvent.id);

    saveToLocalStorage();
    closeEventModal();
    renderCurrentView();
    renderMiniCalendar();
    renderCategories();
    updateStatistics();
    showNotification('Event deleted successfully', 'success');
}

function handleEventDuplicate() {
    if (!state.selectedEvent) return;

    const duplicatedEvent = {
        ...state.selectedEvent,
        id: Date.now(),
        title: state.selectedEvent.title + ' (Copy)',
        createdAt: new Date().toISOString()
    };

    state.events.push(duplicatedEvent);
    saveToLocalStorage();
    closeEventModal();
    renderCurrentView();
    updateStatistics();
    showNotification('Event duplicated successfully', 'success');
}

function generateRecurringEvents(baseEvent) {
    const events = [baseEvent];
    const startDate = parseDate(baseEvent.date);
    const endDate = baseEvent.recurrenceEnd ? parseDate(baseEvent.recurrenceEnd) : new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());

    let currentDate = new Date(startDate);

    while (currentDate < endDate) {
        switch (baseEvent.recurrence) {
            case 'daily':
                currentDate.setDate(currentDate.getDate() + 1);
                break;
            case 'weekly':
                currentDate.setDate(currentDate.getDate() + 7);
                break;
            case 'monthly':
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;
            case 'yearly':
                currentDate.setFullYear(currentDate.getFullYear() + 1);
                break;
        }

        if (currentDate <= endDate) {
            events.push({
                ...baseEvent,
                id: Date.now() + events.length,
                date: formatDateForInput(currentDate)
            });
        }
    }

    return events;
}

// ==========================================
// MODALS
// ==========================================
function openEventModal(date = null, hour = null) {
    const modal = document.getElementById('eventModal');
    const form = document.getElementById('eventForm');

    form.reset();
    state.selectedEvent = null;

    document.getElementById('modalTitle').textContent = 'Add Event';
    document.getElementById('deleteEventBtn').style.display = 'none';
    document.getElementById('duplicateEventBtn').style.display = 'none';
    document.getElementById('timeInputs').style.display = 'flex';
    document.getElementById('recurrenceEndGroup').style.display = 'none';

    if (date) {
        document.getElementById('eventDate').value = date;
    } else {
        document.getElementById('eventDate').value = formatDateForInput(state.currentDate);
    }

    if (hour !== null) {
        document.getElementById('eventStartTime').value = `${hour.toString().padStart(2, '0')}:00`;
        document.getElementById('eventEndTime').value = `${(hour + 1).toString().padStart(2, '0')}:00`;
    }

    modal.classList.add('active');
    document.getElementById('eventTitle').focus();
}

function closeEventModal() {
    document.getElementById('eventModal').classList.remove('active');
    state.selectedEvent = null;
}

function openCategoryModal() {
    document.getElementById('categoryModal').classList.add('active');
    document.getElementById('categoryName').focus();
}

function closeCategoryModal() {
    document.getElementById('categoryModal').classList.remove('active');
    document.getElementById('categoryForm').reset();
}

function handleCategorySubmit(e) {
    e.preventDefault();

    const category = {
        id: Date.now(),
        name: document.getElementById('categoryName').value,
        color: document.getElementById('categoryColor').value,
        visible: true
    };

    state.categories.push(category);
    saveToLocalStorage();
    closeCategoryModal();
    renderCategories();
    showNotification('Category added successfully', 'success');
}

function showEventDetails(eventId) {
    const event = state.events.find(e => e.id === eventId);
    if (!event) return;

    const modal = document.getElementById('eventDetailsModal');
    const titleEl = document.getElementById('detailsEventTitle');
    const contentEl = document.getElementById('eventDetailsContent');

    titleEl.textContent = event.title;

    const category = state.categories.find(c => c.id === event.categoryId);
    const eventDate = parseDate(event.date);

    let html = '<div class="event-details">';

    html += `<p><i class="fas fa-calendar"></i> <strong>Date:</strong> ${formatDate(eventDate, 'dddd, MMMM D, YYYY')}</p>`;

    if (event.allDay) {
        html += `<p><i class="fas fa-clock"></i> <strong>Time:</strong> All Day</p>`;
    } else if (event.startTime) {
        html += `<p><i class="fas fa-clock"></i> <strong>Time:</strong> ${event.startTime}${event.endTime ? ' - ' + event.endTime : ''}</p>`;
    }

    if (event.description) {
        html += `<p><i class="fas fa-align-left"></i> <strong>Description:</strong><br>${escapeHtml(event.description)}</p>`;
    }

    if (event.location) {
        html += `<p><i class="fas fa-map-marker-alt"></i> <strong>Location:</strong> ${escapeHtml(event.location)}</p>`;
    }

    if (category) {
        html += `<p><i class="fas fa-tag"></i> <strong>Category:</strong> <span style="color: ${category.color}">${escapeHtml(category.name)}</span></p>`;
    }

    if (event.recurrence !== 'none') {
        html += `<p><i class="fas fa-redo"></i> <strong>Recurrence:</strong> ${capitalizeFirst(event.recurrence)}</p>`;
    }

    if (event.reminder !== 'none') {
        html += `<p><i class="fas fa-bell"></i> <strong>Reminder:</strong> ${getReminderText(event.reminder)}</p>`;
    }

    if (event.url) {
        html += `<p><i class="fas fa-link"></i> <strong>URL:</strong> <a href="${event.url}" target="_blank">${event.url}</a></p>`;
    }

    if (event.attendees) {
        html += `<p><i class="fas fa-users"></i> <strong>Attendees:</strong> ${escapeHtml(event.attendees)}</p>`;
    }

    html += '</div>';

    contentEl.innerHTML = html;
    modal.classList.add('active');

    state.selectedEvent = event;
}

function closeEventDetailsModal() {
    document.getElementById('eventDetailsModal').classList.remove('active');
}

function handleEditFromDetails() {
    closeEventDetailsModal();

    const event = state.selectedEvent;
    if (!event) return;

    document.getElementById('modalTitle').textContent = 'Edit Event';
    document.getElementById('eventTitle').value = event.title;
    document.getElementById('eventDate').value = event.date;
    document.getElementById('allDayEvent').checked = event.allDay;
    document.getElementById('eventStartTime').value = event.startTime || '';
    document.getElementById('eventEndTime').value = event.endTime || '';
    document.getElementById('eventDescription').value = event.description || '';
    document.getElementById('eventLocation').value = event.location || '';
    document.getElementById('eventCategory').value = event.categoryId || '';
    document.getElementById('eventColor').value = event.color;
    document.getElementById('eventRecurrence').value = event.recurrence || 'none';
    document.getElementById('recurrenceEnd').value = event.recurrenceEnd || '';
    document.getElementById('eventReminder').value = event.reminder || 'none';
    document.getElementById('eventURL').value = event.url || '';
    document.getElementById('eventAttendees').value = event.attendees || '';

    document.getElementById('timeInputs').style.display = event.allDay ? 'none' : 'flex';
    document.getElementById('recurrenceEndGroup').style.display = event.recurrence !== 'none' ? 'block' : 'none';
    document.getElementById('deleteEventBtn').style.display = 'inline-flex';
    document.getElementById('duplicateEventBtn').style.display = 'inline-flex';

    document.getElementById('eventModal').classList.add('active');
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
}

// ==========================================
// HELPERS
// ==========================================
function handleDayClick(dateStr) {
    state.currentDate = parseDate(dateStr);
    switchView('day');
}

function handleWeekSlotClick(dateStr, hour) {
    openEventModal(dateStr, hour);
}

function jumpToDate(year, month, day) {
    state.currentDate = new Date(year, month, day);
    renderCurrentView();
}

function getEventsForDate(date) {
    const dateKey = formatDateKey(date);
    return state.events.filter(event => {
        if (event.date === dateKey) {
            const category = state.categories.find(c => c.id === event.categoryId);
            return !category || category.visible;
        }
        return false;
    });
}

function toggleCategoryVisibility(categoryId) {
    const category = state.categories.find(c => c.id === categoryId);
    if (category) {
        category.visible = !category.visible;
        renderCurrentView();
        saveToLocalStorage();
    }
}

function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    updateThemeIcon();
    saveToLocalStorage();
}

function updateThemeIcon() {
    const icon = document.querySelector('#themeBtn i');
    icon.className = state.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

function toggleSidebar() {
    state.sidebarOpen = !state.sidebarOpen;
    document.getElementById('sidebar').classList.toggle('active');
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
        renderCurrentView();
        return;
    }

    const results = state.events.filter(event =>
        event.title.toLowerCase().includes(query) ||
        (event.description && event.description.toLowerCase().includes(query)) ||
        (event.location && event.location.toLowerCase().includes(query))
    );

    renderSearchResults(results);
}

function renderSearchResults(results) {
    const container = document.getElementById('calendarView');

    let html = '<div class="agenda-view"><h3>Search Results</h3>';

    if (results.length === 0) {
        html += `<div class="no-events">
            <i class="fas fa-search"></i>
            <p>No events found</p>
        </div>`;
    } else {
        results.sort((a, b) => new Date(a.date) - new Date(b.date)).forEach(event => {
            const eventDate = parseDate(event.date);
            const category = state.categories.find(c => c.id === event.categoryId);
            const color = event.color || (category ? category.color : '#4285f4');
            const timeDisplay = event.allDay ? 'All Day' : `${event.startTime || ''} ${event.endTime ? '- ' + event.endTime : ''}`;

            html += `<div class="agenda-event" style="border-left-color: ${color}" onclick="showEventDetails(${event.id})">
                <div class="agenda-event-time">${timeDisplay}</div>
                <div class="agenda-event-details">
                    <div class="agenda-event-title">${escapeHtml(event.title)}</div>
                    <div class="agenda-event-meta">
                        <span><i class="fas fa-calendar"></i> ${formatDate(eventDate, 'MMM D, YYYY')}</span>`;

            if (event.location) {
                html += `<span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(event.location)}</span>`;
            }

            html += `</div></div></div>`;
        });
    }

    html += '</div>';
    container.innerHTML = html;
}

// ==========================================
// IMPORT / EXPORT
// ==========================================
function exportEvents() {
    const dataStr = JSON.stringify({
        events: state.events,
        categories: state.categories,
        exportDate: new Date().toISOString()
    }, null, 2);

    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calendar-export-${formatDateKey(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification('Events exported successfully', 'success');
}

function importEvents(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);

            if (data.events) {
                const confirmed = confirm(`This will import ${data.events.length} events. Continue?`);
                if (confirmed) {
                    state.events = [...state.events, ...data.events];

                    if (data.categories) {
                        data.categories.forEach(cat => {
                            if (!state.categories.find(c => c.id === cat.id)) {
                                state.categories.push(cat);
                            }
                        });
                    }

                    saveToLocalStorage();
                    renderCurrentView();
                    renderCategories();
                    updateStatistics();
                    showNotification('Events imported successfully', 'success');
                }
            }
        } catch (error) {
            showNotification('Error importing events. Invalid file format.', 'error');
        }
    };

    reader.readAsText(file);
    e.target.value = '';
}

function clearAllEvents() {
    if (!confirm('Are you sure you want to delete ALL events? This cannot be undone.')) {
        return;
    }

    state.events = [];
    saveToLocalStorage();
    renderCurrentView();
    renderMiniCalendar();
    updateStatistics();
    showNotification('All events cleared', 'success');
}

// ==========================================
// REMINDERS
// ==========================================
function checkReminders() {
    if (!('Notification' in window)) return;

    const now = new Date();
    const currentTime = now.getTime();

    state.events.forEach(event => {
        if (event.reminder === 'none' || event.notified) return;

        const eventDate = parseDate(event.date);
        let eventTime = eventDate.getTime();

        if (!event.allDay && event.startTime) {
            const [hours, minutes] = event.startTime.split(':').map(Number);
            eventDate.setHours(hours, minutes, 0, 0);
            eventTime = eventDate.getTime();
        }

        const reminderMinutes = parseInt(event.reminder);
        const reminderTime = eventTime - (reminderMinutes * 60 * 1000);

        if (currentTime >= reminderTime && currentTime < eventTime) {
            showEventReminder(event);
            event.notified = true;
            saveToLocalStorage();
        }
    });
}

function showEventReminder(event) {
    if (Notification.permission === 'granted') {
        new Notification('Event Reminder', {
            body: `${event.title} is coming up soon!`,
            icon: '/favicon.ico',
            tag: `event-${event.id}`
        });
    }

    showNotification(`Reminder: ${event.title}`, 'warning');
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// ==========================================
// NOTIFICATIONS
// ==========================================
function showNotification(message, type = 'info') {
    const container = document.getElementById('notifications');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;

    const icon = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    }[type];

    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <div class="notification-content">
            <div class="notification-message">${message}</div>
        </div>
    `;

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showShortcuts() {
    document.getElementById('shortcutsModal').classList.add('active');
}

document.getElementById('closeShortcutsModal').addEventListener('click', () => {
    document.getElementById('shortcutsModal').classList.remove('active');
});

// ==========================================
// DATE UTILITIES
// ==========================================
function formatDate(date, format) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return format
        .replace('dddd', days[date.getDay()])
        .replace('ddd', daysShort[date.getDay()])
        .replace('MMMM', months[date.getMonth()])
        .replace('MMM', monthsShort[date.getMonth()])
        .replace('YYYY', date.getFullYear())
        .replace('D', date.getDate());
}

function formatMonthYear(date) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDateKey(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

function formatDateForInput(date) {
    return date.toISOString().split('T')[0];
}

function parseDate(dateStr) {
    return new Date(dateStr + 'T00:00:00');
}

function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

function getWeekEnd(date) {
    const weekStart = getWeekStart(date);
    return new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
}

function formatHour(hour) {
    if (hour === 0) return '12 AM';
    if (hour < 12) return `${hour} AM`;
    if (hour === 12) return '12 PM';
    return `${hour - 12} PM`;
}

function getReminderText(reminder) {
    const minutes = parseInt(reminder);
    if (minutes === 0) return 'At time of event';
    if (minutes < 60) return `${minutes} minutes before`;
    if (minutes === 60) return '1 hour before';
    if (minutes === 1440) return '1 day before';
    return `${minutes} minutes before`;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
