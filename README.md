# React Task Manager

A modern task management application built with **React** as part of Laboratory Work No. 2 for the *Web Application Development Tools* course.

The project is based on **Variant 10 – ToDo Application**, but was extended with additional functionality.

## Features

- Add new tasks
- Add tasks by pressing `Enter`
- Edit existing tasks
- Delete tasks
- Mark tasks as completed
- Set priority: Low / Medium / High
- Assign categories: Work / Study / Personal
- Set due dates
- Detect overdue tasks
- Search tasks by text
- Filter tasks by status
- Filter tasks by category
- Sort tasks by priority, due date, and creation order
- Clear completed tasks
- Show task statistics
- Save tasks in `localStorage`
- Light / Dark theme
- Save selected theme in `localStorage`
- Responsive layout

## Technologies

- React
- JavaScript
- HTML
- CSS
- Vite
- localStorage

## Project Structure

```text
src/
├── components/
│   ├── TodoControls.jsx
│   ├── TodoForm.jsx
│   ├── TodoItem.jsx
│   └── TodoStats.jsx
├── App.jsx
├── index.css
└── main.jsx
```

## Installation

Clone the repository:

```bash
git clone https://github.com/bkuvshinnikov/lab2-react-todo.git
```

Open the project directory:

```bash
cd lab2-react-todo
```

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm run dev
```

The application will usually be available at:

```text
http://localhost:5173/
```

## Production Build

To create a production build:

```bash
npm run build
```

## Project Passport

**Student:** Boris Kuvshinnikov  
**Project Name:** React Task Manager  
**Framework:** React.js  
**GitHub:** https://github.com/bkuvshinnikov/lab2-react-todo

### Brief Description

A frontend React task management application that allows users to create, edit, complete, organize, search, filter, sort, and delete tasks.

The application stores data locally in the browser using `localStorage`.

## Debugging

The application was tested and debugged in the browser.

Checked functionality:

- Adding new tasks
- Adding tasks with `Enter`
- Editing task text
- Editing priority
- Editing category
- Editing due date
- Completing tasks
- Deleting tasks
- Filtering by status
- Filtering by category
- Searching tasks
- Sorting tasks
- Detecting overdue tasks
- Clearing completed tasks
- Saving tasks in `localStorage`
- Saving the selected Light / Dark theme in `localStorage`
- Switching between Light and Dark themes
- Responsive layout

During debugging, a CSS conflict affecting Dark Mode was identified and fixed.

The browser console was checked for errors and the application works correctly.

## Application Type

This project is a **frontend-only React application**.

No backend, external API, or database is required.

## Author

**Boris Kuvshinnikov**

Web Application Development Tools  
Laboratory Work No. 2  
Variant 10 – ToDo Application