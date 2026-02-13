// Student Registration Form - JavaScript
// Author: Claude
// Description: Comprehensive form validation and interaction logic

// ==================== INITIALIZATION ====================

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeForm);
} else {
    // DOM is already loaded
    initializeForm();
}

function initializeForm() {
    console.log('Initializing form...');
    setupCharacterCounter();
    setupPhoneFormatting();
    setupRealtimeValidation();
    setupFormSubmission();
    setupInputErrorRemoval();
    console.log('Form initialization complete');
}

// ==================== CHARACTER COUNTER ====================

function setupCharacterCounter() {
    const commentsField = document.getElementById('comments');
    const charCount = document.getElementById('charCount');

    if (commentsField && charCount) {
        commentsField.addEventListener('input', function() {
            charCount.textContent = this.value.length;
        });
    }
}

// ==================== PHONE NUMBER FORMATTING ====================

function formatPhoneNumber(value) {
    // Remove all non-digit characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format based on length
    if (phoneNumber.length <= 3) {
        return phoneNumber;
    } else if (phoneNumber.length <= 6) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
}

function setupPhoneFormatting() {
    const phoneField = document.getElementById('phone');
    const emergencyPhoneField = document.getElementById('emergencyPhone');

    if (phoneField) {
        phoneField.addEventListener('input', function(e) {
            this.value = formatPhoneNumber(this.value);
        });
    }

    if (emergencyPhoneField) {
        emergencyPhoneField.addEventListener('input', function(e) {
            this.value = formatPhoneNumber(this.value);
        });
    }
}

// ==================== VALIDATION FUNCTIONS ====================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^\(\d{3}\)\s\d{3}-\d{4}$/;
    return phoneRegex.test(phone);
}

function isValidZipCode(zip) {
    const usZipRegex = /^\d{5}(-\d{4})?$/;
    const canadaZipRegex = /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/;
    const genericZipRegex = /^[A-Za-z0-9\s-]{3,10}$/;
    
    return usZipRegex.test(zip) || canadaZipRegex.test(zip) || genericZipRegex.test(zip);
}

function isValidGPA(gpa) {
    const gpaValue = parseFloat(gpa);
    return !isNaN(gpaValue) && gpaValue >= 0 && gpaValue <= 4;
}

function isValidDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        return false;
    }
    
    // Calculate age
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();
    
    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        actualAge--;
    }
    
    // Check if date is in future or age is unreasonable
    if (date > today || actualAge < 5 || actualAge > 100) {
        return false;
    }
    
    return true;
}

function isValidName(name) {
    // Name should contain only letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    return nameRegex.test(name) && name.trim().length >= 2;
}

// ==================== ERROR DISPLAY ====================

function showError(fieldId, errorId, isValid, customMessage = null) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    
    if (!field || !error) {
        console.warn(`Field or error element not found: ${fieldId}, ${errorId}`);
        return true;
    }
    
    if (!isValid) {
        field.classList.add('error');
        error.classList.add('show');
        if (customMessage) {
            error.textContent = customMessage;
        }
        return false;
    } else {
        field.classList.remove('error');
        error.classList.remove('show');
        return true;
    }
}

function clearError(fieldId, errorId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    
    if (field) {
        field.classList.remove('error');
    }
    if (error) {
        error.classList.remove('show');
    }
}

// ==================== REAL-TIME VALIDATION ====================

function setupRealtimeValidation() {
    // Email validation - immediate feedback
    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('input', function() {
            if (this.value.trim() !== '') {
                const valid = isValidEmail(this.value);
                showError('email', 'emailError', valid);
            } else {
                clearError('email', 'emailError');
            }
        });
        
        emailField.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                const valid = isValidEmail(this.value);
                showError('email', 'emailError', valid);
            }
        });
    }

    // Phone validation - immediate feedback with formatting
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', function() {
            // Check if we have enough digits to validate
            const digitsOnly = this.value.replace(/\D/g, '');
            if (digitsOnly.length >= 10) {
                const valid = isValidPhone(this.value);
                showError('phone', 'phoneError', valid);
            } else if (digitsOnly.length > 0) {
                // Clear error while typing
                clearError('phone', 'phoneError');
            }
        });
        
        phoneField.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                const valid = isValidPhone(this.value);
                showError('phone', 'phoneError', valid);
            }
        });
    }

    // Emergency phone validation - immediate feedback
    const emergencyPhoneField = document.getElementById('emergencyPhone');
    if (emergencyPhoneField) {
        emergencyPhoneField.addEventListener('input', function() {
            const digitsOnly = this.value.replace(/\D/g, '');
            if (digitsOnly.length >= 10) {
                const valid = isValidPhone(this.value);
                showError('emergencyPhone', 'emergencyPhoneError', valid);
            } else if (digitsOnly.length > 0) {
                clearError('emergencyPhone', 'emergencyPhoneError');
            }
        });
        
        emergencyPhoneField.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                const valid = isValidPhone(this.value);
                showError('emergencyPhone', 'emergencyPhoneError', valid);
            }
        });
    }

    // ZIP code validation - immediate feedback
    const zipCodeField = document.getElementById('zipCode');
    if (zipCodeField) {
        zipCodeField.addEventListener('input', function() {
            if (this.value.trim().length >= 3) {
                const valid = isValidZipCode(this.value);
                showError('zipCode', 'zipCodeError', valid);
            } else {
                clearError('zipCode', 'zipCodeError');
            }
        });
        
        zipCodeField.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                const valid = isValidZipCode(this.value);
                showError('zipCode', 'zipCodeError', valid);
            }
        });
    }

    // GPA validation - immediate feedback
    const gpaField = document.getElementById('gpa');
    if (gpaField) {
        gpaField.addEventListener('input', function() {
            if (this.value !== '') {
                const valid = isValidGPA(this.value);
                showError('gpa', 'gpaError', valid);
            } else {
                clearError('gpa', 'gpaError');
            }
        });
        
        gpaField.addEventListener('blur', function() {
            if (this.value !== '') {
                const valid = isValidGPA(this.value);
                showError('gpa', 'gpaError', valid);
            }
        });
    }

    // First name validation - immediate feedback
    const firstNameField = document.getElementById('firstName');
    if (firstNameField) {
        firstNameField.addEventListener('input', function() {
            if (this.value.trim().length >= 2) {
                const valid = isValidName(this.value);
                showError('firstName', 'firstNameError', valid, 
                    valid ? null : 'Please enter a valid name (letters only)');
            } else {
                clearError('firstName', 'firstNameError');
            }
        });
        
        firstNameField.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                const valid = isValidName(this.value);
                showError('firstName', 'firstNameError', valid, 
                    valid ? null : 'Please enter a valid name (letters only)');
            }
        });
    }

    // Last name validation - immediate feedback
    const lastNameField = document.getElementById('lastName');
    if (lastNameField) {
        lastNameField.addEventListener('input', function() {
            if (this.value.trim().length >= 2) {
                const valid = isValidName(this.value);
                showError('lastName', 'lastNameError', valid,
                    valid ? null : 'Please enter a valid name (letters only)');
            } else {
                clearError('lastName', 'lastNameError');
            }
        });
        
        lastNameField.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                const valid = isValidName(this.value);
                showError('lastName', 'lastNameError', valid,
                    valid ? null : 'Please enter a valid name (letters only)');
            }
        });
    }

    // Date of birth validation - immediate feedback
    const dobField = document.getElementById('dob');
    if (dobField) {
        dobField.addEventListener('change', function() {
            if (this.value !== '') {
                const valid = isValidDate(this.value);
                showError('dob', 'dobError', valid, 
                    valid ? null : 'Please enter a valid date (age 5-100)');
            }
        });
        
        dobField.addEventListener('blur', function() {
            if (this.value !== '') {
                const valid = isValidDate(this.value);
                showError('dob', 'dobError', valid, 
                    valid ? null : 'Please enter a valid date (age 5-100)');
            }
        });
    }

    // Required field validation on blur
    const requiredTextFields = [
        'firstName', 'lastName', 'email', 'phone', 'dob',
        'program', 'address', 'city', 'state', 'zipCode',
        'emergencyName', 'emergencyRelation', 'emergencyPhone'
    ];

    requiredTextFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', function() {
                if (this.value.trim() === '' && this.hasAttribute('required')) {
                    showError(fieldId, fieldId + 'Error', false);
                }
            });
        }
    });

    // Required select fields
    const requiredSelectFields = ['grade', 'country'];
    requiredSelectFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('change', function() {
                if (this.value === '') {
                    showError(fieldId, fieldId + 'Error', false);
                } else {
                    clearError(fieldId, fieldId + 'Error');
                }
            });
            
            field.addEventListener('blur', function() {
                if (this.value === '' && this.hasAttribute('required')) {
                    showError(fieldId, fieldId + 'Error', false);
                }
            });
        }
    });
}

// ==================== FORM VALIDATION ====================

function validateRequiredFields() {
    let isValid = true;
    
    const requiredFields = [
        'firstName', 'lastName', 'email', 'phone', 'dob',
        'grade', 'program', 'address', 'city', 'state', 
        'zipCode', 'country', 'emergencyName', 'emergencyRelation', 'emergencyPhone'
    ];

    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        const errorElement = document.getElementById(field + 'Error');
        
        if (element && element.value.trim() === '') {
            isValid = false;
            showError(field, field + 'Error', false);
        }
    });

    return isValid;
}

function validateEmail() {
    const email = document.getElementById('email');
    if (email && email.value.trim() !== '') {
        return showError('email', 'emailError', isValidEmail(email.value));
    }
    return true;
}

function validatePhoneNumbers() {
    let isValid = true;
    
    const phone = document.getElementById('phone');
    if (phone && phone.value.trim() !== '') {
        if (!showError('phone', 'phoneError', isValidPhone(phone.value))) {
            isValid = false;
        }
    }

    const emergencyPhone = document.getElementById('emergencyPhone');
    if (emergencyPhone && emergencyPhone.value.trim() !== '') {
        if (!showError('emergencyPhone', 'emergencyPhoneError', isValidPhone(emergencyPhone.value))) {
            isValid = false;
        }
    }

    return isValid;
}

function validateZipCode() {
    const zipCode = document.getElementById('zipCode');
    if (zipCode && zipCode.value.trim() !== '') {
        return showError('zipCode', 'zipCodeError', isValidZipCode(zipCode.value));
    }
    return true;
}

function validateGPA() {
    const gpa = document.getElementById('gpa');
    if (gpa && gpa.value !== '') {
        return showError('gpa', 'gpaError', isValidGPA(gpa.value));
    }
    return true;
}

function validateNames() {
    let isValid = true;
    
    const firstName = document.getElementById('firstName');
    if (firstName && firstName.value.trim() !== '') {
        if (!showError('firstName', 'firstNameError', isValidName(firstName.value),
            isValidName(firstName.value) ? null : 'Please enter a valid name (letters only)')) {
            isValid = false;
        }
    }

    const lastName = document.getElementById('lastName');
    if (lastName && lastName.value.trim() !== '') {
        if (!showError('lastName', 'lastNameError', isValidName(lastName.value),
            isValidName(lastName.value) ? null : 'Please enter a valid name (letters only)')) {
            isValid = false;
        }
    }

    return isValid;
}

function validateGender() {
    const genderSelected = document.querySelector('input[name="gender"]:checked');
    const genderError = document.getElementById('genderError');
    
    if (!genderSelected) {
        if (genderError) {
            genderError.classList.add('show');
        }
        return false;
    } else {
        if (genderError) {
            genderError.classList.remove('show');
        }
        return true;
    }
}

function validateDateOfBirth() {
    const dob = document.getElementById('dob');
    if (dob && dob.value !== '') {
        const isValid = isValidDate(dob.value);
        return showError('dob', 'dobError', isValid,
            isValid ? null : 'Please enter a valid date (age 5-100)');
    }
    return false;
}

function validateTerms() {
    const terms = document.getElementById('terms');
    if (terms) {
        return showError('terms', 'termsError', terms.checked);
    }
    return false;
}

// ==================== FORM SUBMISSION ====================

function setupFormSubmission() {
    const form = document.getElementById('registrationForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    let isValid = true;

    // Run all validations
    if (!validateRequiredFields()) isValid = false;
    if (!validateEmail()) isValid = false;
    if (!validatePhoneNumbers()) isValid = false;
    if (!validateZipCode()) isValid = false;
    if (!validateGPA()) isValid = false;
    if (!validateNames()) isValid = false;
    if (!validateGender()) isValid = false;
    if (!validateDateOfBirth()) isValid = false;
    if (!validateTerms()) isValid = false;

    if (isValid) {
        submitForm(this);
    } else {
        scrollToFirstError();
    }
}

function submitForm(form) {
    // Collect form data
    const formData = new FormData(form);
    const data = {};
    
    // Process form data
    formData.forEach((value, key) => {
        if (key === 'activities') {
            if (!data[key]) {
                data[key] = [];
            }
            data[key].push(value);
        } else {
            data[key] = value;
        }
    });

    // Log the data (in production, this would be sent to a server)
    console.log('Form submitted successfully:', data);
    console.log('Submission timestamp:', new Date().toISOString());
    
    // Store in localStorage for demo purposes
    try {
        localStorage.setItem('lastRegistration', JSON.stringify(data));
        localStorage.setItem('registrationTimestamp', new Date().toISOString());
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
    
    // Show success message
    showSuccessMessage();
}

function showSuccessMessage() {
    const form = document.getElementById('registrationForm');
    const header = document.querySelector('.header');
    const successMessage = document.getElementById('successMessage');
    
    if (form) form.style.display = 'none';
    if (header) header.style.display = 'none';
    if (successMessage) successMessage.classList.add('show');
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToFirstError() {
    const firstError = document.querySelector('.error');
    if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// ==================== CLEAR FORM ====================

function setupClearForm() {
    // This function is called from the HTML button's onclick attribute
    // but we can also add keyboard shortcuts if needed
}

function clearForm() {
    const form = document.getElementById('registrationForm');
    
    if (confirm('Are you sure you want to clear all fields?')) {
        if (form) {
            form.reset();
        }
        
        // Remove all error classes and messages
        document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
        
        // Reset character count
        const charCount = document.getElementById('charCount');
        if (charCount) {
            charCount.textContent = '0';
        }
    }
}

// ==================== SUBMIT ANOTHER ====================

function submitAnother() {
    const form = document.getElementById('registrationForm');
    const header = document.querySelector('.header');
    const successMessage = document.getElementById('successMessage');
    
    if (form) form.style.display = 'block';
    if (header) header.style.display = 'block';
    if (successMessage) successMessage.classList.remove('show');
    
    clearFormWithoutConfirmation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function clearFormWithoutConfirmation() {
    const form = document.getElementById('registrationForm');
    
    if (form) {
        form.reset();
    }
    
    // Remove all error classes and messages
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('.error-message').forEach(el => el.classList.remove('show'));
    
    // Reset character count
    const charCount = document.getElementById('charCount');
    if (charCount) {
        charCount.textContent = '0';
    }
}

// ==================== ERROR REMOVAL ON INPUT ====================

function setupInputErrorRemoval() {
    // Special handling for radio buttons
    document.querySelectorAll('input[type="radio"][name="gender"]').forEach(element => {
        element.addEventListener('change', function() {
            const errorElement = document.getElementById('genderError');
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        });
    });

    // Special handling for terms checkbox
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', function() {
            const errorElement = document.getElementById('termsError');
            if (errorElement) {
                if (this.checked) {
                    clearError('terms', 'termsError');
                } else {
                    showError('terms', 'termsError', false);
                }
            }
        });
    }
}

// ==================== UTILITY FUNCTIONS ====================

function getFormData() {
    const form = document.getElementById('registrationForm');
    if (!form) return null;
    
    const formData = new FormData(form);
    const data = {};
    
    formData.forEach((value, key) => {
        if (key === 'activities') {
            if (!data[key]) {
                data[key] = [];
            }
            data[key].push(value);
        } else {
            data[key] = value;
        }
    });
    
    return data;
}

function loadFormData(data) {
    if (!data) return;
    
    Object.keys(data).forEach(key => {
        const element = document.getElementById(key);
        
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = data[key];
            } else if (element.type === 'radio') {
                const radio = document.querySelector(`input[name="${key}"][value="${data[key]}"]`);
                if (radio) radio.checked = true;
            } else {
                element.value = data[key];
            }
        }
    });
}

function printFormData() {
    const data = getFormData();
    console.log('Current Form Data:', data);
    return data;
}

// ==================== EXPORT FUNCTIONS ====================
// Make functions available globally if needed

if (typeof window !== 'undefined') {
    window.clearForm = clearForm;
    window.submitAnother = submitAnother;
    window.getFormData = getFormData;
    window.loadFormData = loadFormData;
    window.printFormData = printFormData;
}

// ==================== KEYBOARD SHORTCUTS ====================

document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        const form = document.getElementById('registrationForm');
        if (form && form.style.display !== 'none') {
            e.preventDefault();
            form.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to clear focus from current input
    if (e.key === 'Escape') {
        if (document.activeElement) {
            document.activeElement.blur();
        }
    }
});

// ==================== AUTO-SAVE (OPTIONAL) ====================

let autoSaveTimeout;

function enableAutoSave() {
    document.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(() => {
                const data = getFormData();
                try {
                    localStorage.setItem('formDraft', JSON.stringify(data));
                    console.log('Form auto-saved');
                } catch (e) {
                    console.warn('Auto-save failed:', e);
                }
            }, 2000); // Save after 2 seconds of inactivity
        });
    });
}

function loadAutoSavedData() {
    try {
        const savedData = localStorage.getItem('formDraft');
        if (savedData) {
            const data = JSON.parse(savedData);
            if (confirm('Would you like to restore your previously saved form data?')) {
                loadFormData(data);
            }
        }
    } catch (e) {
        console.warn('Could not load auto-saved data:', e);
    }
}

// Uncomment to enable auto-save feature
// enableAutoSave();
// loadAutoSavedData();

console.log('Student Registration Form JavaScript loaded successfully!');