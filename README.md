# 🌟 Bright Tuition Care – Online Learning Platform

An advanced online tutoring platform designed to connect students/guardians with qualified tutors, streamline tutoring job requests, enable community engagement, and offer a secure backend for payments, communication, and management.

# 🚀 Live Deployment

🌐 Frontend URL: https://brighttuitioncare.com

🔧 Admin Panel: https://admin.brighttuitioncare.com

📦 API Base URL: https://api.brighttuitioncare.com

# 📚 Project Overview
Bright Tuition Care is a full-featured online learning platform that allows:

   - Students/Guardians to request tutors, post jobs, and track progress.

   - Tutors to register, apply for jobs, manage profiles, and receive payments.

  - Admins to manage users, jobs, payments, and communications across the platform.

This system includes dedicated dashboards and role-based access for students, tutors, and admins with real-time alerts, SMS support, and community features.
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

# 👤 Key Features Based on Roles

### 🧑‍🎓 Student / Guardian Panel
 - 🔐 Phone/Email Registration & Verification

 - 📝 Tutor Request Form (Detailed Requirements)

 - 🧾 Post Tutoring Job Requests

 - 📂 Profile Management

 - 📊 Dashboard (Track Tutor Requests)

 - 📬 Real-time SMS & Notifications

 - ⭐ Rate & Review Tutors

 - 📢 Notice Board for Announcements

 - 👥 Join Tutor Community

 - ❓ Help & Support Access

 - 🔄 Settings & Confirmation Letter Download

 - 🧭 How It Works Guide

 - 📌 Posted Jobs Overview

 - 🧾 Important Notes Section

 - 📤 Share App
   



### 👨‍🏫 Tutor Panel
 - 🔐 Phone/Email Registration & Verification

 - 🧾 Request Profile Verification

 - 🧍 Profile Management (After Unlock)

 - 💼 Apply for Tutoring Jobs

 - 📬 Dashboard (Job Applications)

 - 💸 Secure Payment Integration

 - 🧾 Invoice Management

 - 📢 Real-time Alerts (SMS & Notifications)

 - 🧭 How It Works Guide

 - 📢 Notice Board

 - 📤 Share App

 - 💰 Refer & Earn Feature

 - 📤 Job Sharing Functionality

 - 👥 Join Tutor Community

 - ⚙️ Settings & Confirmation Letter

 - 📃 Terms & Conditions

 - ❓ Help & Support

 

### 🛠️ Admin Panel
 - 📊 Comprehensive Dashboard with Analytics

 - 👥 Student & Guardian Management

 - ✅ Tutor Verification & Job Approval Workflows

 - 💳 Payment Tracking & Management

 - 📂 Tutor Profile Oversight

 - 📋 Manage Job Board Listings

 - 📢 Manage Notices & Notifications

 - 👤 Admin & Staff Profiles

 - 📬 Notification & Alerts Module

 - ⚙️ System Settings

 - 📜 Confirmation Letter Management

 - 📈 Lead Offer Management

 - 📞 Help & Support

 - 🔔 Auto Notification Configuration

# 📦 Technology Stack & Packages
### ✨ Frontend
 - React
 - Redux
 - Tailwind CSS
 - RTK Query

### ⚙️ Backend
 - NojeJS
 - ExpressJS

### 🧩 Database
 - MySQL

# 📝 License
This project is proprietary and governed by the Bright Tuition Care development agreement. Redistribution or reuse of source code is prohibited



## 🚀 Installation

Follow these steps to get the project up and running locally:

### 1. Clone the Repository

```bash
git clone https://github.com/team-pr01/Bright-Tuition-Care-Client.git
cd Bright-Tuition-Care-Client
```
### 2. Install Dependencies

Make sure you have Node.js installed (preferably v18 or above).
```bash
npm install
```
### 3. Run the Development Server


```bash
npm run dev
```
Your application will be available at: https://brighttuitioncare.com

# 🧾 Git Branch Naming & Commit Message Guidelines
To maintain a clean and scalable Git history, follow these conventions for branch names and commit messages.

## 🚀 Branch Naming Convention
Use the format:

```
<branch-type>/<ticket-id>-<short-kebab-case-description>
```
### 🔹 Allowed Branch Types:
Type	Purpose
- feat	-New feature
- fix	Bug -fixes
- refactor	-Code refactoring without behavior change
- chore	-Misc tasks (e.g., updating config, scripts)
- docs	-Documentation only
- test	-Adding/updating tests
- hotfix	-Emergency production fix
- ui	-UI-only changes (pages, components, styles)

#### 🔸 Examples:
feat/101-user-authentication

fix/234-navbar-overlap-mobile

refactor/119-reorganize-form-hooks

ui/198-profile-page-redesign

## 📝 Commit Message Convention
Follow the Conventional Commits format:

```
<type>(scope): <short summary>

[optional body]

[optional footer, e.g. closes #issue]
```
### 🔹 Types
- Type	-Description
- feat	-Introduces a new feature
- fix	-Fixes a bug
- style	-UI/UX or styling only (no logic changes)
- refactor	-Code change that doesn’t fix a bug or add feature
- chore	-Maintenance tasks (e.g., deps, config)
- docs	-Adds or improves documentation
- test	-Adds or improves tests
- perf	-Performance improvements

### 🔸 Common Scopes
Scope	When to Use
- component	-For reusable components
- page	-For entire screen or route-based pages
- layout-	Headers, footers or layout wrappers
- style	-Styling or theme changes
- auth, api, db, utils, etc.	-Based on modules

#### 🔸 Commit Examples
feat(auth): add JWT-based login system

fix(component): resolve button alignment issue on mobile

style(layout): update sidebar color scheme for dark mode

refactor(page): extract profile logic into reusable hook

chore(deps): bump axios to v1.6.2

docs(readme): add setup instructions

#### ✅ Summary
Use Case	Convention Example

Create a feature	feat/123-add-tutor-registration

Fix a UI bug	ui/456-fix-header-overlap

Commit new UI page	feat(page): implement tutor profile page

Commit reusable button	feat(component): create primary button component

Update colors	style(ui): update brand color palette


