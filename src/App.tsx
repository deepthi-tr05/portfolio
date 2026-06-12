import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './layouts/MainLayout';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Certifications } from './components/Certifications';
import { GithubDashboard } from './components/GithubDashboard';
import { ExperimentalAILab } from './components/ExperimentalAILab';
import { BootSequence } from './components/BootSequence';

function App() {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {!bootComplete && (
          <BootSequence key="boot" onComplete={() => setBootComplete(true)} />
        )}
      </AnimatePresence>

      {bootComplete && (
        <Layout>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Certifications />
          <GithubDashboard />
          <ExperimentalAILab />
        </Layout>
      )}
    </>
  );
}

export default App;
