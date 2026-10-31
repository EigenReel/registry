## The Lorenz system

$$
\begin{aligned}
\dot{x} &= \sigma\,(y - x) \\
\dot{y} &= x\,(\rho - z) - y \\
\dot{z} &= xy - \beta z
\end{aligned}
$$

with $\sigma = 10$, $\beta = 8/3$, and $\rho$ yours to choose. Edward Lorenz derived it in 1963 by truncating a model of convecting fluid to three modes, hoping for a toy weather model. He found something better.

### What you're seeing
Two solutions start at (1, 1, 1) and (1.001, 1, 1) and are integrated with fourth-order Runge–Kutta. The view is the orthographic projection onto the vertical axis *z* and a horizontal axis in the (*x*, *y*) plane, rotating slowly so the two wings and the loops around them show depth. The run restarts every 40 seconds.

### The mathematics
- **Dissipative.** The divergence of the vector field is $-(\sigma + 1 + \beta) \approx -13.67$, so volumes in phase space shrink like $e^{-13.67\,t}$. The attractor has zero volume; its fractal dimension is about 2.06.
- **Fixed points.** The origin, plus $C_\pm = \bigl(\pm\sqrt{\beta(\rho - 1)},\ \pm\sqrt{\beta(\rho - 1)},\ \rho - 1\bigr)$ once $\rho > 1$. For $\sigma = 10$, $\beta = 8/3$ the pair $C_\pm$ loses stability at $\rho = \sigma(\sigma + \beta + 3)/(\sigma - \beta - 1) \approx 24.74$.
- **Sensitive dependence.** At $\rho = 28$ the largest Lyapunov exponent is about 0.906, so a gap of $10^{-3}$ grows to order one in roughly 7 time units. That is the butterfly effect: the wing a trajectory visits next is unpredictable, while the attractor itself is perfectly stable.

### Try this
- Set $\rho = 10$. Both runs spiral into the same fixed point and the picture settles. Nothing is chaotic below about 13.9.
- Set $\rho = 28$ and wait for the two colors to separate.
- Try $\rho = 20$. Trajectories wander chaotically for a long time before settling onto a fixed point.

**Reference.** E. Lorenz, *Deterministic nonperiodic flow*, Journal of the Atmospheric Sciences 20 (1963).
