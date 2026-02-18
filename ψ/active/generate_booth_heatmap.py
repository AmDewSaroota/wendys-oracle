"""
Smart Tourism — Booth Placement Heatmap (Dense Sensor Version)
150+ sensors for high-resolution 1-month foot traffic overlay
on Concourse Level Zone 9 floor plan.

Purpose: Identify booth locations and pricing tiers based on traffic density.
"""

import sys
import os
sys.stdout.reconfigure(encoding='utf-8')

import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from matplotlib.patches import FancyBboxPatch, Rectangle, Circle
import matplotlib.patheffects as pe
from scipy.ndimage import gaussian_filter
from PIL import Image

# --- Config ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FLOORPLAN_PATH = os.path.join(SCRIPT_DIR, "width_1600.png")
OUTPUT_DIR = SCRIPT_DIR

img = Image.open(FLOORPLAN_PATH)
img_array = np.array(img)
h, w = img_array.shape[:2]
print(f"Floor plan: {w} x {h} px")

# ============================================================
# WALKABLE ZONES — define where people can actually walk
# (x_min, y_min, x_max, y_max) in pixels + traffic weight
# ============================================================

WALKABLE_ZONES = [
    # Main horizontal corridor — heaviest flow
    {"name": "Main Corridor",      "bbox": (80, 280, 1450, 400),  "weight": 0.85},
    # Upper corridor / passage
    {"name": "Upper Passage",      "bbox": (150, 140, 1350, 280), "weight": 0.55},
    # Fare gate area — peak concentration
    {"name": "Fare Gate Zone",     "bbox": (450, 350, 750, 480),  "weight": 1.0},
    # Exit to Bus Bay — everyone funnels through here
    {"name": "Bus Bay Exit",       "bbox": (450, 460, 780, 580),  "weight": 0.90},
    # Zone 13 open area — prime booth space
    {"name": "Zone 13 Open",       "bbox": (800, 250, 1300, 430), "weight": 0.65},
    # Ticket counter area
    {"name": "Ticket Area",        "bbox": (820, 430, 1150, 570), "weight": 0.70},
    # West wing corridor
    {"name": "West Wing",          "bbox": (30, 320, 300, 530),   "weight": 0.40},
    # Northwest rooms
    {"name": "NW Rooms",           "bbox": (30, 80, 320, 300),    "weight": 0.25},
    # South passage — wider zone, connects bus bay to ticket
    {"name": "South Passage",      "bbox": (300, 540, 1150, 650), "weight": 0.55},
    # North entry — expanded, this is a major entrance
    {"name": "North Entry",        "bbox": (250, 30, 800, 160),   "weight": 0.80},
    # East entry — expanded to edge
    {"name": "East Entry",         "bbox": (1280, 150, 1560, 480),"weight": 0.75},
    # West entry (red arrows on floorplan)
    {"name": "West Entry",         "bbox": (0, 280, 100, 500),    "weight": 0.70},
    # South entry (bottom of floorplan)
    {"name": "South Entry",        "bbox": (350, 630, 800, 700),  "weight": 0.65},
]

# ============================================================
# DENSE SENSOR PLACEMENT — ~40px spacing (~3-4m real scale)
# ============================================================

SENSOR_SPACING = 40
sensors = []

for zone in WALKABLE_ZONES:
    x1, y1, x2, y2 = zone["bbox"]
    for sx in range(x1 + SENSOR_SPACING // 2, x2, SENSOR_SPACING):
        for sy in range(y1 + SENSOR_SPACING // 2, y2, SENSOR_SPACING):
            sensors.append({
                "x": sx, "y": sy,
                "zone": zone["name"],
                "weight": zone["weight"],
            })

print(f"Sensors deployed: {len(sensors)}")

# ============================================================
# SIMULATE 1-MONTH DATA (30 days)
# ============================================================

np.random.seed(2026)
BASE_DAILY = 12000  # max daily uniques at weight=1.0

sensor_data = []
for s in sensors:
    base = BASE_DAILY * 30 * s["weight"]

    # Edge attenuation — center of zone gets more traffic
    zone = next(z for z in WALKABLE_ZONES if z["name"] == s["zone"])
    x1, y1, x2, y2 = zone["bbox"]
    cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
    zw, zh = max(x2 - x1, 1), max(y2 - y1, 1)
    dx = abs(s["x"] - cx) / (zw / 2)
    dy = abs(s["y"] - cy) / (zh / 2)
    edge_factor = 1.0 - 0.3 * (dx ** 2 + dy ** 2) / 2

    noise = np.random.normal(1.0, 0.12)
    monthly = int(max(0, base * edge_factor * noise))

    sensor_data.append({**s, "monthly": monthly, "daily_avg": monthly / 30})

total = sum(s["monthly"] for s in sensor_data)
print(f"Total monthly detections: {total:,}")

# ============================================================
# BUILD HEATMAP
# ============================================================

heatmap = np.zeros((h, w), dtype=np.float64)
RADIUS = 50

for s in sensor_data:
    sx, sy, count = s["x"], s["y"], s["monthly"]
    y_lo, y_hi = max(0, sy - RADIUS * 2), min(h, sy + RADIUS * 2)
    x_lo, x_hi = max(0, sx - RADIUS * 2), min(w, sx + RADIUS * 2)
    if y_hi <= y_lo or x_hi <= x_lo:
        continue

    ys = np.arange(y_lo, y_hi)
    xs = np.arange(x_lo, x_hi)
    xx, yy = np.meshgrid(xs, ys)
    dist_sq = (xx - sx) ** 2 + (yy - sy) ** 2
    cutoff = (RADIUS * 2) ** 2
    gauss = count * np.exp(-dist_sq / (2 * RADIUS ** 2))
    heatmap[y_lo:y_hi, x_lo:x_hi] += gauss * (dist_sq < cutoff)

heatmap = gaussian_filter(heatmap, sigma=20)
hm_max = heatmap.max()
heatmap_norm = heatmap / hm_max if hm_max > 0 else heatmap
print(f"Heatmap ready (max raw: {hm_max:.0f})")

# ============================================================
# BOOTH SPOTS + PRICING
# ============================================================

BOOTH_SPOTS = [
    # Zone 13 area — open space, great for booths
    (920, 320, "B1", "large"),
    (1050, 320, "B2", "large"),
    (1180, 320, "B3", "medium"),
    (920, 400, "B4", "medium"),
    (1050, 400, "B5", "medium"),
    (1180, 400, "B6", "small"),
    # Near fare gates — premium eyeballs
    (480, 300, "A1", "medium"),
    (580, 300, "A2", "medium"),
    (680, 300, "A3", "medium"),
    # West wing — budget spots
    (150, 370, "C1", "small"),
    (150, 440, "C2", "small"),
    (250, 370, "C3", "small"),
    # Upper corridor
    (400, 200, "D1", "medium"),
    (550, 200, "D2", "medium"),
    (700, 200, "D3", "medium"),
    (900, 200, "D4", "small"),
    # Near ticket
    (870, 500, "E1", "small"),
    (970, 500, "E2", "small"),
]


def get_booth_price(x, y, size):
    density = heatmap_norm[min(int(y), h - 1), min(int(x), w - 1)] if (0 <= y < h and 0 <= x < w) else 0
    size_mult = {"large": 1.5, "medium": 1.0, "small": 0.7}[size]

    if density > 0.70:
        base, tier, color = 25000, "Premium", "#e74c3c"
    elif density > 0.45:
        base, tier, color = 18000, "Gold", "#f39c12"
    elif density > 0.25:
        base, tier, color = 12000, "Standard", "#3498db"
    else:
        base, tier, color = 7000, "Economy", "#27ae60"

    return int(base * size_mult), tier, color, density


# ============================================================
# COLORMAP — deep blue → cyan → green → yellow → orange → red
# ============================================================

cmap_colors = [
    (0.0, 0.0, 0.0, 0.0),
    (0.0, 0.25, 0.75, 0.10),
    (0.0, 0.55, 0.95, 0.20),
    (0.0, 0.80, 0.70, 0.32),
    (0.15, 0.95, 0.30, 0.42),
    (0.65, 1.0, 0.0, 0.50),
    (1.0, 0.90, 0.0, 0.57),
    (1.0, 0.55, 0.0, 0.64),
    (1.0, 0.20, 0.0, 0.72),
    (0.80, 0.0, 0.0, 0.80),
]
cmap = mcolors.LinearSegmentedColormap.from_list("deeptrack", cmap_colors, N=512)


# ============================================================
# RENDER 1: Heatmap with sensor dots
# ============================================================

def render_heatmap():
    fig, ax = plt.subplots(1, 1, figsize=(20, 20 * h / w), dpi=120)
    ax.imshow(img_array, zorder=1)
    im = ax.imshow(heatmap_norm, cmap=cmap, alpha=0.72, interpolation='bilinear',
                   vmin=0, vmax=1, zorder=2)

    # Tiny sensor dots
    sx = [s["x"] for s in sensor_data]
    sy = [s["y"] for s in sensor_data]
    ax.scatter(sx, sy, s=1.5, c='white', alpha=0.25, zorder=3, linewidths=0)

    # Colorbar
    cbar = plt.colorbar(im, ax=ax, fraction=0.026, pad=0.012, aspect=35)
    cbar.set_label('Monthly Foot Traffic Density (30 days)', fontsize=11, fontweight='bold')
    cbar.set_ticks([0, 0.2, 0.4, 0.6, 0.8, 1.0])
    cbar.set_ticklabels(['Very Low\n< 2K/day', 'Low\n2-4K', 'Moderate\n4-6K',
                          'High\n6-8K', 'Very High\n8-10K', 'Peak\n> 10K/day'], fontsize=8)

    ax.set_title('DeepTrack Heatmap — Concourse Level Zone 9\n'
                 f'1-Month Aggregated Foot Traffic  |  {len(sensors)} Sensors',
                 fontsize=15, fontweight='bold', pad=12, color='#2c3e50')

    ax.text(0.5, -0.015, f"Sensors: {len(sensors)}  |  Period: 30 days  |  "
            f"Total detections: {total:,}  |  Avg daily: {total // 30:,}",
            transform=ax.transAxes, fontsize=9, ha='center', color='#7f8c8d',
            bbox=dict(boxstyle='round,pad=0.4', facecolor='white', alpha=0.9, edgecolor='#bdc3c7'))

    ax.set_xlim(0, w); ax.set_ylim(h, 0); ax.axis('off')
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "heatmap_sensor_coverage_18.png")
    fig.savefig(path, bbox_inches='tight', facecolor='white', dpi=150)
    plt.close(fig)
    print(f"Saved: {path}")


# ============================================================
# RENDER 2: Booth pricing overlay
# ============================================================

def render_booth_pricing():
    fig, ax = plt.subplots(1, 1, figsize=(20, 20 * h / w), dpi=120)
    ax.imshow(img_array, zorder=1)
    ax.imshow(heatmap_norm, cmap=cmap, alpha=0.62, interpolation='bilinear',
              vmin=0, vmax=1, zorder=2)

    # Booths
    for bx, by, label, size in BOOTH_SPOTS:
        price, tier, color, density = get_booth_price(bx, by, size)
        r = {"large": 20, "medium": 15, "small": 11}[size]

        circle = Circle((bx, by), r, facecolor=color, edgecolor='white',
                         linewidth=2.2, alpha=0.88, zorder=5)
        ax.add_patch(circle)

        ax.text(bx, by, label, fontsize=7, fontweight='bold', color='white',
                ha='center', va='center', zorder=6)

        ax.annotate(f"฿{price:,}/mo\n{tier} | {size.title()}",
                    (bx, by), xytext=(0, -(r + 16)), textcoords='offset points',
                    fontsize=6, fontweight='bold', color='white', ha='center', va='top',
                    bbox=dict(boxstyle='round,pad=0.3', facecolor=color,
                              edgecolor='white', alpha=0.92, linewidth=1),
                    zorder=7)

    ax.set_title('DeepTrack — Booth Placement & Pricing Map\n'
                 'Concourse Level Zone 9  |  Based on 1-Month Traffic Analysis',
                 fontsize=15, fontweight='bold', pad=12, color='#2c3e50')

    # Pricing legend
    legend_info = [
        ("Premium", "#e74c3c", "> 7K/day", "฿25,000+"),
        ("Gold", "#f39c12", "4.5-7K", "฿18,000+"),
        ("Standard", "#3498db", "2.5-4.5K", "฿12,000+"),
        ("Economy", "#27ae60", "< 2.5K/day", "฿7,000+"),
    ]
    for i, (name, col, traffic, price) in enumerate(legend_info):
        lx, ly = w * 0.02, h * 0.87 + i * h * 0.033
        ax.add_patch(Rectangle((lx, ly), w * 0.013, h * 0.026,
                                facecolor=col, edgecolor='white', linewidth=1, zorder=7, alpha=0.9))
        ax.text(lx + w * 0.019, ly + h * 0.013,
                f"{name}  —  {traffic}  ->  {price}/mo",
                fontsize=7, color='#2c3e50', va='center', fontweight='bold',
                bbox=dict(boxstyle='round,pad=0.2', facecolor='white', alpha=0.88, edgecolor='#bdc3c7'),
                zorder=8)

    ax.text(w * 0.78, h * 0.95, "Size multiplier:  Large x1.5  |  Medium x1.0  |  Small x0.7",
            fontsize=7, color='#2c3e50', fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='white', alpha=0.88, edgecolor='#bdc3c7'),
            zorder=8)

    ax.set_xlim(0, w); ax.set_ylim(h, 0); ax.axis('off')
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "heatmap_booth_pricing.png")
    fig.savefig(path, bbox_inches='tight', facecolor='white', dpi=150)
    plt.close(fig)
    print(f"Saved: {path}")


# ============================================================
# RENDER 3: Pricing table
# ============================================================

def render_booth_table():
    booth_rows = []
    for bx, by, label, size in BOOTH_SPOTS:
        price, tier, color, density = get_booth_price(bx, by, size)
        daily_est = int(density * BASE_DAILY)
        booth_rows.append((label, tier, size.title(), f"{daily_est:,}", f"฿{price:,}", color))

    booth_rows.sort(key=lambda r: int(r[4].replace('฿', '').replace(',', '')), reverse=True)

    fig, ax = plt.subplots(figsize=(12, max(6, len(booth_rows) * 0.45 + 2.5)), dpi=120)
    ax.axis('off')

    ax.text(0.5, 0.97, 'Booth Pricing Summary — Concourse Level Zone 9',
            fontsize=16, fontweight='bold', ha='center', va='top',
            transform=ax.transAxes, color='#2c3e50')
    ax.text(0.5, 0.93, 'Based on DeepTrack 1-Month Traffic Analysis  |  Prices in THB/month',
            fontsize=10, ha='center', va='top', transform=ax.transAxes, color='#7f8c8d')

    columns = ['Booth', 'Tier', 'Size', 'Est. Daily Traffic', 'Price/Month']
    cells = [[r[0], r[1], r[2], r[3], r[4]] for r in booth_rows]
    cell_colors = [[mcolors.to_rgba(r[5], alpha=0.12)] * 5 for r in booth_rows]

    table = ax.table(cellText=cells, colLabels=columns, cellColours=cell_colors,
                     colColours=['#2c3e50'] * 5, loc='center', cellLoc='center')
    table.auto_set_font_size(False)
    table.set_fontsize(10)
    table.scale(1.0, 1.8)

    for j in range(5):
        table[0, j].set_text_props(color='white', fontweight='bold')
        table[0, j].set_edgecolor('white')

    for i in range(1, len(cells) + 1):
        for j in range(5):
            table[i, j].set_edgecolor('#ecf0f1')
            if j == 4:
                table[i, j].set_text_props(fontweight='bold')

    # Total revenue
    total_monthly = sum(int(r[4].replace('฿', '').replace(',', '')) for r in booth_rows)
    ax.text(0.5, 0.03, f"Total potential revenue: ฿{total_monthly:,} / month  |  ฿{total_monthly * 12:,} / year",
            fontsize=11, fontweight='bold', ha='center', va='bottom',
            transform=ax.transAxes, color='#e74c3c')

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "heatmap_booth_table.png")
    fig.savefig(path, bbox_inches='tight', facecolor='white', dpi=120)
    plt.close(fig)
    print(f"Saved: {path}")


# ============================================================
# ZONE SUMMARY
# ============================================================

def print_summary():
    zone_stats = {}
    for s in sensor_data:
        zn = s["zone"]
        if zn not in zone_stats:
            zone_stats[zn] = {"sensors": 0, "total": 0}
        zone_stats[zn]["sensors"] += 1
        zone_stats[zn]["total"] += s["monthly"]

    print(f"\n{'=' * 70}")
    print("ZONE TRAFFIC SUMMARY (30 days)")
    print(f"{'=' * 70}")
    print(f"{'Zone':<20} {'Sensors':>8} {'Total':>14} {'Avg/Sensor':>12} {'Daily':>10}")
    print(f"{'-' * 70}")

    for zn in sorted(zone_stats, key=lambda z: zone_stats[z]["total"], reverse=True):
        zs = zone_stats[zn]
        print(f"{zn:<20} {zs['sensors']:>8} {zs['total']:>14,} "
              f"{zs['total'] // zs['sensors']:>12,} {zs['total'] // 30:>10,}")

    print(f"{'-' * 70}")
    print(f"{'TOTAL':<20} {len(sensor_data):>8} {total:>14,} "
          f"{total // len(sensor_data):>12,} {total // 30:>10,}")

    print(f"\n{'=' * 70}")
    print("BOOTH PRICING")
    print(f"{'=' * 70}")
    total_rev = 0
    for bx, by, label, size in sorted(BOOTH_SPOTS, key=lambda b: get_booth_price(*b[:2], b[3])[0], reverse=True):
        price, tier, _, density = get_booth_price(bx, by, size)
        daily = int(density * BASE_DAILY)
        total_rev += price
        print(f"  {label}  {tier:>10}  {size:>7}  {daily:>6,}/day  THB {price:>8,}/mo")
    print(f"{'-' * 70}")
    print(f"  TOTAL REVENUE: THB {total_rev:,}/mo  |  THB {total_rev * 12:,}/yr")


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    print(f"\n--- Generating Dense Heatmap ({len(sensors)} sensors) ---")
    render_heatmap()

    # Booth pricing maps — uncomment when ready
    # print(f"\n--- Generating Booth Pricing Map ---")
    # render_booth_pricing()
    # print(f"\n--- Generating Pricing Table ---")
    # render_booth_table()

    print_summary()
    print("\nDone!")
