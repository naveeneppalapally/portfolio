import Hero from '../Hero';
import FeaturedScrub from '../FeaturedScrub';
import Work from '../Work';
import Services from '../Services';
import Process from '../Process';
import Playground from '../Playground';
import About from '../About';

/**
 * Single-page experience — section order follows the unified build plan:
 * Hero → Featured pinned case study → Work index → Services accordion →
 * Process track → Lab playground → About. Footer renders after (ClientApp).
 */
export default function HomeView() {
  return (
    <>
      <Hero />
      <FeaturedScrub />
      <div className="blend blend--ink-to-paper" aria-hidden="true" />
      <Work />
      <div className="blend blend--paper-to-ink" aria-hidden="true" />
      <Services />
      <div className="blend blend--ink-to-paper" aria-hidden="true" />
      <Process />
      <div className="blend blend--paper-to-ink" aria-hidden="true" />
      <Playground />
      <div className="blend blend--ink-to-paper" aria-hidden="true" />
      <About />
    </>
  );
}
