## The chord-and-tangent law

An **elliptic curve** over ℝ is the set of solutions of a Weierstrass equation

$$y^2 = x^3 + ax + b, \qquad 4a^3 + 27b^2 \neq 0,$$

together with a point at infinity 𝒪. Here $a = -1$ and you control $b$.

### What you're seeing
Draw the line through **P** and **Q**. By Bézout's theorem a line meets a cubic in three points counted with multiplicity, so it hits the curve once more, at **P∗Q**. Reflect that point across the *x*-axis to get **P + Q**.

With 𝒪 as the identity and reflection as negation, this rule makes the curve an **abelian group**. Commutativity is obvious. Associativity is the hard part; one classical proof uses the Cayley–Bacharach theorem for cubics through eight points.

### The formulas
For $P \neq \pm Q$, write $P = (x_P, y_P)$, $Q = (x_Q, y_Q)$ and $P + Q = (x_3, y_3)$. With the slope $\lambda = (y_Q - y_P)/(x_Q - x_P)$ of the chord,

$$
\begin{aligned}
x_3 &= \lambda^2 - x_P - x_Q, \\
y_3 &= \lambda\,(x_P - x_3) - y_P.
\end{aligned}
$$

### Try this
- Click the piece, then drag **P** or **Q** along the curve. The pointer's *x* snaps onto the curve, and dragging above or below the axis picks the branch. Esc (or a click outside) hands scrolling back; the points stay where you left them, and a share link keeps them.
- With the piece engaged, the keyboard works too: **P** or **Q** picks a point, ← and → move it (Shift for small steps), ↑ and ↓ pick the branch, 0 puts both back.
- Lower *b* below $2/(3\sqrt{3}) \approx 0.385$. The real curve splits into an oval and an unbounded branch. The unbounded branch is the identity component, and it is a subgroup. Drag P onto the oval and watch where P + Q goes.
- Drag P onto Q: the chord becomes the tangent at P and the readout shows 2P.
- Watch what happens as P passes under Q: the line turns vertical, and P + Q runs off to 𝒪.

### Where it leads
Over $\mathbb{F}_p$ the same formulas give elliptic-curve cryptography. Over ℚ, the Mordell–Weil theorem says *E*(ℚ) is finitely generated, and the Birch and Swinnerton-Dyer conjecture predicts its rank from an *L*-function.

**Reference.** Silverman and Tate, *Rational Points on Elliptic Curves*, chapter 1.
