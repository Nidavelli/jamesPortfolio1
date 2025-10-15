# James Kuria Portfolio Website

A responsive, professional portfolio website for James Kuria, a Project Manager and Strategy Consultant with over 6 years of experience in digital transformation, strategy, and quality assurance.

## Project Overview

This website features a modern Node.js/Express backend with Nodemailer (Gmail SMTP) email integration for contact form handling, replacing the previous PHP implementation. The frontend is built using pure HTML, CSS, and JavaScript with a clean, minimalist design and interactive elements.

## Features

- **Responsive Design**: Works seamlessly on all devices and screen sizes
- **Dark Mode Toggle**: User preference with localStorage persistence
- **Animated Typing Effect**: Dynamic text animation on the home page
- **Project Filtering**: Interactive project showcase with filtering
- **Smooth Animations**: Fade-in effects and smooth scrolling
- **Contact Form**: Fully functional contact form with email integration
- **SEO Optimized**: Meta tags and structured data for better search visibility
- **Security**: Rate limiting, input validation, and security headers
- **Email Integration**: Nodemailer (Gmail SMTP) for reliable email delivery

## Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Font Awesome icons
- Google Fonts (Poppins)
- Responsive CSS Grid and Flexbox

### Backend
- Node.js with Express.js
- Nodemailer (Gmail SMTP) for email services
- Express Rate Limit for spam protection
- Helmet.js for security headers
- Express Validator for input validation
- CORS for cross-origin requests

## Project Structure

```
james_portfolio_website/
│
├── server/                    # Node.js Backend
│   ├── routes/
│   │   └── contact.js         # Contact form API endpoint
│   ├── middleware/
│   │   └── validation.js      # Input validation middleware
│   ├── server.js              # Main Express server
│   ├── package.json           # Backend dependencies
│   └── .env.example          # Environment variables template
│
├── assets/                    # Static assets
│   ├── images/               # Images and icons
│   └── resume.pdf           # Resume download
│
├── css/                      # Stylesheets
│   ├── style.css            # Main stylesheet
│   └── animations.css       # Animation styles
│
├── js/                      # JavaScript files
│   └── script.js           # Main JavaScript functionality
│
├── index.html              # Home page
├── about.html              # About page
├── projects.html           # Projects showcase
├── contact.html            # Contact page
├── contact-form-handler.php # Legacy PHP handler (deprecated)
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)
- Resend API account and API key

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd james_portfolio_website
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your actual values
   # Required variables:
   # - RESEND_API_KEY: Your Resend API key
   # - RECIPIENT_EMAIL: Email address to receive contact form submissions
   ```

4. **Start the development server**
   ```bash
   # From the server directory
   npm run dev
   
   # Or start the production server
   npm start
   ```

5. **Access the website**
   - Open your browser and navigate to `http://localhost:3000`
   - The contact form will be fully functional

### Environment Variables

Create a `.env` file in the `server/` directory with the following variables:

```env
PORT=3000
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_app_password
RECIPIENT_EMAIL=recipient@example.com
NODE_ENV=development
CORS_ORIGIN=*
```

**Required Variables:**
- `EMAIL_USER`: Gmail address used to send emails
- `EMAIL_PASS`: Gmail App Password (not your normal password)
- `RECIPIENT_EMAIL`: Email address where contact form submissions will be sent

**Optional Variables:**
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `CORS_ORIGIN`: CORS origin (use `*` for development, specific domain for production)

## Deployment

### Platform Options

The application is ready for deployment on various platforms:

#### 1. Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project root
vercel

# Set environment variables in Vercel dashboard
# - RESEND_API_KEY
# - RECIPIENT_EMAIL
```

#### 2. Render
1. Connect your GitHub repository
2. Set build command: `cd server && npm install`
3. Set start command: `cd server && npm start`
4. Add environment variables in dashboard

#### 3. Railway
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

#### 4. Heroku
```bash
# Install Heroku CLI
# Create Procfile in server directory:
echo "web: node server.js" > server/Procfile

# Deploy
cd server
heroku create your-app-name
heroku config:set RESEND_API_KEY=your_key
heroku config:set RECIPIENT_EMAIL=your_email
git push heroku main
```

#### 5. DigitalOcean App Platform
1. Connect GitHub repository
2. Configure build settings
3. Set environment variables
4. Deploy

### Production Considerations

1. **Environment Variables**: Ensure all required environment variables are set
2. **Domain Configuration**: Update CORS_ORIGIN to your production domain
3. **HTTPS**: Enable HTTPS in production (most platforms handle this automatically)
4. **Monitoring**: Set up logging and monitoring for production
5. **Backup**: Regular backups of your deployment

## API Endpoints

### Contact Form
- **POST** `/api/contact` - Submit contact form
  - Body: `{ name: string, email: string, message: string }`
  - Response: `{ success: boolean, message: string }`

### Health Check
- **GET** `/api/health` - Server health status
  - Response: `{ success: boolean, message: string, timestamp: string }`

## Security Features

- **Rate Limiting**: 5 requests per 15 minutes per IP for contact form
- **Input Validation**: Comprehensive validation and sanitization
- **Security Headers**: Helmet.js for security headers
- **CORS Protection**: Configurable cross-origin resource sharing
- **XSS Protection**: Input escaping and validation
- **CSRF Protection**: Built-in Express protection

## Browser Compatibility

The website is compatible with all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contact Form Integration

The contact form uses Resend API for reliable email delivery:

1. **Form Submission**: AJAX-based submission without page reload
2. **Validation**: Client-side and server-side validation
3. **Email Delivery**: Professional email formatting with reply-to functionality
4. **Error Handling**: Comprehensive error handling and user feedback
5. **Rate Limiting**: Protection against spam and abuse

## Troubleshooting

### Common Issues

1. **Contact form not working**
   - Check RESEND_API_KEY is set correctly
   - Verify RECIPIENT_EMAIL is valid
   - Check server logs for errors

2. **Static files not loading**
   - Ensure server is running from correct directory
   - Check file paths in HTML/CSS

3. **CORS errors**
   - Update CORS_ORIGIN environment variable
   - Check browser console for specific errors

### Development Tips

- Use `npm run dev` for development with auto-restart
- Check server logs for debugging information
- Test contact form functionality thoroughly
- Validate all environment variables are set

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Credits

- **Fonts**: Google Fonts (Poppins)
- **Icons**: Font Awesome
- **Email Service**: Resend
- **Design**: Custom responsive design
- **Backend**: Node.js with Express

## Support

For support or questions:
- Email: tmarn2004@gmail.com
- Check the troubleshooting section above
- Review server logs for error details
