/**
 * Main JavaScript file for James Kuria Portfolio Website
 * Author: Manus AI
 * Date: June 3, 2025
 */

// DOM Elements
const navbar = document.getElementById('navbar');
const progressBar = document.getElementById('progress-bar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const fadeElements = document.querySelectorAll('.fade-in');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const typingText = document.querySelector('.typing-text');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

// Typing effect text options
const typingTextOptions = [
  "Project Manager",
  "Strategy Consultant",
  "Digital Transformation Expert"
];

// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
  // Initialize animations and effects
  initScrollAnimation();
  initProgressBar();
  initNavbarShrink();
  initMobileMenu();
  initDarkMode();
  
  // Initialize page-specific features
  if (typingText) {
    initTypingEffect();
  }
  
  if (filterButtons.length > 0) {
    initProjectFilter();
  }
  
  if (contactForm) {
    initContactForm();
  }
});

/**
 * Initialize scroll animation for fade-in elements
 */
function initScrollAnimation() {
  // Initial check for elements in viewport
  checkFadeElements();
  
  // Set up Intersection Observer for fade-in elements
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  // Observe all fade elements
  fadeElements.forEach(element => {
    fadeObserver.observe(element);
  });
}

/**
 * Check if fade elements are in viewport on page load
 */
function checkFadeElements() {
  fadeElements.forEach(element => {
    const position = element.getBoundingClientRect();
    
    // If element is in viewport
    if (position.top < window.innerHeight && position.bottom >= 0) {
      element.classList.add('appear');
    }
  });
}

/**
 * Initialize scroll progress bar
 */
function initProgressBar() {
  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPosition = window.scrollY;
    const scrollPercentage = (scrollPosition / windowHeight) * 100;
    
    progressBar.style.width = `${scrollPercentage}%`;
  });
}

/**
 * Initialize navbar shrink effect on scroll
 */
function initNavbarShrink() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('shrink');
    } else {
      navbar.classList.remove('shrink');
    }
  });
}

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Toggle hamburger animation
    const spans = hamburger.querySelectorAll('span');
    if (hamburger.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  });
  
  // Close mobile menu when clicking on a link
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        
        // Reset hamburger
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  });
}

/**
 * Initialize dark mode toggle
 */
function initDarkMode() {
  // Check for saved theme preference or respect OS preference
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('theme');
  
  // Apply saved theme or OS preference
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }
  
  // Toggle dark mode on button click
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
      darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      localStorage.setItem('theme', 'light');
      darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  });
}

/**
 * Initialize typing effect for hero section
 */
function initTypingEffect() {
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;
  
  function type() {
    const currentText = typingTextOptions[textIndex];
    
    if (isDeleting) {
      // Deleting text
      typingText.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50; // Faster when deleting
    } else {
      // Typing text
      typingText.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100; // Normal speed when typing
    }
    
    // If word is complete
    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      typingSpeed = 1000; // Pause at the end of word
    } 
    // If deletion is complete
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % typingTextOptions.length; // Move to next text
      typingSpeed = 500; // Pause before starting new word
    }
    
    setTimeout(type, typingSpeed);
  }
  
  // Start the typing effect
  setTimeout(type, 1000);
}

/**
 * Initialize project filtering functionality
 */
function initProjectFilter() {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      const filterValue = button.getAttribute('data-filter');
      
      // Filter projects
      projectCards.forEach(card => {
        if (filterValue === 'all') {
          card.style.display = 'block';
        } else {
          const tags = card.getAttribute('data-tags');
          if (tags && tags.includes(filterValue)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        }
      });
    });
  });
}

/**
 * Initialize contact form functionality
 */
function initContactForm() {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form elements
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    
    // Disable submit button and show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    submitButton.style.opacity = '0.7';
    
    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name').trim();
    const email = formData.get('email').trim();
    const message = formData.get('message').trim();
    
    // Basic validation
    if (!name || !email || !message) {
      showFormStatus('Please fill in all fields', 'error');
      resetSubmitButton(submitButton, originalButtonText);
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFormStatus('Please enter a valid email address', 'error');
      resetSubmitButton(submitButton, originalButtonText);
      return;
    }
    
    // Name validation (letters and spaces only)
    const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
    if (!nameRegex.test(name)) {
      showFormStatus('Name can only contain letters, spaces, hyphens, apostrophes, and periods', 'error');
      resetSubmitButton(submitButton, originalButtonText);
      return;
    }
    
    // Message length validation
    if (message.length < 10) {
      showFormStatus('Message must be at least 10 characters long', 'error');
      resetSubmitButton(submitButton, originalButtonText);
      return;
    }
    
    if (message.length > 2000) {
      showFormStatus('Message must be less than 2000 characters', 'error');
      resetSubmitButton(submitButton, originalButtonText);
      return;
    }
    
    try {
      // Submit form to backend API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        showFormStatus(data.message || 'Thank you! Your message has been sent successfully.', 'success');
        contactForm.reset();
      } else {
        // Handle validation errors
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map(error => 
            typeof error === 'string' ? error : error.message
          ).join(', ');
          showFormStatus(errorMessages, 'error');
        } else {
          showFormStatus(data.message || 'Something went wrong. Please try again.', 'error');
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showFormStatus('Network error. Please check your connection and try again.', 'error');
    } finally {
      // Re-enable submit button
      resetSubmitButton(submitButton, originalButtonText);
    }
  });
}

/**
 * Reset submit button to original state
 */
function resetSubmitButton(button, originalText) {
  button.disabled = false;
  button.textContent = originalText;
  button.style.opacity = '1';
}

/**
 * Show form status message
 * @param {string} message - Status message to display
 * @param {string} type - Message type ('success' or 'error')
 */
function showFormStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
  formStatus.style.display = 'block';
  
  // Add visual styling based on type
  if (type === 'success') {
    formStatus.style.color = '#28a745';
    formStatus.style.backgroundColor = '#d4edda';
    formStatus.style.border = '1px solid #c3e6cb';
    formStatus.style.padding = '12px';
    formStatus.style.borderRadius = '4px';
    formStatus.style.marginTop = '10px';
  } else if (type === 'error') {
    formStatus.style.color = '#dc3545';
    formStatus.style.backgroundColor = '#f8d7da';
    formStatus.style.border = '1px solid #f5c6cb';
    formStatus.style.padding = '12px';
    formStatus.style.borderRadius = '4px';
    formStatus.style.marginTop = '10px';
  }
  
  // Scroll to form status if it's not visible
  formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  // Hide status message after 8 seconds for success, 10 seconds for errors
  const hideDelay = type === 'success' ? 8000 : 10000;
  setTimeout(() => {
    formStatus.style.display = 'none';
    formStatus.className = '';
    formStatus.style.cssText = '';
  }, hideDelay);
}
