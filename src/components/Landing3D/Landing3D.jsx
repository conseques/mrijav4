import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'framer-motion';
import styles from './Landing3D.module.css';

// Lazy load 3D scenes for performance
const HeroScene = lazy(() => import('../ThreeScenes/HeroScene'));
const SunflowerScene = lazy(() => import('../ThreeScenes/SunflowerScene'));
const HeartScene = lazy(() => import('../ThreeScenes/HeartScene'));
const CubeWaveScene = lazy(() => import('../ThreeScenes/CubeWaveScene'));
const BookScene = lazy(() => import('../ThreeScenes/BookScene'));
const CrystalScene = lazy(() => import('../ThreeScenes/CrystalScene'));

/* ═══════════════════════════════════════════════════════
   ANIMATION VARIANTS
═══════════════════════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }
};

/* Reusable animated section wrapper */
function AnimatedSection({ children, className, id }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeUp}
    >
      {children}
    </motion.section>
  );
}

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
        
        <motion.div 
          className={styles.heroContent}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        >
          <motion.p 
            className={styles.heroEyebrow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Волонтерська Організація · Norway · Ukraine
          </motion.p>
          <motion.h1 
            className={styles.heroTitle}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.7 }}
          >
            МріЯ
          </motion.h1>
          <motion.p 
            className={styles.heroSubtitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            Мрія — To Dream is to Act
          </motion.p>
          <motion.p 
            className={styles.heroDesc}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            Born from Ukraine's unbreakable spirit, Mriya connects the will to help
            with the places that need it most — from the blue of our skies to the
            gold of our fields, we carry our dreams forward.
          </motion.p>
          <motion.div 
            className={styles.btnRow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <a href="#programs" className={styles.btnPrimary}>Explore Our Work</a>
            <a href="#cta" className={styles.btnGhost}>Стати Волонтером</a>
          </motion.div>
        </motion.div>

        <motion.div 
          className={styles.scrollCue}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.0 }}
        >
          <div className={styles.scrollLine}></div>
          <span>Scroll</span>
        </motion.div>
      </section>

      {/* ═══ ABOUT SECTION ═══ */}
      <AnimatedSection className={styles.about} id="about">
        <div className={styles.container}>
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <motion.span className={styles.label} variants={fadeUp}>Who We Are</motion.span>
              <motion.h2 className={styles.sectionTitle} variants={fadeUp}>
                A dream rooted in <em>Ukraine's</em><br />golden soil
              </motion.h2>
              <motion.p variants={fadeUp}>
                Mriya — was born in the hearts of Ukrainians who believed
                that dreams must never stop, even in the darkest hours. Our name
                carries the soul of our language: a single word that holds the sky,
                the future, and the will to reach for both.
              </motion.p>
              <motion.p variants={fadeUp}>
                We are a volunteer-driven force — connecting compassionate people
                with communities that need rebuilding, children who deserve education,
                and a culture that must be remembered.
              </motion.p>
              <motion.a href="#programs" className={styles.btnGhost} style={{ marginTop: '1.2rem' }} variants={fadeUp}>
                See What We Do
              </motion.a>
            </div>
            
            <motion.div className={styles.sunflowerWrap} variants={scaleIn}>
              <Suspense fallback={<SceneLoader />}>
                <SunflowerScene />
              </Suspense>
              <span className={styles.sfCaption}>
                Соняшник — Ukraine's National Flower
              </span>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* ═══ VALUES SECTION ═══ */}
      <AnimatedSection className={styles.values} id="values">
        <div className={styles.container}>
          <div className={styles.valuesHead}>
            <motion.span className={styles.label} variants={fadeUp}>What We Stand For</motion.span>
            <motion.h2 className={styles.sectionTitle} variants={fadeUp}>
              The spirit that <em>guides</em> every step
            </motion.h2>
          </div>
          <motion.div className={styles.vGrid} variants={staggerContainer}>
            {[
              { icon: '🌾', ua: 'Стійкість', title: 'Resilience', desc: "Ukraine has endured for centuries and emerged stronger each time. We carry that same unbreakable spirit into every mission." },
              { icon: '🤝', ua: 'Єдність', title: 'Unity', desc: "No dream is built alone. We are strongest standing together — Ukrainians and friends of Ukraine, united by purpose." },
              { icon: '🌻', ua: 'Надія', title: 'Hope', desc: "Hope is the Ukrainian spirit — it cannot be broken, only passed on. Every act of service plants a seed for tomorrow." }
            ].map((card, i) => (
              <motion.div key={i} className={styles.vCard} variants={fadeUp}>
                <span className={styles.vCardIcon}>{card.icon}</span>
                <span className={styles.vCardUa}>{card.ua}</span>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ═══ STATS SECTION ═══ */}
      <AnimatedSection className={styles.stats}>
        <div className={styles.container}>
          <motion.div className={styles.sGrid} variants={staggerContainer}>
            {[
              { end: 3500, suffix: '+', label: 'Volunteers' },
              { end: 220, suffix: '', label: 'Missions Completed' },
              { end: 47, suffix: '', label: 'Cities Reached' },
              { end: 18, suffix: 'K+', label: 'People Supported' }
            ].map((stat, i) => (
              <motion.div key={i} className={styles.sItem} variants={scaleIn}>
                <div className={styles.sNum}>
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </div>
                <div className={styles.sLbl}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ═══ PROGRAMS SECTION ═══ */}
      <AnimatedSection className={styles.programs} id="programs">
        <div className={styles.container}>
          <div className={styles.progHead}>
            <div>
              <motion.span className={styles.label} variants={fadeUp}>What We Do</motion.span>
              <motion.h2 className={styles.sectionTitle} variants={fadeUp}>
                Programs born from <em>necessity</em>
              </motion.h2>
            </div>
            <motion.a href="#cta" className={styles.btnGhost} variants={fadeUp}>View All</motion.a>
          </div>

          <motion.div className={styles.pGrid} variants={staggerContainer}>
            {/* Humanitarian Aid */}
            <motion.div className={styles.pCard} variants={fadeUp}>
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
            </motion.div>

            {/* Reconstruction */}
            <motion.div className={styles.pCard} variants={fadeUp}>
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
            </motion.div>

            {/* Education */}
            <motion.div className={styles.pCard} variants={fadeUp}>
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
            </motion.div>

            {/* Cultural Heritage */}
            <motion.div className={styles.pCard} variants={fadeUp}>
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
            </motion.div>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* ═══ CTA SECTION ═══ */}
      <AnimatedSection className={styles.cta} id="cta">
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <motion.span className={styles.label} variants={fadeUp}>Join the Mission</motion.span>
            <motion.h2 className={styles.sectionTitle} variants={fadeUp}>
              Your hands are part<br />of this <em>dream</em>
            </motion.h2>
            <motion.p variants={fadeUp}>
              Whether you are in Ukraine or standing with us from across the world,
              Mriya has a place for you. Every hour you give is a stitch in
              the fabric of what we are rebuilding together.
            </motion.p>
            <motion.div className={styles.btnRow} variants={fadeUp}>
              <a href="mailto:mrija.i.drammen@gmail.com" className={styles.btnPrimary}>
                Стати Волонтером
              </a>
              <a href="#about" className={styles.btnGhost}>Learn More</a>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Landing3D;
