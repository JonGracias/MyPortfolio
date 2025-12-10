My Portfolio

A collection of my projects spanning backend automation, web development, and creative technology. Built with Next.js and deployed on Azure.

Overview

This portfolio showcases my work using a dynamic grid system that displays my GitHub repositories. The frontend uses a card system with a smooth pop-up effect where cards display information about the repositories. The pop-up effect creates an engaging UX, allowing for overlap outside the grid for an aesthetic appeal.

Users can interact with the repositories by starring them in real-time using the GitHub API, with OAuth authentication allowing clients to sign in and star my repositories. The frontend communicates with an Azure API, hosted on Azure Functions, to manage all the necessary interactions.

Features

Dynamic Grid: Repositories are displayed in a grid format, with cards popping up on click.

Repository Interaction: Users can star repositories directly from the grid, which updates the stars in real-time.

OAuth Authentication: GitHub OAuth authentication is implemented, allowing clients to sign in and interact with the repos.

API Integration: The frontend makes API calls to Azure Functions for:

Fetching repository data.

Checking if the user is logged in.

Starring repos in real time.

Retrieving the list of repos starred by the client.

Static Web App: Deployed on Azure as a static web app, utilizing CI/CD via GitHub Actions.

Tech Stack

Frontend: Next.js, Tailwind CSS

Backend: Azure Functions (Node.js)

Authentication: GitHub OAuth

Deployment: Azure Static Web Apps with CI/CD via GitHub Actions

How It Works

Frontend Interaction:

The grid displays repositories from GitHub. When clicked, a detailed card pops up showing more information about the repo.

Cards overlap outside of the grid slightly, creating a dynamic effect.

GitHub API Integration:

The frontend makes requests to the GitHub API to fetch repository details.

Users can star repos in real-time. If logged in, the user’s GitHub profile is linked, and the star status is updated in real-time.

Azure API Integration:

The frontend communicates with Azure Functions, which handles API calls to fetch repos, manage OAuth logins, and update star statuses.

The API is responsible for securely handling OAuth callbacks and storing user data for starred repos.

Continuous Deployment:

The project is deployed as a static web app on Azure, using GitHub Actions for CI/CD. This ensures any updates to the GitHub repository or code are automatically reflected on the live site.

Setup and Installation
Prerequisites

Node.js (preferably the latest LTS version)

Azure Functions Core Tools (for local development)

GitHub OAuth credentials

Steps to Run Locally:

Clone the repository:

git clone https://github.com/JonGracias/MyPortfolio.git
cd MyPortfolio


Install dependencies:

npm install


Configure environment variables:

Create a .env.local file in the root directory.

Add your GitHub OAuth credentials:

NEXT_PUBLIC_GITHUB_CLIENT_ID=your-client-id
NEXT_PUBLIC_GITHUB_CLIENT_SECRET=your-client-secret


Run the app locally:

npm run dev


Run Azure Functions locally (if you’re developing the backend as well):

func start

Deployment

Azure Static Web App:

The frontend is deployed as a static web app on Azure, providing a fast and secure way to serve the portfolio.

CI/CD Pipeline:

The GitHub repository is connected to Azure via GitHub Actions, enabling automatic deployment whenever changes are made to the code.

To Deploy to Azure:

Follow the Azure Static Web Apps documentation
 to set up your app on Azure.

Make sure to configure the Azure Functions and set up your GitHub Actions for seamless deployment.

Future Improvements

More Interactive UI: Add more interactivity, such as animations or transitions between the cards, and app demos. 

More Detailed Repo Info: Enhance the displayed repository information (e.g., contributor data, issues).

Profile Management: Allow users to manage their GitHub profile and starred repos directly within the portfolio.

License

This project is licensed under the MIT License – see the LICENSE
 file for details.