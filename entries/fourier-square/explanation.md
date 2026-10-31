## Building a square wave from circles

The square wave *sq(θ) = sign(sin θ)* has the Fourier series

    sq(θ) = (4/π) Σ sin((2k − 1)θ) / (2k − 1),   k = 1, 2, 3, …

### What you're seeing
Each term is a rotating vector, an **epicycle**, of radius 4/((2*k* − 1)π) spinning at frequency 2*k* − 1. Chain [*N*](#param:N) of them tip to tail. The height of the last tip, plotted against time, is the partial sum *S_N(θ)*, drawn to the right. The dashed line is the square wave itself. The newest point of the trace is its left end, joined to the tip by the dotted line, at θ = 1.1 *t*, so a jump of *sq* enters the trace whenever θ passes a multiple of π: [pause at t = 3.1 s](#t:3.1), just after θ passes π, and the jump sits just inside the left end of the trace.

### Gibbs phenomenon
The partial sums converge to *sq* in *L²* and at every point (to 0 at the jumps), but not uniformly. Near each jump, *S_N* overshoots to about 1.179, roughly 9% of the jump height. As *N* grows the overshoot moves closer to the jump, but its height never shrinks. Compare the same moment at [six terms](#state:eyJwIjp7Ik4iOjZ9LCJ0IjozLjF9) and at [forty terms](#state:eyJwIjp7Ik4iOjQwfSwidCI6My4xfQ): the first ripple beside the jump is narrower at forty and just as tall.

### Try this
- [Set *N* = 1](#preset:n-1). One circle gives a pure sine.
- [Set *N* = 40](#preset:n-40) and watch the ripples squeeze toward the jump while their peak stays put.

### In the classroom
Orthogonal decomposition, the difference between *L²* and uniform convergence, and why sharp corners need high frequencies, all from one animation.

**Reference.** E. Hewitt and R. E. Hewitt, The Gibbs–Wilbraham phenomenon: an episode in Fourier analysis, *Archive for History of Exact Sciences* 21 (1979), 129–160.
