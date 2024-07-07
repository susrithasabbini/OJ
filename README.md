# Code Judge

## Project Overview

This project is an online judge platform that allows users to solve coding problems, participate in coding contests, and view their submissions. The platform offers a user-friendly interface for coding practice and competition.

## Features

- **Problem Solving**: Users can browse, solve, and submit solutions for various coding problems.
- **Contests**: Participate in coding contests and compete with other users.
- **Submissions**: View your past submissions and track your progress.
- **Leaderboard**: Check your ranking and performance in contests.
- **User-Friendly UI**: Built using React and NextUI for an attractive and responsive user interface.

## Technologies Used

- **React**: JavaScript library for building user interfaces.
- **NextUI**: React UI library for creating beautiful and modern web applications.
- **Axios**: Promise-based HTTP client for making API requests.
- **Firebase**: Used for file storage.
- **Docker**: Containerization of the backend server.
- **ECR**: To push the docker image to Elastic Container Registry.
- **EC2**: Hosting the Docker container directly on an EC2 instance from ECR.

## Setup Instructions

1. **Clone the repository**: Go to the root directory.
2. **Install dependencies**: 
    - *Client*: `cd client` && `npm install --legacy-peer-deps`,
    - *Server*: `cd server` && `npm install`
3. **Configure environment variables**: Set up the env files for both client and server.
    - *Client*: Environment variables required will be in `src/config/index.js`.
    - *Server*: Environment variables required will be in `config/index.js`
3. **Run the application**: Run both the client and server applications.
    - *Client*: `cd client` && `npm run dev`.
    - *Server*: `cd server` && `npm run dev`. (In local)
    - *Server*: `docker build -t oj-backend .` && `docker run -d -p 5000:5000 --env-file .env oj-backend` (In docker)