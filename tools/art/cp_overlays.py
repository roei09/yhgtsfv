"""Re-anchors the animated CardPull overlays in index.html and site.css to the drawn scene
(holo sheen, auras and particles on the counter cards; glints on the packs; glow on the crystals).
Run after changing positions in cp_shop.py."""
import os
import random
import re

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
W, H = 2000, 848.44
FL, FR = (782, 604), (1062, 551)
SLOPE = (FR[1] - FL[1]) / (FR[0] - FL[0])
CARD_K = .8
CARDS = {'fire': 814, 'water': 899, 'leaf': 984}
WVX, WVY = 2652, 313
N_MID, N_BOT = 392, 482


def pct(x, y):
    return f'{x / W * 100:.2f}%', f'{y / H * 100:.2f}%'


def card_pt(x0, y0, u, v):
    return x0 + CARD_K * u, y0 + SLOPE * CARD_K * u + CARD_K * v


def wy(x, y0):
    return WVY + (y0 - WVY) * (WVX - x) / WVX


cards = {}
for name, x0 in CARDS.items():
    y0 = FL[1] + SLOPE * (x0 - FL[0]) + 40
    tl, tr, br, bl = card_pt(x0, y0, 9, 20), card_pt(x0, y0, 75, 20), card_pt(x0, y0, 75, 82), card_pt(x0, y0, 9, 82)
    left, right = tl[0], tr[0]
    top, bottom = min(tl[1], tr[1]), max(bl[1], br[1])
    w, h = right - left, bottom - top
    clip = 'polygon(' + ','.join(f'{(x - left) / w * 100:.1f}% {(y - top) / h * 100:.1f}%' for x, y in (tl, tr, br, bl)) + ')'
    cards[name] = dict(box=(left, top, w, h), clip=clip, centre=card_pt(x0, y0, 42, 51))

path = os.path.join(ROOT, 'index.html')
s = open(path, encoding='utf-8').read()


def holo(m):
    c = cards[m.group(1)]; l, t = pct(*c['box'][:2])
    return (f'<i class="cpw__holo cpw__holo--{m.group(1)}" style="left:{l};top:{t};width:{c["box"][2] / W * 100:.2f}%;'
            f'height:{c["box"][3] / H * 100:.2f}%;clip-path:{c["clip"]};--dl:{m.group(2)}">')


def aura(m):
    l, t = pct(*cards[m.group(1)]['centre'])
    return f'<i class="cpw__aura cpw__aura--{m.group(1)}" style="left:{l};top:{t};--dl:{m.group(2)}">'


s = re.sub(r'<i class="cpw__holo cpw__holo--(\w+)" style="[^"]*--dl:([^";]+)">', holo, s)
s = re.sub(r'<i class="cpw__aura cpw__aura--(\w+)" style="[^"]*--dl:([^";]+)">', aura, s)
rnd = random.Random(4)
for cls, name in (('cpw__em', 'fire'), ('cpw__bu', 'water'), ('cpw__lf', 'leaf')):
    cx, cy = cards[name]['centre']

    def particle(m, cls=cls, cx=cx, cy=cy):
        l, t = pct(cx + rnd.uniform(-12, 12), cy + rnd.uniform(-6, 10))
        return f'<i class="{cls}" style="left:{l};top:{t};{m.group(1)}">'
    s = re.sub(r'<i class="' + cls + r'" style="left:[^;]+;top:[^;]+;([^"]*)">', particle, s)
glints = iter([(64, wy(64, N_MID) - 32), (112, wy(112, N_MID) - 36), (184, wy(184, N_BOT) - 52), (358, wy(358, N_MID) - 46), (590, wy(590, N_MID) - 30)])
s = re.sub(r'<i class="cpw__gl" style="left:[^;]+;top:[^;]+;([^"]*)">',
           lambda m: '<i class="cpw__gl" style="left:{};top:{};{}">'.format(*pct(*next(glints)), m.group(1)), s)
open(path, 'w', encoding='utf-8').write(s)

gx, gy = 560, wy(560, N_MID) - 4
path = os.path.join(ROOT, 'assets', 'css', 'site.css')
c = open(path, encoding='utf-8').read()
c, n = re.subn(r'(\.cpw__gem \{\n  position: absolute;\n  left: )[\d.]+%;\n  top: [\d.]+%;',
               lambda m: m.group(1) + f'{(gx + 28) / W * 100:.1f}%;\n  top: {(gy - 12) / H * 100:.1f}%;', c)
assert n == 1
open(path, 'w', encoding='utf-8').write(c)
print('overlays re-anchored')
