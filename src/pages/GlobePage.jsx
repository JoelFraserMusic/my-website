import ExperimentHero from '../components/ExperimentHero'
import GlobeHero from '../components/GlobeHero'

export default function GlobePage() {
  return (
    <ExperimentHero
      Bg={GlobeHero}
      eyebrow="Experiment 01 — Globe"
      headline="Every coordinate."
      accent="Mapped."
      sub="A living view of the world's spatial data — streaming, indexed, and queryable at any scale. No GIS tools required."
      cta1="Explore the Data"
      cta2="How It Works"
    />
  )
}
