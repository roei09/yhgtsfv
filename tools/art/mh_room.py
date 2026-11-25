"""Draws the מחסני חשמל living room as SVG. Same composition as the old raster (2691x1080) so the
animated overlays (ring, fire, TV, embers) keep their positions. Coordinates are in a 2000-wide space."""
import os
import random

OUT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'assets', 'img', 'partners')

W, H = 2000, 802.68
INK = '#120c2c'
R = random.Random(7)
out = []
lights = []
a = out.append
L = lights.append


def poly(pts, fill, stroke=INK, sw=3, extra=''):
    a(f'<polygon points="{" ".join(f"{x},{y}" for x, y in pts)}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round" {extra}/>')


def rect(x, y, w, h, fill, stroke=INK, sw=3, rx=0, extra=''):
    a(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>')


def neon(d, color, width=7, glow='gP'):
    L(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width * 7}" stroke-linecap="round" stroke-linejoin="round" opacity=".28" filter="url(#gS)"/>')
    L(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width * 2.6}" stroke-linecap="round" stroke-linejoin="round" opacity=".55" filter="url(#{glow})"/>')
    L(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linecap="round" stroke-linejoin="round"/>')
    L(f'<path d="{d}" fill="none" stroke="#fff" stroke-width="{width * .3}" stroke-linecap="round" stroke-linejoin="round" opacity=".75"/>')


def speaker(x, y, w=38, h=50):
    rect(x, y, w, h, '#2b2550', rx=3)
    a(f'<circle cx="{x + w / 2}" cy="{y + h * .32}" r="{w * .18}" fill="#14102c" stroke="#5a5290" stroke-width="2"/>')
    a(f'<circle cx="{x + w / 2}" cy="{y + h * .7}" r="{w * .3}" fill="#14102c" stroke="#5a5290" stroke-width="2"/>')
    a(f'<circle cx="{x + w / 2}" cy="{y + h * .7}" r="{w * .1}" fill="#3a3370"/>')


def headset(x, y, s=1):
    a(f'<g transform="translate({x},{y}) scale({s})">'
      f'<path d="M0 22 Q4 0 32 2 Q60 0 64 22 L62 34 Q32 40 2 34 Z" fill="#d9d3f2" stroke="{INK}" stroke-width="3"/>'
      f'<rect x="8" y="18" width="48" height="14" rx="6" fill="#262048" stroke="{INK}" stroke-width="2"/>'
      f'<path d="M-6 20 Q-12 4 6 -6 L58 -6 Q74 4 70 20" fill="none" stroke="#4a4280" stroke-width="5"/></g>')


# ---- defs ----
a(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice">')
a('''<defs>
<filter id="gP" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="9"/></filter>
<filter id="gS" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
<filter id="rug" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9 .25" numOctaves="2" seed="3"/><feGaussianBlur stdDeviation=".8"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .42  0 0 0 0 .95  0 0 0 .7 -.2"/><feComposite in2="SourceGraphic" operator="in"/><feBlend in2="SourceGraphic" mode="normal"/></filter>
<linearGradient id="ceil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c2468"/><stop offset="1" stop-color="#3a2f86"/></linearGradient>
<linearGradient id="wallL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2a2160"/><stop offset="1" stop-color="#3a3088"/></linearGradient>
<linearGradient id="back" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2f8a"/><stop offset="1" stop-color="#2c2470"/></linearGradient>
<linearGradient id="col" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3c3290"/><stop offset=".7" stop-color="#33297c"/><stop offset="1" stop-color="#4a3270"/></linearGradient>
<linearGradient id="wallR" x1="1070" y1="0" x2="2000" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#352c80"/><stop offset=".5" stop-color="#2c2570"/><stop offset="1" stop-color="#221c52"/></linearGradient>
<linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2f78"/><stop offset="1" stop-color="#1f1a4a"/></linearGradient>
<linearGradient id="tv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d6a8ff"/><stop offset=".55" stop-color="#9b7cff"/><stop offset="1" stop-color="#6aa8ff"/></linearGradient>
<linearGradient id="city" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a1d4a"/><stop offset="1" stop-color="#2c3a7a"/></linearGradient>
<linearGradient id="fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1a1a30" stop-opacity="0"/><stop offset=".45" stop-color="#1a1a30" stop-opacity=".85"/><stop offset="1" stop-color="#191a2e"/></linearGradient>
<linearGradient id="fire" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe6a0"/><stop offset=".5" stop-color="#ff9a2a"/><stop offset="1" stop-color="#c84010"/></linearGradient>
<linearGradient id="sofa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a82b8"/><stop offset="1" stop-color="#5a5288"/></linearGradient>
<linearGradient id="sofaD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d5590"/><stop offset="1" stop-color="#3a3466"/></linearGradient>
<radialGradient id="vig" cx=".36" cy=".44" r=".9"><stop offset=".45" stop-color="#05030f" stop-opacity="0"/><stop offset="1" stop-color="#05030f" stop-opacity=".6"/></radialGradient>
<radialGradient id="warm" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffb060" stop-opacity=".4"/><stop offset="1" stop-color="#ff8a30" stop-opacity="0"/></radialGradient>
<radialGradient id="tvGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#a98bff" stop-opacity=".5"/><stop offset="1" stop-color="#a98bff" stop-opacity="0"/></radialGradient>
</defs>''')

# ---- room shell ----
rect(0, 0, W, H, '#1d1846', stroke='none', sw=0)
poly([(0, 0), (2000, 0), (2000, 803), (0, 803)], '#241d58', stroke='none', sw=0)
poly([(30, 0), (1300, 0), (1070, 155), (400, 155)], 'url(#ceil)')                        # ceiling
poly([(330, 0), (1110, 0), (1030, 118), (430, 118)], '#30296f', sw=2)                     # recessed tray
poly([(0, 0), (30, 0), (400, 155), (392, 568), (0, 722)], 'url(#wallL)')                    # left wall
poly([(400, 155), (1070, 155), (1082, 568), (392, 568)], 'url(#back)')                      # back wall
poly([(1070, 155), (1300, 0), (2000, 0), (2000, 803), (1458, 803), (1082, 568)], 'url(#wallR)')  # right wall
poly([(0, 722), (392, 568), (1082, 568), (1458, 803), (0, 803)], 'url(#floor)')  # floor
# wall panelling seams on the left wall
for d in ['M80 34 L80 690', 'M345 135 L345 586', 'M0 300 L60 320']:
    a(f'<path d="{d}" stroke="{INK}" stroke-width="2" opacity=".55"/>')

# ---- right wall: perspective helper (every horizontal line on this wall runs to the vanishing point) ----
VX, VY = 749, 371


def on_wall(x, x0, y0):
    """Height at x of the wall line that passes through (x0, y0)."""
    return VY + (y0 - VY) * (x - VX) / (x0 - VX)


# ---- glass wall with the night city ----
WIN = [(1118, 178), (1458, 0), (1600, 0), (1600, on_wall(1600, 1118, 556)), (1118, 556)]
a('<clipPath id="win"><polygon points="' + ' '.join(f'{x:.0f},{y:.0f}' for x, y in WIN) + '"/></clipPath>')
a('<g clip-path="url(#win)">')
rect(1100, 0, 520, 803, 'url(#city)', stroke='none', sw=0)
R2 = random.Random(11)
for bx, bw, bh in [(1125, 60, 230), (1180, 45, 330), (1228, 70, 270), (1300, 50, 380), (1352, 70, 300), (1424, 64, 420), (1490, 48, 520), (1540, 70, 470)]:
    base = on_wall(bx + bw / 2, 1118, 556) + 6
    top = base - bh
    poly([(bx, base + 40), (bx, top), (bx + bw, top - 8), (bx + bw, base + 40)], '#1c2050', stroke='none', sw=0, extra='opacity=".9"')
    for _ in range(int(bh / 16)):
        x = bx + 6 + R2.random() * (bw - 12); y = top + 10 + R2.random() * (bh - 30)
        c = R2.choice(['#ffb3e6', '#ffd27a', '#c9a6ff', '#ff8ac8'])
        a(f'<rect x="{x:.0f}" y="{y:.0f}" width="4" height="5" fill="{c}" opacity="{.4 + R2.random() * .5:.2f}"/>')
for x, w in [(1150, 100), (1380, 140)]:
    a(f'<path d="M{x} 0 L{x + w} 0 L{x + w - 70} 803 L{x - 70} 803 Z" fill="#fff" opacity=".045"/>')
a('</g>')
for x in [1218, 1318, 1425, 1515]:
    y1, y2 = on_wall(x, 1118, 178), on_wall(x, 1118, 556)
    a(f'<path d="M{x} {max(y1, 0):.0f} L{x} {y2:.0f}" stroke="#3b3a7a" stroke-width="{9 + (x - 1118) / 60:.0f}"/><path d="M{x} {max(y1, 0):.0f} L{x} {y2:.0f}" stroke="{INK}" stroke-width="2" opacity=".6"/>')
a(f'<polygon points="{" ".join(f"{x:.0f},{y:.0f}" for x, y in WIN)}" fill="none" stroke="#4a478c" stroke-width="12"/>')
a(f'<polygon points="{" ".join(f"{x:.0f},{y:.0f}" for x, y in WIN)}" fill="none" stroke="{INK}" stroke-width="2.5"/>')

# ---- the wall beyond the glass: panelling, a framed planet print, sconces and acoustic hexagons ----
for x in [1700, 1850]:
    a(f'<path d="M{x} 0 L{x} 803" stroke="{INK}" stroke-width="2" opacity=".5"/>')
    a(f'<path d="M{x + 3} 0 L{x + 3} 803" stroke="#4a3f9a" stroke-width="1.5" opacity=".5"/>')
fx0, fx1 = 1650, 1800
f_tl, f_bl = (fx0, 200), (fx0, 420)
f_tr, f_br = (fx1, on_wall(fx1, *f_tl)), (fx1, on_wall(fx1, *f_bl))
L(f'<polygon points="{fx0},{f_tl[1]} {fx1},{f_tr[1]:.0f} {fx1},{f_br[1]:.0f} {fx0},{f_bl[1]}" fill="#b472ff" opacity=".35" filter="url(#gS)"/>')
poly([f_tl, (fx1, round(f_tr[1])), (fx1, round(f_br[1])), f_bl], '#1a1438', sw=4)
inner = [(fx0 + 12, on_wall(fx0 + 12, fx0, 214)), (fx1 - 12, on_wall(fx1 - 12, fx0, 214)), (fx1 - 12, on_wall(fx1 - 12, fx0, 406)), (fx0 + 12, on_wall(fx0 + 12, fx0, 406))]
poly([(round(x), round(y)) for x, y in inner], '#2a1d66', stroke='#d9c2ff', sw=1.5)
a(f'<clipPath id="art"><polygon points="{" ".join(f"{x:.0f},{y:.0f}" for x, y in inner)}"/></clipPath><g clip-path="url(#art)">')
for _ in range(26):
    a(f'<circle cx="{fx0 + 14 + R.random() * 124:.0f}" cy="{200 + R.random() * 230:.0f}" r="{R.choice([1, 1.4, 2])}" fill="#fff" opacity=".8"/>')
a('<ellipse cx="1730" cy="320" rx="70" ry="44" fill="#c77dff" opacity=".35" filter="url(#gP)"/>')
a(f'<circle cx="1726" cy="318" r="38" fill="#ff9ad5" stroke="{INK}" stroke-width="2.5"/>')
a('<path d="M1700 306 Q1726 296 1752 310 M1696 326 Q1724 316 1756 332" stroke="#e26fb8" stroke-width="5" fill="none" opacity=".8"/>')
a('<ellipse cx="1726" cy="322" rx="64" ry="13" transform="rotate(-12 1726 322)" fill="none" stroke="#ffd27a" stroke-width="5"/>')
a('</g>')
for i, (hx, hy, lit) in enumerate([(1760, 590, 0), (1818, 556, 1), (1818, 624, 0), (1876, 590, 0), (1934, 556, 0), (1934, 624, 1), (1876, 658, 0), (1992, 590, 0)]):
    pts = ' '.join(f'{hx + 32 * c:.0f},{hy + 32 * s_:.0f}' for c, s_ in [(1, 0), (.5, .866), (-.5, .866), (-1, 0), (-.5, -.866), (.5, -.866)])
    a(f'<polygon points="{pts}" fill="#2f2770" stroke="{INK}" stroke-width="2.5"/>')
    pts2 = ' '.join(f'{hx + 24 * c:.0f},{hy + 24 * s_:.0f}' for c, s_ in [(1, 0), (.5, .866), (-.5, .866), (-1, 0), (-.5, -.866), (.5, -.866)])
    a(f'<polygon points="{pts2}" fill="#3a3184"/>')
    if lit:
        L(f'<polygon points="{pts}" fill="none" stroke="#c77dff" stroke-width="10" opacity=".45" filter="url(#gP)"/><polygon points="{pts}" fill="none" stroke="#e2b8ff" stroke-width="2.5"/>')
neon('M1620 0 L1620 760', '#ffcf5a', 4)

# ---- neon: purple along the ceiling, yellow trims on the walls ----
neon('M30 0 L400 155 L565 155', '#c77dff', 7)
neon('M890 155 L1070 155 L1300 0', '#c77dff', 7)
neon('M398 205 L565 205', '#b472ff', 5)
neon('M890 205 L995 205 L1025 228 L1078 228', '#b472ff', 5)
neon('M0 720 L120 690', '#b472ff', 5)
Y = '#ffcf5a'
neon('M150 70 L170 178 L292 196 L305 152', Y, 5)
neon('M0 196 L44 262 L44 640 L0 668', Y, 5)
neon('M475 210 L475 292 L412 300 L370 322 L362 480', Y, 5)
neon('M526 210 L526 270 L566 312', Y, 5)
neon('M382 488 L412 506 L520 506 L548 488', Y, 4)

# ---- central chimney and fireplace ----
rect(568, 145, 320, 422, 'url(#col)')
L('<ellipse cx="727" cy="500" rx="260" ry="150" fill="url(#warm)"/>')
rect(610, 446, 234, 84, '#1a1330', sw=4, rx=2)
rect(622, 456, 210, 64, '#140608', stroke='#5a2a18', sw=2)
L('<rect x="640" y="470" width="175" height="48" fill="#ff8a2a" opacity=".45" filter="url(#gP)"/>')
L('<path d="M632 516 Q642 506 646 496 Q650 507 658 500 Q664 503 668 490 Q672 504 680 500 Q686 505 690 493 Q694 506 702 500 Q708 493 712 470 Q716 495 724 500 Q730 493 734 469 Q738 495 746 500 Q752 501 756 486 Q760 503 768 500 Q774 502 778 488 Q782 503 790 500 Q796 500 800 485 Q804 502 812 500 Q818 506 822 495 Q826 507 834 500 L822 516 Z" fill="url(#fire)" stroke="#ff7a1a" stroke-width="1.5"/>')
L('<path d="M632 516 Q642 506 646 496 Q650 507 658 500 Q664 503 668 490 Q672 504 680 500 Q686 505 690 493 Q694 506 702 500 Q708 493 712 470 Q716 495 724 500 Q730 493 734 469 Q738 495 746 500 Q752 501 756 486 Q760 503 768 500 Q774 502 778 488 Q782 503 790 500 Q796 500 800 485 Q804 502 812 500 Q818 506 822 495 Q826 507 834 500 L822 516 Z" fill="#fff2c0" opacity=".75" transform="translate(727 516) scale(.75 .5) translate(-727 -516)"/>')
rect(622, 512, 210, 8, '#1a1330', stroke='none', sw=0)

# ---- chandelier ----
for tx in [640, 690, 765, 815]:
    a(f'<path d="M727 38 L{tx} {150 if tx in (690, 765) else 156}" stroke="#bfa6ff" stroke-width="1.6" opacity=".7"/>')
a(f'<ellipse cx="727" cy="38" rx="28" ry="8" fill="#3c3384" stroke="{INK}" stroke-width="2"/>')
L('<ellipse cx="727" cy="155" rx="104" ry="25" fill="none" stroke="#ffcf8a" stroke-width="24" opacity=".35" filter="url(#gP)"/>')
a('<ellipse cx="727" cy="155" rx="104" ry="25" fill="none" stroke="#3a2f60" stroke-width="12"/>')
a('<ellipse cx="727" cy="155" rx="104" ry="25" fill="none" stroke="#ffe0a8" stroke-width="6"/>')
a('<ellipse cx="727" cy="155" rx="104" ry="25" fill="none" stroke="#fff" stroke-width="2"/>')

# ---- TV on the left wall ----
L('<ellipse cx="225" cy="368" rx="230" ry="250" fill="url(#tvGlow)"/>')
poly([(116, 220), (332, 274), (332, 480), (116, 514)], '#1b1538', sw=5)
poly([(126, 232), (322, 282), (322, 472), (126, 502)], 'url(#tv)', stroke='none', sw=0)
poly([(126, 232), (200, 251), (150, 500), (126, 502)], '#fff', stroke='none', sw=0, extra='opacity=".08"')

# ---- shelves (left niche) ----
for x1, x2, y in [(406, 552, 378), (380, 566, 480)]:
    L(f'<rect x="{x1}" y="{y + 2}" width="{x2 - x1}" height="26" fill="#ffcf5a" opacity=".22" filter="url(#gP)"/>')
    L(f'<rect x="{x1 + 4}" y="{y + 3}" width="{x2 - x1 - 8}" height="3" fill="#ffd77a"/>')
    rect(x1, y - 4, x2 - x1, 8, '#2c2456', sw=2)
headset(420, 340, .9)
a(f'<path d="M508 376 L512 352 Q518 335 524 352 L528 376 Z" fill="#cbd8ff" stroke="{INK}" stroke-width="2.5"/>')
a('<circle cx="518" cy="350" r="9" fill="#e8f0ff" opacity=".8"/>')
speaker(418, 426); speaker(508, 426)
rect(382, 484, 182, 76, '#231d4a', sw=3)

# ---- shelves (right niche) ----
for x1, x2, y in [(905, 1068, 318), (905, 1068, 380), (890, 1078, 480)]:
    L(f'<rect x="{x1}" y="{y + 2}" width="{x2 - x1}" height="26" fill="#ffcf5a" opacity=".22" filter="url(#gP)"/>')
    L(f'<rect x="{x1 + 4}" y="{y + 3}" width="{x2 - x1 - 8}" height="3" fill="#ffd77a"/>')
    rect(x1, y - 4, x2 - x1, 8, '#2c2456', sw=2)
a(f'<path d="M934 312 Q930 282 962 276 Q996 276 998 300 L1000 312 Z" fill="#b9b0e6" stroke="{INK}" stroke-width="2.5"/>')
a(f'<path d="M946 296 L990 296" stroke="#2a2250" stroke-width="7" stroke-linecap="round"/>')
a(f'<path d="M1020 312 L1024 296 L1042 296 L1046 312 Z" fill="#6a4a7a" stroke="{INK}" stroke-width="2"/>')
for lx, ly in [(-12, -20), (0, -26), (12, -20), (-6, -14), (8, -14)]:
    a(f'<path d="M1033 296 l{lx} {ly}" stroke="#6fd08a" stroke-width="4" stroke-linecap="round"/>')
headset(918, 346, .85)
rect(1012, 344, 30, 32, '#3a3270', sw=2.5)
rect(1018, 350, 18, 20, '#b6a8e8', stroke='none', sw=0)
speaker(910, 428); speaker(1018, 428)
a(f'<path d="M962 468 Q964 458 976 460 L996 460 Q1008 458 1010 468 Q1010 478 1000 476 L972 476 Q962 478 962 468 Z" fill="#3e3870" stroke="{INK}" stroke-width="2.5"/>')
rect(890, 484, 188, 76, '#231d4a', sw=3)

# ---- TV cabinet and console ----
poly([(118, 616), (352, 548), (406, 552), (406, 578), (172, 640), (118, 628)], '#2a2350', sw=3)   # top
poly([(118, 628), (172, 640), (172, 706), (118, 694)], '#1b1638', sw=3)                          # end
poly([(172, 640), (406, 578), (406, 640), (172, 706)], '#221c44', sw=3)                          # front
a(f'<path d="M180 668 L398 610" stroke="{INK}" stroke-width="2"/>')
rect(182, 520, 48, 88, '#f2f0fa', rx=6, sw=3)
a(f'<path d="M206 522 L206 606" stroke="#c9c4e0" stroke-width="2"/><rect x="190" y="528" width="10" height="72" rx="4" fill="#20193e"/>')

# ---- floor reflections and rug ----
for x, w in [(40, 10), (390, 8), (560, 8), (620, 30), (1080, 8)]:
    a(f'<rect x="{x}" y="600" width="{w}" height="200" fill="#ffcf5a" opacity=".07"/>')
a('<path d="M300 765 L492 592 L990 592 L1206 765 Z" fill="#3b2a86" filter="url(#rug)"/>')
a(f'<path d="M300 765 L492 592 L990 592 L1206 765 Z" fill="none" stroke="#6a54b8" stroke-width="3" stroke-dasharray="3 4" opacity=".7"/>')
a('<ellipse cx="727" cy="610" rx="230" ry="40" fill="#ffb060" opacity=".12" filter="url(#gS)"/>')

# ---- a blue French bulldog asleep on the rug, curled up with its head on its paws ----
# lit warm from the fireplace (upper left) and cool from the room; the inner ear glows a little
a('''<defs>
<radialGradient id="dB" cx=".38" cy=".25" r=".85"><stop offset="0" stop-color="#a9b2c4"/><stop offset=".45" stop-color="#7e889c"/><stop offset="1" stop-color="#4c5468"/></radialGradient>
<radialGradient id="dH" cx=".36" cy=".28" r=".8"><stop offset="0" stop-color="#b2bbcc"/><stop offset=".5" stop-color="#848ea2"/><stop offset="1" stop-color="#535b70"/></radialGradient>
<radialGradient id="dT" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#a2abbd"/><stop offset="1" stop-color="#5e677c"/></radialGradient>
<linearGradient id="dE" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#b9808e"/><stop offset=".6" stop-color="#e2a8b2"/><stop offset="1" stop-color="#f2c4c8"/></linearGradient>
<radialGradient id="dM" cx=".45" cy=".3" r=".8"><stop offset="0" stop-color="#bcc4d2"/><stop offset="1" stop-color="#7d869a"/></radialGradient>
<radialGradient id="dN" cx=".4" cy=".3" r=".7"><stop offset="0" stop-color="#4a4a5c"/><stop offset="1" stop-color="#16161f"/></radialGradient>
<linearGradient id="dW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#c9c4d8"/></linearGradient>
<filter id="dSoft" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="dFur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation=".6"/></filter>
</defs>''')
OL = '#1a1430'
a('<g transform="translate(596 634) scale(.7)">')
a('<ellipse cx="8" cy="44" rx="112" ry="18" fill="#0a0524" opacity=".6" filter="url(#dSoft)"/>')
a('<ellipse cx="8" cy="42" rx="96" ry="9" fill="#0a0524" opacity=".5" filter="url(#dFur)"/>')
# body: a stocky barrel, back toward the viewer
a(f'<path d="M-58 20 C-64 -20 -20 -50 30 -46 C82 -42 102 -12 96 16 C90 40 56 48 10 47 C-28 47 -54 40 -58 20 Z" fill="url(#dB)" stroke="{OL}" stroke-width="2.6"/>')
a('<path d="M-40 34 C-10 44 40 46 80 34 C70 44 40 48 10 48 C-20 48 -36 42 -40 34 Z" fill="#3a4156" opacity=".55"/>')
a('<path d="M-24 -40 C10 -50 58 -44 84 -22" stroke="#cdd4e2" stroke-width="5" fill="none" opacity=".5" stroke-linecap="round" filter="url(#dFur)"/>')
a('<path d="M-30 -36 C-6 -46 20 -48 40 -46" stroke="#ffc48a" stroke-width="2.5" fill="none" opacity=".55" stroke-linecap="round"/>')
# hind leg folded along the side, the tail tucked against it
a(f'<path d="M22 -16 C56 -30 94 -14 92 14 C90 36 62 42 36 38 C16 34 8 12 22 -16 Z" fill="url(#dT)" stroke="#4a5266" stroke-width="1.6" stroke-opacity=".8"/>')
a('<path d="M30 -14 C56 -24 84 -12 88 6" stroke="#c3cad8" stroke-width="3" fill="none" opacity=".45" stroke-linecap="round"/>')
a(f'<path d="M92 0 C104 -4 106 10 96 14" fill="url(#dT)" stroke="{OL}" stroke-width="2"/>')
a(f'<path d="M4 38 C10 32 30 32 38 38 C42 46 30 50 18 50 C6 50 0 46 4 38 Z" fill="url(#dT)" stroke="{OL}" stroke-width="2.2"/>')
a(f'<path d="M14 49 l1 -5 M22 50 l0 -5 M30 48 l-1 -5" stroke="{OL}" stroke-width="1.4" stroke-linecap="round"/>')
# short fur strokes following the form
for d in ['M-12 -34 l6 -2', 'M8 -40 l6 -1', 'M30 -42 l6 0', 'M52 -36 l5 2', 'M70 -26 l4 3', 'M60 -6 l5 2', 'M70 6 l4 3', 'M44 0 l5 1',
          'M-30 -20 l5 -3', 'M-44 0 l4 -3', 'M0 -20 l6 -1', 'M20 -26 l6 0', 'M56 20 l5 2', 'M76 22 l3 3']:
    a(f'<path d="{d}" stroke="#5a637a" stroke-width="1.1" stroke-linecap="round" opacity=".3"/>')
# white chest blaze between the front legs
a(f'<path d="M-44 30 C-40 18 -24 18 -20 30 C-20 42 -30 48 -38 46 C-44 44 -46 38 -44 30 Z" fill="url(#dW)" stroke="#8a86a2" stroke-width="1.2"/>')
# front paws reaching out from under the chin
for px, rot in ((-100, -6), (-18, 8)):
    a(f'<g transform="rotate({rot} {px} 44)"><path d="M{px - 18} 46 C{px - 20} 36 {px - 6} 34 {px + 6} 36 C{px + 18} 38 {px + 20} 48 {px + 10} 52 C{px} 54 {px - 14} 54 {px - 18} 46 Z" fill="url(#dT)" stroke="{OL}" stroke-width="2.2"/>'
      f'<path d="M{px - 8} 52 l0 -6 M{px} 53 l0 -6 M{px + 8} 51 l-1 -6" stroke="{OL}" stroke-width="1.4" stroke-linecap="round"/>'
      '</g>')
# bat ears: wide base, rounded tips, tipped outward a little in sleep
a(f'<path transform="translate(-80 -12) scale(.72) translate(80 12)" d="M-94 -2 C-114 -20 -122 -48 -112 -58 C-98 -62 -76 -42 -66 -22 Z" fill="url(#dH)" stroke="{OL}" stroke-width="2.6"/>')
a('<path transform="translate(-80 -12) scale(.72) translate(80 12)" d="M-92 -10 C-106 -24 -112 -44 -107 -50 C-96 -52 -82 -38 -74 -22 Z" fill="url(#dE)"/>')
a('<path transform="translate(-80 -12) scale(.72) translate(80 12)" d="M-100 -26 C-96 -36 -92 -40 -88 -42" stroke="#a46a7a" stroke-width="1.2" fill="none" opacity=".7"/>')
a('<path transform="translate(-80 -12) scale(.72) translate(80 12)" d="M-112 -56 C-104 -60 -92 -54 -84 -44" stroke="#ffc48a" stroke-width="2" fill="none" opacity=".6"/>')
a(f'<path transform="translate(-28 -16) scale(.72) translate(28 16)" d="M-42 -22 C-30 -42 -12 -60 2 -58 C10 -50 4 -26 -14 -6 Z" fill="url(#dH)" stroke="{OL}" stroke-width="2.6"/>')
a('<path transform="translate(-28 -16) scale(.72) translate(28 16)" d="M-36 -22 C-26 -38 -12 -50 -3 -50 C2 -42 -2 -26 -16 -12 Z" fill="url(#dE)"/>')
a('<path transform="translate(-28 -16) scale(.72) translate(28 16)" d="M-22 -32 C-16 -38 -10 -42 -6 -44" stroke="#a46a7a" stroke-width="1.2" fill="none" opacity=".7"/>')
# broad flat head resting on the paws
a(f'<path d="M-102 18 C-106 -8 -84 -26 -54 -26 C-24 -26 -4 -8 -8 18 C-10 38 -30 46 -55 46 C-82 46 -100 38 -102 18 Z" fill="url(#dH)" stroke="{OL}" stroke-width="2.6"/>')
a('<path d="M-96 -4 C-88 -18 -72 -24 -56 -24" stroke="#ffc48a" stroke-width="3" fill="none" opacity=".55" stroke-linecap="round"/>')
a('<path d="M-96 26 C-90 40 -70 46 -55 46 C-36 46 -18 40 -12 28 C-24 38 -40 42 -55 42 C-72 42 -88 36 -96 26 Z" fill="#3e4558" opacity=".45"/>')
# forehead and brow wrinkles: a dark crease with a lit ridge under it
for d in ['M-68 -14 q13 -6 26 0', 'M-72 -7 q17 -7 34 0', 'M-86 -2 q6 -5 12 -4', 'M-36 -6 q6 -1 12 4']:
    a(f'<path d="{d}" stroke="#454d62" stroke-width="2" fill="none" stroke-linecap="round"/>')
    a(f'<path d="{d}" transform="translate(0 2.2)" stroke="#bcc4d4" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".7"/>')
a('<path d="M-55 -4 l0 8" stroke="#454d62" stroke-width="1.8" stroke-linecap="round"/>')
# closed eyes, set wide apart, with a soft lid shadow
for ex in (-74, -36):
    a(f'<ellipse cx="{ex}" cy="5" rx="9" ry="4" fill="#5a6276" opacity=".55"/>')
    a(f'<path d="M{ex - 8} 3 q8 7 16 0" stroke="{OL}" stroke-width="2.6" fill="none" stroke-linecap="round"/>')
    a(f'<path d="M{ex - 6} 7 l-1.5 3 M{ex - 1} 8 l-.5 3 M{ex + 4} 7 l.5 3" stroke="{OL}" stroke-width="1.1" stroke-linecap="round"/>')
# muzzle: nose right under the eyes, heavy jowls either side, soft fold lines on the cheeks
a('<path d="M-72 10 q17 -8 34 0" stroke="#454d62" stroke-width="2.2" fill="none" stroke-linecap="round"/>')
a(f'<path d="M-78 20 C-82 38 -66 44 -55 34 C-44 44 -28 38 -32 20 C-40 13 -70 13 -78 20 Z" fill="url(#dM)" stroke="{OL}" stroke-width="2.2"/>')
a('<path d="M-74 34 C-70 40 -62 40 -56 35 M-54 35 C-48 40 -40 40 -36 34" stroke="#c9909a" stroke-width="1.6" fill="none" opacity=".8"/>')
a(f'<path d="M-66 14 C-66 9 -44 9 -44 14 C-44 20 -50 23 -55 23 C-60 23 -66 20 -66 14 Z" fill="url(#dN)" stroke="{OL}" stroke-width="1.4"/>')
a('<path d="M-61 16 q2 -2 4 0 M-53 16 q2 -2 4 0" stroke="#0a0a12" stroke-width="2" fill="none" stroke-linecap="round"/>')
a('<ellipse cx="-58" cy="12" rx="4" ry="1.6" fill="#ffffff" opacity=".55"/>')
a(f'<path d="M-55 23 l0 9" stroke="{OL}" stroke-width="1.8" stroke-linecap="round"/>')
a('<path d="M-84 16 q-6 8 -2 16 M-26 16 q6 8 2 16" stroke="#4e566b" stroke-width="1.8" fill="none" stroke-linecap="round"/>')
for x, y in [(-70, 24), (-66, 28), (-44, 24), (-40, 28), (-72, 30), (-38, 30)]:
    a(f'<circle cx="{x}" cy="{y}" r=".9" fill="#4e566b"/>')
a('</g>')

# ---- sofa: L-shaped sectional seen from the front left; chaise on the left, a deep arm on the right ----
SF, SFD, SFT, RIM = '#4c4674', '#38325e', '#625c8e', '#ffcf9a'


def cushion(cx, cy, w, h, rot, fill='#a49ece'):
    """A soft square pillow: rounded corners pinched in, with a crease."""
    x0, y0, x1, y1 = cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2
    d = (f'M{x0 + 8} {y0 + 2} Q{cx} {y0 + 7} {x1 - 8} {y0 + 2} Q{x1 + 2} {y0 + 2} {x1 - 2} {y0 + 10} '
         f'Q{x1 - 6} {cy} {x1 - 2} {y1 - 10} Q{x1 + 2} {y1 - 2} {x1 - 8} {y1 - 2} Q{cx} {y1 - 7} {x0 + 8} {y1 - 2} '
         f'Q{x0 - 2} {y1 - 2} {x0 + 2} {y1 - 10} Q{x0 + 6} {cy} {x0 + 2} {y0 + 10} Q{x0 - 2} {y0 + 2} {x0 + 8} {y0 + 2} Z')
    a(f'<g transform="rotate({rot} {cx} {cy})"><path d="{d}" fill="{fill}" stroke="{INK}" stroke-width="2.5"/>'
      f'<path d="M{x0 + w * .3} {cy - h * .15} q{w * .15} {h * .2} {w * .35} {h * .1}" stroke="#7c76a8" stroke-width="2" fill="none"/></g>')


# backrest behind the chaise, the back cushions and the side of the right arm
a(f'<path d="M944 560 L944 520 Q944 506 958 506 L1078 504 L1080 560 Z" fill="{SFD}" stroke="{INK}" stroke-width="3"/>')
a(f'<rect x="936" y="504" width="56" height="36" rx="14" fill="{SFT}" stroke="{INK}" stroke-width="3"/>')
for x, y, w, h, rot in [(1072, 476, 66, 96, 3), (1134, 484, 80, 98, 5), (1208, 496, 102, 96, 7)]:
    a(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="16" transform="rotate({rot} {x + w / 2} {y + h / 2})" fill="{SF}" stroke="{INK}" stroke-width="3"/>')
    a(f'<path d="M{x + 12} {y + 6} Q{x + w / 2} {y + 1} {x + w - 10} {y + 8}" transform="rotate({rot} {x + w / 2} {y + h / 2})" stroke="{RIM}" stroke-width="2" fill="none" opacity=".35"/>')
a(f'<path d="M1302 524 Q1336 524 1340 546 L1344 600 L1306 596 Z" fill="{SFD}" stroke="{INK}" stroke-width="3"/>')
# seat surface: chaise on the left running into the seats
a(f'<path d="M826 544 Q826 532 840 531 L1000 529 L1080 556 L1300 568 L1320 590 L1096 600 L982 570 Z" fill="{SFT}" stroke="{INK}" stroke-width="3"/>')
a(f'<path d="M982 570 L1004 548 M1080 556 L1092 592" stroke="{INK}" stroke-width="2" opacity=".55"/>')
a(f'<path d="M830 538 L1000 531" stroke="{RIM}" stroke-width="2" opacity=".35"/>')
# pillows resting on the seat against the back
cushion(1060, 508, 58, 38, 4, '#8e88ba')
cushion(1008, 524, 70, 52, -8)
cushion(1080, 538, 76, 58, 10)
cushion(1176, 560, 72, 52, -12)
cushion(1222, 564, 96, 52, 6, '#8e88ba')
# front faces: chaise, middle seat, then the big right arm
a(f'<path d="M826 544 L982 570 L982 624 Q982 630 976 630 L834 596 Q826 594 826 586 Z" fill="{SFD}" stroke="{INK}" stroke-width="3"/>')
a(f'<path d="M982 570 L1096 600 L1100 676 L982 626 Z" fill="#332e58" stroke="{INK}" stroke-width="3"/>')
a(f'<path d="M1090 600 Q1088 584 1104 584 L1320 578 Q1346 578 1352 600 L1356 704 Q1356 720 1340 720 L1112 726 Q1098 726 1098 712 Z" fill="{SF}" stroke="{INK}" stroke-width="3"/>')
a(f'<path d="M1094 602 Q1200 590 1350 600" stroke="{INK}" stroke-width="2" fill="none" opacity=".6"/>')
a(f'<path d="M1096 590 Q1104 584 1120 584 L1320 578" stroke="{RIM}" stroke-width="2.5" fill="none" opacity=".35"/>')
for x, y in [(840, 598), (972, 632), (1112, 728), (1336, 722)]:
    a(f'<rect x="{x - 8}" y="{y - 2}" width="16" height="8" rx="2" fill="#16122e"/>')

# ---- plant ----
poly([(1318, 640), (1404, 640), (1396, 762), (1326, 762)], '#262048', sw=3)
for d, c in [('M1362 638 C1330 560 1290 470 1236 344 C1300 380 1350 470 1366 600', '#24304e'),
             ('M1364 636 C1350 520 1318 380 1296 246 C1356 320 1384 470 1370 610', '#2a3858'),
             ('M1368 636 C1392 520 1410 400 1432 300 C1446 400 1420 540 1376 626', '#22304c'),
             ('M1360 640 C1320 600 1270 580 1228 566 C1290 548 1334 586 1364 630', '#26324f'),
             ('M1368 632 C1388 500 1372 360 1392 238 C1430 330 1414 500 1374 628', '#2c3a5c')]:
    a(f'<path d="{d} Z" fill="{c}" stroke="{INK}" stroke-width="3"/>')
    a(f'<path d="{d.split(" C")[0]} C{d.split(" C")[1]}" fill="none" stroke="#3e4e78" stroke-width="2" opacity=".6"/>')

# ---- overall light and the dark side for the panel ----
a('<rect x="0" y="0" width="2000" height="803" fill="url(#vig)"/>')
a('<rect x="0" y="0" width="2000" height="803" fill="#0a0620" opacity=".18"/>')
out.extend(lights)
a('<path d="M380 600 L1090 600 L1440 800 L0 800 Z" fill="#c77dff" opacity=".04"/>')
a(f'<rect x="1300" y="0" width="700" height="803" fill="url(#fade)" opacity=".38"/>')
a('</svg>')
open(os.path.join(OUT_DIR, 'mh-room.svg'), 'w').write('\n'.join(out))
print(sum(len(x) for x in out))
