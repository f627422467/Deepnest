<img src="https://deepnest.io/img/logo-large.png" alt="Deepnest" width="250">

**Deepnest**: A fast, robust nesting tool for laser cutters and other CNC tools

**Download:** https://deepnest.io

Deepnest is a desktop application based on [SVGNest](https://github.com/Jack000/SVGnest)

- new nesting engine with speed critical code written in C
- merges common lines for laser cuts
- support for DXF files (via conversion)
- new path approximation feature for highly complex parts

**Mac Hint:**
Environment Flags to build an run on Macs > 10.9:
CXXFLAGS="-mmacosx-version-min=10.9" LDFLAGS="-mmacosx-version-min=10.9" npm install

**Changes:**
Added a simple REST API. Enables to use Deepnest in an automated generate/build/layout process.
