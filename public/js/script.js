import Swiper from '/node_modules/swiper/swiper-bundle.esm.js';
import '/node_modules/swiper/swiper-bundle.css';

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const body = document.body;

function toggleMenu() {
  menuBtn.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  body.classList.toggle('menu-open');
}

function closeMenu() {
  menuBtn.classList.remove('active');
  mobileMenu.classList.remove('active');
  body.classList.remove('menu-open');
}

menuBtn.addEventListener('click', toggleMenu);

const menuItems = mobileMenu.querySelectorAll('a');
menuItems.forEach((item) => {
  item.addEventListener('click', closeMenu);
});

document.addEventListener('click', (e) => {
  if (
    mobileMenu.classList.contains('active') &&
    !mobileMenu.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {
    closeMenu();
  }
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      const headerOffset = 100;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  });
});

document.querySelectorAll('section[id]').forEach((section) => {
  section.style.scrollMarginTop = '100px';
});

const swiper = new Swiper('.swiper', {
  modules: [Pagination],
  slidesPerView: 1,
  slidesPerGroup: 1,
  spaceBetween: 30,
  loop: true,
  breakpoints: {
    768: {
      slidesPerView: 2,
      slidesPerGroup: 2,
    },
    1024: {
      slidesPerView: 3,
      slidesPerGroup: 3,
    },
  },

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '"></span>';
    },
  },
});

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitButton = contactForm.querySelector('button[type="submit"]');
const submitText = submitButton.querySelector('.submit-text');
const loadingSpinner = submitButton.querySelector('.loading-spinner');

function showError(input, message) {
  const errorElement = input.parentElement.querySelector('.error-message');
  input.classList.add('border-red-500');
  errorElement.textContent = message;
  errorElement.classList.remove('opacity-0');
}

function clearError(input) {
  const errorElement = input.parentElement.querySelector('.error-message');
  input.classList.remove('border-red-500');
  errorElement.textContent = '';
  errorElement.classList.add('opacity-0');
}

function showFormMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.classList.remove('opacity-0');
  formMessage.classList.remove('text-green-500', 'text-red-500');
  formMessage.classList.add(isError ? 'text-red-500' : 'text-green-500');
}

function setLoading(isLoading) {
  submitButton.disabled = isLoading;
  submitText.classList.toggle('hidden', isLoading);
  loadingSpinner.classList.toggle('hidden', !isLoading);
}

function validateForm(data) {
  const errors = {};

  // Full Name validation
  if (!data.fullName || data.fullName.trim() === '') {
    errors.fullName = 'Please enter your full name';
  }

  // Email validation
  if (!data.email || data.email.trim() === '') {
    errors.email = 'Please enter your email address';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Telephone validation
  if (!data.telephone || data.telephone.trim() === '') {
    errors.telephone = 'Please enter your telephone number';
  } else if (!/^[0-9+\-\s()]*$/.test(data.telephone)) {
    errors.telephone = 'Please enter a valid telephone number';
  }

  return errors;
}

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Clear previous errors
  contactForm.querySelectorAll('.error-message').forEach((error) => {
    error.classList.add('opacity-0');
  });
  contactForm.querySelectorAll('input, textarea').forEach((input) => {
    input.classList.remove('border-red-500');
  });

  const formData = new FormData(contactForm);
  const data = Object.fromEntries(formData.entries());

  // Client-side validation
  const errors = validateForm(data);
  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([field, message]) => {
      const input = contactForm.querySelector(`[name="${field}"]`);
      if (input) showError(input, message);
    });
    showFormMessage('Please fill in all required fields correctly.', true);
    return;
  }

  setLoading(true);

  try {
    const response = await fetch('/form-handler.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      showFormMessage(result.message);
      contactForm.reset();
    } else {
      if (result.errors) {
        Object.entries(result.errors).forEach(([field, message]) => {
          const input = contactForm.querySelector(`[name="${field}"]`);
          if (input) showError(input, message);
        });
      }
      showFormMessage(result.message || 'Please check the form for errors.', true);
    }
  } catch (error) {
    console.error('Form submission error:', error);
    showFormMessage('An error occurred. Please try again later.', true);
  } finally {
    setLoading(false);
  }
});

contactForm.querySelectorAll('input, textarea').forEach((input) => {
  input.addEventListener('input', () => clearError(input));
});
