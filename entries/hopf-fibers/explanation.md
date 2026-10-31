## The Hopf fibration

The 3-sphere *S³* is the set of pairs (*z*₁, *z*₂) of complex numbers with |*z*₁|² + |*z*₂|² = 1. The Hopf map sends it to the ordinary 2-sphere:

    h(z₁, z₂) = (2 z₁ z̄₂, |z₁|² − |z₂|²) ∈ ℂ × ℝ.

Multiplying both coordinates by the same unit complex number *e^{iα}* does not change *h*, and these are the only points with the same image. So the preimage of every point of *S²*, its fiber, is a circle: the great circle {(*z*₁*e^{iα}*, *z*₂*e^{iα}*)}. *S³* is the disjoint union of these circles, one for each point of *S²*.

### What you're seeing
The piece picks evenly spaced points around one circle of latitude on *S²* and draws their fibers. To show circles in *S³* in ordinary space it uses stereographic projection from the point (0, 0, 0, 1), which sends circles to circles (or to a line, for the circle through the projection point). The fiber over the north pole is the horizontal unit circle; the fiber over the south pole is the vertical axis. Fibers over one latitude sweep out a torus. Each fiber goes once around the torus the long way and once the short way, and these tilted circles are the Villarceau circles of that torus. Colors follow the longitude of the base point, so neighbors on *S²* are neighbors in the picture. On a phone the same fibers are drawn without the GPU, as lines sorted by depth instead of shaded tubes.

### Linking
Any two fibers are linked exactly once: you cannot pull one off the other without cutting it. That is why the fibration cannot be untwisted into a product *S²* × *S¹*, and it is the geometric content of the statement that *h* generates π₃(*S²*) ≅ ℤ. The Hopf invariant of *h*, which is the linking number of two fibers, is 1.

### Try this
- Turn it yourself: click the piece, then drag to orbit, right-drag (or Shift-drag) to pan and scroll to zoom; the arrow keys orbit and 0 resets. On a phone, tap it, then drag with one finger and pinch with two. The slow turn stops the moment you take the camera.
- Click (or tap) a circle: it lights up, the others fade, and the label gives the point of *S²* it lies over, (cos φ cos λ, cos φ sin λ, sin φ) for latitude φ and longitude λ. Its neighbors in the picture are its neighbors on the sphere.
- One latitude, one torus: at latitude 0° the fibers lie on the image of the Clifford torus. Raise the fiber count to 64 and the torus fills in.
- Two latitudes link: turn on the second ring, 35° further north. It is a thinner torus nested inside the first, and every one of its circles passes through every circle of the outer one.
- Near the pole: at 75° the fibers hug the unit circle, the fiber over the north pole. Move toward −40° and the circles grow large, because their fibers pass close to the projection point.

**Reference.** D. W. Lyons, "An elementary introduction to the Hopf fibration", *Mathematics Magazine* 76 (2003), 87–98. H. Hopf, "Über die Abbildungen der dreidimensionalen Sphäre auf die Kugelfläche", *Math. Ann.* 104 (1931), 637–665.
