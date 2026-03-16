import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Landing3D.module.css';

// Lazy load 3D scenes for performance
const HeroScene = lazy(() => import('../ThreeScenes/HeroScene'));
const SunflowerScene = lazy(() => import('../ThreeScenes/SunflowerScene'));
const { HeartScene, CubeWaveScene, BookScene, CrystalScene } = lazy(() => 
  import('../ThreeScenes/ProgramScenes')
);

/* ═══════════════════════════════════════════════════════
   UTILITY: Animated Counter
═══════════════════════════════════════════════════════ */
function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════
   LOADING FALLBACK
═══════════════════════════════════════════════════════ */
function SceneLoader() {
  return (
    <div className={styles.sceneLoader}>
      <div className={styles.loaderPulse}></div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN LANDING 3D COMPONENT
═══════════════════════════════════════════════════════ */
const Landing3D = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.landing}>
      {/* Ukrainian Flag Bar */}
      <div className={styles.flagBar}></div>

      {/* ═══ HERO SECTION ═══ */}
      <section className={styles.hero} id="home">
        <Suspense fallback={<SceneLoader />}>
          <HeroScene />
        </Suspense>
        <div className={styles.heroVignette}></div>
        
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>
            Волонтерська Організація · Norway · Ukraine
          </p>
          <h1 className={styles.heroTitle}>МріЯ</h1>
          <p className={styles.heroSubtitle}>Мрія — To Dream is to Act</p>
          <p className={styles.heroDesc}>
            Born from Ukraine's unbreakable spirit, Mriya connects the will to help
            with the places that need it most — from the blue of our skies to the
            gold of our fields, we carry our dreams forward.
          </p>
          <div className={styles.btnRow}>
            <a href="#programs" className={styles.btnPrimary}>Explore Our Work</a>
            <a href="#cta" className={styles.btnGhost}>Стати Волонтером</a>
          </div>
        </div>

        <div className={styles.scrollCue}>
          <div className={styles.scrollLine}></div>
          <span>Scroll</span>
        </div>
      </section>

      {/* ═══ ABOUT SECTION ═══ */}
      <section className={styles.about} id="about">
        <div className={styles.container}>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <span className={styles.label}>Who We Are</span>
              <h2 className={styles.sectionTitle}>
                A dream rooted in <em>Ukraine's</em><br />golden soil
              </h2>
              <p>
                Mriya — was born in the hearts of Ukrainians who believed
                that dreams must never stop, even in the darkest hours. Our name
                carries the soul of our language: a single word that holds the sky,
                the future, and the will to reach for both.
              </p>
              <p>
                We are a volunteer-driven force — connecting compassionate people
                with communities that need rebuilding, children who deserve education,
                and a culture that must be remembered.
              </p>
              <a href="#programs" className={styles.btnGhost} style={{ marginTop: '1.2rem' }}>
                See What We Do
              </a>
            </div>
            
            <div className={styles.sunflowerWrap}>
              <Suspense fallback={<SceneLoader />}>
                <SunflowerScene />
              </Suspense>
              <span className={styles.sfCaption}>
                Соняшник — Ukraine's National Flower
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ VALUES SECTION ═══ */}
      <section className={styles.values} id="values">
        <div className={styles.container}>
          <div className={styles.valuesHead}>
            <span className={styles.label}>What We Stand For</span>
            <h2 className={styles.sectionTitle}>
              The spirit that <em>guides</em> every step
            </h2>
          </div>
          <div className={styles.vGrid}>
            <div className={styles.vCard}>
              <span className={styles.vCardIcon}>🌾</span>
              <span className={styles.vCardUa}>Стійкість</span>
              <h3>Resilience</h3>
              <p>Ukraine has endured for centuries and emerged stronger each time. We carry that same unbreakable spirit into every mission.</p>
            </div>
            <div className={styles.vCard}>
              <span className={styles.vCardIcon}>🤝</span>
              <span className={styles.vCardUa}>Єдність</span>
              <h3>Unity</h3>
              <p>No dream is built alone. We are strongest standing together — Ukrainians and friends of Ukraine, united by purpose.</p>
            </div>
            <div className={styles.vCard}>
              <span className={styles.vCardIcon}>🌻</span>
              <span className={styles.vCardUa}>Надія</span>
              <h3>Hope</h3>
              <p>Hope is the Ukrainian spirit — it cannot be broken, only passed on. Every act of service plants a seed for tomorrow.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS SECTION ═══ */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <div className={styles.sGrid}>
            <div className={styles.sItem}>
              <div className={styles.sNum}>
                <AnimatedCounter end={3500} suffix="+" />
              </div>
              <div className={styles.sLbl}>Volunteers</div>
            </div>
            <div className={styles.sItem}>
              <div className={styles.sNum}>
                <AnimatedCounter end={220} />
              </div>
              <div className={styles.sLbl}>Missions Completed</div>
            </div>
            <div className={styles.sItem}>
              <div className={styles.sNum}>
                <AnimatedCounter end={47} />
              </div>
              <div className={styles.sLbl}>Cities Reached</div>
            </div>
            <div className={styles.sItem}>
              <div className={styles.sNum}>
                <AnimatedCounter end={18} suffix="K+" />
              </div>
              <div className={styles.sLbl}>People Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROGRAMS SECTION ═══ */}
      <section className={styles.programs} id="programs">
        <div className={styles.container}>
          <div className={styles.progHead}>
            <div>
              <span className={styles.label}>What We Do</span>
              <h2 className={styles.sectionTitle}>
                Programs born from <em>necessity</em>
              </h2>
            </div>
            <a href="#cta" className={styles.btnGhost}>View All</a>
          </div>

          <div className={styles.pGrid}>
            {/* Humanitarian Aid */}
            <div className={styles.pCard}>
              <div className={styles.assetStrip}>
                <Suspense fallback={<SceneLoader />}>
                  <HeartScene />
                </Suspense>
                <span className={styles.assetBadge}>3D Asset</span>
              </div>
              <p className={styles.pTag}>Humanitarian Aid · Гуманітарна допомога</p>
              <h3>Серце Нації</h3>
              <p>Delivering food, medicine, and essentials to displaced Ukrainians across the country. Where roads close, we find another way.</p>
              <a href="#" className={styles.pLink}>Learn More</a>
            </div>

            {/* Reconstruction */}
            <div className={styles.pCard}>
              <div className={styles.assetStrip}>
                <Suspense fallback={<SceneLoader />}>
                  <CubeWaveScene />
                </Suspense>
                <span className={styles.assetBadge}>3D Asset</span>
              </div>
              <p className={styles.pTag}>Reconstruction · Відбудова</p>
              <h3>Відбудова</h3>
              <p>Brick by brick, we restore homes, schools, and community centers — turning rubble back into the places where life happens.</p>
              <a href="#" className={styles.pLink}>Learn More</a>
            </div>

            {/* Education */}
            <div className={styles.pCard}>
              <div className={styles.assetStrip}>
                <Suspense fallback={<SceneLoader />}>
                  <BookScene />
                </Suspense>
                <span className={styles.assetBadge}>3D Asset</span>
              </div>
              <p className={styles.pTag}>Education · Освіта</p>
              <h3>Мрії Дітям</h3>
              <p>Ensuring that every Ukrainian child has access to safe learning spaces, qualified teachers, and the right to imagine their future.</p>
              <a href="#" className={styles.pLink}>Learn More</a>
            </div>

            {/* Cultural Heritage */}
            <div className={styles.pCard}>
              <div className={styles.assetStrip}>
                <Suspense fallback={<SceneLoader />}>
                  <CrystalScene />
                </Suspense>
                <span className={styles.assetBadge}>3D Asset</span>
              </div>
              <p className={styles.pTag}>Heritage · Культурна пам'ять</p>
              <h3>Культурна Пам'ять</h3>
              <p>Preserving Ukraine's language, art, music, and traditions so that what makes us Ukrainian is never lost — it lives on.</p>
              <a href="#" className={styles.pLink}>Learn More</a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section className={styles.cta} id="cta">
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <span className={styles.label}>Join the Mission</span>
            <h2 className={styles.sectionTitle}>
              Your hands are part<br />of this <em>dream</em>
            </h2>
            <p>
              Whether you are in Ukraine or standing with us from across the world,
              Mriya has a place for you. Every hour you give is a stitch in
              the fabric of what we are rebuilding together.
            </p>
            <div className={styles.btnRow}>
              <a href="mailto:info@mrija-norway.no" className={styles.btnPrimary}>
                Стати Волонтером
              </a>
              <a href="#about" className={styles.btnGhost}>Learn More</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing3D;
