<div align="center">

# SlopeQuest

### A Differential Equation Adventure

Master differential equations — one field at a time.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Available-0ea5e9?style=flat-square)](https://harisnae.github.io/slopequest/)
[![License](https://img.shields.io/badge/License-MIT-eab308?style=flat-square)](./LICENSE)
[![Dependencies](https://img.shields.io/badge/Dependencies-None-22c55e?style=flat-square)](#technology)
[![Exercises](https://img.shields.io/badge/Exercises-27-8b5cf6?style=flat-square)](#chapters-and-fields)

[**Play the Live Demo**](https://harisnae.github.io/slopequest/)

</div>

---

## Live Demo

SlopeQuest is deployed on GitHub Pages and runs directly in the browser. No installation,
account, or build step is required.

> ### https://harisnae.github.io/slopequest/

The application supports mouse, touch, and keyboard input, and is fully responsive across
desktop, tablet, and mobile devices.

---

## Table of Contents

- [Overview](#overview)
- [Gameplay](#gameplay)
- [Features](#features)
- [Chapters and Fields](#chapters-and-fields)
- [Mathematical Topics Covered](#mathematical-topics-covered)
- [Technology](#technology)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Responsive Design](#responsive-design)
- [Project Structure](#project-structure)
- [Content Verification](#content-verification)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Overview

SlopeQuest is a browser-based educational game for learning ordinary differential equations
through interactive slope fields. Each level presents the slope field of a differential
equation — a grid of short line segments showing the direction a solution curve flows at
every point. Players classify the equation, solve it step by step, and then trace the actual
solution curve through the field by hand.

The game contains **27 hand-authored exercises across 8 thematic chapters**, progressing from
exponential growth and decay to phase-plane analysis of second-order systems and ecological
models.

Every exercise is reverse-authored: the closed-form solution is selected first,
differentiated to produce the governing equation, and verified by substitution. On startup,
the application additionally runs a fourth-order Runge–Kutta verification pass over every
exercise, confirming that each stored solution satisfies its field and initial condition.

---

## Gameplay

Each level follows a four-phase loop:

| Phase | Description |
|:---|:---|
| **1. Diagnose** | Classify the equation by inspecting its slope field. Some equations belong to multiple families; any valid classification is accepted. |
| **2. Solve** | Select the correct next step at each stage of the solution. Incorrect answers drain the Focus meter; detailed feedback explains the error. |
| **3. Trace** | Drag from the initial point and follow the field to the goal line (or goal ring, in the phase plains). The player is sketching the actual solution curve. |
| **4. Reveal** | Compare the player's trace against the exact solution and the full solution family. Performance is scored on Focus retained and trace accuracy. |

**Additional modes:**

- **Mixed Review** — weighted random selection that emphasizes the player's most-missed fields and resurfaces fields not visited recently.
- **Field Quiz** — a reverse challenge in which equations are matched to their slope fields.
- **Formula Cards** — chapter reference cards, unlocked by earning stars.
- **Practice Mode** — disables Focus drain and progress saving for pure drilling.

---

## Features

- 27 hand-authored exercises across 8 chapters, all unlocked from the start
- Animated slope fields with flow particles; undefined field points rendered as gaps
- Solution tracing via mouse drag, touch, or arrow keys
- Euler's method overlay with selectable step sizes (h = 0.5, 0.25, 0.1)
- Phase-plane mode with vector fields, nullcline overlays, and a y-versus-t replay
- Progression system: stars, XP, weak-spot tracking, and error logging
- Hint system that eliminates one incorrect option at the cost of Focus
- Synthesized sound effects via the Web Audio API (no audio asset files)
- Local progress persistence via `localStorage`
- Fully responsive layout for phones, tablets, and desktops, in portrait and landscape
- Zero runtime dependencies and no build step

---

## Chapters and Fields

| Chapter | Name | Fields | Topics |
|:---:|:---|:---:|:---|
| 1 | The Exponential Wilds | 2 | Exponential growth and decay (y′ = ky) |
| 2 | The Separable Realms | 3 | Hyperbolas, circles, finite-time blow-up, tangent fields |
| 3 | The Linear Legion | 4 | Equilibria and the integrating factor |
| 4 | Boss Fields | 7 | Hidden equations, uniqueness, harvesting bifurcations, Euler's method |
| 5 | The Substitution Stronghold | 2 | Bernoulli equations and homogeneous substitutions |
| 6 | The Exact Empire | 2 | Exact forms, potential functions, integrating-factor repair |
| 7 | The Real-World Realms | 2 | Newton cooling, mixing tanks, RC circuits, radiometric dating |
| 8 | The Phase Plains | 5 | Second-order oscillators, linear systems, ecology |

---

## Mathematical Topics Covered

| Topic | Chapters |
|:---|:---:|
| Separation of variables and partial fractions | 1–2, 4, 7 |
| First-order linear ODEs and integrating factors (including μ = x, 1/x) | 3, 4 |
| Exact equations, potential functions, and almost-exact repair | 6 |
| Bernoulli equations (v = y^(1−n)) | 5 |
| Homogeneous equations (v = y/x) | 2, 5, 6 |
| Autonomous equations: equilibria, stability, semi-stability | 1, 3, 4, 7 |
| Logistic growth and constant-yield harvesting bifurcations | 4 |
| Existence and uniqueness (Picard–Lindelöf failures) | 4 |
| Finite-time blow-up | 2, 4, 5 |
| Euler's method and convergence | 4 |
| Second-order linear ODEs: characteristic equation, damping regimes | 8 |
| Phase-plane classification: centers, saddles, nodes, spirals | 8 |
| Linear systems and eigenvalues | 8 |
| Lotka–Volterra and competing-species models | 8 |
| Applied modeling: cooling, mixing, circuits, isotopes, terminal velocity | 7 |

---

## Technology

| Layer | Implementation |
|:---|:---|
| Structure | HTML5, semantic markup with ARIA labels |
| Styling | CSS3 — custom properties, flexbox, grid, `clamp()`, safe-area insets |
| Logic | Vanilla JavaScript (ES6+); no frameworks, no build step |
| Graphics | Canvas 2D — pre-rendered slope fields, device-pixel-ratio aware, `ResizeObserver` |
| Audio | Web Audio API — fully synthesized sound effects |
| Storage | `localStorage` — stars, XP, settings, error log |

---

## Getting Started

Clone the repository and open the application in any modern browser:

```bash
git clone https://github.com/harisnae/slopequest.git
cd slopequest
```

Open `index.html` directly, or serve the directory locally:

```bash
npx serve .
```

There are no dependencies to install and no build step required.

---

## Deployment

The project is a static site and can be hosted on any static file server. To deploy on
GitHub Pages:

1. Push the repository to `https://github.com/harisnae/slopequest`.
2. Open **Settings → Pages**.
3. Under **Source**, select *Deploy from a branch*; set the branch to `main` and the folder
   to `/ (root)`.
4. Click **Save**.

The site will be available at `https://harisnae.github.io/slopequest/`.

---

## Responsive Design

| Viewport | Behavior |
|:---|:---|
| Desktop (≥ 1024px) | Full layout; mouse and keyboard tracing |
| Tablet (521–1023px) | Fluid layout; touch drag tracing |
| Phone (≤ 520px) | Two-column score grid; compact banner and level nodes |
| Small phone (≤ 400px) | Quiz grid collapses to a single column |
| Short landscape (≤ 560px height) | Taller phase panel; compact choice buttons |
| Notched devices | `viewport-fit=cover` with safe-area inset padding |

---

## Project Structure

```
slopequest/
├── index.html    # Screens (title, map, game) and modals
├── style.css     # Theme, layout, and responsive rules
├── game.js       # Engine and all 27 hand-authored exercises
├── LICENSE       # MIT License
└── README.md
```

---

## Content Verification

On every startup, the application runs an automated verification pass over all exercises:

- Each closed-form solution is checked against its differential equation and initial
  condition using fourth-order Runge–Kutta integration.
- Every multiple-choice step is checked to contain exactly one correct option.
- Phase-plane orbits are checked for numerical stability at two step sizes.

Any inconsistency is reported to the browser console, allowing the exercise content to
audit itself.

---

## Contributing

Bug reports, feature requests, and pull requests are welcome via the
[issue tracker](https://github.com/harisnae/slopequest/issues). Potential contributions
include additional exercises, new chapters, and translations.

---

## License

This project is released under the [MIT License](./LICENSE).

---

## Acknowledgments

The code for this repository was generated with
[GLM-5.3](https://huggingface.co/zai-org/GLM-5.3).
