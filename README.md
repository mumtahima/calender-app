# 📅 Modern Calendar App

A feature-rich, modern calendar application built with HTML, CSS, and JavaScript. This app runs entirely in your browser with no server required, using localStorage for data persistence.

![Calendar App](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### Core Functionality
- **Multiple Calendar Views**
  - 📅 Month View - Traditional calendar grid
  - 📆 Week View - Detailed weekly schedule with hourly slots
  - 📋 Day View - Focused single-day schedule
  - 📝 Agenda View - List of upcoming events

- **Event Management**
  - ➕ Create, edit, delete, and duplicate events
  - 🎨 Custom colors for events
  - 📁 Categorize events (Work, Personal, Meeting, Holiday, etc.)
  - 🔄 Recurring events (Daily, Weekly, Monthly, Yearly)
  - ⏰ All-day events or timed events
  - 📍 Add location information
  - 📝 Event descriptions and notes
  - 🔗 Attach URLs to events
  - 👥 Track attendees
  - 🔔 Event reminders with browser notifications

### User Interface
- 🌓 **Dark/Light Theme** - Toggle between themes
- 🔍 **Search** - Find events by title, description, or location
- ⌨️ **Keyboard Shortcuts** - Navigate efficiently
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎯 **Mini Calendar** - Quick navigation in sidebar
- 📊 **Statistics Dashboard** - Track your events at a glance

### Data Management
- 💾 **Local Storage** - All data saved in your browser
- 📤 **Export** - Save your events as JSON file
- 📥 **Import** - Load events from JSON file
- 🗑️ **Clear All** - Remove all events (with confirmation)

### Additional Features
- 🎨 Custom categories with colors
- 📅 Click on any day to view/add events
- 🖱️ Click on time slots in week/day view to create events
- 🔔 Browser notifications for event reminders
- ✅ Visual indicators for today's date
- 🎯 Event counts per category
- 📈 Monthly and upcoming event statistics

## 🚀 Getting Started

### Installation

1. **Download the Files**
   - Download all three files: `index.html`, `styles.css`, and `script.js`
   - Place them in the same folder

2. **Open in Browser**
   - Double-click `index.html` or
   - Right-click `index.html` → Open with → Your preferred browser

That's it! No installation, no dependencies, no server required.

### Browser Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- LocalStorage enabled
- Notification permission (optional, for reminders)

## 🎮 Usage Guide

### Creating Events

**Method 1: Using the Add Event Button**
1. Click the "Add Event" button in the header or sidebar
2. Fill in the event details
3. Click "Save Event"

**Method 2: Click on a Day**
- In Month View: Click on any day
- In Week/Day View: Click on a time slot

**Method 3: Keyboard Shortcut**
- Press `N` to open the new event dialog

### Event Fields

- **Title*** - Event name (required)
- **Date*** - Event date (required)
- **All Day Event** - Toggle for all-day events
- **Start/End Time** - Specific times for the event
- **Description** - Detailed notes about the event
- **Location** - Where the event takes place
- **Category** - Organize events by type
- **Color** - Custom color for the event
- **Recurrence** - Create repeating events
- **Reminder** - Get notified before the event
- **URL** - Link related to the event
- **Attendees** - List of participants (comma-separated emails)

### Navigating the Calendar

**Navigation Buttons**
- ◀ Previous - Go to previous period
- Today - Jump to current date
- ▶ Next - Go to next period

**Keyboard Shortcuts**
- `N` - New Event
- `T` - Go to Today
- `←` - Previous Period
- `→` - Next Period
- `M` - Month View
- `W` - Week View
- `D` - Day View
- `A` - Agenda View
- `/` - Focus Search
- `?` - Show Shortcuts
- `Esc` - Close Modal

### Managing Categories

1. Click the **+** button next to "Categories" in the sidebar
2. Enter category name and choose a color
3. Click "Add Category"
4. Click on any category to toggle visibility

### Searching Events

1. Click the search bar in the header or press `/`
2. Type your search query
3. Results will display immediately
4. Clear the search to return to calendar view

### Import/Export Events

**Export Events**
1. Click "Export Events" in the sidebar
2. A JSON file will download automatically
3. Save it for backup or sharing

**Import Events**
1. Click "Import Events" in the sidebar
2. Select a previously exported JSON file
3. Events will be added to your calendar

### Theme Switching

- Click the moon/sun icon in the header
- Toggle between light and dark themes
- Your preference is saved automatically

## 📱 Responsive Design

The calendar automatically adapts to different screen sizes:

- **Desktop** (>1024px) - Full sidebar and all features visible
- **Tablet** (768px-1024px) - Collapsible sidebar, optimized layout
- **Mobile** (<768px) - Simplified interface, touch-optimized

## 💾 Data Storage

All your data is stored in your browser's localStorage:

- **Privacy** - Data never leaves your computer
- **Persistence** - Events are saved automatically
- **Portability** - Export and import to move between devices
- **Size Limit** - Typically 5-10MB (thousands of events)

## 🔔 Notifications

To enable event reminders:

1. When you first create an event with a reminder, your browser will ask for notification permission
2. Click "Allow" to enable notifications
3. You'll receive browser notifications based on your reminder settings

**Note:** Notifications only work when the browser is open.

## ⚙️ Customization

### Adding More Categories

Edit the `state.categories` array in `script.js`:

```javascript
categories: [
    { id: 1, name: 'Work', color: '#4285f4', visible: true },
    { id: 2, name: 'Personal', color: '#ea4335', visible: true },
    // Add more categories here
]
```

### Changing Color Scheme

Edit CSS variables in `styles.css`:

```css
:root {
    --primary-color: #4285f4;
    --success-color: #34a853;
    --danger-color: #ea4335;
    /* Customize colors here */
}
```

### Modifying Date Format

Edit the `formatDate` function in `script.js` to change date display formats.

## 🐛 Troubleshooting

**Events not saving?**
- Check if localStorage is enabled in your browser
- Check browser privacy settings
- Try clearing browser cache and restarting

**Notifications not working?**
- Grant notification permission in browser settings
- Keep the browser tab open
- Check system notification settings

**Calendar not displaying correctly?**
- Make sure all three files (HTML, CSS, JS) are in the same folder
- Clear browser cache
- Try a different browser
- Check browser console for errors (F12)

**Search not working?**
- Events must have matching text in title, description, or location
- Search is case-insensitive
- Clear search to return to normal view

## 🔒 Privacy & Security

- **No Server** - Everything runs locally in your browser
- **No Tracking** - No analytics or tracking code
- **No External Calls** - Except for Font Awesome icons (can be made offline)
- **Your Data** - You have complete control

## 📄 Browser Support

| Browser | Minimum Version |
|---------|----------------|
| Chrome  | 90+            |
| Firefox | 88+            |
| Safari  | 14+            |
| Edge    | 90+            |

## 🎨 Technology Stack

- **HTML5** - Structure and semantics
- **CSS3** - Styling with custom properties (CSS variables)
- **Vanilla JavaScript** - No frameworks or dependencies
- **Font Awesome** - Icons (CDN)
- **LocalStorage API** - Data persistence
- **Notification API** - Event reminders

## 📝 Tips & Best Practices

1. **Regular Exports** - Export your events periodically as backup
2. **Use Categories** - Organize events for better visualization
3. **Set Reminders** - Never miss important events
4. **Keyboard Shortcuts** - Navigate faster with shortcuts
5. **Color Coding** - Use different colors for visual distinction
6. **Recurring Events** - Save time by setting up recurring events
7. **Search Feature** - Quickly find past or future events

## 🆘 Support

For issues, questions, or suggestions:
- Check the troubleshooting section above
- Review the browser console for errors (F12)
- Ensure all files are properly downloaded

## 📜 License

MIT License - Feel free to use, modify, and distribute this calendar app.

## 🙏 Acknowledgments

- Font Awesome for the icons
- Modern web standards for making this possible
- You, for using this calendar app!

## 📅 Version History

**v1.0.0** (Current)
- Initial release
- All core features implemented
- Multiple views (Month, Week, Day, Agenda)
- Event management with full CRUD operations
- Categories and custom colors
- Recurring events
- Import/Export functionality
- Dark/Light themes
- Search functionality
- Keyboard shortcuts
- Responsive design
- Browser notifications

---

**Enjoy your new calendar app! 🎉**

Made with ❤️ using HTML, CSS, and JavaScript
