const STORAGE_KEYS = {
  user: 'stride-user',
};

const readUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const saveUser = (user) => localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
const clearUser = () => localStorage.removeItem(STORAGE_KEYS.user);

function updateLoginView() {
  const user = readUser();
  const label = document.querySelector('[data-user-label]');
  const status = document.querySelector('[data-login-status]');
  const form = document.querySelector('[data-login-form]');

  if (label) label.textContent = user ? `Witaj, ${user.name}` : 'Gość';
  if (status) {
    status.textContent = user
      ? `Jesteś zalogowany jako ${user.name} (${user.email}). Dane zapisano lokalnie.`
      : 'To tylko wirtualne logowanie zapisane lokalnie w przeglądarce.';
  }
  if (form) form.reset();
}

function initLogin() {
  const form = document.querySelector('[data-login-form]');
  if (!form) return;

  updateLoginView();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const password = String(formData.get('password') || '').trim();

    if (name.length < 2 || email.length < 3 || password.length < 4) {
      alert('Uzupełnij poprawnie formularz.');
      return;
    }

    saveUser({
      name,
      email,
      savedAt: new Date().toISOString(),
    });

    updateLoginView();
    alert(`Zalogowano jako ${name}. Sesja została zapisana w przeglądarce.`);
  });

  document.querySelector('[data-logout]')?.addEventListener('click', () => {
    clearUser();
    updateLoginView();
    alert('Wylogowano i usunięto zapis lokalny konta.');
  });
}

document.addEventListener('DOMContentLoaded', initLogin);
