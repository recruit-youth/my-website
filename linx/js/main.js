// ============================
// LINX株式会社
// メインJavaScript
// ============================

document.addEventListener('DOMContentLoaded', () => {

  // ---- ハンバーガーメニュー ----
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('global-nav');

  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', nav.classList.contains('open'));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
    });
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
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));

  // ---- トップへ戻るボタン ----
  const backTop = document.getElementById('back-top');
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  backTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- カウントアップアニメーション ----
  const statNums = document.querySelectorAll('.stat-num');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const text = el.innerText;
      const match = text.match(/(\d+)/);
      if (!match) return;
      const target = parseInt(match[1]);
      const suffix = text.replace(/[\d]+/, '');
      let current = 0;
      const step = Math.ceil(target / 50);
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.innerHTML = current + suffix;
        if (current >= target) clearInterval(timer);
      }, 30);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => countObserver.observe(el));

  // ---- お問い合わせフォーム ----
  const form = document.getElementById('contact-form');
  const successBox = document.getElementById('form-success');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    // 名前
    const name = document.getElementById('name');
    const nameErr = document.getElementById('name-err');
    if (!name.value.trim()) {
      nameErr.style.display = 'block';
      valid = false;
    } else {
      nameErr.style.display = 'none';
    }

    // メール
    const email = document.getElementById('email');
    const emailErr = document.getElementById('email-err');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
      emailErr.style.display = 'block';
      valid = false;
    } else {
      emailErr.style.display = 'none';
    }

    // 種別
    const category = document.getElementById('category');
    const categoryErr = document.getElementById('category-err');
    if (!category.value) {
      categoryErr.style.display = 'block';
      valid = false;
    } else {
      categoryErr.style.display = 'none';
    }

    // メッセージ
    const message = document.getElementById('message');
    const messageErr = document.getElementById('message-err');
    if (!message.value.trim()) {
      messageErr.style.display = 'block';
      valid = false;
    } else {
      messageErr.style.display = 'none';
    }

    if (!valid) return;

    // データ保存
    try {
      const data = {
        name: name.value.trim(),
        company: document.getElementById('company').value.trim(),
        email: email.value.trim(),
        category: category.value,
        message: message.value.trim(),
      };
      await fetch('../tables/linx_contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (_) {}

    form.style.display = 'none';
    successBox.style.display = 'block';
  });

});
