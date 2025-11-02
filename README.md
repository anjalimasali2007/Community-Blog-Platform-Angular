# Community-Blog-Platform-Angular

## 👥 Team Members  

| **Name** | **Role** |
|----------|----------|
| Anjali Masali (Team Leader) | Frontend Developer |
| Saloni Yangundi | Backend Developer |

 

##  Introduction
The Community Blog Platform is a modern web application that allows users to create, read, update, and delete blog posts.
It is built using Angular (Frontend) and Spring Boot (Backend) with PostgreSQL Database, following the MVC Architecture.
The platform provides an interactive and responsive UI for smooth user experience and proper integration between frontend and backend.

##  Technologies Used

Frontend: Angular, TypeScript, HTML, CSS

Backend: Spring Boot (Java), REST API

Database: PostgreSQL

Build Tools: Maven, Node.js & NPM

Version Control: Git & GitHub

##  Features

• Create new blog posts with title, content, and author

• View all blogs in a list with attractive UI

•  Read full blog details

•  Update blog posts easily

•  Delete blog posts from the platform

•  Responsive and user-friendly interface

•  RESTful API integration between Angular & Spring Boot

##  Prerequisites

Make sure you have the following installed on your system:

• Java 17+

• Maven

• PostgreSQL

• Node.js & NPM

• Angular CLI

## Ports Used

Spring Boot Backend: http://localhost:8080/

Angular Frontend: http://localhost:4200/

PostgreSQL Database: Default port 5432

## Commands to Run
## Backend
```
cd backend
mvn spring-boot:run
```

## Frontend
```
npm install
ng serve
```



##  Project Structure
```plaintext
frontend/
├── proxy.conf.json # Proxy to Spring Boot backend (avoids CORS)
├── angular.json # Angular CLI configuration
├── package.json # Project dependencies & scripts
├── tsconfig.json # TypeScript configuration
├── src/
│ ├── index.html # Main HTML entry point
│ ├── main.ts # Application bootstrap
│ ├── styles.css # Global CSS styles
│ ├── app/
│ │ ├── app.component.ts # Root component logic
│ │ ├── app.component.html # Root component template
│ │ ├── app.config.ts # Provides Router + HttpClient
│ │ ├── app.routes.ts # Route definitions
│ │ │
│ │ ├── models/
│ │ │ └── blog.ts # Blog interface
│ │ │
│ │ ├── services/
│ │ │ └── blog.service.ts # BlogService (CRUD API calls)
│ │ │
│ │ ├── pages/ # All standalone UI pages
│ │ │ ├── blog-list/
│ │ │ │ ├── blog-list.component.ts
│ │ │ │ ├── blog-list.component.html
│ │ │ │ └── blog-list.component.css
│ │ │ │
│ │ │ ├── blog-form/
│ │ │ │ ├── blog-form.component.ts
│ │ │ │ ├── blog-form.component.html
│ │ │ │ └── blog-form.component.css
│ │ │ │
│ │ │ └── blog-detail/
│ │ │ ├── blog-detail.component.ts
│ │ │ ├── blog-detail.component.html
│ │ │ └── blog-detail.component.css
│ │ │
│ │ └── ...
│ │
│ └── assets/ # Static files (images, logos, etc.)
│
└── ...
```


##  Output Screentshot


## Home Page

<img width="1599" height="848" alt="Screenshot 2025-11-01 204706" src="https://github.com/user-attachments/assets/98902df8-8988-46ff-8195-e9cafe1702f7" />


## All Blogs
<img width="1599" height="849" alt="Screenshot 2025-11-01 205337" src="https://github.com/user-attachments/assets/d9bfbf42-82b7-4db2-8b17-38700b3b9463" />


## About

<img width="1599" height="848" alt="Screenshot 2025-11-01 205446" src="https://github.com/user-attachments/assets/81af08fd-3bc5-4251-8287-a402e4d88e4e" />








**Name:** Anjali Masali

📫 **GitHub:** @anjalimasali2007

✉️ **Email:** anjalimasali05@gmail.com



