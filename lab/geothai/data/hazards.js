/**
 * GeoThai — Thailand Geological Hazard Zones
 * 7 major hazard zones: landslide, sinkhole, subsidence, seismic
 *
 * Coordinates are simplified approximations for visualization.
 * Sources: DMR hazard maps, GISTDA, EGAT geological surveys
 */
window.GEOTHAI_DATA = window.GEOTHAI_DATA || {};
window.GEOTHAI_DATA.hazards = {
  type: "FeatureCollection",
  features: [
    // ─────────────────────────────────────────────
    // 1. Northern Highlands Landslide Zone
    // ─────────────────────────────────────────────
    {
      type: "Feature",
      properties: {
        name_th: "\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e40\u0e2a\u0e35\u0e48\u0e22\u0e07\u0e14\u0e34\u0e19\u0e16\u0e25\u0e48\u0e21 \u0e20\u0e32\u0e04\u0e40\u0e2b\u0e19\u0e37\u0e2d\u0e15\u0e2d\u0e19\u0e1a\u0e19",
        name_en: "Northern Highlands Landslide Zone",
        hazard_type: "landslide",
        risk_level: "high",
        color: "#FF5252",
        provinces_th: [
          "\u0e40\u0e0a\u0e35\u0e22\u0e07\u0e23\u0e32\u0e22",
          "\u0e40\u0e0a\u0e35\u0e22\u0e07\u0e43\u0e2b\u0e21\u0e48",
          "\u0e41\u0e21\u0e48\u0e2e\u0e48\u0e2d\u0e07\u0e2a\u0e2d\u0e19",
          "\u0e19\u0e48\u0e32\u0e19",
          "\u0e25\u0e33\u0e1b\u0e32\u0e07"
        ],
        provinces_en: ["Chiang Rai", "Chiang Mai", "Mae Hong Son", "Nan", "Lampang"],
        description_th: "\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e20\u0e39\u0e40\u0e02\u0e32\u0e2a\u0e39\u0e07\u0e20\u0e32\u0e04\u0e40\u0e2b\u0e19\u0e37\u0e2d \u0e21\u0e35\u0e04\u0e27\u0e32\u0e21\u0e25\u0e32\u0e14\u0e0a\u0e31\u0e19 \u0e14\u0e34\u0e19\u0e40\u0e1b\u0e47\u0e19\u0e2b\u0e34\u0e19\u0e41\u0e01\u0e23\u0e19\u0e34\u0e15\u0e41\u0e25\u0e30\u0e2b\u0e34\u0e19\u0e41\u0e1b\u0e23\u0e2a\u0e20\u0e32\u0e1e\u0e2a\u0e39\u0e07\u0e17\u0e35\u0e48\u0e1c\u0e38\u0e1e\u0e31\u0e07 \u0e40\u0e2a\u0e35\u0e48\u0e22\u0e07\u0e2a\u0e39\u0e07\u0e43\u0e19\u0e0a\u0e48\u0e27\u0e07\u0e24\u0e14\u0e39\u0e1d\u0e19",
        description_en: "High-altitude mountainous terrain in northern Thailand with steep slopes on weathered granite and metamorphic bedrock. High landslide risk during monsoon season (June-October), especially in deforested areas."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [97.80, 19.50],
          [98.50, 20.00],
          [99.30, 20.40],
          [100.10, 20.40],
          [100.80, 20.00],
          [101.10, 19.50],
          [101.00, 19.00],
          [100.80, 18.50],
          [100.50, 18.20],
          [100.00, 18.00],
          [99.30, 18.10],
          [98.60, 18.30],
          [98.00, 18.50],
          [97.60, 19.00],
          [97.80, 19.50]
        ]]
      }
    },

    // ─────────────────────────────────────────────
    // 2. Western Mountains Landslide Zone
    // ─────────────────────────────────────────────
    {
      type: "Feature",
      properties: {
        name_th: "\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e40\u0e2a\u0e35\u0e48\u0e22\u0e07\u0e14\u0e34\u0e19\u0e16\u0e25\u0e48\u0e21 \u0e20\u0e39\u0e40\u0e02\u0e32\u0e15\u0e30\u0e27\u0e31\u0e19\u0e15\u0e01",
        name_en: "Western Mountains Landslide Zone",
        hazard_type: "landslide",
        risk_level: "moderate",
        color: "#FF8A65",
        provinces_th: [
          "\u0e01\u0e32\u0e0d\u0e08\u0e19\u0e1a\u0e38\u0e23\u0e35",
          "\u0e15\u0e32\u0e01",
          "\u0e2d\u0e38\u0e17\u0e31\u0e22\u0e18\u0e32\u0e19\u0e35"
        ],
        provinces_en: ["Kanchanaburi", "Tak", "Uthai Thani"],
        description_th: "\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e20\u0e39\u0e40\u0e02\u0e32\u0e17\u0e32\u0e07\u0e15\u0e30\u0e27\u0e31\u0e19\u0e15\u0e01\u0e02\u0e2d\u0e07\u0e1b\u0e23\u0e30\u0e40\u0e17\u0e28\u0e44\u0e17\u0e22 \u0e14\u0e34\u0e19\u0e40\u0e1b\u0e47\u0e19\u0e2b\u0e34\u0e19\u0e1b\u0e39\u0e19\u0e41\u0e25\u0e30\u0e2b\u0e34\u0e19\u0e14\u0e34\u0e19\u0e14\u0e32\u0e19 \u0e40\u0e2a\u0e35\u0e48\u0e22\u0e07\u0e14\u0e34\u0e19\u0e16\u0e25\u0e48\u0e21\u0e1b\u0e32\u0e19\u0e01\u0e25\u0e32\u0e07\u0e43\u0e19\u0e0a\u0e48\u0e27\u0e07\u0e1d\u0e19\u0e15\u0e01\u0e2b\u0e19\u0e31\u0e01",
        description_en: "Mountainous western region with limestone and mudstone bedrock. Moderate landslide risk along steep river valleys and road cuts, particularly during heavy rainfall events."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [98.20, 17.00],
          [98.80, 17.00],
          [99.30, 16.80],
          [99.50, 16.20],
          [99.30, 15.50],
          [99.10, 15.00],
          [98.80, 14.50],
          [98.50, 14.70],
          [98.20, 15.20],
          [98.00, 15.80],
          [98.10, 16.50],
          [98.20, 17.00]
        ]]
      }
    },

    // ─────────────────────────────────────────────
    // 3. Southern Hills Landslide Zone
    // ─────────────────────────────────────────────
    {
      type: "Feature",
      properties: {
        name_th: "\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e40\u0e2a\u0e35\u0e48\u0e22\u0e07\u0e14\u0e34\u0e19\u0e16\u0e25\u0e48\u0e21 \u0e20\u0e32\u0e04\u0e43\u0e15\u0e49",
        name_en: "Southern Hills Landslide Zone",
        hazard_type: "landslide",
        risk_level: "moderate",
        color: "#FF8A65",
        provinces_th: [
          "\u0e19\u0e04\u0e23\u0e28\u0e23\u0e35\u0e18\u0e23\u0e23\u0e21\u0e23\u0e32\u0e0a",
          "\u0e2a\u0e38\u0e23\u0e32\u0e29\u0e0e\u0e23\u0e4c\u0e18\u0e32\u0e19\u0e35",
          "\u0e23\u0e30\u0e19\u0e2d\u0e07"
        ],
        provinces_en: ["Nakhon Si Thammarat", "Surat Thani", "Ranong"],
        description_th: "\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e20\u0e39\u0e40\u0e02\u0e32\u0e17\u0e32\u0e07\u0e20\u0e32\u0e04\u0e43\u0e15\u0e49 \u0e14\u0e34\u0e19\u0e40\u0e1b\u0e47\u0e19\u0e2b\u0e34\u0e19\u0e41\u0e01\u0e23\u0e19\u0e34\u0e15\u0e41\u0e25\u0e30\u0e2b\u0e34\u0e19\u0e41\u0e1b\u0e23\u0e2a\u0e20\u0e32\u0e1e\u0e1c\u0e38\u0e1e\u0e31\u0e07 \u0e1d\u0e19\u0e15\u0e01\u0e2b\u0e19\u0e31\u0e01\u0e08\u0e32\u0e01\u0e21\u0e23\u0e2a\u0e38\u0e21\u0e15\u0e30\u0e27\u0e31\u0e19\u0e2d\u0e2d\u0e01\u0e40\u0e09\u0e35\u0e22\u0e07\u0e40\u0e2b\u0e19\u0e37\u0e2d",
        description_en: "Mountain ridges along the southern peninsula with weathered granite and metamorphic rock. Heavy northeast monsoon rainfall (November-January) triggers landslides along the Nakhon Si Thammarat range."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [98.30, 10.00],
          [98.80, 10.00],
          [99.50, 9.80],
          [99.80, 9.40],
          [100.00, 9.00],
          [99.80, 8.50],
          [99.50, 8.00],
          [99.00, 8.10],
          [98.50, 8.30],
          [98.30, 8.80],
          [98.30, 9.30],
          [98.30, 10.00]
        ]]
      }
    },

    // ─────────────────────────────────────────────
    // 4. Khorat Plateau Sinkhole Zone
    // ─────────────────────────────────────────────
    {
      type: "Feature",
      properties: {
        name_th: "\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e40\u0e2a\u0e35\u0e48\u0e22\u0e07\u0e2b\u0e25\u0e38\u0e21\u0e22\u0e38\u0e1a \u0e17\u0e35\u0e48\u0e23\u0e32\u0e1a\u0e2a\u0e39\u0e07\u0e42\u0e04\u0e23\u0e32\u0e0a",
        name_en: "Khorat Plateau Sinkhole Zone",
        hazard_type: "sinkhole",
        risk_level: "moderate",
        color: "#FFB74D",
        provinces_th: [
          "\u0e19\u0e04\u0e23\u0e23\u0e32\u0e0a\u0e2a\u0e35\u0e21\u0e32",
          "\u0e2a\u0e23\u0e30\u0e1a\u0e38\u0e23\u0e35",
          "\u0e0a\u0e31\u0e22\u0e20\u0e39\u0e21\u0e34",
          "\u0e2b\u0e19\u0e2d\u0e07\u0e1a\u0e31\u0e27\u0e25\u0e33\u0e20\u0e39"
        ],
        provinces_en: ["Nakhon Ratchasima", "Saraburi", "Chaiyaphum", "Nong Bua Lamphu"],
        description_th: "\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e17\u0e35\u0e48\u0e21\u0e35\u0e0a\u0e31\u0e49\u0e19\u0e2b\u0e34\u0e19\u0e40\u0e01\u0e25\u0e37\u0e2d\u0e41\u0e25\u0e30\u0e2b\u0e34\u0e19\u0e23\u0e30\u0e40\u0e2b\u0e22\u0e43\u0e15\u0e49\u0e14\u0e34\u0e19 \u0e19\u0e49\u0e33\u0e43\u0e15\u0e49\u0e14\u0e34\u0e19\u0e25\u0e30\u0e25\u0e32\u0e22\u0e0a\u0e31\u0e49\u0e19\u0e2b\u0e34\u0e19\u0e40\u0e01\u0e25\u0e37\u0e2d\u0e17\u0e33\u0e43\u0e2b\u0e49\u0e40\u0e01\u0e34\u0e14\u0e42\u0e1e\u0e23\u0e07\u0e2b\u0e25\u0e38\u0e21\u0e22\u0e38\u0e1a",
        description_en: "Areas underlain by evaporite (rock salt and gypsum) and carbonate formations on the Khorat Plateau. Dissolution of subsurface salt and limestone creates sinkholes, particularly exacerbated by groundwater extraction for agriculture and salt mining."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [100.50, 17.50],
          [101.50, 17.50],
          [102.50, 17.00],
          [103.00, 16.50],
          [103.00, 15.50],
          [102.50, 14.80],
          [101.80, 14.50],
          [101.00, 14.80],
          [100.50, 15.50],
          [100.50, 16.50],
          [100.50, 17.50]
        ]]
      }
    },

    // ─────────────────────────────────────────────
    // 5. Southern Karst Sinkhole Zone
    // ─────────────────────────────────────────────
    {
      type: "Feature",
      properties: {
        name_th: "\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e40\u0e2a\u0e35\u0e48\u0e22\u0e07\u0e2b\u0e25\u0e38\u0e21\u0e22\u0e38\u0e1a \u0e2b\u0e34\u0e19\u0e1b\u0e39\u0e19\u0e04\u0e32\u0e23\u0e4c\u0e2a\u0e15\u0e4c\u0e20\u0e32\u0e04\u0e43\u0e15\u0e49",
        name_en: "Southern Karst Sinkhole Zone",
        hazard_type: "sinkhole",
        risk_level: "moderate",
        color: "#FFB74D",
        provinces_th: [
          "\u0e01\u0e23\u0e30\u0e1a\u0e35\u0e48",
          "\u0e1e\u0e31\u0e07\u0e07\u0e32",
          "\u0e2a\u0e38\u0e23\u0e32\u0e29\u0e0e\u0e23\u0e4c\u0e18\u0e32\u0e19\u0e35"
        ],
        provinces_en: ["Krabi", "Phang Nga", "Surat Thani"],
        description_th: "\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e2b\u0e34\u0e19\u0e1b\u0e39\u0e19\u0e04\u0e32\u0e23\u0e4c\u0e2a\u0e15\u0e4c\u0e17\u0e32\u0e07\u0e20\u0e32\u0e04\u0e43\u0e15\u0e49 \u0e21\u0e35\u0e16\u0e49\u0e33\u0e41\u0e25\u0e30\u0e42\u0e1e\u0e23\u0e07\u0e43\u0e15\u0e49\u0e14\u0e34\u0e19\u0e08\u0e33\u0e19\u0e27\u0e19\u0e21\u0e32\u0e01 \u0e40\u0e2a\u0e35\u0e48\u0e22\u0e07\u0e15\u0e48\u0e2d\u0e42\u0e04\u0e23\u0e07\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e1e\u0e37\u0e49\u0e19\u0e10\u0e32\u0e19\u0e41\u0e25\u0e30\u0e2a\u0e34\u0e48\u0e07\u0e1b\u0e25\u0e39\u0e01\u0e2a\u0e23\u0e49\u0e32\u0e07",
        description_en: "Karst limestone terrain in the southern peninsula with extensive cave systems and underground drainage. Sinkhole formation poses risk to infrastructure and construction, particularly in the Phang Nga Bay hinterland."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [98.20, 9.50],
          [98.80, 9.50],
          [99.30, 9.20],
          [99.50, 8.80],
          [99.40, 8.30],
          [99.10, 7.80],
          [98.70, 7.50],
          [98.30, 7.70],
          [98.20, 8.20],
          [98.20, 8.80],
          [98.20, 9.50]
        ]]
      }
    },

    // ─────────────────────────────────────────────
    // 6. Bangkok Subsidence Zone
    // ─────────────────────────────────────────────
    {
      type: "Feature",
      properties: {
        name_th: "\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e17\u0e23\u0e38\u0e14\u0e15\u0e31\u0e27 \u0e01\u0e23\u0e38\u0e07\u0e40\u0e17\u0e1e\u0e41\u0e25\u0e30\u0e1b\u0e23\u0e34\u0e21\u0e13\u0e11\u0e25",
        name_en: "Bangkok Subsidence Zone",
        hazard_type: "subsidence",
        risk_level: "high",
        color: "#CE93D8",
        provinces_th: [
          "\u0e01\u0e23\u0e38\u0e07\u0e40\u0e17\u0e1e\u0e21\u0e2b\u0e32\u0e19\u0e04\u0e23",
          "\u0e19\u0e19\u0e17\u0e1a\u0e38\u0e23\u0e35",
          "\u0e2a\u0e21\u0e38\u0e17\u0e23\u0e1b\u0e23\u0e32\u0e01\u0e32\u0e23",
          "\u0e1b\u0e17\u0e38\u0e21\u0e18\u0e32\u0e19\u0e35",
          "\u0e2a\u0e21\u0e38\u0e17\u0e23\u0e2a\u0e32\u0e04\u0e23"
        ],
        provinces_en: ["Bangkok", "Nonthaburi", "Samut Prakan", "Pathum Thani", "Samut Sakhon"],
        description_th: "\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e14\u0e34\u0e19\u0e2d\u0e48\u0e2d\u0e19\u0e41\u0e2d\u0e48\u0e07\u0e19\u0e49\u0e33\u0e40\u0e08\u0e49\u0e32\u0e1e\u0e23\u0e30\u0e22\u0e32 \u0e14\u0e34\u0e19\u0e40\u0e1b\u0e47\u0e19\u0e0a\u0e31\u0e49\u0e19\u0e14\u0e34\u0e19\u0e40\u0e2b\u0e19\u0e35\u0e22\u0e27\u0e2d\u0e48\u0e2d\u0e19\u0e2b\u0e19\u0e32 15-25 \u0e40\u0e21\u0e15\u0e23 \u0e17\u0e23\u0e38\u0e14\u0e15\u0e31\u0e27\u0e08\u0e32\u0e01\u0e01\u0e32\u0e23\u0e2a\u0e39\u0e1a\u0e19\u0e49\u0e33\u0e1a\u0e32\u0e14\u0e32\u0e25\u0e41\u0e25\u0e30\u0e19\u0e49\u0e33\u0e2b\u0e19\u0e31\u0e01\u0e2d\u0e32\u0e04\u0e32\u0e23",
        description_en: "Greater Bangkok metropolitan area built on 15-25 meter thick soft marine clay deposits of the Chao Phraya River delta. Severe land subsidence (historically up to 10 cm/year) caused by excessive groundwater pumping and heavy building loads. Sea-level rise compounds the flood risk."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [100.20, 14.10],
          [100.45, 14.15],
          [100.70, 14.10],
          [100.85, 13.95],
          [100.90, 13.75],
          [100.85, 13.55],
          [100.70, 13.40],
          [100.50, 13.35],
          [100.30, 13.40],
          [100.15, 13.55],
          [100.10, 13.75],
          [100.15, 13.95],
          [100.20, 14.10]
        ]]
      }
    },

    // ─────────────────────────────────────────────
    // 7. Northern Seismic Risk Zone
    // ─────────────────────────────────────────────
    {
      type: "Feature",
      properties: {
        name_th: "\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e40\u0e2a\u0e35\u0e48\u0e22\u0e07\u0e41\u0e1c\u0e48\u0e19\u0e14\u0e34\u0e19\u0e44\u0e2b\u0e27 \u0e20\u0e32\u0e04\u0e40\u0e2b\u0e19\u0e37\u0e2d",
        name_en: "Northern Seismic Risk Zone",
        hazard_type: "seismic",
        risk_level: "high",
        color: "#FFEE58",
        provinces_th: [
          "\u0e40\u0e0a\u0e35\u0e22\u0e07\u0e23\u0e32\u0e22",
          "\u0e40\u0e0a\u0e35\u0e22\u0e07\u0e43\u0e2b\u0e21\u0e48",
          "\u0e1e\u0e30\u0e40\u0e22\u0e32",
          "\u0e25\u0e33\u0e1e\u0e39\u0e19",
          "\u0e41\u0e1e\u0e23\u0e48",
          "\u0e41\u0e21\u0e48\u0e2e\u0e48\u0e2d\u0e07\u0e2a\u0e2d\u0e19",
          "\u0e19\u0e48\u0e32\u0e19"
        ],
        provinces_en: ["Chiang Rai", "Chiang Mai", "Phayao", "Lamphun", "Phrae", "Mae Hong Son", "Nan"],
        description_th: "\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e43\u0e01\u0e25\u0e49\u0e23\u0e2d\u0e22\u0e40\u0e25\u0e37\u0e48\u0e2d\u0e19\u0e21\u0e35\u0e1e\u0e25\u0e31\u0e07\u0e2b\u0e25\u0e32\u0e22\u0e41\u0e19\u0e27 \u0e40\u0e0a\u0e48\u0e19 \u0e23\u0e2d\u0e22\u0e40\u0e25\u0e37\u0e48\u0e2d\u0e19\u0e41\u0e21\u0e48\u0e08\u0e31\u0e19 \u0e23\u0e2d\u0e22\u0e40\u0e25\u0e37\u0e48\u0e2d\u0e19\u0e41\u0e21\u0e48\u0e17\u0e32 \u0e23\u0e2d\u0e22\u0e40\u0e25\u0e37\u0e48\u0e2d\u0e19\u0e1e\u0e30\u0e40\u0e22\u0e32 \u0e40\u0e04\u0e22\u0e40\u0e01\u0e34\u0e14\u0e41\u0e1c\u0e48\u0e19\u0e14\u0e34\u0e19\u0e44\u0e2b\u0e27\u0e23\u0e30\u0e14\u0e31\u0e1a 6.3 (2557)",
        description_en: "Zone of active faults in northern Thailand including the Mae Chan, Mae Tha, Phayao, and Moei-Uttaradit fault systems. The 2014 Chiang Rai earthquake (M6.3) highlighted the significant seismic hazard. Recurrence interval estimated at 500-2000 years for large events."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [98.00, 20.50],
          [99.00, 20.50],
          [100.00, 20.40],
          [101.00, 20.00],
          [101.10, 19.20],
          [100.80, 18.30],
          [100.20, 17.80],
          [99.50, 17.50],
          [98.80, 17.80],
          [98.20, 18.20],
          [97.80, 18.80],
          [97.70, 19.50],
          [98.00, 20.50]
        ]]
      }
    }
  ]
};
