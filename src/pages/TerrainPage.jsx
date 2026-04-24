import ExperimentHero from '../components/ExperimentHero'
import TerrainHero from '../components/TerrainHero'

export default function TerrainPage() {
  return (
    <ExperimentHero
      Bg={TerrainHero}
      eyebrow="Experiment 02 — Terrain"
      headline="Elevation data."
      accent="At any resolution."
      sub="Query topographic layers, slope gradients, and surface models across any geography — delivered in milliseconds."
      cta1="Try Terrain Queries"
      cta2="See the Docs"
    />
  )
}
