// ============================================
// CONTACT PAGE - Form Handling with Web3Forms
// ============================================

/**
 * Contact Manager
 * Handles contact form submission and validation using Web3Forms
 */
class ContactManager {
  constructor() {
    this.form = document.getElementById("contactForm");
    this.formMessage = document.getElementById("formMessage");

    // Web3Forms Configuration
    this.web3formsConfig = {
      accessKey: "ee846ef7-6f82-4505-b571-d00cc89ea215",
      endpoint: "https://api.web3forms.com/submit"
    };

    this.isSubmitting = false;
    this.init();
  }

  /**
   * Initialize the contact manager
   */
  init() {
    if (!this.form) return;

    // Handle form submission
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Add input validation
    const inputs = this.form.querySelectorAll(".form-input, .form-textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => this.clearFieldError(input));
    });
  }

  /**
   * Handle form submission
   */
  async handleSubmit() {
    // Prevent multiple submissions
    if (this.isSubmitting) {
      return;
    }

    // Get form data
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);

    // Validate all fields
    if (!this.validateForm()) {
      this.showMessage(
        "Please fill in all required fields correctly.",
        "error"
      );
      return;
    }

    this.isSubmitting = true;

    // Show loading state
    const submitButton = this.form.querySelector('button[type="submit"]');
    if (!submitButton) {
      this.isSubmitting = false;
      return;
    }

    const originalText = submitButton.innerHTML;
    const originalHeight = submitButton.offsetHeight;
    const originalWidth = submitButton.offsetWidth;

    submitButton.disabled = true;
    submitButton.style.minHeight = originalHeight + "px";
    submitButton.style.height = originalHeight + "px";
    submitButton.style.width = originalWidth + "px";
    submitButton.innerHTML = "Sending...";

    try {
      // Send email via Web3Forms
      await this.sendEmail(data);

      // Success
      this.showMessage(
        "Thank you! Your message has been sent successfully.",
        "success"
      );
      this.form.reset();
      
      // Clear any field errors
      this.form.querySelectorAll('.field-error').forEach(error => {
        error.remove();
      });
    } catch (error) {
      // Error
      this.showMessage(
        "Oops! Something went wrong. Please try again later.",
        "error"
      );
      console.error("Form submission error:", error);
    } finally {
      // Reset button
      submitButton.disabled = false;
      submitButton.innerHTML = originalText;
      submitButton.style.minHeight = "";
      submitButton.style.height = "";
      submitButton.style.width = "";
      this.isSubmitting = false;
    }
  }

  /**
   * Send email via Web3Forms API
   * @param {Object} data - Form data
   */
  async sendEmail(data) {
    // Prepare form data for Web3Forms
    const formData = new FormData();
    
    // Add access key
    formData.append('access_key', this.web3formsConfig.accessKey);
    
    // Add form fields
    formData.append('name', data.name || '');
    formData.append('email', data.email || '');
    formData.append('subject', data.subject || 'New Contact Form Submission');
    formData.append('message', data.message || '');
    
    // Add bot check (hidden field)
    formData.append('botcheck', '');
    
    // Add from name for better email formatting
    formData.append('from_name', data.name || 'Portfolio Visitor');

    try {
      // Send email using Web3Forms API
      const response = await fetch(this.web3formsConfig.endpoint, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to send message');
      }

      return result;
    } catch (error) {
      console.error("Web3Forms Error:", error);
      throw error;
    }
  }

  /**
   * Validate the entire form
   * @returns {boolean} - True if form is valid
   */
  validateForm() {
    const inputs = this.form.querySelectorAll(
      ".form-input[required], .form-textarea[required]"
    );
    let isValid = true;

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Validate a single form field
   * @param {HTMLElement} field - The field to validate
   * @returns {boolean} - True if valid
   */
  validateField(field) {
    if (!field) return false;

    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = "";

    // Check if empty
    if (field.hasAttribute("required") && !value) {
      isValid = false;
      errorMessage = "This field is required";
    }
    // Validate email
    else if (type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = "Please enter a valid email address";
      }
    }
    // Validate minimum length
    else if (field.hasAttribute("minlength")) {
      const minLength = parseInt(field.getAttribute("minlength"), 10);
      if (!isNaN(minLength) && value.length < minLength) {
        isValid = false;
        errorMessage = `Minimum ${minLength} characters required`;
      }
    }
    // Validate maximum length
    else if (field.hasAttribute("maxlength")) {
      const maxLength = parseInt(field.getAttribute("maxlength"), 10);
      if (!isNaN(maxLength) && value.length > maxLength) {
        isValid = false;
        errorMessage = `Maximum ${maxLength} characters allowed`;
      }
    }

    // Update field styling
    if (!isValid) {
      this.showFieldError(field, errorMessage);
    } else {
      this.clearFieldError(field);
    }

    return isValid;
  }

  /**
   * Show field error message
   * @param {HTMLElement} field - The field with error
   * @param {string} message - Error message
   */
  showFieldError(field, message) {
    field.style.borderColor = "#ef4444";

    // Remove existing error message
    const existingError = field.parentElement.querySelector(".field-error");
    if (existingError) {
      existingError.remove();
    }

    // Add error message
    const errorElement = document.createElement("span");
    errorElement.className = "field-error";
    errorElement.style.color = "#ef4444";
    errorElement.style.fontSize = "0.875rem";
    errorElement.style.marginTop = "0.25rem";
    errorElement.style.display = "block";
    errorElement.textContent = message;
    field.parentElement.appendChild(errorElement);
  }

  /**
   * Clear field error
   * @param {HTMLElement} field - The field to clear
   */
  clearFieldError(field) {
    field.style.borderColor = "";
    const errorElement = field.parentElement.querySelector(".field-error");
    if (errorElement) {
      errorElement.remove();
    }
  }

  /**
   * Show form message (success/error)
   * @param {string} message - Message to display
   * @param {string} type - Message type (success/error)
   */
  showMessage(message, type) {
    if (!this.formMessage) return;

    this.formMessage.textContent = message;
    this.formMessage.className = `form-message ${type}`;

    // Auto hide after 5 seconds
    setTimeout(() => {
      this.formMessage.className = "form-message";
    }, 5000);
  }
}

// Initialize contact manager
document.addEventListener("DOMContentLoaded", () => {
  new ContactManager();
});
