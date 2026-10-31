## The Galton board

A ball falls through *n* rows of pegs. At each peg it goes right with probability ½ and left with probability ½, independently. After *n* rows it lands in bin *k*, where *k* is the number of rightward bounces.

### What you're seeing
240 balls are released at a steady rate. Their paths come from a seeded random number generator, so every loop is the same. The bars are the bins; the curve is the normal density with the same mean and variance that the bars should approach, scaled to the number of balls that have landed.

### The mathematics
The bin of a ball is a sum of *n* independent Bernoulli(½) variables, so

*P(k) = C(n, k) / 2ⁿ*,  mean *n*/2,  variance *n*/4.

The de Moivre–Laplace theorem says that for large *n*

*P(k) ≈ (1 / √(2πσ²)) exp(−(k − n/2)² / 2σ²)*,  σ² = *n*/4.

This is the first and most concrete case of the central limit theorem: sums of many small independent pieces look Gaussian, whatever the details of a single piece. The width grows like √*n*, not like *n*, which is why a deep board does not spread out as fast as the number of rows suggests.

### Try this
- With 16 rows the tallest bin should hold *C(16, 8)/2¹⁶* ≈ 19.6% of the balls, about 47 of 240. Early on the histogram is ragged. The relative noise in a bin shrinks like 1/√(count).
- Drop to 4 rows. The histogram is the row 1, 4, 6, 4, 1 of Pascal's triangle, and the Gaussian is a poor fit. How many rows before the curve looks right?

**Reference.** W. Feller, *An Introduction to Probability Theory and Its Applications*, vol. 1, chapter VII. F. Galton, *Natural Inheritance* (1889).
