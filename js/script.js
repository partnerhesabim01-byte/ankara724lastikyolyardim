/* ====== İLETİŞİM BİLGİLERİ ======
   Telefon ve WhatsApp numarası netleşince buraya ülke koduyla girin.
   Örnek: '905321234567' (başında 0 veya + KULLANMAYIN) */
const PHONE_NUMBER = '905352546446';
const WHATSAPP_NUMBER = '905352546446';
const WHATSAPP_DEFAULT_MESSAGE = 'Merhaba, lastik hizmetleriniz hakkında bilgi almak istiyorum.';

document.addEventListener('DOMContentLoaded', () => {

  /* ===== Hızlı ara / WhatsApp linklerini bağla ===== */
  if (PHONE_NUMBER) {
    document.querySelectorAll('[data-call]').forEach(el => {
      el.setAttribute('href', `tel:+${PHONE_NUMBER}`);
    });
  }
  if (WHATSAPP_NUMBER) {
    document.querySelectorAll('[data-whatsapp]').forEach(el => {
      el.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`);
    });
  }

  /* ===== Yıl bilgisi ===== */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ===== Sesli karşılama ===== */
  const welcomeAudio = document.getElementById('welcomeAudio');
  const welcomeAudioBtn = document.getElementById('welcomeAudioBtn');
  const welcomeAudioIcon = document.getElementById('welcomeAudioIcon');

  if (welcomeAudio && welcomeAudioBtn && welcomeAudioIcon) {
    welcomeAudioBtn.addEventListener('click', () => {
      if (welcomeAudio.paused) {
        welcomeAudio.play();
        welcomeAudioIcon.textContent = '⏸';
      } else {
        welcomeAudio.pause();
        welcomeAudio.currentTime = 0;
        welcomeAudioIcon.textContent = '🔊';
      }
    });
    welcomeAudio.addEventListener('ended', () => { welcomeAudioIcon.textContent = '🔊'; });
  }

  /* ===== Mobil menü ===== */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  /* ===== Aktif menü linki (scroll takibi) ===== */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const setActiveLink = () => {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 140;
      if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
    });
  };

  /* ===== Sayaç animasyonu (istatistikler) ===== */
  const counters = document.querySelectorAll('.stat__num');
  let countersStarted = false;

  const animateCounters = () => {
    if (countersStarted) return;
    const heroStats = document.querySelector('.hero__stats');
    if (!heroStats) return;
    const rect = heroStats.getBoundingClientRect();
    if (rect.top > window.innerHeight) return;

    countersStarted = true;
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10) || 0;
      const duration = 1400;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = value.toLocaleString('tr-TR');
        if (progress < 1) requestAnimationFrame(step);
        else counter.textContent = target.toLocaleString('tr-TR');
      };
      requestAnimationFrame(step);
    });
  };

  /* ===== Geri dön butonu + header gölgesi + sayaç tetikleyici ===== */
  const backToTop = document.getElementById('backToTop');

  const onScroll = () => {
    setActiveLink();
    animateCounters();
    if (backToTop) backToTop.classList.toggle('show', window.scrollY > 500);
  };

  window.addEventListener('scroll', onScroll);
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== Müşteri yorumları slider (mobil) ===== */
  const testiTrack = document.getElementById('testiTrack');
  const testiDots = document.getElementById('testiDots');

  if (testiTrack && testiDots) {
    const cards = testiTrack.querySelectorAll('.testi-card');

    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        cards[i].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      });
      testiDots.appendChild(dot);
    });

    const dotEls = testiDots.querySelectorAll('button');

    const updateDots = () => {
      if (getComputedStyle(testiTrack).gridTemplateColumns.split(' ').length > 1) return;
      const index = Math.round(testiTrack.scrollLeft / testiTrack.clientWidth);
      dotEls.forEach((d, i) => d.classList.toggle('active', i === index));
    };

    const toggleDotsVisibility = () => {
      const isMobile = window.innerWidth <= 860;
      testiDots.style.display = isMobile ? 'flex' : 'none';
      testiTrack.style.overflowX = isMobile ? 'auto' : 'visible';
      testiTrack.style.display = isMobile ? 'flex' : 'grid';
      testiTrack.style.scrollSnapType = isMobile ? 'x mandatory' : 'none';
      cards.forEach(card => {
        card.style.scrollSnapAlign = isMobile ? 'start' : 'none';
        card.style.minWidth = isMobile ? '85%' : 'auto';
      });
    };

    testiTrack.addEventListener('scroll', updateDots);
    window.addEventListener('resize', toggleDotsVisibility);
    toggleDotsVisibility();
  }

  /* ===== İletişim formu → WhatsApp'a yönlendirme ===== */
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  if (contactForm && formNote) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.name.value.trim();
      const phone = contactForm.phone.value.trim();
      const service = contactForm.service.options[contactForm.service.selectedIndex]?.text || '';
      const message = contactForm.message.value.trim();
      const kvkkConsent = contactForm.kvkkConsent;

      if (!name || !phone) {
        formNote.textContent = 'Lütfen zorunlu alanları doldurun.';
        formNote.classList.remove('success');
        return;
      }

      if (kvkkConsent && !kvkkConsent.checked) {
        formNote.textContent = 'Devam etmek için KVKK Aydınlatma Metni\'ni onaylamanız gerekiyor.';
        formNote.classList.remove('success');
        return;
      }

      const lines = [
        `Merhaba, ben ${name}.`,
        `Telefon: ${phone}`,
        service && service !== 'Bir hizmet seçin' ? `Hizmet: ${service}` : '',
        message ? `Mesaj: ${message}` : ''
      ].filter(Boolean);

      const text = encodeURIComponent(lines.join('\n'));
      const target = WHATSAPP_NUMBER
        ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
        : `https://wa.me/?text=${text}`;

      window.open(target, '_blank', 'noopener');

      formNote.textContent = `Teşekkürler ${name}, WhatsApp'a yönlendiriliyorsunuz.`;
      formNote.classList.add('success');
      contactForm.reset();
    });
  }

  /* ===== Smooth scroll (eski tarayıcı uyumu için yedek) ===== */
  document.querySelectorAll('a[href^="#"]:not([data-call]):not([data-whatsapp])').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ===== Çerez onay çubuğu (Google Ads / KVKK uyumluluğu) ===== */
  const COOKIE_CONSENT_KEY = 'efeOtoLastikCookieConsent';

  if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Çerez onayı');
    banner.innerHTML = `
      <p>Sitede deneyiminizi iyileştirmek ve Google Ads reklam performansını ölçmek için çerezler kullanıyoruz.
      Detaylar için <a href="cerez-politikasi.html">Çerez Politikası</a> sayfamızı inceleyebilirsiniz.</p>
      <div class="cookie-banner__actions">
        <button type="button" class="btn btn--outline cookie-banner__reject">Reddet</button>
        <button type="button" class="btn btn--primary cookie-banner__accept">Kabul Et</button>
      </div>
    `;
    document.body.appendChild(banner);

    const closeBanner = (value) => {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
      banner.classList.add('cookie-banner--hide');
      setTimeout(() => banner.remove(), 350);
    };

    banner.querySelector('.cookie-banner__accept').addEventListener('click', () => closeBanner('accepted'));
    banner.querySelector('.cookie-banner__reject').addEventListener('click', () => closeBanner('rejected'));
  }

});
