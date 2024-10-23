# Security Analyzer

Security Analyzer is a web application that allows users to upload images or emails for security analysis. The application uses the Groq API to analyze the content and provide security insights.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- Upload images for security analysis
- Upload emails for security analysis
- View detailed analysis results
- User-friendly interface

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/your-username/security-analyzer.git
    cd security-analyzer
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your Groq API key:

    ```env
    REACT_APP_GROQ_API_KEY=your-api-key
    ```

## Usage

1. Start the development server:

    ```sh
    npm run dev
    ```

2. Open your browser and navigate to `http://localhost:3000`.

3. Enter your Groq API key in the input field.

4. Upload an image or email file for analysis.

## Project Structure

- `src/`
  - `components/`
    - `Analysis.tsx`: Displays the analysis results.
    - `ApiKeyInput.tsx`: Input field for the Groq API key.
    - `ErrorMessage.tsx`: Displays error messages.
    - `FileUpload.tsx`: Component for uploading files.
  - `context/`
    - `ApiKeyContext.tsx`: Context for managing the Groq API key.
  - `services/`
    - `groq.ts`: Service for interacting with the Groq API.
  - `utils/`
    - `fileProcessing.ts`: Utility functions for processing files.
  - `App.tsx`: Main application component.
  - `main.tsx`: Entry point of the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.