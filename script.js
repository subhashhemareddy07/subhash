document.addEventListener('DOMContentLoaded', () => {
  const yearTarget = document.querySelector('[data-year]');
  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }

  const registrationForm = document.querySelector('#registration-form');
  const registrationStatus = document.querySelector('#registration-status');
  if (
    registrationForm instanceof HTMLFormElement &&
    registrationStatus instanceof HTMLElement
  ) {
    const password = registrationForm.elements.namedItem('password');
    const confirmPassword = registrationForm.elements.namedItem('confirmPassword');

    if (password instanceof HTMLInputElement && confirmPassword instanceof HTMLInputElement) {
      const validatePasswords = () => {
        confirmPassword.setCustomValidity(
          confirmPassword.value && confirmPassword.value !== password.value
            ? 'Passwords do not match.'
            : '',
        );
      };

      password.addEventListener('input', validatePasswords);
      confirmPassword.addEventListener('input', validatePasswords);

      registrationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        validatePasswords();
        if (!registrationForm.reportValidity()) {
          return;
        }

        registrationStatus.textContent =
          'Form looks good. No account was created because this demo has no registration server.';
        registrationForm.reset();
      });
    }
  }

  const contactForm = document.querySelector('#contact-form');
  const formStatus = document.querySelector('#form-status');
  if (!(contactForm instanceof HTMLFormElement) || !(formStatus instanceof HTMLElement)) {
    return;
  }

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const submission = {
      name: String(formData.get('name')).trim(),
      email: String(formData.get('email')).trim(),
      message: String(formData.get('message')).trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      const savedSubmissions = JSON.parse(localStorage.getItem('portfolio-contact-submissions') || '[]');
      if (!Array.isArray(savedSubmissions)) {
        throw new Error('Saved messages are not in the expected format.');
      }

      savedSubmissions.push(submission);
      localStorage.setItem('portfolio-contact-submissions', JSON.stringify(savedSubmissions));
      formStatus.textContent = 'Message saved in this browser only. It has not been sent to Subhash.';
      contactForm.reset();
    } catch (error) {
      console.error('Unable to save the contact message in this browser.', error);
      formStatus.textContent = 'Could not save your message in this browser. Please try again.';
    }
  });
});
