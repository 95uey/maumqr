
# Lotto Number Generator

## Overview

This project is a simple web application that generates random lottery numbers. It demonstrates the use of modern web technologies, including Web Components, to create a clean and interactive user experience.

## Project Outline

*   **`index.html`**: The main HTML file. It includes the basic structure of the page, a container for the lottery number display, and a button to trigger the number generation.
*   **`style.css`**: The stylesheet for the application. It provides the styling for the lottery number balls, the container, and the button, creating a visually appealing and responsive layout.
*   **`main.js`**: The JavaScript file that contains the application logic. It defines a custom element (`lotto-numbers`) to display the lottery balls and handles the random number generation when the button is clicked.

## Current Task: Create the Lotto Number Generator

1.  **Update `index.html`**:
    *   Change the title to "Lotto Number Generator".
    *   Add a `lotto-container` to hold the generated numbers.
    *   Add a button with the ID `generate-btn` to trigger the number generation.
    *   Use the `<lotto-numbers>` custom element to display the numbers.
2.  **Update `style.css`**:
    *   Add styles for the overall layout, including a background with a subtle texture.
    *   Style the `lotto-container` to center the numbers.
    *   Create a visually distinct style for the lottery number balls, including colors and shadows.
    *   Style the `generate-btn` to be interactive and visually appealing.
3.  **Update `main.js`**:
    *   Create a `LottoNumbers` class that extends `HTMLElement`.
    *   Use the Shadow DOM to encapsulate the styles and structure of the lotto numbers.
    *   Implement a function to generate and display 6 unique random numbers between 1 and 45.
    *   Add an event listener to the `generate-btn` to call the number generation function.
