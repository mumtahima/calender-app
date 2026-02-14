# STA 351: Probability Models and Inference - Study Notes

This directory contains comprehensive, exam-focused LaTeX study notes for STA 351.

## Module 1: Foundations of Multiple Random Variables

**File:** `Module1_Joint_Distributions.tex`

A complete, compilable LaTeX document covering all topics in Module 1:

### Topics Covered

1. **Joint Distributions**
   - Joint PMF (Discrete Case)
   - Joint PDF (Continuous Case)
   - Joint CDF and Properties
   - Independence of Random Variables

2. **Marginal Distributions**
   - Finding Marginal PMF/PDF
   - Relationship Between Joint and Marginal

3. **Conditional Distributions**
   - Conditional PMF and PDF
   - Conditional Expectation
   - Law of Iterated Expectation (Tower Property)

4. **Covariance and Correlation**
   - Definition and Computation of Covariance
   - Correlation Coefficient
   - Uncorrelated vs Independent (KEY DISTINCTION!)
   - Variance of Sums

### Features

- ✅ **Colored boxes** for definitions, theorems, warnings, and exam tips
- ✅ **TikZ/PGFPlots visualizations** for key concepts
- ✅ **Worked examples** with step-by-step solutions
- ✅ **Practice problems** with hints
- ✅ **Summary table** comparing discrete vs continuous cases
- ✅ **Python code snippets** for verification and simulation
- ✅ **Exam tips** and common mistakes highlighted
- ✅ **Quick reference appendix** with essential formulas

## Compiling the Documents

### Requirements

- LaTeX distribution (e.g., TeX Live, MiKTeX)
- Required packages: `amsmath`, `amssymb`, `amsthm`, `tikz`, `pgfplots`, `tcolorbox`, `listings`, `hyperref`, `geometry`

### Compilation

```bash
cd STA351_Notes
pdflatex Module1_Joint_Distributions.tex
pdflatex Module1_Joint_Distributions.tex  # Run twice for proper references
```

Or use your preferred LaTeX editor (TeXstudio, Overleaf, etc.)

## Document Structure

The document is designed with an **intuition-first approach**:
- Mathematical definitions are preceded by intuitive explanations
- Visual aids help understand abstract concepts
- Real-world examples demonstrate applications
- Common mistakes are highlighted to avoid pitfalls

## Using the Notes

1. **Read sequentially** for comprehensive understanding
2. **Focus on colored boxes** for key concepts
3. **Work through examples** before attempting practice problems
4. **Pay special attention to warnings** - these highlight common exam mistakes
5. **Use the quick reference** for formula lookup during problem-solving

## Additional Resources

The Python code snippets can be run independently to:
- Verify covariance formulas
- Visualize independence and correlation
- Simulate random variables
- Compute joint distributions from data

---

**Good luck with your studies!** 📚
