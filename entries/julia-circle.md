## Julia sets of $z^2 + c$

For a complex parameter $c$, iterate $f_c(z) = z^2 + c$. The **filled Julia set** $K_c$ is the set of starting
points whose orbit stays bounded. Its boundary $J_c$ is the **Julia set**, where the dynamics is chaotic: points
on either side of it have completely different fates, and arbitrarily close to any point of $J_c$ there are
points whose orbits escape.

## What you're seeing

The parameter travels once around the circle $|c| = 0.7885$ every 52 seconds. The small picture in the lower
right is the $c$-plane: the Mandelbrot set $M$ (see below) in pale violet, the circle dotted, and $c$ itself as
the yellow dot moving around it.

The large picture is the $z$-plane, with the shorter side of the frame spanning $3.2$ around the origin and the
imaginary axis pointing up. Each point $z_0$ is iterated, together with the derivative $z_n' = 2 z_{n-1} z_{n-1}'$
(starting from $z_0' = 1$), until $|z_n|$ passes $100$. Two numbers then color it. The smoothed escape time

$$\mu = n + 1 - \log_2 \log |z_n|$$

gives a faint violet tint that rises toward the set without the bands the integer $n$ alone would give. The
distance estimate

$$d \approx \frac{|z_n| \log |z_n|}{|z_n'|}$$

is roughly how far $z_0$ is from the Julia set $J_c$, and points within about a pixel of it are drawn bright
yellow, with a soft halo a few pixels wide. So the bright line you see is $J_c$ itself. Points that never escape
within the iteration limit are left in the dark interior tint; that is the filled Julia set. An orbit that
returns to within $10^{-7}$ of an earlier point has fallen onto an attracting cycle and can never escape, so it
is stopped there and counted as interior, which gives the same picture faster.

## Connected, or dust

Fatou and Julia showed that $J_c$ is connected exactly when the critical orbit $0, c, c^2 + c, \dots$ stays
bounded, which is the definition of $c$ lying in the **Mandelbrot set** $M$. Otherwise $J_c$ is a Cantor set:
totally disconnected dust. This circle crosses the boundary of $M$ several times, so you see the set break apart
and reconnect. The dot in the inset tells you which side you're on: it is filled while $c \in M$ and becomes a
hollow ring once $c \notin M$, judged by iterating the critical orbit up to the same iteration limit. The inset's
$M$ is drawn with that limit too.

## Try this

- Jump to [$c = -0.7885$](#preset:connected). Here $|c + 1| < 1/4$, so $c$ is in the period-2 bulb of the
  Mandelbrot set: the critical orbit settles onto an attracting cycle of period two, stays bounded, and $J_c$
  is connected.
- Jump to [$c = 0.7885$](#preset:dust). On the real axis past $c = 1/4$ the critical orbit escapes, so $c$ is
  outside the Mandelbrot set and $J_c$ is a Cantor set.
- Compare the same parameter near the edge of $M$ with [70 iterations](#preset:edge-70) and with
  [200 iterations](#preset:edge-200). With the lower limit the critical orbit has not escaped yet and the dot
  is filled, $c \in M$; with the higher one it has, the dot turns into a ring, and the dark specks of interior
  left inside the glowing filaments disappear into dust. Raising the limit is what
  you need whenever $c$ is near the boundary of $M$.
- Notice the 180° symmetry at any moment, for example [at t = 30](#t:30). Since $f_c(-z) = f_c(z)$, the set
  satisfies $K_c = -K_c$.

## Research connections

Whether $M$ is locally connected (the MLC conjecture) is still open. Douady and Hubbard showed that MLC would
imply that hyperbolic parameters are dense in the quadratic family, which in turn would mean that almost every
quadratic map is, in a precise sense, as tame as possible.

Reference: J. Milnor, *Dynamics in One Complex Variable*, 3rd ed., Princeton University Press, 2006; see also
[Julia set](https://en.wikipedia.org/wiki/Julia_set) on Wikipedia.
