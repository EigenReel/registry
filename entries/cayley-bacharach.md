## Eight points force a ninth

A plane cubic is the zero set of a polynomial

$$
F(x,y) = a_1x^3 + a_2x^2y + a_3xy^2 + a_4y^3 + a_5x^2 + a_6xy + a_7y^2 + a_8x + a_9y + a_{10}.
$$

It has ten coefficients, and rescaling them gives the same curve, so cubics form a 9-dimensional projective space $\mathbb{P}^9$. Asking a cubic to pass through a given point is one linear equation in the $a_i$. So nine points in general position determine a unique cubic, and eight points determine a one-parameter family, a **pencil**

$$
\lambda F + \mu G = 0, \qquad [\lambda : \mu] \in \mathbb{P}^1.
$$

By Bézout's theorem, two cubics without a common component meet in $3 \cdot 3 = 9$ points. Every member of the pencil vanishes wherever both $F$ and $G$ do, so all of them share those nine points. Eight of them are the points you chose. The ninth comes for free. This is the **Cayley–Bacharach theorem** for cubics (Chasles' version): *if two cubics meet in exactly nine points, every cubic through eight of them passes through the ninth.*

## What you're seeing

- The **dark red dots** are the eight chosen points. In the feed they drift slowly on small closed loops.
- The **faint thin curves** are several fixed members of the pencil of cubics through those eight points.
- The **thick curve** sweeps through the entire pencil, from $F$ to $G$ and back to $F$ (up to sign), once every 12 seconds, so it covers the pencil twice per loop.
- The **glowing pink dot** is the ninth base point. Nobody placed it. Each frame it is computed from the eight red points, and every curve on the screen, thin or thick, passes through it.

Watch the pink dot as the red points drift: the forced point moves too, smoothly and sometimes surprisingly far for a small push. It acts as a hub that every curve in the family threads.

The hypothesis matters. The theorem needs the pencil's base locus to be exactly nine points (counted with multiplicity). For eight distinct points, that holds exactly when **no four lie on a line and no seven lie on a conic**. If four lie on a line $\ell$, every cubic through them contains $\ell$, because a cubic that meets a line in four points contains it. Then all members of the pencil share the whole line, and there is no isolated ninth point. Seven points on a conic cause the same failure. With five on a line, or all eight on a conic, it gets worse: the cubics through the eight points form a two-parameter net instead of a pencil.

Two facts that are less obvious from the formula show up in the picture:

- **The ninth point is always real.** Complex conjugation permutes the nine base points and fixes the eight real ones, so it fixes the ninth too. It can, however, lie at infinity in the projective plane. Then the piece draws an arrow at the edge of the frame instead.
- **The ninth point can coincide with one of the eight.** Then every cubic in the pencil is tangent to every other one at that point.

## Two classical theorems inside the pencil

The pencil contains reducible members, and choosing the eight points cleverly turns Cayley–Bacharach into a one-line proof.

**Pascal's theorem.** Take six points $P_1,\dots,P_6$ on a conic $Q$. The three lines $P_1P_2$, $P_3P_4$, $P_5P_6$ form one cubic, and $P_2P_3$, $P_4P_5$, $P_6P_1$ form another. They meet in the six $P_i$ and in the three points where opposite sides cross. Take as the eight points the six $P_i$ plus two of those crossings, $X$ and $Y$. The cubic $Q \cdot \overline{XY}$ (the conic together with the line through $X$ and $Y$) passes through all eight. By Cayley–Bacharach it also passes through the third crossing $Z$. Since $Z$ is not on the conic, it lies on the line $XY$: the three crossings are collinear.

**Pappus's theorem** is the same argument with the conic replaced by a pair of lines $\ell \cup m$, three of the points on each.

## Try this

- Open [the Pascal configuration](#preset:pascal): points 1 to 6 are on a circle. The thick cubic is paused at the moment it splits into **the circle plus a straight line**. That line runs through points 7 and 8 and the pink ninth point: Pascal's line.
- With the Pascal points still set, jump to [t = 3.13](#t:3.13) and [t = 9.45](#t:9.45). The thick cubic is now one of the two triangles of alternate sides of the hexagon.
- Open [Pappus](#preset:pappus): the thick cubic is the two lines of three points together with the line through points 7, 8 and the forced ninth point. [The other Pappus preset](#preset:pappus-lines) pauses on one of the triangles of lines from the proof.
- In interact mode, drag any red point. Predict where the pink point will go before you let go.
- Line up four red points, slowly. As they approach a common line, the pink point slides onto that line too. When they are exactly collinear, the line becomes part of every cubic in the family, and the ninth point disappears.
- Drag one red point onto the pink one. The two merge, and the curves all become tangent there.
- Set "Other cubics drawn" to 12 to see more of the pencil, or to 0 to watch the thick curve sweep alone.

The same theorem gives the classical proof that the chord-and-tangent addition on an elliptic curve is associative. The theorem has a long line of generalizations, to curves of any degrees and to higher dimensions, surveyed by Eisenbud, Green and Harris.

Reference: D. Eisenbud, M. Green, J. Harris, *Cayley–Bacharach theorems and conjectures*, Bull. Amer. Math. Soc. 33 (1996), 295–324; see also [Cayley–Bacharach theorem](https://en.wikipedia.org/wiki/Cayley%E2%80%93Bacharach_theorem).
