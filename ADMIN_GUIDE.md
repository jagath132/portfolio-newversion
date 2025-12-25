# 🛡️ Admin Panel Guide

Your portfolio includes a fully functional Admin Panel for managing your content dynamically. I've set up easy scripts to access it.

## 🚀 How to Run the Admin Panel

To start the admin dashboard in development mode:

```bash
npm run dev:admin
```

This will launch the application in Admin Mode at `http://localhost:5173` (or the next available port).
**Note:** You might need to stop your current running server (`Ctrl+C`) before starting this one, or run it in a separate terminal.

## 🏗️ How to Build for Admin

To build the admin panel for deployment:

```bash
npm run build:admin
```

## ✨ Features Available

The admin panel already includes full CRUD (Create, Read, Update, Delete) capabilities for:
- **Skills Manager**: Add or edit technical skills and categories.
- **Experience Manager**: Update your work history and points.
- **Project Manager**: Manage your portfolio projects, images, and links.
- **Education Manager**: Update your degrees and certifications.

## 🔧 implementation Details

The mode is controlled by the `VITE_APP_MODE` environment variable:
- `VITE_APP_MODE=admin` -> Loads Admin Routes & Dashboard
- `VITE_APP_MODE=portfolio` (or default) -> Loads Public Portfolio

I have added the `cross-env` package to ensure these scripts work seamlessly on Windows, Mac, and Linux.
