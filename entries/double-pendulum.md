## The double pendulum

Hang a second rod, with its own bob, from the end of a pendulum. With equal masses, rods of length $1$ and
angles $\theta_1, \theta_2$ measured from straight down, the Lagrangian gives

$$
\begin{aligned}
\ddot\theta_1 &= \frac{-3g\sin\theta_1 - g\sin(\theta_1 - 2\theta_2) - 2\sin(\theta_1 - \theta_2)\bigl(\dot\theta_2^2 + \dot\theta_1^2\cos(\theta_1 - \theta_2)\bigr)}{3 - \cos(2\theta_1 - 2\theta_2)} \\
\ddot\theta_2 &= \frac{2\sin(\theta_1 - \theta_2)\bigl(2\dot\theta_1^2 + 2g\cos\theta_1 + \dot\theta_2^2\cos(\theta_1 - \theta_2)\bigr)}{3 - \cos(2\theta_1 - 2\theta_2)}
\end{aligned}
$$

with $g = 9.81$. The state is $(\theta_1, \theta_2, \dot\theta_1, \dot\theta_2)$, integrated here with
fourth-order Runge–Kutta at a fixed step of $0.005$ s, always from $t = 0$, so any moment of the loop can be
reached directly and a shared link shows exactly the same swing.

## What you're seeing

Two copies start from rest with the same $\theta_2 = 0$. Their $\theta_1$ differ by $0.001$ rad, about
$0.057^\circ$. The two are drawn in pink and blue with their light added together, so while they agree they
overlap as a single white pendulum, and the moment they part each shows its own color. Trails show the last few
seconds of each lower bob's path, fading with age. The faint circle is everything the lower bob could reach, two
rod lengths from the pivot. The simulation starts over every 24 seconds.

The dotted line is an **energy ceiling**. Both copies start at rest, so with unit masses and rods the energy
says $2\cos\theta_1 + \cos\theta_2 \ge 2\cos\theta_1(0) + 1$ for all time. Minimizing the height of the lower
bob under that constraint shows it can never rise above $-\cos\theta_1(0)$ rod lengths over the pivot (or
$-2\cos\theta_1(0)$, below the pivot, when $\theta_1(0) < 90^\circ$). For starts above $90^\circ$ that is
exactly the height the upper bob starts at, which you can see [at t = 0](#t:0).

## Why they separate

The system is conservative, so energy is fixed, but for large angles it is chaotic: nearby trajectories separate
roughly like $e^{\lambda t}$, where $\lambda > 0$ is the largest Lyapunov exponent. A gap of $10^{-3}$ becomes
order one after about $\ln(10^3)/\lambda$ seconds, and then it cannot grow further because both pendulums are
confined to the same energy surface. This is why long forecasts fail even when the equations are exactly known.

## Try this

- Try [small swings](#preset:small-swings), $\theta_1 = 20^\circ$. For small angles the equations linearize into
  two normal modes with $\omega^2 = (g/\ell)(2 \pm \sqrt 2)$. The motion is quasi-periodic and the two copies
  stay together for the whole loop.
- At the default $135^\circ$, watch [the moment they part](#preset:parting), then step back to
  [t = 5](#t:5), when the separation is still far too small to see.
- Start [nearly upside down](#preset:over-the-top) at $175^\circ$. More energy means a stronger exponent, and
  the copies part within a few seconds.
- Raise $\theta_1$ in steps of $5^\circ$ from $20^\circ$ and note when the copies start to part ways.

Reference: R. B. Levien and S. M. Tan, *Double pendulum: An experiment in chaos*, American Journal of Physics
61 (1993); see also [Double pendulum](https://en.wikipedia.org/wiki/Double_pendulum) on Wikipedia.
