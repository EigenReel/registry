## Genus three, in the moduli stack

The moduli stack $\overline{\mathcal M}_3$ parametrizes stable complex curves of arithmetic genus three. Its open substack $\mathcal M_3$ parametrizes smooth curves, whose underlying oriented surfaces have three handles. At a point represented by a curve $C$, the stabilizer is its finite automorphism group $\operatorname{Aut}(C)$.

## What you're seeing

The ivory surfaces are topological models of smooth genus-three curves. Their different shapes accompany selected automorphism loci, joined to marked points on the folded sheets. The sheets give a schematic view of the moduli stack, which has complex dimension six. Their coordinates and folds do not specify algebraic equations, dimensions, or incidence relations among the automorphism loci.

During each thirty-second loop, the surfaces turn once, together with their colored guides. This motion changes the viewpoint on each model. It does not deform the represented complex curve. The rotational guides show distinguished topological symmetries where these have been constructed. The translucent planes are reference sections through their axes. They do not assert that ambient reflections are holomorphic automorphisms, or that every automorphism acts as a rigid motion of the sculpture.

The small weighted graphs encode the boundary. A vertex records a normalization component, its weight records the component's genus, and an edge records a node. A loop joins two branches on the same component. For a connected graph $\Gamma$, the arithmetic genus and stability conditions are

$$
g=\sum_{v\in V(\Gamma)}g(v)+|E(\Gamma)|-|V(\Gamma)|+1=3,
\qquad 2g(v)-2+\operatorname{val}(v)>0.
$$

There are 42 such unmarked stable weighted graphs up to isomorphism, including the smooth type. Their strata have dimension $6-|E(\Gamma)|$. The 92 arrows record distinct immediate degeneration relations. Following an arrow creates one node. Reversing it contracts an edge, which adds the endpoint weights, or raises the vertex weight by one for a loop. The two boundary divisors are $\Delta_0$, whose general curve has one nonseparating node, and $\Delta_1$, whose general curve joins components of genera one and two. In the nodal models, paired branch tips have identical coordinates. These spatial drawings represent the abstract identifications and need not be embeddings in three-dimensional space.

## Try this

- Start with [the whole drawing](#preset:drawing). At [a quarter turn](#t:7.5), the curves and their guides have rotated together while the sheets remain fixed.
- Move **Unfold the boundary poset** slowly to separate its seven ranks, then inspect [the boundary](#preset:boundary). Each downward step adds a node and lowers the stratum dimension by one.
- Enter interact mode, drag to turn the composition, and scroll to zoom. Select a curve to approach it. Select it again, double-click, or press Escape to return.

Inspired by Elliot Kienzle's artwork featured in [AMS Notices](https://doi.org/10.1090/noti3280) by Jarod Alper. Made at the conference [Accelerating Mathematical Discovery: A Crash Course in AI and Computation](https://aimathconference.github.io/).

Reference — Jarod Alper, *Evolution of Stacks and Moduli*, Notices of the American Mathematical Society, 2025, with illustrations by Elliot Kienzle. See also [Kienzle's account of the drawings](https://chessapig.github.io/art/stacks) and the [full interactive atlas](https://zengrf.github.io/assets/html/genus-three-atlas.html).
