## The logistic map

*x*ₙ₊₁ = *r x*ₙ(1 − *x*ₙ),  with 0 ≤ *x* ≤ 1 and 0 ≤ *r* ≤ 4.

Robert May used this one-line model of a population with limited resources to show that very simple rules can behave unpredictably.

### What you're seeing
**Top.** For each *r* from 2.5 to 4, start at *x* = 0.5, discard 300 iterates, and plot the next 400. Brighter pixels are visited more often. The vertical line marks the [*r*](#param:r) you chose.

**Bottom.** A cobweb diagram. From the point (*x*, *x*) on the diagonal go vertically to the parabola, which gives *f(x)*, then horizontally back to the diagonal. Each corner on the diagonal is one iterate, four of them per second. The path restarts from *x*₀ = 0.2 every 16 seconds; [pause at t = 2 s](#t:2) to see only the first eight.

### Period doubling
For 1 < *r* < 3 the fixed point x⋆ = 1 − 1/*r* attracts, because |*f′*(x⋆)| = |2 − *r*| < 1. At *r* = 3 the slope reaches −1 and a 2-cycle takes over; further splits happen at *r* = 1 + √6 ≈ 3.4495, 3.5441, 3.5644, … and pile up at *r*∞ ≈ 3.5699. The gaps between splits shrink by the Feigenbaum constant δ ≈ 4.6692, and the same δ appears in every smooth one-hump map.

### Why it works
1. For *r* < 3 the fixed point x⋆ = 1 − 1/*r* attracts: *f′*(x⋆) = 2 − *r*, and |2 − *r*| < 1, so each iterate shrinks the distance to x⋆ by about that factor. The slope is negative, so the cobweb spirals in, landing on alternate sides of x⋆. [See it at r = 2.8, after 60 iterates](#state:eyJwIjp7InIiOjI4MH0sInQiOjE1fQ).
2. At *r* = 3 the slope is exactly −1 and the linear term no longer contracts. The orbit still converges, but only through the higher-order terms, so slowly that after 60 iterates the spiral is still open. [See it at r = 3](#state:eyJwIjp7InIiOjMwMH0sInQiOjE1fQ).
3. Past 3, x⋆ repels. Look at *f*∘*f* instead: its slope at x⋆ is *f′*(x⋆)², which passes 1, and two new fixed points of *f*∘*f* split off on either side, a pair *p*, *q* with *f(p)* = *q* and *f(q)* = *p*. That pair is the 2-cycle the cobweb settles onto: [r = 3.2](#preset:r-3-20).
4. The 2-cycle attracts while |*f′(p) f′(q)*| < 1, the slope of *f*∘*f* at *p*. The product reaches −1 at *r* = 1 + √6 ≈ 3.4495, and the argument of step 3, applied to *f*∘*f*, gives a 4-cycle: [see it at r = 3.5](#state:eyJwIjp7InIiOjM1MH0sInQiOjE1fQ).
5. The same step repeats for each composite, which is why the splits come one after another. Why their gaps shrink by the same δ in every one-hump map is the deep part (Feigenbaum's renormalization, proved by Lanford in 1982), and nothing in this picture shows it.

### Order inside chaos
Past *r*∞ the picture is mostly chaotic, but not entirely. At *r* = 1 + √8 ≈ 3.8284 a stable 3-cycle appears. By the Li–Yorke theorem and Sharkovskii's ordering, a period-3 orbit forces orbits of every other period.

### Try this
- [Set *r* = 3.2](#preset:r-3-20). The cobweb settles onto a rectangle: a 2-cycle.
- [Set *r* = 4](#preset:r-4). With *x* = sin²(π*θ*) the map becomes *θ* ↦ 2*θ* mod 1, so the dynamics is as random-looking as coin flips.
- [Sit just left of 3.8284](#preset:r-3-82) and watch the orbit idle near a 3-cycle, then burst away. That is intermittency.

**Reference.** R. May, *Simple mathematical models with very complicated dynamics*, Nature 261 (1976). S. Strogatz, *Nonlinear Dynamics and Chaos*, chapter 10. O. Lanford, *A computer-assisted proof of the Feigenbaum conjectures*, Bull. AMS 6 (1982).
