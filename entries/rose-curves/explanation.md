## Rose curves

A **rose** is the polar curve *r = cos(kθ)*. For a whole number *k* it closes up into evenly spaced petals, and how many depends on whether [*k*](#param:k) is odd or even.

### What you're seeing
The curve is traced over six seconds, held for three, and then traced again. The faint circle is *r* = 1, which every petal touches at its tip. The label names the curve and counts its petals.

### Why odd and even differ
Replacing θ with θ + π gives *cos(kθ + kπ) = (−1)ᵏ cos(kθ)*. In polar coordinates, (*r*, θ) and (−*r*, θ + π) are the same point.

- **Odd *k*:** *r*(θ + π) = −*r*(θ), so the second half-turn lands on the points of the first. The curve closes after θ = π, with *k* petals.
- **Even *k*:** *r*(θ + π) = *r*(θ), so the second half-turn draws the first half's petals on the opposite side. It takes the full turn to close, with 2*k* petals.

### Try this
- [Set *k* = 3](#preset:k-3). Watch the tracing stop after half a turn of θ: three petals.
- [Set *k* = 2](#preset:k-2). A smaller *k* gives more petals than *k* = 3 does, four instead of three.
- Move from *k* = 1 up to 12 and predict each petal count before the curve finishes.

### In the classroom
A first polar graph with a surprise in it. Students can guess the rule from the picture, then prove it with one line of trigonometry.

**Reference.** J. D. Lawrence, *A Catalog of Special Plane Curves*, Dover, 1972.
