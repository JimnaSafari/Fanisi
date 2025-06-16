# Fanisi Flow Automator

## Project Overview
A modern web application built with React, TypeScript, and shadcn-ui, designed to streamline and automate workflow processes.

## Main Contributor
- [Jimnasafari](https://github.com/JimnaSafari)

## Technologies Used
This project is built with:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Getting Started

### Prerequisites
- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation
```sh
# Step 1: Clone the repository
git clone https://github.com/JimnaSafari/Fanisi.git

# Step 2: Navigate to the project directory
cd Fanisi

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

## Development
The development server will start with auto-reloading and an instant preview.

## Building for Production
```sh
npm run build
```

## Deployment

### Netlify Deployment
1. Push your code to GitHub
2. Go to [Netlify](https://app.netlify.com/)
3. Click "Add new site" > "Import an existing project"
4. Select your GitHub repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

### Vercel Deployment
1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Vercel will automatically detect the Vite configuration
5. Click "Deploy"

## Environment Variables
If you need to add environment variables:
1. Create a `.env` file in the root directory
2. Add your variables following the format: `VITE_VARIABLE_NAME=value`
3. Never commit the `.env` file to version control

## License
This project is licensed under the MIT License.
