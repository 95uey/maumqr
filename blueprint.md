
# Lotto Number Generator

## Overview

This project is a simple web application that generates random lottery numbers. It demonstrates the use of modern web technologies, including Web Components, to create a clean and interactive user experience.

## Project Outline

*   **`index.html`**: The main HTML file. It includes the basic structure of the page, a container for the lottery number display, and a button to trigger the number generation.
*   **`style.css`**: The stylesheet for the application. It provides the styling for the lottery number balls, the container, and the button, creating a visually appealing and responsive layout.
*   **`main.js`**: The JavaScript file that contains the application logic. It defines a custom element (`lotto-numbers`) to display the lottery balls and handles the random number generation when the button is clicked.

## Implemented Features

*   **Lotto Number Generation**: Generates 6 unique random numbers between 1 and 45.
*   **Modern UI**: Features a clean and visually appealing interface with styled lottery balls and a generation button.

## Current Task: Add Dark/Light Mode Toggle

1.  **Update `index.html`**:
    *   Add a toggle switch or button to the HTML to allow users to switch between dark and light modes.
2.  **Update `style.css`**:
    *   Define CSS variables for colors to easily switch between themes.
    *   Create a `[data-theme="dark"]` selector to apply the dark mode styles.
    *   Add styles for the toggle switch.
3.  **Update `main.js`**:
    *   Add an event listener to the toggle switch.
    *   When the switch is toggled, update the `data-theme` attribute on the `<html>` element to switch between `light` and `dark` themes.
    *   Implement logic to save the user's theme preference in `localStorage` and apply it on page load.
