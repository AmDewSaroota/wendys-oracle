/**
 * GeoThai — Thailand Geological Terranes
 * 4 major tectonic terranes from west to east:
 *   Sibumasu, Inthanon Zone, Sukhothai, Indochina
 *
 * Coordinates are simplified approximations for visualization.
 * Sources: DMR geological map, Metcalfe (2011), Sone & Metcalfe (2008)
 */
window.GEOTHAI_DATA = window.GEOTHAI_DATA || {};
window.GEOTHAI_DATA.zones = {
  type: "FeatureCollection",
  features: [
    // ─────────────────────────────────────────────
    // 1. Sibumasu Terrane (Shan-Thai)
    // ─────────────────────────────────────────────
    {
      type: "Feature",
      properties: {
        name_th: "\u0e41\u0e1c\u0e48\u0e19\u0e40\u0e1b\u0e25\u0e37\u0e2d\u0e01\u0e42\u0e25\u0e01\u0e0a\u0e34\u0e1a\u0e39\u0e21\u0e30\u0e2a\u0e38 (\u0e0a\u0e32\u0e19-\u0e44\u0e17\u0e22)",
        name_en: "Sibumasu Terrane (Shan-Thai)",
        zone_id: "sibumasu",
        color: "#2196F3",
        opacity: 0.15,
        age: "Late Paleozoic \u2013 Triassic",
        description_th: "\u0e41\u0e1c\u0e48\u0e19\u0e40\u0e1b\u0e25\u0e37\u0e2d\u0e01\u0e42\u0e25\u0e01\u0e17\u0e32\u0e07\u0e1d\u0e31\u0e48\u0e07\u0e15\u0e30\u0e27\u0e31\u0e19\u0e15\u0e01\u0e02\u0e2d\u0e07\u0e1b\u0e23\u0e30\u0e40\u0e17\u0e28\u0e44\u0e17\u0e22 \u0e21\u0e35\u0e2b\u0e34\u0e19\u0e41\u0e01\u0e23\u0e19\u0e34\u0e15 \u0e2b\u0e34\u0e19\u0e1b\u0e39\u0e19 \u0e41\u0e25\u0e30\u0e2b\u0e34\u0e19\u0e41\u0e1b\u0e23\u0e2a\u0e20\u0e32\u0e1e\u0e2a\u0e39\u0e07 \u0e40\u0e1b\u0e47\u0e19\u0e41\u0e2b\u0e25\u0e48\u0e07\u0e41\u0e23\u0e48\u0e14\u0e35\u0e1a\u0e38\u0e01\u0e41\u0e25\u0e30\u0e17\u0e31\u0e07\u0e2a\u0e40\u0e15\u0e19\u0e17\u0e35\u0e48\u0e2a\u0e33\u0e04\u0e31\u0e0d",
        description_en: "Western Thailand terrane extending from the Malaysian border to the north. Rich in granites, limestones, and high-grade metamorphic rocks. Major source of tin-tungsten mineralization.",
        key_rocks: ["granite", "limestone", "gneiss", "schist"],
        key_minerals: ["tin", "tungsten", "lead", "fluorite", "gem"]
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [97.50, 5.60],
          [98.30, 5.60],
          [98.50, 6.30],
          [98.60, 7.00],
          [98.80, 7.80],
          [98.70, 8.50],
          [98.50, 9.20],
          [98.40, 9.80],
          [98.80, 10.50],
          [99.20, 11.20],
          [99.40, 12.00],
          [99.50, 13.00],
          [99.40, 14.00],
          [99.20, 15.00],
          [99.00, 16.00],
          [98.80, 17.00],
          [99.00, 18.00],
          [99.10, 19.00],
          [99.00, 19.50],
          [98.10, 19.50],
          [97.80, 19.00],
          [97.50, 18.00],
          [98.00, 17.00],
          [98.50, 16.00],
          [98.70, 15.00],
          [98.40, 14.50],
          [98.80, 13.50],
          [99.00, 12.50],
          [98.90, 11.50],
          [98.30, 10.50],
          [98.20, 9.50],
          [98.30, 8.50],
          [98.40, 7.50],
          [98.20, 6.80],
          [98.10, 6.00],
          [97.50, 5.60]
        ]]
      }
    },

    // ─────────────────────────────────────────────
    // 2. Inthanon Zone (accretionary complex)
    // ─────────────────────────────────────────────
    {
      type: "Feature",
      properties: {
        name_th: "\u0e41\u0e19\u0e27\u0e2b\u0e34\u0e19\u0e2d\u0e34\u0e19\u0e17\u0e19\u0e19\u0e17\u0e4c",
        name_en: "Inthanon Zone",
        zone_id: "inthanon",
        color: "#009688",
        opacity: 0.15,
        age: "Carboniferous \u2013 Triassic (Paleo-Tethys oceanic)",
        description_th: "\u0e41\u0e19\u0e27\u0e2b\u0e34\u0e19\u0e2a\u0e30\u0e2a\u0e21\u0e08\u0e32\u0e01\u0e01\u0e32\u0e23\u0e21\u0e38\u0e14\u0e15\u0e31\u0e27\u0e02\u0e2d\u0e07\u0e41\u0e1c\u0e48\u0e19\u0e40\u0e1b\u0e25\u0e37\u0e2d\u0e01\u0e42\u0e25\u0e01 \u0e1b\u0e23\u0e30\u0e01\u0e2d\u0e1a\u0e14\u0e49\u0e27\u0e22\u0e2b\u0e34\u0e19\u0e40\u0e0a\u0e34\u0e23\u0e4c\u0e17 \u0e40\u0e0b\u0e2d\u0e23\u0e4c\u0e40\u0e1e\u0e19\u0e17\u0e34\u0e44\u0e19\u0e15\u0e4c \u0e41\u0e25\u0e30\u0e42\u0e2d\u0e1f\u0e34\u0e42\u0e2d\u0e44\u0e25\u0e15\u0e4c \u0e40\u0e1b\u0e47\u0e19\u0e2b\u0e25\u0e31\u0e01\u0e10\u0e32\u0e19\u0e02\u0e2d\u0e07\u0e21\u0e2b\u0e32\u0e2a\u0e21\u0e38\u0e17\u0e23\u0e1e\u0e32\u0e25\u0e35\u0e42\u0e2d\u0e40\u0e17\u0e17\u0e34\u0e2a\u0e42\u0e1a\u0e23\u0e32\u0e13",
        description_en: "Narrow accretionary complex marking the Paleo-Tethys suture. Contains chert, serpentinite, and ophiolitic fragments. Represents remnants of oceanic crust consumed during terrane collision.",
        key_rocks: ["chert", "serpentinite", "limestone", "ophiolite"],
        key_minerals: ["chromite", "asbestos"]
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [99.00, 17.00],
          [99.20, 17.00],
          [99.30, 17.30],
          [99.40, 17.60],
          [99.40, 17.90],
          [99.35, 18.20],
          [99.30, 18.50],
          [99.25, 18.80],
          [99.20, 19.10],
          [99.15, 19.40],
          [99.10, 19.50],
          [99.00, 19.50],
          [99.00, 19.10],
          [99.05, 18.80],
          [99.05, 18.50],
          [99.00, 18.20],
          [98.95, 17.90],
          [98.90, 17.60],
          [98.85, 17.30],
          [99.00, 17.00]
        ]]
      }
    },

    // ─────────────────────────────────────────────
    // 3. Sukhothai Terrane (volcanic arc)
    // ─────────────────────────────────────────────
    {
      type: "Feature",
      properties: {
        name_th: "\u0e41\u0e1c\u0e48\u0e19\u0e40\u0e1b\u0e25\u0e37\u0e2d\u0e01\u0e42\u0e25\u0e01\u0e2a\u0e38\u0e42\u0e02\u0e17\u0e31\u0e22",
        name_en: "Sukhothai Terrane",
        zone_id: "sukhothai",
        color: "#4CAF50",
        opacity: 0.15,
        age: "Permian \u2013 Triassic (volcanic arc)",
        description_th: "\u0e41\u0e19\u0e27\u0e20\u0e39\u0e40\u0e02\u0e32\u0e44\u0e1f\u0e42\u0e1a\u0e23\u0e32\u0e13\u0e17\u0e35\u0e48\u0e40\u0e01\u0e34\u0e14\u0e08\u0e32\u0e01\u0e01\u0e32\u0e23\u0e21\u0e38\u0e14\u0e15\u0e31\u0e27\u0e02\u0e2d\u0e07\u0e41\u0e1c\u0e48\u0e19\u0e40\u0e1b\u0e25\u0e37\u0e2d\u0e01\u0e42\u0e25\u0e01 \u0e1b\u0e23\u0e30\u0e01\u0e2d\u0e1a\u0e14\u0e49\u0e27\u0e22\u0e2b\u0e34\u0e19\u0e20\u0e39\u0e40\u0e02\u0e32\u0e44\u0e1f \u0e2b\u0e34\u0e19\u0e14\u0e34\u0e19\u0e14\u0e32\u0e19\u0e2a\u0e35\u0e14\u0e33 \u0e41\u0e25\u0e30\u0e2b\u0e34\u0e19\u0e2d\u0e48\u0e2d\u0e19\u0e2b\u0e34\u0e19\u0e2d\u0e31\u0e04\u0e19\u0e35",
        description_en: "Permian-Triassic volcanic arc belt between the Inthanon suture and Indochina. Contains volcanic tuffs, agglomerates, and associated mineralization of copper, gold, and silver.",
        key_rocks: ["volcanic tuff", "agglomerate", "black shale", "marble"],
        key_minerals: ["copper", "gold", "silver"]
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [99.20, 15.00],
          [99.80, 15.00],
          [100.00, 15.50],
          [100.20, 16.00],
          [100.30, 16.50],
          [100.40, 17.00],
          [99.40, 17.00],
          [99.50, 17.50],
          [99.50, 18.00],
          [99.45, 18.50],
          [99.40, 19.00],
          [99.35, 19.40],
          [99.15, 19.40],
          [99.20, 19.10],
          [99.25, 18.80],
          [99.30, 18.50],
          [99.35, 18.20],
          [99.40, 17.90],
          [99.40, 17.60],
          [99.30, 17.30],
          [99.20, 17.00],
          [99.00, 16.00],
          [99.20, 15.50],
          [99.20, 15.00]
        ]]
      }
    },

    // ─────────────────────────────────────────────
    // 4. Indochina Terrane
    // ─────────────────────────────────────────────
    {
      type: "Feature",
      properties: {
        name_th: "\u0e41\u0e1c\u0e48\u0e19\u0e40\u0e1b\u0e25\u0e37\u0e2d\u0e01\u0e42\u0e25\u0e01\u0e2d\u0e34\u0e19\u0e42\u0e14\u0e08\u0e35\u0e19",
        name_en: "Indochina Terrane",
        zone_id: "indochina",
        color: "#FF9800",
        opacity: 0.15,
        age: "Paleozoic \u2013 Mesozoic",
        description_th: "\u0e41\u0e1c\u0e48\u0e19\u0e40\u0e1b\u0e25\u0e37\u0e2d\u0e01\u0e42\u0e25\u0e01\u0e02\u0e19\u0e32\u0e14\u0e43\u0e2b\u0e0d\u0e48\u0e17\u0e35\u0e48\u0e2a\u0e38\u0e14\u0e02\u0e2d\u0e07\u0e1b\u0e23\u0e30\u0e40\u0e17\u0e28\u0e44\u0e17\u0e22 \u0e04\u0e23\u0e2d\u0e1a\u0e04\u0e25\u0e38\u0e21\u0e17\u0e35\u0e48\u0e23\u0e32\u0e1a\u0e2a\u0e39\u0e07\u0e42\u0e04\u0e23\u0e32\u0e0a \u0e1b\u0e23\u0e30\u0e01\u0e2d\u0e1a\u0e14\u0e49\u0e27\u0e22\u0e2b\u0e34\u0e19\u0e17\u0e23\u0e32\u0e22\u0e41\u0e14\u0e07 \u0e2b\u0e34\u0e19\u0e40\u0e01\u0e25\u0e37\u0e2d \u0e41\u0e25\u0e30\u0e2b\u0e34\u0e19\u0e23\u0e30\u0e40\u0e2b\u0e22 \u0e40\u0e1b\u0e47\u0e19\u0e41\u0e2b\u0e25\u0e48\u0e07\u0e41\u0e23\u0e48\u0e42\u0e1e\u0e41\u0e17\u0e0a\u0e41\u0e25\u0e30\u0e40\u0e01\u0e25\u0e37\u0e2d\u0e2b\u0e34\u0e19\u0e17\u0e35\u0e48\u0e2a\u0e33\u0e04\u0e31\u0e0d",
        description_en: "The largest terrane covering eastern and central-eastern Thailand including the Khorat Plateau. Dominated by red sandstones, siltstones, evaporites, and Cenozoic basalt fields. Major source of potash, rock salt, and gemstones.",
        key_rocks: ["red sandstone", "siltstone", "evaporite", "basalt"],
        key_minerals: ["potash", "rock_salt", "gypsum", "gem", "iron"]
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [99.80, 15.00],
          [100.00, 15.50],
          [100.20, 16.00],
          [100.30, 16.50],
          [100.40, 17.00],
          [99.50, 17.50],
          [99.50, 18.00],
          [99.45, 18.50],
          [99.40, 19.00],
          [99.35, 19.40],
          [99.50, 19.80],
          [100.10, 20.40],
          [100.50, 20.30],
          [101.00, 19.60],
          [101.50, 18.80],
          [102.10, 18.20],
          [102.80, 17.90],
          [103.50, 17.40],
          [104.00, 17.00],
          [104.70, 16.50],
          [105.20, 16.00],
          [105.60, 15.40],
          [105.30, 14.80],
          [104.80, 14.40],
          [104.50, 14.00],
          [103.50, 14.30],
          [102.60, 14.10],
          [102.30, 13.50],
          [102.00, 12.80],
          [101.80, 12.30],
          [101.50, 12.60],
          [101.00, 12.50],
          [100.80, 12.80],
          [100.50, 13.20],
          [100.30, 13.50],
          [100.10, 13.20],
          [100.00, 12.60],
          [99.80, 12.00],
          [99.50, 11.50],
          [99.30, 11.00],
          [99.40, 12.00],
          [99.50, 13.00],
          [99.40, 14.00],
          [99.20, 15.00],
          [99.80, 15.00]
        ]]
      }
    }
  ]
};
