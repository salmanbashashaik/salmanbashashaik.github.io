# salmanbashashaik.github.io

Personal research site for Shaik Salman Basha — generative models for health,
built around working instruments rather than screenshots of results.

## Stack

React 19 · TypeScript · Vite · Tailwind 4 · Framer Motion. Every visualization
is hand-rolled canvas or SVG; there is no charting library and no WebGL
dependency.

## The interactive pieces

| Where | What it does |
| --- | --- |
| Hero | The wordmark is sampled from its own glyph mask and displaced by a noise schedule. Scrub `t` from 1000 to 0 to run the reverse diffusion by hand, or push the field with the cursor. |
| Research | The Gut4Heart knowledge graph (taxon → enzyme → pathway → metabolite → receptor → disease) with signal propagating down it, beside the leave-one-cohort-out transfer matrix. |
| Projects | A synthetic MRI volume you can scrub slice by slice with the few-shot regime as a live control; a running glucose trace with PPO/GRPO dosing policies; the ingestion pipeline at serial versus multiprocess throughput. |
| Toolkit | Skills as a force-directed molecule — drag an atom and the structure reorganizes. |
| Distribution | A latent-space map: drag a sample out of the training clusters and watch support collapse. |
| Paper mode | The entire site re-typeset as a two-column preprint, with abstract and references. |
| ⌘K | Command palette for navigation and actions. |

Everything respects `prefers-reduced-motion`, pauses offscreen via
`IntersectionObserver`, and reads its palette from CSS custom properties so the
canvases follow the light/dark theme.

## Local development

```bash
npm install
npm run dev      # vite dev server
npm run build    # tsc -b && vite build
npm run lint
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and
publishes `dist/` to GitHub Pages.

## A note on the data

The simulations are illustrations of the underlying research, generated in the
browser — no patient data, no scan data, and no proprietary model weights are
shipped or referenced. Reported figures (transfer win rates, AUC, throughput)
come from the work described; the accompanying visuals are stand-ins that
behave the way the real results do, and say so on the page.
