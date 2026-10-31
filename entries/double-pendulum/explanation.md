## The double pendulum

Hang a second rod, with its own bob, from the end of a pendulum. With equal masses and lengths and angles θ₁, θ₂ measured from straight down, the Lagrangian gives

    θ₁″ = [−3g sin θ₁ − g sin(θ₁ − 2θ₂) − 2 sin(θ₁ − θ₂)(θ₂′² + θ₁′² cos(θ₁ − θ₂))] / (3 − cos(2θ₁ − 2θ₂))
    θ₂″ = [2 sin(θ₁ − θ₂)(2θ₁′² + 2g cos θ₁ + θ₂′² cos(θ₁ − θ₂))] / (3 − cos(2θ₁ − 2θ₂))

with *g* = 9.81 and rod lengths 1. The state is (θ₁, θ₂, θ₁′, θ₂′), integrated here with fourth-order Runge–Kutta at a step of 0.005 s.

### What you're seeing
Two copies start from rest with the same θ₂ = 0. Their θ₁ differ by 0.001 rad (0.057°). Trails show the last stretch of each lower bob's path. The simulation restarts every 24 seconds.

### Why they separate
The system is conservative, so energy is fixed, but for large angles it is chaotic: nearby trajectories separate roughly like *e*^{λt}, where λ > 0 is the largest Lyapunov exponent. A gap of 10⁻³ becomes order one after about ln(10³)/λ seconds, and then it cannot grow further because both pendulums are confined to the same energy surface. This is why long forecasts fail even when the equations are exactly known.

### Try this
- Set θ₁ = 20°. For small angles the equations linearize into two normal modes with ω² = (*g*/ℓ)(2 ± √2). The motion is quasi-periodic and the two copies stay together.
- Raise θ₁ and note when they start to part ways. More energy means a stronger exponent.
- Watch the readout: the tip separation is the distance between the two lower bobs, in rod lengths.

**Reference.** Levien and Tan, *Double pendulum: An experiment in chaos*, American Journal of Physics 61 (1993).
