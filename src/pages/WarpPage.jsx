import ExperimentHero from '../components/ExperimentHero'
import WarpHero from '../components/WarpHero'

export default function WarpPage() {
  return (
    <ExperimentHero
      Bg={WarpHero}
      eyebrow="Experiment 03 — Warp"
      headline="Data at the"
      accent="speed of light."
      sub="Billions of spatial records, streamed and resolved in real time. Your pipeline, turbocharged."
      cta1="See Performance"
      cta2="Request a Demo"
    />
  )
}
