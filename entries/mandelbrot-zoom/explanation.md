## Zooming into the Mandelbrot set

The Mandelbrot set *M* is the set of complex numbers *c* for which the orbit of 0 under

    z ↦ z² + c

stays bounded. If |*z*| ever exceeds 2 the orbit escapes to infinity, so membership can be tested by iterating and watching for that moment.

### What you're seeing
Every pixel of the box is one value of *c*, and the GPU runs the iteration for all of them at once in a fragment shader. Points that have not escaped within the iteration budget are drawn in the background color: as far as this picture can tell, they are in *M*. Every other point is colored by how fast it escaped. The camera zooms toward a point on the boundary of *M* and back out, once every 30 seconds, from a width of 3.2 down to about 3 × 10⁻⁵, a magnification of 10⁵. The readout shows the budget and the current zoom.

### The escape-time algorithm and smooth coloring
Iterate up to *N* times and record the first *n* with |*z*ₙ| > *R*. Coloring by the integer *n* gives visible bands. With a large bailout radius (here *R* = 16) the quantity

    μ = n + 1 − log₂(ln |zₙ|)

varies continuously with *c*, because near escape |*z*| roughly squares at every step, so the double logarithm counts the fraction of a step left over. The colors are a function of μ, mixed from the theme's two accent colors.

### Why the zoom stops at 10⁵
The shader computes in 32-bit floats, which carry about 7 significant digits. Near the seahorse valley at *c* ≈ −0.7436 + 0.1318*i*, neighboring floats are about 6 × 10⁻⁸ apart. At a width of 3 × 10⁻⁵ across a 700-pixel box, one pixel is 4 × 10⁻⁸, already finer than the floats can tell apart, so going deeper would show blocks, not detail. Deep-zoom renderers use double precision or perturbation theory: one reference orbit in high precision and small float offsets from it.

### Try this
- Steer it yourself: click (or tap) the piece, then drag to pan and scroll (or pinch) to zoom about the pointer; a double-click zooms in 2×, with Shift out. The view stays where you leave it, and a share link keeps it; **Resume the tour** in the list here, or 0 while the piece is engaged, hands the camera back to the zoom tour.
- Start on the seahorse valley at 300 iterations. Near the deepest point of the zoom, a featureless background-colored blob appears: those points escape, but slowly. Raise the iterations to 1000 and it fills with spirals.
- Switch the target to the Misiurewicz point and to the branch point. These are tips and branch points of filaments, where the set is so thin that almost every pixel escapes.
- Drop the iterations to 50. The overview looks fine, but the zoom shows a blob where the boundary should be: the budget, not the set, decides the picture.
- On a phone this piece runs its mobile version, which iterates on the CPU at half resolution and clamps the budget to at most 200 iterations, whatever the slider says (the readout shows when it is capped). Compare the seahorse valley there with 1000 iterations on a desktop: the blob at the deepest point is the clamp.

**Reference.** H.-O. Peitgen and P. H. Richter, *The Beauty of Fractals*, Springer, 1986, chapters 3 and 4. A. Douady and J. H. Hubbard, "Itération des polynômes quadratiques complexes", *C. R. Acad. Sci. Paris* 294 (1982), 123–126.
