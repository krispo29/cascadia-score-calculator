# Cascadia Score Calculator

A web-based score calculator for the board game Cascadia. This application helps players easily calculate their scores based on the various scoring cards for wildlife and habitats.

## Features

*   **Player Management:** Supports 1 to 4 players.
*   **Dynamic Scoring Cards:** Select the specific scoring cards (A, B, C, D) for each wildlife type (Bear, Elk, Salmon, Hawk, Fox) for accurate scoring.
*   **Real-time Score Calculation:** Scores are updated in real-time as you input the values for each category.
*   **Winner Highlighting:** The player with the highest score is automatically highlighted.
*   **Responsive Design:** The application is designed to work on various screen sizes, from mobile devices to desktops.
*   **Reset Functionality:** Easily reset the scores to start a new game.

## Technologies Used

*   **Frontend:**
    *   [React](https://reactjs.org/)
    *   [Vite](https://vitejs.dev/)
    *   [Tailwind CSS](https://tailwindcss.com/)
*   **Linting:**
    *   [ESLint](https://eslint.org/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v14 or later)
*   [npm](https://www.npmjs.com/)

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/cascadia-score-calculator.git
    ```
2.  Navigate to the project directory:
    ```sh
    cd cascadia-score-calculator
    ```
3.  Install the dependencies:
    ```sh
    npm install
    ```

### Running the Application

To run the application in development mode, use the following command:

```sh
npm run dev
```

This will start the development server, and you can view the application at `http://localhost:5173`.

## Available Scripts

*   `npm run dev`: Runs the app in the development mode.
*   `npm run build`: Builds the app for production to the `dist` folder.
*   `npm run lint`: Lints the source code using ESLint.
*   `npm run preview`: Serves the production build locally for preview.

## Live Demo

A live demo of the application is available at [https://cascadia-score-calculator.vercel.app/](https://cascadia-score-calculator.vercel.app/).