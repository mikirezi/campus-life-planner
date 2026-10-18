# My Campus Planner 
## Live Website
https://mikirezi.github.io/campus-life-planner/
## Demo Video
https://youtu.be/La1vmmz9CbM
## Theme 
Campus Life Planner
## About the project
My campus Planner is a simple responsive web application designed to mostly help and support university students organise their classes, assignments,quizzes, study  sessions in one place.
The application allows students to add, edit, delete, search and sort their campus records while also tracking their study time and weekly study target.
## Features
- Add and manage campus records
- Edit and delete records
- Search records using regular expressions
- sort records by date, title and duration
- Track total study time
- View the most common category
- View study activity for the last 7 days
- Set a weekly study target
- Convert minutes into hours
- Save records using localStorage 
- Export planner data as JSON
- Import and validate JSON data
- Responsive design for phones, tablets and desktops
- Keyboard-friendly navigation and accessible status messages
## Regex catalog
### Title validation
Pattern:
`^\S(?:.*\S)?$`
Example that passes: `Python Assignment`
Example that fails: `Python Assignment`
### Duration validation
Pattern:
`^(0|[1-9]\d*)(\.\d{1,2})?$`
Example that passes: `90`
Example that fails: `09.999`
### Date validation
Pattern:
`^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$`
Example that passes: `2026-10-20`
Example that fails: `2026-15-40`
### Category validation
Pattern:
`^[A-Za-z]+(?:[ -][A-Za-z]+)*$`
Example that passes: `Software Engineering`
Example that fails: `123Study`
### Time validation
Pattern:
`^(?[01]\d|2[0-3]):[0-5]\d$`
Example that passess: `10:30`
Example that fails: `25:70`
### Advanced duplicate-word validation
Pattern:
`\b(\w+)\s+\1\b`
Example that fails: `Python Python`
This rule uses a back-reference to detect repeated words.
## Accessibility
The application includes:
- Semantic HTML landmarks such as header, nav, main, section and footer
- Labels connected to form inputs
- Visible keyboard focus styles
- Keyboard-friendly navigation
- A skip-to-content link
- ARIA live messages for important updates
- Responsive layouts for mobile, tablet and desktop
- Reduced-motion support for users who prefer less animation
## Keyboard map
- Tab: Move between interactive elements
- Shift + Tab: Move backwards
- Enter: Activate buttons and checkboxes 
- Space: Activate buttons and checkboxes
- Arrow keys: Navigate select options
## Testing
Open `tests.html` in a browser to run the validation and search tests
The test page checks:
- Valid record validation
- Invalid title validation
- Valid regex search
- Invalid regex search
## How to run the project
1. Clone the repository from Github
2. Open the project folder in visual studio code
3. Open `index.html` using a local development server such as Live server
4. Use the navigation menu to access the Dashboard, Planner, Add Record, settings and About sections.

