import React, { useRef, useLayoutEffect } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Console from "./components/Console";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { motion, useScroll, useSpring } from "framer-motion";

const App: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useLayoutEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    // Respect deep links (#projects etc.); otherwise start at the top.
    if (!window.location.hash) window.scrollTo(0, 0);
    return () => {
      if ("scrollRestoration" in history) {
        history.scrollRestoration = "auto";
      }
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-white text-ink selection:bg-ink selection:text-paper">
      {/* Paper grain */}
      <div className="paper-grain" />

      {/* Thin reading-progress rule (rust) */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-rust origin-left z-[110]"
        style={{ scaleX }}
      />

      <Navbar />

      <div className="relative z-10">
        <Hero heroRef={heroRef} />
        <Console />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
        <Footer />
      </div>
    </main>
  );
};

export default App;
