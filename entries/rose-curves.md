## Rose curves

A **rose** is the polar curve $r = \cos(k\theta)$. For a whole number $k$ it closes up into evenly spaced petals,
and how many petals there are depends on whether $k$ is odd or even: $k$ petals when $k$ is odd, $2k$ when it is
even.

## What you're seeing

The curve is traced as $\theta$ runs from $0$ until the curve closes, over six seconds, and then erased over
the next six; a faint ghost of the whole rose shows where it is headed. The trace is coral where $r \ge 0$ and
aqua where $r < 0$. The dashed line points in the direction $\theta$, and the solid segment is the radius to the
glowing tracing point, so you can watch $r$ shrink to zero between petals and turn negative, when the point
swings to the other side of the origin from the dashed line. The faint polar grid has circles at
$r = \tfrac14, \tfrac12, \tfrac34$ and spokes every $15^\circ$; its outer circle is $r = 1$, which every petal
touches at its tip. In interact mode a label names the curve, counts its petals and keys the two colors.

When $r$ is negative, the point $(r, \theta)$ lies on the opposite side of the origin, at angle $\theta + \pi$.
That is the whole reason odd and even differ. Replacing $\theta$ with $\theta + \pi$ gives

$$\cos(k\theta + k\pi) = (-1)^k \cos(k\theta).$$

- **Odd $k$:** $r(\theta + \pi) = -r(\theta)$, so the second half-turn lands exactly on the points of the first.
  The curve closes after $\theta = \pi$ with $k$ petals.
- **Even $k$:** $r(\theta + \pi) = r(\theta)$, so the second half-turn draws the first half's petals on the
  opposite side. It takes the full turn to close, with $2k$ petals.

## Try this

- Jump to [eight petals](#preset:eight): $k = 4$ is even, so the tracing needs the full turn of $\theta$ and
  finds eight petals. Coral and aqua alternate: every other petal is drawn with $r < 0$, from the opposite side.
- Stop the tracing [at t = 6](#t:6), the moment the curve is complete, and count the petals. With the default
  $k = 5$ the coral petals all sit above the horizontal axis and the aqua ones below it, since $\theta$ only
  runs over $[0, \pi]$; the petal on the axis is half of each, started with $r > 0$ and finished with $r < 0$.
- In interact mode, move $k$ from $1$ to $12$ with the panel and predict each petal count before the curve
  finishes. Notice that $k = 2$ gives more petals than $k = 3$.

A first polar graph with a surprise in it: students can guess the rule from the picture, then prove it with the
one line of trigonometry above.

Reference: J. D. Lawrence, *A Catalog of Special Plane Curves*, Dover, 1972; see also
[Rose (mathematics)](https://en.wikipedia.org/wiki/Rose_(mathematics)) on Wikipedia.
