// FormSubmit handles email delivery for both static hosting targets.
async function submitEnquiry(endpoint, payload, fetcher = fetch) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetcher(endpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    const result = await response.json();
    if (!response.ok || (result.success !== true && result.success !== 'true')) {
      throw new Error('The form service did not accept this enquiry.');
    }
    return result;
  } finally {
    clearTimeout(timeout);
  }
}

function enquiryEmail(payload) {
  const subject = `Project enquiry: ${payload.company}`;
  const body = [
    `Name: ${payload.name}`, `Email: ${payload.email}`, `Company / project: ${payload.company}`,
    `Website: ${payload.website || 'Not provided'}`, `Interested in: ${payload.services || 'See project details'}`,
    '', payload.message, '', `Timeline: ${payload.timeline || 'Not specified'}`, `Budget: ${payload.budget || 'Not specified'}`
  ].join('\n');
  return `mailto:edakturk19@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

if (typeof module !== 'undefined') module.exports = {submitEnquiry, enquiryEmail};

if (typeof document !== 'undefined') (() => {
  const form = document.getElementById('project-form');
  if (!form) return;
  const fields = form.querySelector('.intake-fields');
  const button = form.querySelector('.enquiry-submit');
  const status = form.querySelector('.form-status');
  const recovery = form.querySelector('.form-recovery');
  const fallback = form.querySelector('.enquiry-email-fallback');
  const website = form.elements.website;
  let sending = false;
  function normalizeWebsite() {
    const value = website.value.trim();
    if (value && !/^[a-z][a-z\d+.-]*:/i.test(value)) website.value = `https://${value}`;
  }
  website.addEventListener('blur', normalizeWebsite);
  form.addEventListener('submit', async event => {
    event.preventDefault();
    normalizeWebsite();
    if (sending || !form.reportValidity() || form.elements._honey.value) return;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    payload.services = data.getAll('services').join(', ');
    payload._url = location.origin + location.pathname;
    payload._subject = `Project enquiry: ${payload.company}`;
    for (const key of Object.keys(payload)) payload[key] = payload[key].trim();
    if (!payload.name || !payload.company || payload.message.length < 10) {
      status.textContent = 'Please add your name, company, and a little more detail about the project.';
      status.hidden = false;
      status.focus();
      return;
    }
    sending = true;
    fields.disabled = true;
    form.setAttribute('aria-busy', 'true');
    button.textContent = 'Sending…';
    status.hidden = true;
    recovery.hidden = true;
    fallback.href = enquiryEmail(payload);
    try {
      await submitEnquiry(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), payload);
      fields.hidden = true;
      status.dataset.state = 'success';
      status.textContent = 'Thank you. Your enquiry has been submitted.';
    } catch {
      status.dataset.state = 'error';
      status.textContent = 'Your submission could not be confirmed.';
      recovery.hidden = false;
    } finally {
      sending = false;
      fields.disabled = false;
      form.removeAttribute('aria-busy');
      button.textContent = 'Send enquiry';
      status.hidden = false;
      status.focus();
    }
  });
})();
