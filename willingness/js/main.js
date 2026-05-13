// ============================
// 株式会社Willingness
// メインJavaScript
// ============================

document.addEventListener('DOMContentLoaded', () => {

  // ---- ハンバーガーメニュー ----
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('global-nav');

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });

  // ---- スクロールアニメーション ----
  const fadeEls = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));

  // ---- トップへ戻るボタン ----
  const backTop = document.getElementById('back-top');
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- 採用フィルター ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const prefCards = document.querySelectorAll('.pref-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const region = btn.dataset.region;
      prefCards.forEach(card => {
        card.style.display = (region === 'all' || card.dataset.region === region) ? 'block' : 'none';
      });
    });
  });

  // ---- お問い合わせフォーム ----
  const form = document.getElementById('contact-form');
  const successBox = document.getElementById('form-success');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('name');
    const nameErr = document.getElementById('name-err');
    if (!name.value.trim()) { nameErr.style.display = 'block'; valid = false; }
    else { nameErr.style.display = 'none'; }

    const email = document.getElementById('email');
    const emailErr = document.getElementById('email-err');
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      emailErr.style.display = 'block'; valid = false;
    } else { emailErr.style.display = 'none'; }

    const category = document.getElementById('category');
    const categoryErr = document.getElementById('category-err');
    if (!category.value) { categoryErr.style.display = 'block'; valid = false; }
    else { categoryErr.style.display = 'none'; }

    const message = document.getElementById('message');
    const messageErr = document.getElementById('message-err');
    if (!message.value.trim()) { messageErr.style.display = 'block'; valid = false; }
    else { messageErr.style.display = 'none'; }

    if (!valid) return;

    try {
      await fetch('tables/willingness_contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.value.trim(),
          company: document.getElementById('company').value.trim(),
          email: email.value.trim(),
          category: category.value,
          message: message.value.trim(),
        }),
      });
    } catch (_) {}

    form.style.display = 'none';
    successBox.style.display = 'block';
  });

});
