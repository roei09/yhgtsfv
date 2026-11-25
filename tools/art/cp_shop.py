"""Draws the CardPull card shop as SVG. Same composition as the old raster (2560x1086) so the animated
overlays (counter neon, gem glow, nebula, shooting stars) keep their positions. 2000-wide coordinates."""
import math
import os
import random

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'assets', 'img', 'partners')

W, H = 2000, 848.44
INK = '#140c30'
R = random.Random(5)
out = []
lights = []
a = out.append
L = lights.append


def poly(pts, fill, stroke=INK, sw=3, extra=''):
    a(f'<polygon points="{" ".join(f"{x},{y}" for x, y in pts)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" {extra}/>')


def rect(x, y, w, h, fill, stroke=INK, sw=3, rx=0, extra=''):
    a(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>')


def neon(d, color, width=6):
    L(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width * 6}" stroke-linecap="round" stroke-linejoin="round" opacity=".3" filter="url(#gS)"/>')
    L(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width * 2.4}" stroke-linecap="round" stroke-linejoin="round" opacity=".55" filter="url(#gP)"/>')
    L(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>')
    L(f'<path d="{d}" fill="none" stroke="#fff" stroke-width="{width * .3}" stroke-linecap="round" opacity=".75"/>')


SYM = {
    'fire': 'M0 18 C-12 10 -10 -4 0 -18 C2 -8 10 -6 8 4 C12 0 12 -4 12 -6 C18 4 14 16 0 18 Z',
    'drop': 'M0 -18 C8 -6 14 2 14 8 C14 16 8 20 0 20 C-8 20 -14 16 -14 8 C-14 2 -8 -6 0 -18 Z',
    'leaf': 'M-14 16 C-18 -4 -4 -18 16 -18 C18 2 6 16 -14 16 Z M-14 16 L8 -8',
    'star': 'M0 -18 L5 -6 L18 -6 L8 3 L12 16 L0 8 L-12 16 L-8 3 L-18 -6 L-5 -6 Z',
    'swirl': 'M0 0 m-2 0 a2 2 0 1 1 4 0 a6 6 0 1 1 -12 0 a10 10 0 1 1 20 0 a14 14 0 1 1 -28 0',
}
SC = {'fire': ('#ff7a2a', '#ffcf5a'), 'drop': ('#3aa0ff', '#bfe4ff'), 'leaf': ('#3fbf5a', '#c8ffb0'), 'star': ('#ffd23a', '#fff4b0'), 'swirl': ('#c08aff', '#ffd2f0')}


def card(x, y, w, h, sym, bg, rot=0, s=1.0, frame='#ffffff'):
    cx, cy = x + w / 2, y + h / 2
    c1, c2 = SC[sym]
    a(f'<g transform="rotate({rot} {cx} {cy})">')
    rect(x, y, w, h, bg, rx=6, sw=3)
    rect(x + w * .07, y + h * .05, w * .86, h * .9, 'none', stroke=frame, sw=4, rx=4)
    rect(x + w * .14, y + h * .09, w * .72, h * .82, 'none', stroke=frame, sw=1.5, rx=3, extra='stroke-dasharray="3 3" opacity=".8"')
    fill = 'none' if sym == 'swirl' else c1
    a(f'<path d="{SYM[sym]}" transform="translate({cx} {cy}) scale({s})" fill="{fill}" stroke="{c1 if sym == "swirl" else INK}" stroke-width="{4 if sym == "swirl" else 2.5 / s}" stroke-linejoin="round"/>')
    a('</g>')


a(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice">')
a('''<defs>
<filter id="gP" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="gS" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
<filter id="neb" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="18"/></filter>
<filter id="nebS" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="7"/></filter>
<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3796"/><stop offset="1" stop-color="#3a2c80"/></linearGradient>
<linearGradient id="wallL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#33276e"/><stop offset="1" stop-color="#4a3896"/></linearGradient>
<linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a1c6a"/><stop offset=".5" stop-color="#3a2286"/><stop offset="1" stop-color="#2a2a7a"/></linearGradient>
<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3c8e"/><stop offset="1" stop-color="#2e2668"/></linearGradient>
<linearGradient id="wood" x1="0" y1="0" x2="1" y2=".2"><stop offset="0" stop-color="#a06a48"/><stop offset=".55" stop-color="#8a5a3c"/><stop offset="1" stop-color="#6a4430"/></linearGradient>
<linearGradient id="woodS" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a3826"/><stop offset="1" stop-color="#7a4e36"/></linearGradient>
<linearGradient id="foil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".6" stop-color="#b8f0ff" stop-opacity=".45"/><stop offset=".8" stop-color="#ffb8f0" stop-opacity=".3"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff2a8"/><stop offset=".5" stop-color="#e8c050"/><stop offset="1" stop-color="#b8862a"/></linearGradient>
<linearGradient id="etb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8a5af0"/><stop offset="1" stop-color="#4a2aa0"/></linearGradient>
<linearGradient id="cSide" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#211a50"/><stop offset="1" stop-color="#2e2668"/></linearGradient>
<linearGradient id="cpSky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6ad8ff"/><stop offset=".5" stop-color="#7a5af0"/><stop offset="1" stop-color="#3a1a9a"/></linearGradient>
<linearGradient id="cpGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset=".6" stop-color="#ffc23a"/><stop offset="1" stop-color="#e8961a"/></linearGradient>
<linearGradient id="soda" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7ee89a"/><stop offset=".45" stop-color="#2fbf5a"/><stop offset="1" stop-color="#157a34"/></linearGradient>
<radialGradient id="nicheBack" cx=".5" cy="0" r="1.1"><stop offset="0" stop-color="#3e3290"/><stop offset=".6" stop-color="#2a2066"/><stop offset="1" stop-color="#1f1850"/></radialGradient>
<linearGradient id="shelfTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a3c9a"/><stop offset="1" stop-color="#6a5ac0"/></linearGradient>
<linearGradient id="bayShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0a0620" stop-opacity=".35"/><stop offset="1" stop-color="#0a0620" stop-opacity="0"/></linearGradient>
<linearGradient id="lemonade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e8fff0" stop-opacity=".55"/><stop offset=".5" stop-color="#c8f2d4" stop-opacity=".35"/><stop offset="1" stop-color="#9ad8b0" stop-opacity=".5"/></linearGradient>
<linearGradient id="label" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2ecc5a"/><stop offset=".5" stop-color="#1faa48"/><stop offset="1" stop-color="#0f7a34"/></linearGradient>
<linearGradient id="cap" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5ae07a"/><stop offset="1" stop-color="#138a3a"/></linearGradient>
<filter id="dFur" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="1.5"/></filter>
<linearGradient id="dbSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a1a7a"/><stop offset=".55" stop-color="#6a3ae0"/><stop offset="1" stop-color="#3ab0e8"/></linearGradient>
<radialGradient id="dbHalo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff3c0" stop-opacity=".85"/><stop offset=".5" stop-color="#ffb8f0" stop-opacity=".35"/><stop offset="1" stop-color="#ffb8f0" stop-opacity="0"/></radialGradient>
<linearGradient id="dbGoldText" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffbe0"/><stop offset=".45" stop-color="#ffd34a"/><stop offset="1" stop-color="#e8901a"/></linearGradient>
<linearGradient id="dbSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8962a"/><stop offset="1" stop-color="#a86a12"/></linearGradient>
<linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd8a0" stop-opacity=".55"/><stop offset="1" stop-color="#ffd8a0" stop-opacity="0"/></linearGradient>
<linearGradient id="cTop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9a8ad8"/><stop offset="1" stop-color="#6a5aa8"/></linearGradient>
<linearGradient id="cFront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3278"/><stop offset="1" stop-color="#262058"/></linearGradient>
<radialGradient id="vig" cx=".45" cy=".45" r=".8"><stop offset=".5" stop-color="#06031a" stop-opacity="0"/><stop offset="1" stop-color="#06031a" stop-opacity=".55"/></radialGradient>
</defs>''')

# ---- shell: ceiling corner top-left, back wall, floor ----
rect(0, 0, W, H, 'url(#wall)', stroke='none', sw=0)
poly([(0, 0), (700, 0), (700, 112), (0, 40)], '#3c2d84', sw=0, stroke='none')
poly([(0, 40), (700, 112), (712, 640), (0, 760)], 'url(#wallL)', sw=0, stroke='none')      # left wall
a(f'<path d="M700 112 L712 660" stroke="{INK}" stroke-width="2.5" opacity=".6"/>')
poly([(0, 760), (712, 640), (2000, 660), (2000, 848.44), (0, 848.44)], 'url(#floor)', sw=0, stroke='none')
# floor planks converging toward the back-left
for i in range(14):
    x = -400 + i * 230
    a(f'<path d="M{x} 848 L{560 + i * 105} 648" stroke="{INK}" stroke-width="2" opacity=".45"/>')
for y in [690, 735, 790]:
    a(f'<path d="M0 {y + 60} L2000 {y}" stroke="{INK}" stroke-width="1.5" opacity=".25"/>')
for x, y in [(1000, 700), (1300, 760), (1600, 690), (800, 800), (1750, 790)]:
    a(f'<path d="M{x} {y} l30 -2" stroke="{INK}" stroke-width="2" opacity=".35"/>')
a(f'<path d="M0 760 L712 640 L2000 660" stroke="{INK}" stroke-width="3" fill="none"/>')
poly([(880, 780), (1360, 760), (1390, 848), (900, 848)], '#5a3aa0', sw=2, extra='opacity=".45"')

# ---- big windows onto space ----
poly([(790, 60), (2000, 0), (2000, 612), (790, 585)], '#2a2260', sw=4)
panes = [[(808, 98), (1060, 88), (1062, 570), (808, 560)],
         [(1084, 40), (1572, 18), (1572, 582), (1084, 572)],
         [(1594, 12), (2000, 0), (2000, 600), (1594, 584)]]
a('<clipPath id="glass">' + ''.join(f'<polygon points="{" ".join(f"{x},{y}" for x, y in p)}"/>' for p in panes) + '</clipPath>')
a('<g clip-path="url(#glass)">')
rect(780, 0, 1240, 620, 'url(#sky)', stroke='none', sw=0)
# a milky-way band from lower left to upper right, then the bright cloud in the middle pane
a('<polygon points="800,560 1000,560 2000,60 2000,-80 1800,-80" fill="#8a4ad8" opacity=".45" filter="url(#neb)"/>')
a('<polygon points="860,520 940,520 2000,120 2000,20" fill="#c070ff" opacity=".35" filter="url(#neb)"/>')
for cx, cy, rx, ry, c, o, f in [(1230, 200, 150, 42, '#c06aff', .8, 'neb'), (1290, 225, 110, 34, '#5a8cff', .65, 'neb'), (1180, 190, 60, 20, '#ffd8f4', .4, 'neb'),
                                (1240, 206, 34, 14, '#ffffff', .35, 'neb'), (1790, 140, 200, 90, '#c060ff', .6, 'neb'), (1860, 230, 140, 80, '#5a90ff', .5, 'neb'),
                                (1760, 120, 70, 30, '#ffc8f0', .3, 'neb'), (1450, 400, 260, 60, '#9a50ff', .35, 'neb'), (960, 330, 120, 70, '#7a4aff', .35, 'neb')]:
    a(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{c}" opacity="{o}" filter="url(#{f})" transform="rotate(-14 {cx} {cy})"/>')
for _ in range(520):
    x = 790 + R.random() * 1210; y = R.random() * 600; r = R.choice([.8, 1, 1.2, 1.6, 2.2])
    a(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r}" fill="#fff" opacity="{.4 + R.random() * .6:.2f}"/>')
for x, y, s in [(1215, 126, 9), (1340, 230, 6), (980, 360, 6), (1700, 60, 8), (1900, 420, 7), (1470, 500, 5)]:
    a(f'<path d="M{x} {y - s} L{x + s * .25} {y - s * .25} L{x + s} {y} L{x + s * .25} {y + s * .25} L{x} {y + s} L{x - s * .25} {y + s * .25} L{x - s} {y} L{x - s * .25} {y - s * .25} Z" fill="#fff"/>')
for x in [880, 1180, 1340, 1680, 1850]:
    a(f'<path d="M{x} 600 L{x + 220} 0 L{x + 300} 0 L{x + 80} 600 Z" fill="#fff" opacity=".06"/>')
a('</g>')
for p in panes:
    poly(p, 'none', stroke='#3c3488', sw=12)
    poly(p, 'none', stroke=INK, sw=2.5)
poly([(790, 585), (2000, 612), (2000, 640), (790, 605)], '#34296e', sw=2)                   # sill
a(f'<path d="M760 66 L2000 4" stroke="#463c90" stroke-width="10"/><rect x="1048" y="22" width="34" height="28" fill="#3a3080" stroke="{INK}" stroke-width="2"/>')
rect(724, 300, 26, 40, '#3a3080', sw=2)
a(f'<path d="M737 70 L737 300 M737 340 L737 640" stroke="#3a3080" stroke-width="6"/>')

# ---- neon strip along the ceiling ----
neon('M420 0 L700 112 L1205 0', '#c77dff', 5)


# ---- shelves built into the left wall: a shallow recess the length of the wall, painted the wall colour ----
WVX, WVY = 2652, 313                       # vanishing point of the left wall's horizontals


def wy(x, y0):
    """Height at x of the left-wall line that is at y0 where the wall meets the screen edge (x=0)."""
    return WVY + (y0 - WVY) * (WVX - x) / WVX


def P(*pts):
    return ' '.join(f'{x:.1f},{y:.1f}' for x, y in pts)


NX0, NX1 = 14, 684                         # recess ends
N_TOP, N_MID, N_BOT = 300, 392, 482        # recess top, middle shelf, bottom shelf (heights at x=0)


DEPTH = 16                                  # how far the recess goes into the wall, as seen on screen
frame = [(NX0 - 8, wy(NX0, N_TOP - 12)), (NX1 + 8, wy(NX1, N_TOP - 12)), (NX1 + 8, wy(NX1, N_BOT + 14)), (NX0 - 8, wy(NX0, N_BOT + 14))]
hole = [(NX0, wy(NX0, N_TOP)), (NX1, wy(NX1, N_TOP)), (NX1, wy(NX1, N_BOT + 6)), (NX0, wy(NX0, N_BOT + 6))]
a(f'<polygon points="{P(*frame)}" fill="#43358a"/>')
a(f'<path d="M{frame[0][0]} {frame[0][1]:.1f} L{frame[1][0]} {frame[1][1]:.1f}" stroke="#6a5ab8" stroke-width="2" opacity=".7"/>')
a(f'<path d="M{frame[3][0]} {frame[3][1]:.1f} L{frame[2][0]} {frame[2][1]:.1f}" stroke="#251c58" stroke-width="2"/>')
a(f'<polygon points="{P(*hole)}" fill="url(#nicheBack)"/>')
# the recess's ceiling and left inner side, in shadow
a(f'<polygon points="{P(hole[0], hole[1], (NX1, wy(NX1, N_TOP) + DEPTH * .6), (NX0 + DEPTH, wy(NX0, N_TOP) + DEPTH * .6))}" fill="#1c1446"/>')
a(f'<polygon points="{P(hole[0], (NX0 + DEPTH, wy(NX0, N_TOP) + DEPTH * .6), (NX0 + DEPTH, wy(NX0, N_BOT)), hole[3])}" fill="#251c5a"/>')
# LED strip under the ceiling and the light it throws down the back wall
for b0, b1 in ((NX0 + DEPTH + 4, 236), (254 + DEPTH, 466), (484 + DEPTH, NX1 - 4)):
    L(f'<polygon points="{P((b0, wy(b0, N_TOP) + DEPTH * .6 - 3), (b1, wy(b1, N_TOP) + DEPTH * .6 - 3), (b1, wy(b1, N_TOP) + DEPTH * .6), (b0, wy(b0, N_TOP) + DEPTH * .6))}" fill="#e6d4ff" opacity=".9"/>')
L(f'<polygon points="{P((NX0 + DEPTH, wy(NX0, N_TOP) + 10), (NX1, wy(NX1, N_TOP) + 10), (NX1, wy(NX1, N_TOP) + 70), (NX0 + DEPTH, wy(NX0, N_TOP) + 70))}" fill="#b48cff" opacity=".16" filter="url(#gP)"/>')
# shelves: lit top surface with a bright front lip
for y in (N_MID, N_BOT):
    a(f'<polygon points="{P((NX0 + DEPTH, wy(NX0, y) - 10), (NX1, wy(NX1, y) - 10), (NX1, wy(NX1, y)), (NX0, wy(NX0, y)))}" fill="url(#shelfTop)"/>')
    a(f'<polygon points="{P((NX0, wy(NX0, y)), (NX1, wy(NX1, y)), (NX1, wy(NX1, y) + 6), (NX0, wy(NX0, y) + 6))}" fill="#3a2e7c"/>')
    a(f'<path d="M{NX0} {wy(NX0, y):.1f} L{NX1} {wy(NX1, y):.1f}" stroke="#8a7ad8" stroke-width="1.5" opacity=".8"/>')
    a(f'<polygon points="{P((NX0 + DEPTH, wy(NX0, y) - 10), (NX1, wy(NX1, y) - 10), (NX1, wy(NX1, y) - 7), (NX0 + DEPTH, wy(NX0, y) - 7))}" fill="#000" opacity=".25"/>')
# two dividers: front edge and the side facing the room's light
for x in (240, 470):
    a(f'<polygon points="{P((x, wy(x, N_TOP)), (x + 7, wy(x + 7, N_TOP)), (x + 7, wy(x + 7, N_BOT + 6)), (x, wy(x, N_BOT + 6)))}" fill="#4a3c96"/>')
    a(f'<polygon points="{P((x + 7, wy(x + 7, N_TOP) + 4), (x + 7 + DEPTH * .8, wy(x + 7, N_TOP) + DEPTH * .6), (x + 7 + DEPTH * .8, wy(x + 7, N_BOT) - 4), (x + 7, wy(x + 7, N_BOT + 6)))}" fill="#2f2470"/>')
    a(f'<path d="M{x} {wy(x, N_TOP):.1f} L{x} {wy(x, N_BOT + 6):.1f}" stroke="#6a5ab8" stroke-width="1.2" opacity=".7"/>')
# a soft corner shadow down the left side of each bay
for x in (NX0 + DEPTH, 247 + DEPTH, 477 + DEPTH):
    a(f'<rect x="{x}" y="{wy(x, N_TOP):.0f}" width="22" height="{wy(x, N_BOT) - wy(x, N_TOP):.0f}" fill="url(#bayShade)"/>')


def on_shelf(x, y_shelf, w, h):
    """Translate to the top-left of an object w x h standing on a shelf (shelf height given at x=0)."""
    base = wy(x + w / 2, y_shelf) - 5
    a(f'<ellipse cx="{x + w / 2:.1f}" cy="{base + 1:.1f}" rx="{w * .6:.1f}" ry="3" fill="#0a0620" opacity=".45" filter="url(#dFur)"/>')
    return f'translate({x:.1f} {base - h:.1f})'


NS = 'vector-effect="non-scaling-stroke"'


def pack(x, y_shelf, c1, c2, sym, rot=0):
    w, h = 32, 50
    a(f'<g transform="{on_shelf(x, y_shelf, w, h)} rotate({rot} {w / 2} {h})">'
      f'<rect x="0" y="3" width="{w}" height="{h - 6}" fill="{c1}" stroke="{INK}" stroke-width="1.6"/>'
      f'<rect x="0" y="3" width="{w}" height="{h - 6}" fill="url(#foil)" opacity=".5"/>'
      f'<path d="M0 3 l2.66 -2.5 l2.66 2.5 l2.66 -2.5 l2.66 2.5 l2.66 -2.5 l2.66 2.5 l2.66 -2.5 l2.66 2.5 l2.66 -2.5 l2.66 2.5 l2.66 -2.5 l2.66 2.5 L{w} 7 L0 7 Z M0 {h - 7} L{w} {h - 7} L{w} {h - 3} L0 {h - 3} Z" fill="#ecebf6"/>'
      f'<circle cx="{w / 2}" cy="{h / 2}" r="9.5" fill="{c2}"/><circle cx="{w / 2}" cy="{h / 2}" r="9.5" fill="url(#foil)" opacity=".6"/>'
      f'<path d="{SYM[sym]}" transform="translate({w / 2} {h / 2}) scale(.46)" fill="#fff" stroke="{INK}" stroke-width="1.3" {NS}/>'
      f'<path d="M3 9 L10 9 L4 {h - 9} L3 {h - 9} Z" fill="#fff" opacity=".25"/></g>')


def soda(x, y_shelf):
    """A clear 1.5L lemon-lime soda bottle: green cap, green label, fizzy liquid, moulded ribs and a petal base."""
    w, h = 34, 104
    body = ('M13 10 h8 v4 C21 18 31 24 31 36 V88 C31 92 33 94 33 97 C33 101 29 102 25 102 Q17 104 9 102 '
            'C5 102 1 101 1 97 C1 94 3 92 3 88 V36 C3 24 13 18 13 14 Z')
    k = .74
    # a soft green glow behind the bottle and a little light spilling onto the shelf
    cx, base = x + w * k / 2, wy(x + w * k / 2, y_shelf) - 5
    a(f'<ellipse cx="{cx:.1f}" cy="{base - h * k * .5:.1f}" rx="{w * k * 1.3:.1f}" ry="{h * k * .62:.1f}" fill="#5aff8a" opacity=".28" filter="url(#gS)"/>')
    a(f'<ellipse cx="{cx:.1f}" cy="{base:.1f}" rx="{w * k * 1.4:.1f}" ry="5" fill="#7dffa0" opacity=".3" filter="url(#gP)"/>')
    a(f'<g transform="{on_shelf(x, y_shelf, w * k, h * k)} scale({k})">')
    a(f'<path d="{body}" fill="#d8f4e2" fill-opacity=".28" stroke="#cfe9da" stroke-width="1.3"/>')
    a(f'<path d="M3.6 44 H30.4 V88 C30.4 92 32.4 94 32.4 97 C32.4 100.6 28.6 101.4 25 101.4 Q17 103.2 9 101.4 C5.4 101.4 1.6 100.6 1.6 97 C1.6 94 3.6 92 3.6 88 Z" fill="url(#lemonade)"/>')
    for bx, by, br in ((8, 90, 1), (12, 82, .8), (24, 92, 1.1), (20, 70, .7), (26, 78, .9), (9, 62, .7), (16, 96, .8), (27, 60, .6)):
        a(f'<circle cx="{bx}" cy="{by}" r="{br}" fill="#fff" opacity=".8"/>')
    a('<path d="M3.6 44 H30.4" stroke="#fff" stroke-width="1" opacity=".7"/>')
    for ry in (28, 32):
        a(f'<path d="M4.5 {ry} Q17 {ry + 2.5} 29.5 {ry}" stroke="#ffffff" stroke-width="1" fill="none" opacity=".45"/>')
    for ry in (78, 84):
        a(f'<path d="M3.6 {ry} Q17 {ry + 2} 30.4 {ry}" stroke="#ffffff" stroke-width=".9" fill="none" opacity=".35"/>')
    a('<path d="M9 102 L11 96 M17 103 L17 96 M25 102 L23 96" stroke="#fff" stroke-width=".8" opacity=".5"/>')
    # label with the product name
    a('<path d="M3 46 H31 V68 H3 Z" fill="url(#label)"/>')
    a('<path d="M3 46 H31 V49 H3 Z M3 65 H31 V68 H3 Z" fill="#0f6a2a"/>')
    a('<path d="M3 59 Q17 54 31 57 V61 Q17 58 3 63 Z" fill="#ffd23a" opacity=".9"/>')
    a('<text x="17" y="57" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-style="italic" font-size="8.5" fill="#fff" stroke="#0f5a24" stroke-width="1" paint-order="stroke" textLength="25" lengthAdjust="spacingAndGlyphs">לימון־ליים</text>')
    # cap
    a(f'<rect x="12" y="2" width="10" height="8.5" rx="1.6" fill="url(#cap)" stroke="{INK}" stroke-width="1"/>')
    a('<path d="M14 3 v6.5 M16.5 3 v6.5 M19 3 v6.5" stroke="#0f6a2a" stroke-width=".8"/><rect x="11.5" y="10" width="11" height="2" rx="1" fill="#1f8a3a"/>')
    # reflections on the plastic
    a('<path d="M6 34 C5 46 5 70 6 90" stroke="#fff" stroke-width="2.2" fill="none" opacity=".55" stroke-linecap="round"/>')
    a('<path d="M27 38 C28 50 28 70 27 86" stroke="#fff" stroke-width="1" fill="none" opacity=".35" stroke-linecap="round"/>')
    a('<path d="M15 15 C12 20 8 24 6.5 30" stroke="#fff" stroke-width="1.4" fill="none" opacity=".5" stroke-linecap="round"/>')
    a('</g>')
    L(f'<path d="M{x + 3 * k:.1f} {base - 60 * k:.1f} C{x + 2 * k:.1f} {base - 40 * k:.1f} {x + 2 * k:.1f} {base - 20 * k:.1f} {x + 3 * k:.1f} {base - 8 * k:.1f}" stroke="#c8ffd8" stroke-width="1.6" fill="none" opacity=".6"/>')


# fewer things, more air: two packs and the bottle on the left, one graded card in the middle, the crystals on the right
pack(48, N_MID, '#e85a3a', '#ffb347', 'fire', -3)
pack(96, N_MID, '#3a7ad8', '#9fd4ff', 'drop', 2)
soda(170, N_BOT)
a(f'<g transform="{on_shelf(338, N_MID, 42, 68)}"><rect x="0" y="0" width="42" height="68" rx="4" fill="#dfe8ff" opacity=".35" stroke="#f0f4ff" stroke-width="1.5"/>'
  f'<rect x="4" y="3" width="34" height="9" rx="1" fill="#f4f4fa"/><rect x="6" y="5.5" width="16" height="2.5" fill="#c33"/><rect x="27" y="4.5" width="8" height="6" fill="#223"/>'
  f'<rect x="6" y="15" width="30" height="49" rx="2" fill="url(#gold)" stroke="{INK}" stroke-width="1"/>'
  f'<rect x="8.5" y="17.5" width="25" height="44" rx="1.5" fill="#3a7ad8"/><rect x="10.5" y="21" width="21" height="17" fill="#bfe4ff"/>'
  f'<path d="{SYM["drop"]}" transform="translate(21 29.5) scale(.38)" fill="#3a7ad8"/>'
  '<path d="M1 1 L18 1 L8 67 L1 67 Z" fill="#fff" opacity=".2"/></g>')
gx = 560
gy = wy(gx, N_MID) - 5
a(f'<ellipse cx="{gx + 28}" cy="{gy + 1:.1f}" rx="34" ry="3.5" fill="#0a0620" opacity=".45" filter="url(#dFur)"/>')
a(f'<g transform="translate({gx} {gy:.0f}) scale(.62)">'
  f'<path d="M-6 0 L6 -30 L30 -36 L42 -8 L22 4 Z" fill="#5ae0e8" stroke="{INK}" stroke-width="2.5"/>'
  '<path d="M6 -30 L18 -10 L30 -36 M18 -10 L22 4" stroke="#c8faff" stroke-width="2" fill="none"/>'
  f'<path d="M34 2 L38 -34 L66 -48 L92 -28 L88 4 L60 10 Z" fill="#3ae05a" stroke="{INK}" stroke-width="2.5"/>'
  '<path d="M38 -34 L62 -20 L66 -48 M62 -20 L60 10 M62 -20 L92 -28" stroke="#c4ffbc" stroke-width="2" fill="none"/></g>')
L(f'<circle cx="{gx + 28}" cy="{gy - 12:.0f}" r="40" fill="#5aff8a" opacity=".2" filter="url(#gS)"/>')
# lower shelf: just a pair of binders and a deck box
for i, c in enumerate(('#8a5ad8', '#3a8ad0')):
    w, h = 17, 66
    a(f'<g transform="{on_shelf(300 + i * 20, N_BOT, w, h)}"><rect width="{w}" height="{h}" rx="2.5" fill="{c}" stroke="{INK}" stroke-width="1.5"/>'
      f'<rect x="3" y="9" width="11" height="14" rx="1.5" fill="#fff" opacity=".75"/><rect x="0" y="{h - 10}" width="{w}" height="3" fill="#000" opacity=".2"/>'
      f'<rect x="1" y="1" width="3" height="{h - 2}" fill="#fff" opacity=".2"/></g>')
a(f'<g transform="{on_shelf(560, N_BOT, 42, 36)}"><rect width="42" height="36" rx="5" fill="#6a4ad0" stroke="{INK}" stroke-width="1.5"/>'
  f'<rect width="42" height="11" rx="5" fill="#8a6af0"/><circle cx="21" cy="24" r="6" fill="none" stroke="#e0d0ff" stroke-width="1.6"/>'
  '<rect x="2" y="2" width="5" height="32" rx="2" fill="#fff" opacity=".15"/></g>')

# ---- display counter: one solid box, the top slab resting on it with a small overhang ----
FL, FR = (782, 604), (1062, 551)             # front top edge
BL = (676, 570)                               # back left top corner
BR = (BL[0] + FR[0] - FL[0], BL[1] + FR[1] - FL[1])
FLb, FRb, BLb = (780, 812), (1062, 752), (680, 750)
# shadow on the floor
a(f'<polygon points="{P((662, 752), (780, 826), (1090, 760), (960, 724))}" fill="#0a0620" opacity=".45" filter="url(#gP)"/>')
a(f'<polygon points="{P(BL, FL, FLb, BLb)}" fill="url(#cSide)" stroke="{INK}" stroke-width="3"/>')
a(f'<polygon points="{P(FL, FR, FRb, FLb)}" fill="url(#cFront)" stroke="{INK}" stroke-width="3"/>')
o, th = 10, 16
def lift(p, dx=0, dy=0): return (p[0] + dx, p[1] + dy)
tFL, tFR, tBR, tBL = lift(FL, -o * .6, o * .5 - th), lift(FR, o, -th), lift(BR, o * .6, -o * .5 - th), lift(BL, -o, -th)
a(f'<polygon points="{P(tBL, tFL, lift(tFL, 0, th), lift(tBL, 0, th))}" fill="#6a5ab0" stroke="{INK}" stroke-width="2.5"/>')
a(f'<polygon points="{P(tFL, tFR, lift(tFR, 0, th), lift(tFL, 0, th))}" fill="#7d6cc4" stroke="{INK}" stroke-width="2.5"/>')
a(f'<polygon points="{P(tBL, tBR, tFR, tFL)}" fill="url(#cTop)" stroke="{INK}" stroke-width="3"/>')
a(f'<path d="M{tFL[0] + 6:.0f} {tFL[1] + 2:.0f} L{tFR[0] - 6:.0f} {tFR[1] + 2:.0f}" stroke="#fff" stroke-width="2" opacity=".45"/>')
# LED strip under the overhang
neon(f'M{FL[0] + 4} {FL[1] + 4} L{FR[0] - 4} {FR[1] + 4}', '#56e6ff', 3)
neon(f'M{BL[0] + 4} {BL[1] + 6} L{FL[0] - 4} {FL[1] + 4}', '#b06aff', 3)

# three holo cards in a glass case on the front, drawn in the plane of the front face
SLOPE = (FR[1] - FL[1]) / (FR[0] - FL[0])
CARD_W, CARD_H = 84, 142
CARD_K = .8                                    # cards are drawn at 84x142 and scaled to fit the case
CARDS = [(814, 'fire', ('#ffb08a', '#e2553a')), (899, 'drop', ('#9fd8ff', '#3a7ad8')), (984, 'leaf', ('#c4f0a0', '#3f9a4a'))]
CASE = (800, 1048, 26, 166)
cx0, cx1, cy0, cy1 = CASE
def fy(x, off): return FL[1] + SLOPE * (x - FL[0]) + off
a(f'<polygon points="{P((cx0, fy(cx0, cy0)), (cx1, fy(cx1, cy0)), (cx1, fy(cx1, cy1)), (cx0, fy(cx0, cy1)))}" fill="#120c34" stroke="{INK}" stroke-width="2.5"/>')
for x0, sym, (c1, c2) in CARDS:
    y0 = fy(x0, 40)
    a(f'<g transform="matrix(1,{SLOPE:.4f},0,1,{x0},{y0:.1f})"><g transform="scale({CARD_K})">')
    a(f'<rect x="0" y="0" width="{CARD_W}" height="{CARD_H}" rx="6" fill="url(#gold)" stroke="{INK}" stroke-width="2"/>')
    a(f'<rect x="5" y="5" width="{CARD_W - 10}" height="{CARD_H - 10}" rx="4" fill="{c2}"/>')
    a(f'<rect x="5" y="5" width="{CARD_W - 10}" height="{CARD_H - 10}" rx="4" fill="url(#foil)" opacity=".35"/>')
    a(f'<rect x="9" y="9" width="44" height="6" rx="3" fill="#fff" opacity=".85"/><circle cx="{CARD_W - 16}" cy="12" r="6" fill="#fff" opacity=".9"/>')
    a(f'<rect x="9" y="20" width="{CARD_W - 18}" height="62" rx="2" fill="{c1}" stroke="#f7e7a0" stroke-width="2"/>')
    a(f'<circle cx="{CARD_W / 2}" cy="51" r="24" fill="#fff" opacity=".35"/>')
    a(f'<path d="{SYM[sym]}" transform="translate({CARD_W / 2} 51) scale(1.25)" fill="{c2}" stroke="{INK}" stroke-width="2"/>')
    a(f'<path d="M9 20 L40 20 L20 82 L9 82 Z" fill="#fff" opacity=".22"/>')
    for i, w in enumerate((58, 50, 40)):
        a(f'<rect x="10" y="{92 + i * 11}" width="{w}" height="4" rx="2" fill="#fff" opacity=".6"/>')
    a('</g></g>')
# glass reflection over the case, then the neon frame
a(f'<polygon points="{P((cx0 + 30, fy(cx0 + 30, cy0)), (cx0 + 90, fy(cx0 + 90, cy0)), (cx0 + 40, fy(cx0 + 40, cy1)), (cx0 - 10 + 30, fy(cx0 + 20, cy1)))}" fill="#fff" opacity=".07"/>')
neon(f'M{cx0} {fy(cx0, cy0):.0f} L{cx1} {fy(cx1, cy0):.0f} L{cx1} {fy(cx1, cy1):.0f} L{cx0} {fy(cx0, cy1):.0f} Z', '#56e6ff', 4)
# neon accents on the side, following its perspective
for t, c in ((.3, '#b06aff'), (.5, '#c77dff'), (.82, '#56e6ff')):
    l = (BL[0] + (BLb[0] - BL[0]) * t, BL[1] + (BLb[1] - BL[1]) * t)
    r = (FL[0] + (FLb[0] - FL[0]) * t, FL[1] + (FLb[1] - FL[1]) * t)
    neon(f'M{l[0] + 18:.0f} {l[1] + 6:.0f} L{r[0] - 18:.0f} {r[1] - 4:.0f}', c, 3.5)

# ---- CardPull booster display boxes on the counter: open box of packs with a tall printed header ----
def ontop(u, v):
    """A point on the counter top: u runs left to right along the front edge, v from the front toward the back."""
    fx, fyy = tFL[0] + (tFR[0] - tFL[0]) * u, tFL[1] + (tFR[1] - tFL[1]) * u
    return fx + (tBL[0] - tFL[0]) * v, fyy + (tBL[1] - tFL[1]) * v


TOP_SLOPE = (tFR[1] - tFL[1]) / (tFR[0] - tFL[0])


def display_box(u0, u1, v):
    """A CardPull booster display box on the counter. Local units: front width 100, y up is negative;
    the box body is 34 high, the printed header behind it rises to -122."""
    x0, y0 = ontop(u0, v)
    x1, _ = ontop(u1, v)
    k = (x1 - x0) / 100
    dvx, dvy = (tBL[0] - tFL[0]) * .16, (tBL[1] - tFL[1]) * .16      # depth of the box
    m = f'matrix({k:.4f},{TOP_SLOPE * k:.4f},0,{k:.4f},{x0:.1f},{y0:.1f})'
    NS = 'vector-effect="non-scaling-stroke"'
    bx, by = dvx / k, dvy / k                                          # back plane offset in local units
    a(f'<ellipse cx="{x0 + 50 * k:.0f}" cy="{y0 + 3:.0f}" rx="{60 * k:.0f}" ry="{7 * k:.0f}" fill="#0a0620" opacity=".5" filter="url(#gP)"/>')
    L(f'<ellipse cx="{x0 + 52 * k:.0f}" cy="{y0 - 60 * k:.0f}" rx="{70 * k:.0f}" ry="{70 * k:.0f}" fill="#9a6aff" opacity=".18" filter="url(#gS)"/>')
    # left side of the body, printed
    a(f'<polygon points="{P((x0, y0), (x0 + dvx, y0 + dvy), (x0 + dvx, y0 + dvy - 34 * k), (x0, y0 - 34 * k))}" fill="url(#dbSide)" stroke="{INK}" stroke-width="2"/>')
    a(f'<g transform="{m}">')

    # ---- header board ----
    a(f'<g transform="translate({bx:.1f} {by:.1f})">')
    a('<clipPath id="dbHead"><path d="M2 -30 L2 -114 Q2 -122 10 -122 L90 -122 Q98 -122 98 -114 L98 -30 Z"/></clipPath>')
    a(f'<path d="M2 -30 L2 -114 Q2 -122 10 -122 L90 -122 Q98 -122 98 -114 L98 -30 Z" fill="url(#dbSky)" stroke="{INK}" stroke-width="2.2" {NS}/>')
    a('<g clip-path="url(#dbHead)">')
    for i in range(14):                                                # sunburst behind the logo
        ang = i * 360 / 14
        a(f'<path d="M50 -96 L{50 + 90 * math.cos(math.radians(ang)):.1f} {-96 + 90 * math.sin(math.radians(ang)):.1f} '
          f'L{50 + 90 * math.cos(math.radians(ang + 12)):.1f} {-96 + 90 * math.sin(math.radians(ang + 12)):.1f} Z" fill="#fff" opacity=".07"/>')
    a('<circle cx="50" cy="-100" r="24" fill="url(#dbHalo)"/>')
    for sx, sy, sr in ((16, -112, 1.6), (84, -108, 1.3), (22, -78, 1), (80, -80, 1.4), (12, -96, .9), (90, -94, 1)):
        a(f'<path d="M{sx} {sy - sr * 3} L{sx + sr * .7} {sy - sr * .7} L{sx + sr * 3} {sy} L{sx + sr * .7} {sy + sr * .7} L{sx} {sy + sr * 3} L{sx - sr * .7} {sy + sr * .7} L{sx - sr * 3} {sy} L{sx - sr * .7} {sy - sr * .7} Z" fill="#fff" opacity=".9"/>')
    # three mini packs fanned out, like the hero pack
    for ang, col in ((-16, '#3ab0e8'), (16, '#e85a9a'), (0, '#7a4ae0')):
        a(f'<g transform="translate(50 -100) rotate({ang * 1.3}) translate(-9 -15)">'
          f'<rect x="0" y="1.5" width="18" height="27" rx="1" fill="{col}" stroke="{INK}" stroke-width="1.2" {NS}/>'
          f'<rect x="0" y="1.5" width="18" height="27" rx="1" fill="url(#foil)" opacity=".6"/>'
          '<path d="M0 1.5 l1.5 -1.5 l1.5 1.5 l1.5 -1.5 l1.5 1.5 l1.5 -1.5 l1.5 1.5 l1.5 -1.5 l1.5 1.5 l1.5 -1.5 l1.5 1.5 l1.5 -1.5 l1.5 1.5 V4 H0 Z M0 26 H18 V28.5 H0 Z" fill="#eef"/>'
          f'<rect x="5" y="9" width="8" height="11" rx="1.2" fill="#ffd34a" stroke="{INK}" stroke-width=".8" {NS}/>'
          f'<path d="{SYM["star"]}" transform="translate(9 14.5) scale(.2)" fill="#fff"/></g>')
    a('</g>')
    # wordmark: gold letters with a dark outline and a white top highlight
    a(f'<text x="50" y="-69" text-anchor="middle" font-family="Arial Black,Impact,Arial,sans-serif" font-weight="900" font-size="15" fill="url(#dbGoldText)" stroke="{INK}" stroke-width="2.6" paint-order="stroke" textLength="78" lengthAdjust="spacingAndGlyphs">CARDPULL</text>')
    # ribbon
    a(f'<path d="M16 -64 H84 L80 -59.5 L84 -55 H16 L20 -59.5 Z" fill="#e23a6a" stroke="{INK}" stroke-width="1.2" {NS}/>')
    a('<text x="50" y="-57.8" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="5" fill="#fff" textLength="46" lengthAdjust="spacingAndGlyphs">BOOSTER BOX</text>')
    a('<path d="M4 -120 L40 -120 L4 -60 Z" fill="#fff" opacity=".1"/>')            # glare
    a('</g>')

    # ---- open top: dark interior and the inner back wall ----
    a(f'<path d="M0 -34 L{bx:.1f} {by - 34:.1f} L{100 + bx:.1f} {by - 34:.1f} L100 -34 Z" fill="#2a1460" stroke="{INK}" stroke-width="1.4" {NS}/>')
    # packs standing in the box, each with foil, crimp and the CardPull card mark
    for i in range(5):
        px = 7 + i * 17.6
        c = ('#7a4ae0', '#3ab0e8', '#e85a9a', '#3ab0e8', '#7a4ae0')[i]
        a(f'<g transform="translate({px + bx * .5:.1f} {by * .5:.1f})">'
          f'<rect x="0" y="-52" width="16" height="26" fill="{c}" stroke="{INK}" stroke-width="1.3" {NS}/>'
          f'<rect x="0" y="-52" width="16" height="26" fill="url(#foil)" opacity=".55"/>'
          '<path d="M0 -52 l2 -2 l2 2 l2 -2 l2 2 l2 -2 l2 2 l2 -2 l2 2 V-49 H0 Z" fill="#f0eefa"/>'
          f'<rect x="4" y="-46" width="8" height="10" rx="1" fill="#ffd34a" stroke="{INK}" stroke-width=".8" {NS}/>'
          f'<path d="{SYM["star"]}" transform="translate(8 -41) scale(.18)" fill="#fff"/>'
          '<path d="M1.5 -49 L5 -49 L2 -28 L1.5 -28 Z" fill="#fff" opacity=".35"/></g>')
    # open flaps folded back on both sides
    a(f'<path d="M0 -34 L-8 -44 L{bx - 6:.1f} {by - 44:.1f} L{bx:.1f} {by - 34:.1f} Z" fill="#e8a42a" stroke="{INK}" stroke-width="1.4" {NS}/>')
    a(f'<path d="M100 -34 L108 -44 L{108 + bx:.1f} {by - 44:.1f} L{100 + bx:.1f} {by - 34:.1f} Z" fill="#c8861a" stroke="{INK}" stroke-width="1.4" {NS}/>')

    # ---- front wall: printed box with a burst, the logo and the pack count ----
    a(f'<rect x="0" y="-34" width="100" height="34" fill="url(#cpGold)" stroke="{INK}" stroke-width="2.2" {NS}/>')
    a('<clipPath id="dbFront"><rect x="0" y="-34" width="100" height="34"/></clipPath><g clip-path="url(#dbFront)">')
    a('<path d="M0 -34 H100 V-26 Q50 -20 0 -26 Z" fill="url(#dbSky)"/>')
    a('<path d="M0 -26 Q50 -20 100 -26" stroke="#fff" stroke-width="1" fill="none" opacity=".7"/>')
    for i in range(10):
        a(f'<path d="M50 -4 L{-20 + i * 16} -40 L{-12 + i * 16} -40 Z" fill="#fff" opacity=".1"/>')
    a('<rect x="0" y="-34" width="100" height="14" fill="#fff" opacity=".12"/>')
    a('</g>')
    a(f'<text x="50" y="-10.5" text-anchor="middle" font-family="Arial Black,Impact,Arial,sans-serif" font-weight="900" font-size="12" fill="#3a1a7a" stroke="#fff6d0" stroke-width="1.6" paint-order="stroke" textLength="72" lengthAdjust="spacingAndGlyphs">CARDPULL</text>')
    a(f'<rect x="31" y="-7" width="38" height="5.2" rx="2.6" fill="#3a1a7a"/>')
    a('<text x="50" y="-3.2" text-anchor="middle" font-family="Arial,sans-serif" font-weight="800" font-size="3.6" fill="#ffd34a" textLength="32" lengthAdjust="spacingAndGlyphs">★ IL ★  36 PACKS</text>')
    a('<path d="M1 -33 L1 -1" stroke="#fff" stroke-width="1.2" opacity=".55"/>')
    a('</g>')
    L(f'<path d="M{x0 + 4 * k:.1f} {y0 - 33 * k + TOP_SLOPE * 4 * k:.1f} L{x0 + 96 * k:.1f} {y0 - 33 * k + TOP_SLOPE * 96 * k:.1f}" stroke="#fff" stroke-width="1.4" opacity=".5"/>')


display_box(.3, .72, .3)

# ---- light, depth ----
a('<rect x="0" y="0" width="2000" height="848.44" fill="url(#vig)"/>')
out.extend(lights)
a('</svg>')
open(os.path.join(OUT_DIR, 'cardpull-shop.svg'), 'w').write('\n'.join(out))
print(sum(len(x) for x in out))
