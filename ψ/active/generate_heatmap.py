"""
Smart Rail — Heatmap Generator
Simulates visitor density on Concourse Level Zone 9 floorplan
Based on DeepTrack sensor data model (Radical Enlighten)
"""

import sys
import os
sys.stdout.reconfigure(encoding='utf-8')

import numpy as np
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
from matplotlib.patches import FancyBboxPatch
from scipy.ndimage import gaussian_filter
from PIL import Image

# --- Config ---
FLOORPLAN_PATH = os.path.join(os.path.dirname(__file__), "width_1600.png")
OUTPUT_DIR = os.path.dirname(__file__)

# Load floorplan
img = Image.open(FLOORPLAN_PATH)
img_array = np.array(img)
h, w = img_array.shape[:2]

# --- Define sensor node positions (normalized 0-1, mapped to image) ---
# Based on floorplan layout analysis
SENSOR_NODES = {
    "FARE_GATE":       {"pos": (0.42, 0.58), "label": "Fare Gates",        "capacity": 200},
    "MAIN_CONCOURSE":  {"pos": (0.50, 0.30), "label": "Main Concourse",    "capacity": 500},
    "BUS_BAY_EXIT":    {"pos": (0.42, 0.68), "label": "Exit to Bus Bay",   "capacity": 150},
    "SECURITY":        {"pos": (0.52, 0.52), "label": "Security Office",   "capacity": 50},
    "TICKET":          {"pos": (0.78, 0.82), "label": "Ticket Counter",    "capacity": 100},
    "CORRIDOR_WEST":   {"pos": (0.12, 0.55), "label": "West Corridor",     "capacity": 120},
    "CORRIDOR_NORTH":  {"pos": (0.35, 0.15), "label": "North Passage",     "capacity": 180},
    "AHU_AREA":        {"pos": (0.55, 0.80), "label": "A.H.U. Area",       "capacity": 30},
    "ZONE_13":         {"pos": (0.75, 0.55), "label": "Zone 13 Junction",  "capacity": 250},
    "SOUTH_ENTRY":     {"pos": (0.38, 0.90), "label": "South Entry",       "capacity": 160},
}

# --- Time period simulation profiles ---
# Each period defines density multiplier per node (0.0 = empty, 1.0 = at capacity)
TIME_PERIODS = {
    "morning_0600_0900": {
        "title": "Morning Rush (06:00-09:00)",
        "subtitle": "Passengers entering station — High ticket + fare gate activity",
        "densities": {
            "FARE_GATE":      0.85,
            "MAIN_CONCOURSE": 0.70,
            "BUS_BAY_EXIT":   0.30,
            "SECURITY":       0.20,
            "TICKET":         0.90,
            "CORRIDOR_WEST":  0.45,
            "CORRIDOR_NORTH": 0.60,
            "AHU_AREA":       0.05,
            "ZONE_13":        0.55,
            "SOUTH_ENTRY":    0.75,
        }
    },
    "midday_1200_1500": {
        "title": "Midday Peak (12:00-15:00)",
        "subtitle": "Peak tourist density — Concourse + Zone 13 crowded",
        "densities": {
            "FARE_GATE":      0.95,
            "MAIN_CONCOURSE": 0.90,
            "BUS_BAY_EXIT":   0.70,
            "SECURITY":       0.35,
            "TICKET":         0.80,
            "CORRIDOR_WEST":  0.65,
            "CORRIDOR_NORTH": 0.50,
            "AHU_AREA":       0.05,
            "ZONE_13":        0.85,
            "SOUTH_ENTRY":    0.60,
        }
    },
    "evening_1800_2100": {
        "title": "Evening (18:00-21:00)",
        "subtitle": "Passengers exiting — Bus Bay + South Entry congested",
        "densities": {
            "FARE_GATE":      0.75,
            "MAIN_CONCOURSE": 0.50,
            "BUS_BAY_EXIT":   0.90,
            "SECURITY":       0.15,
            "TICKET":         0.40,
            "CORRIDOR_WEST":  0.55,
            "CORRIDOR_NORTH": 0.35,
            "AHU_AREA":       0.05,
            "ZONE_13":        0.65,
            "SOUTH_ENTRY":    0.80,
        }
    },
}

# --- Custom colormap: Green (Comfort) → Yellow (Busy) → Red (Alert) ---
colors_list = [
    (0.0, 0.0, 0.0, 0.0),       # transparent (no people)
    (0.0, 0.8, 0.2, 0.25),      # green - Comfort
    (0.2, 0.9, 0.1, 0.35),      # light green
    (1.0, 0.95, 0.0, 0.45),     # yellow - Busy
    (1.0, 0.6, 0.0, 0.55),      # orange
    (1.0, 0.15, 0.0, 0.65),     # red - Alert
    (0.8, 0.0, 0.0, 0.75),      # dark red - Over capacity
]
cmap = mcolors.LinearSegmentedColormap.from_list("density", colors_list, N=256)


def generate_density_field(period_key):
    """Generate a 2D density field from sensor node positions + simulated spread."""
    period = TIME_PERIODS[period_key]
    field = np.zeros((h, w), dtype=np.float64)

    for node_id, node in SENSOR_NODES.items():
        density = period["densities"][node_id]
        px = int(node["pos"][0] * w)
        py = int(node["pos"][1] * h)

        # Create point source
        spread = int(min(w, h) * 0.08)  # spread radius
        y_min = max(0, py - spread)
        y_max = min(h, py + spread)
        x_min = max(0, px - spread)
        x_max = min(w, px + spread)

        for y in range(y_min, y_max):
            for x in range(x_min, x_max):
                dist = np.sqrt((x - px)**2 + (y - py)**2)
                if dist < spread:
                    intensity = density * (1 - dist / spread) ** 1.5
                    field[y, x] = max(field[y, x], intensity)

    # Smooth the field
    field = gaussian_filter(field, sigma=min(w, h) * 0.035)

    # Normalize
    field = np.clip(field / max(field.max(), 0.01), 0, 1)
    return field


def render_heatmap(period_key):
    """Render heatmap overlay on floorplan and save."""
    period = TIME_PERIODS[period_key]
    field = generate_density_field(period_key)

    fig, ax = plt.subplots(1, 1, figsize=(16, 10), dpi=150)

    # Draw floorplan
    ax.imshow(img_array, extent=[0, w, h, 0], zorder=1)

    # Overlay heatmap
    ax.imshow(field, extent=[0, w, h, 0], cmap=cmap, alpha=0.7,
              vmin=0, vmax=1, zorder=2, interpolation='bilinear')

    # Draw sensor node markers
    for node_id, node in SENSOR_NODES.items():
        px = node["pos"][0] * w
        py = node["pos"][1] * h
        density = period["densities"][node_id]
        count = int(density * node["capacity"])

        # Status color
        if density < 0.5:
            status, scolor = "Comfort", "#2ecc71"
        elif density < 0.8:
            status, scolor = "Busy", "#f39c12"
        else:
            status, scolor = "Alert", "#e74c3c"

        # Node dot
        ax.plot(px, py, 'o', color=scolor, markersize=10, markeredgecolor='white',
                markeredgewidth=1.5, zorder=5)

        # Label
        label = f"{node['label']}\n{count}/{node['capacity']} ({status})"
        ax.annotate(label, (px, py), fontsize=5.5, fontweight='bold',
                    color='white', ha='center', va='bottom',
                    xytext=(0, 12), textcoords='offset points',
                    bbox=dict(boxstyle='round,pad=0.3', facecolor=scolor,
                              edgecolor='white', alpha=0.85),
                    zorder=6)

    # Title bar
    title_box = FancyBboxPatch((w * 0.02, h * 0.01), w * 0.96, h * 0.08,
                                boxstyle="round,pad=5", facecolor='#2c3e50',
                                edgecolor='white', linewidth=1.5, alpha=0.9,
                                zorder=7)
    ax.add_patch(title_box)
    ax.text(w * 0.50, h * 0.035, period["title"],
            fontsize=14, fontweight='bold', color='white',
            ha='center', va='center', zorder=8)
    ax.text(w * 0.50, h * 0.065, period["subtitle"],
            fontsize=9, color='#bdc3c7', ha='center', va='center', zorder=8)

    # DeepTrack branding
    ax.text(w * 0.98, h * 0.035, "DeepTrack Simulation",
            fontsize=7, color='#95a5a6', ha='right', va='center', zorder=8)

    # Legend
    legend_y = h * 0.94
    legend_items = [
        ("#2ecc71", "Comfort (< 50%)"),
        ("#f39c12", "Busy (50-80%)"),
        ("#e74c3c", "Alert (> 80%)"),
    ]
    for i, (color, label) in enumerate(legend_items):
        lx = w * 0.05 + i * w * 0.15
        ax.add_patch(plt.Rectangle((lx, legend_y), w * 0.02, h * 0.02,
                                    facecolor=color, edgecolor='white',
                                    linewidth=1, zorder=7))
        ax.text(lx + w * 0.025, legend_y + h * 0.01, label,
                fontsize=7, color='white', va='center', fontweight='bold',
                bbox=dict(boxstyle='round,pad=0.2', facecolor='#2c3e50',
                          alpha=0.8, edgecolor='none'),
                zorder=8)

    ax.set_xlim(0, w)
    ax.set_ylim(h, 0)
    ax.axis('off')
    plt.tight_layout(pad=0.5)

    output_path = os.path.join(OUTPUT_DIR, f"heatmap_{period_key}.png")
    fig.savefig(output_path, bbox_inches='tight', facecolor='#1a1a2e', pad_inches=0.2)
    plt.close(fig)
    print(f"Saved: {output_path}")
    return output_path


if __name__ == "__main__":
    print(f"Floorplan: {w}x{h}px")
    print(f"Sensor nodes: {len(SENSOR_NODES)}")
    print()
    for key in TIME_PERIODS:
        render_heatmap(key)
    print("\nDone! Generated 3 heatmaps.")
