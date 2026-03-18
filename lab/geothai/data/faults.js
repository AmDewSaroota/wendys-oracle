/**
 * Thailand Active Fault Groups — GeoJSON LineStrings
 * 16 major active fault zones recognized by the Department of Mineral Resources (DMR)
 *
 * Coordinate traces approximate the mapped surface expression of each fault.
 * Data synthesized from DMR fault maps, GISTDA, and published geological surveys.
 *
 * Generated: 2026-03-03
 */

window.GEOTHAI_DATA = window.GEOTHAI_DATA || {};

window.GEOTHAI_DATA.faults = {
  type: "FeatureCollection",
  features: [
    // ────────────────────────────────────────────────────────────────
    // 1. Mae Hong Son Fault (รอยเลื่อนแม่ฮ่องสอน)
    // ────────────────────────────────────────────────────────────────
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [97.94, 18.00],
          [97.96, 18.15],
          [97.98, 18.30],
          [98.00, 18.48],
          [98.02, 18.62],
          [98.03, 18.78],
          [98.05, 18.90],
          [98.06, 19.02],
          [98.07, 19.12],
          [98.08, 19.22],
          [98.10, 19.30]
        ]
      },
      properties: {
        fault_id: 1,
        name_th: "รอยเลื่อนแม่ฮ่องสอน",
        name_en: "Mae Hong Son Fault",
        length_km: 90,
        strike: "N-S",
        type: "strike-slip",
        type_th: "รอยเลื่อนด้านข้าง",
        max_magnitude: 7.0,
        provinces_th: ["แม่ฮ่องสอน"],
        provinces_en: ["Mae Hong Son"],
        description_th: "รอยเลื่อนแนวเหนือ-ใต้ทางตะวันตกสุดของภาคเหนือ วางตัวตามแนวหุบเขาแม่น้ำปายและแม่ฮ่องสอน เกี่ยวข้องกับระบบการชนกันของแผ่นเปลือกโลกชานบุรี-อินโดจีน เป็นอันตรายต่อตัวเมืองแม่ฮ่องสอนและชุมชนบนที่สูง",
        description_en: "North-south trending fault along the westernmost part of northern Thailand, following the Pai River valley and the Mae Hong Son basin. Related to the Sibumasu-Indochina collision system. Poses seismic risk to Mae Hong Son city and highland communities along the Myanmar border.",
        last_event: null
      }
    },

    // ────────────────────────────────────────────────────────────────
    // 2. Mae Chan Fault (รอยเลื่อนแม่จัน)
    // ────────────────────────────────────────────────────────────────
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [98.50, 19.50],
          [98.70, 19.55],
          [98.90, 19.62],
          [99.10, 19.70],
          [99.30, 19.78],
          [99.50, 19.85],
          [99.70, 19.92],
          [99.83, 19.97],
          [99.95, 20.02],
          [100.10, 20.08],
          [100.25, 20.14],
          [100.40, 20.18],
          [100.50, 20.20]
        ]
      },
      properties: {
        fault_id: 2,
        name_th: "รอยเลื่อนแม่จัน",
        name_en: "Mae Chan Fault",
        length_km: 150,
        strike: "WSW-ENE",
        type: "strike-slip",
        type_th: "รอยเลื่อนด้านข้าง",
        max_magnitude: 7.0,
        provinces_th: ["เชียงราย", "เชียงใหม่"],
        provinces_en: ["Chiang Rai", "Chiang Mai"],
        description_th: "รอยเลื่อนแนวตะวันตก-ตะวันออกที่สำคัญที่สุดในภาคเหนือ พาดผ่านใกล้ตัวเมืองเชียงราย ต่อเนื่องจากรอยเลื่อนนัมมาในเมียนมา เป็นส่วนหนึ่งของระบบรอยเลื่อนที่เกิดจากแผ่นเปลือกโลกชานบุรี-อินโดจีน มีความเสี่ยงสูงต่อเมืองเชียงรายและชุมชนใกล้เคียง",
        description_en: "The most significant east-west fault in northern Thailand, passing near Chiang Rai city. Continues from the Namtha fault system in Myanmar. Part of the Sibumasu-Indochina collision boundary system. The 2014 M6.3 earthquake confirmed this fault's high activity. Poses significant risk to Chiang Rai city and surrounding communities.",
        last_event: "M6.3 near Chiang Rai, 2014"
      }
    },

    // ────────────────────────────────────────────────────────────────
    // 3. Wiang Haeng Fault (รอยเลื่อนเวียงแหง)
    // ────────────────────────────────────────────────────────────────
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [98.58, 19.50],
          [98.59, 19.53],
          [98.60, 19.55],
          [98.61, 19.58],
          [98.62, 19.60],
          [98.62, 19.63],
          [98.63, 19.65],
          [98.63, 19.68],
          [98.62, 19.70]
        ]
      },
      properties: {
        fault_id: 3,
        name_th: "รอยเลื่อนเวียงแหง",
        name_en: "Wiang Haeng Fault",
        length_km: 20,
        strike: "N-S",
        type: "normal",
        type_th: "รอยเลื่อนแนวดิ่ง (ปกติ)",
        max_magnitude: 6.0,
        provinces_th: ["เชียงใหม่"],
        provinces_en: ["Chiang Mai"],
        description_th: "รอยเลื่อนขนาดเล็กใกล้ชายแดนเมียนมา ในอำเภอเวียงแหง จังหวัดเชียงใหม่ เป็นรอยเลื่อนแบบปกติที่เกิดจากแรงดึงของเปลือกโลก แม้จะสั้นแต่มีหลักฐานการเคลื่อนตัวในยุคควอเทอร์นารี",
        description_en: "A short normal fault near the Myanmar border in Wiang Haeng district, Chiang Mai. Formed by extensional tectonics in the northern Thai highlands. Though short, it shows evidence of Quaternary movement and is associated with the broader back-arc extensional setting of the Sibumasu-Indochina collision zone.",
        last_event: null
      }
    },

    // ────────────────────────────────────────────────────────────────
    // 4. Mae Lao Fault (รอยเลื่อนแม่ลาว)
    // ────────────────────────────────────────────────────────────────
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [99.40, 19.60],
          [99.44, 19.63],
          [99.48, 19.66],
          [99.52, 19.70],
          [99.56, 19.73],
          [99.60, 19.76],
          [99.65, 19.80],
          [99.70, 19.83],
          [99.75, 19.87],
          [99.80, 19.90]
        ]
      },
      properties: {
        fault_id: 4,
        name_th: "รอยเลื่อนแม่ลาว",
        name_en: "Mae Lao Fault",
        length_km: 50,
        strike: "NE-SW",
        type: "strike-slip",
        type_th: "รอยเลื่อนด้านข้าง",
        max_magnitude: 6.5,
        provinces_th: ["เชียงราย"],
        provinces_en: ["Chiang Rai"],
        description_th: "รอยเลื่อนวางตัวตามแนวแม่น้ำลาวในจังหวัดเชียงราย มีความเกี่ยวข้องกับแผ่นดินไหว พ.ศ. 2557 ที่อำเภอพาน เป็นรอยเลื่อนสาขาของระบบรอยเลื่อนแม่จัน-แม่อิง ที่เกิดจากแรงเฉือนของแผ่นเปลือกโลก",
        description_en: "Fault aligned along the Mae Lao River in Chiang Rai province. Linked to the 2014 Phan district earthquake swarm. A branch of the Mae Chan-Mae Ing fault system formed by shear forces from the ongoing Sibumasu-Indochina plate collision. Poses risk to communities in the Mae Lao valley.",
        last_event: null
      }
    },

    // ────────────────────────────────────────────────────────────────
    // 5. Mae Ing Fault (รอยเลื่อนแม่อิง)
    // ────────────────────────────────────────────────────────────────
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [99.50, 19.20],
          [99.55, 19.25],
          [99.60, 19.30],
          [99.65, 19.35],
          [99.70, 19.40],
          [99.75, 19.45],
          [99.80, 19.50],
          [99.85, 19.55],
          [99.90, 19.60],
          [99.95, 19.65],
          [100.00, 19.70]
        ]
      },
      properties: {
        fault_id: 5,
        name_th: "รอยเลื่อนแม่อิง",
        name_en: "Mae Ing Fault",
        length_km: 60,
        strike: "NE-SW",
        type: "normal",
        type_th: "รอยเลื่อนแนวดิ่ง (ปกติ)",
        max_magnitude: 6.5,
        provinces_th: ["พะเยา", "เชียงราย"],
        provinces_en: ["Phayao", "Chiang Rai"],
        description_th: "รอยเลื่อนวางตัวตามแนวแม่น้ำอิง จากพะเยาถึงเชียงราย ควบคุมรูปร่างของกว๊านพะเยาและที่ราบลุ่มแม่น้ำอิง เกิดจากการยืดตัวของเปลือกโลกในระบบการชนชานบุรี-อินโดจีน มีความเสี่ยงต่อเมืองพะเยาและเชียงคำ",
        description_en: "Fault following the Mae Ing River from Phayao to Chiang Rai. Controls the shape of Kwan Phayao lake and the Ing River floodplain. Formed by crustal extension in the Sibumasu-Indochina collision system. Poses seismic risk to Phayao city and Chiang Kham.",
        last_event: null
      }
    },

    // ────────────────────────────────────────────────────────────────
    // 6. Phayao Fault (รอยเลื่อนพะเยา)
    // ────────────────────────────────────────────────────────────────
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [99.50, 18.50],
          [99.54, 18.58],
          [99.58, 18.65],
          [99.62, 18.73],
          [99.66, 18.80],
          [99.70, 18.88],
          [99.74, 18.95],
          [99.78, 19.02],
          [99.82, 19.08],
          [99.86, 19.15],
          [99.90, 19.20],
          [99.95, 19.25],
          [100.00, 19.30]
        ]
      },
      properties: {
        fault_id: 6,
        name_th: "รอยเลื่อนพะเยา",
        name_en: "Phayao Fault",
        length_km: 100,
        strike: "NE-SW",
        type: "oblique",
        type_th: "รอยเลื่อนแบบเฉียง",
        max_magnitude: 6.5,
        provinces_th: ["พะเยา", "ลำปาง"],
        provinces_en: ["Phayao", "Lampang"],
        description_th: "รอยเลื่อนขนาดใหญ่ที่มีทั้งการเคลื่อนตัวในแนวดิ่งและแนวข้าง วางตัวจากลำปางถึงพะเยา ผ่านขอบด้านตะวันตกของกว๊านพะเยา เป็นแหล่งกำเนิดแผ่นดินไหวขนาด 6.2 เมื่อ 5 พ.ค. 2557 แสดงถึงความเคลื่อนไหวต่อเนื่องของระบบรอยเลื่อนในเขตการชนชานบุรี-อินโดจีน",
        description_en: "A major fault with both vertical and lateral movement, running from Lampang to Phayao along the western edge of Kwan Phayao lake. Source of the M6.2 earthquake on 5 May 2014, confirming ongoing activity in the Sibumasu-Indochina collision zone. Poses significant risk to Phayao city, the lake basin communities, and northern Lampang.",
        last_event: "M6.2 Phayao earthquake, 2014-05-05"
      }
    },

    // ────────────────────────────────────────────────────────────────
    // 7. Pua Fault (รอยเลื่อนปัว)
    // ────────────────────────────────────────────────────────────────
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [100.90, 18.50],
          [100.92, 18.60],
          [100.94, 18.72],
          [100.96, 18.85],
          [100.98, 18.95],
          [101.00, 19.05],
          [101.02, 19.15],
          [101.04, 19.25],
          [101.06, 19.33],
          [101.08, 19.42],
          [101.10, 19.50]
        ]
      },
      properties: {
        fault_id: 7,
        name_th: "รอยเลื่อนปัว",
        name_en: "Pua Fault",
        length_km: 110,
        strike: "N-S",
        type: "normal",
        type_th: "รอยเลื่อนแนวดิ่ง (ปกติ)",
        max_magnitude: 7.0,
        provinces_th: ["น่าน"],
        provinces_en: ["Nan"],
        description_th: "รอยเลื่อนแนวเหนือ-ใต้ในจังหวัดน่าน วางตัวตามแนวหุบเขาแม่น้ำน่าน ผ่านอำเภอปัว ทุ่งช้าง และเชียงกลาง มีหลักฐานการเคลื่อนตัวในยุคควอเทอร์นารี เกี่ยวข้องกับการยืดตัวของเปลือกโลกด้านตะวันออกของเขตชนชานบุรี-อินโดจีน",
        description_en: "North-south fault in Nan province following the Nan River valley through Pua, Thung Chang, and Chiang Klang districts. Shows Quaternary displacement evidence. Related to extensional tectonics on the eastern side of the Sibumasu-Indochina collision zone. Poses risk to Nan city and the highland communities along the valley.",
        last_event: null
      }
    },

    // ────────────────────────────────────────────────────────────────
    // 8. Mae Tha Fault (รอยเลื่อนแม่ทา)
    // ────────────────────────────────────────────────────────────────
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [98.50, 18.70],
          [98.60, 18.60],
          [98.72, 18.50],
          [98.84, 18.40],
          [98.95, 18.30],
          [99.05, 18.20],
          [99.15, 18.10],
          [99.25, 18.00],
          [99.35, 17.90],
          [99.48, 17.80],
          [99.60, 17.70],
          [99.72, 17.62],
          [99.85, 17.55],
          [100.00, 17.50]
        ]
      },
      properties: {
        fault_id: 8,
        name_th: "รอยเลื่อนแม่ทา",
        name_en: "Mae Tha Fault",
        length_km: 180,
        strike: "NW-SE",
        type: "strike-slip",
        type_th: "รอยเลื่อนด้านข้าง",
        max_magnitude: 7.0,
        provinces_th: ["เชียงใหม่", "ลำพูน", "ลำปาง"],
        provinces_en: ["Chiang Mai", "Lamphun", "Lampang"],
        description_th: "รอยเลื่อนที่ยาวที่สุดในภาคเหนือ พาดผ่านสามจังหวัด จากเชียงใหม่ผ่านลำพูนถึงลำปาง วางตัวตามแนวแม่น้ำแม่ทา ตัดผ่านใกล้สนามบินเชียงใหม่ เป็นส่วนหนึ่งของระบบรอยเลื่อนขนาดใหญ่ที่เกิดจากการชนกันของแผ่นชานบุรี-อินโดจีน มีความเสี่ยงสูงเนื่องจากตัวเมืองเชียงใหม่อยู่ใกล้แนวรอยเลื่อน",
        description_en: "The longest fault in northern Thailand, crossing three provinces from Chiang Mai through Lamphun to Lampang along the Mae Tha River. Passes near Chiang Mai International Airport. Part of the major fault system generated by the Sibumasu-Indochina collision. High risk due to proximity to Chiang Mai city, one of Thailand's largest urban centers.",
        last_event: null
      }
    },

    // ────────────────────────────────────────────────────────────────
    // 9. Thoen Fault (รอยเลื่อนเถิน)
    // ────────────────────────────────────────────────────────────────
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [99.20, 17.60],
          [99.25, 17.65],
          [99.30, 17.70],
          [99.35, 17.76],
          [99.40, 17.82],
          [99.45, 17.88],
          [99.50, 17.93],
          [99.55, 17.98],
          [99.60, 18.03],
          [99.65, 18.08],
          [99.70, 18.13],
          [99.75, 18.17],
          [99.80, 18.20]
        ]
      },
      properties: {
        fault_id: 9,
        name_th: "รอยเลื่อนเถิน",
        name_en: "Thoen Fault",
        length_km: 130,
        strike: "NE-SW",
        type: "normal",
        type_th: "รอยเลื่อนแนวดิ่ง (ปกติ)",
        max_magnitude: 7.0,
        provinces_th: ["ลำปาง"],
        provinces_en: ["Lampang"],
        description_th: "รอยเลื่อนแบบปกติในอำเภอเถิน จังหวัดลำปาง มีหลักฐานชัดเจนของการเคลื่อนตัวในยุคควอเทอร์นารี รวมถึงผาหินที่เกิดจากรอยเลื่อน (fault scarp) สูง 3-5 เมตร เป็นหนึ่งในรอยเลื่อนที่มีการศึกษามากที่สุดในประเทศไทย แสดงถึงการยืดตัวของเปลือกโลกในเขตชนชานบุรี-อินโดจีน",
        description_en: "Normal fault in Thoen district, Lampang province, with clear evidence of Quaternary movement including 3-5 meter fault scarps. One of the most extensively studied faults in Thailand. Demonstrates ongoing crustal extension in the Sibumasu-Indochina collision zone. Poses risk to Lampang and surrounding communities.",
        last_event: null
      }
    },

    // ────────────────────────────────────────────────────────────────
    // 10. Uttaradit Fault (รอยเลื่อนอุตรดิตถ์)
    // ────────────────────────────────────────────────────────────────
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [100.00, 17.40],
          [100.05, 17.46],
          [100.10, 17.52],
          [100.15, 17.58],
          [100.20, 17.63],
          [100.25, 17.68],
          [100.30, 17.73],
          [100.35, 17.78],
          [100.40, 17.83],
          [100.45, 17.88],
          [100.50, 17.93],
          [100.55, 17.97],
          [100.60, 18.00]
        ]
      },
      properties: {
        fault_id: 10,
        name_th: "รอยเลื่อนอุตรดิตถ์",
        name_en: "Uttaradit Fault",
        length_km: 130,
        strike: "NE-SW",
        type: "strike-slip",
        type_th: "รอยเลื่อนด้านข้าง",
        max_magnitude: 7.5,
        provinces_th: ["อุตรดิตถ์"],
        provinces_en: ["Uttaradit"],
        description_th: "รอยเลื่อนที่มีศักยภาพสูงสุดในภาคเหนือตอนล่าง วางตัวตามแนวรอยตะเข็บชานบุรี-อินโดจีน (Nan Suture) ซึ่งเป็นรอยต่อระหว่างแผ่นเปลือกโลกโบราณสองแผ่น มีหลักฐานทางธรณีวิทยาว่าเคยเกิดแผ่นดินไหวขนาด 7.1 เมื่อประมาณ 4,000 ปีก่อน เป็นอันตรายต่อตัวเมืองอุตรดิตถ์",
        description_en: "Highest-potential fault in the lower northern region, aligned along the Sibumasu-Indochina suture zone (Nan Suture) — the ancient boundary between two tectonic plates. Geological evidence indicates an M7.1 earthquake approximately 4,000 years ago. This is one of the most critical faults in Thailand due to its large magnitude potential and proximity to Uttaradit city.",
        last_event: "M7.1 approximately 4,000 years ago"
      }
    },

    // ────────────────────────────────────────────────────────────────
    // 11. Moei Fault (รอยเลื่อนเมย)
    // ────────────────────────────────────────────────────────────────
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [98.52, 15.80],
          [98.54, 15.95],
          [98.56, 16.10],
          [98.58, 16.25],
          [98.60, 16.40],
          [98.62, 16.55],
          [98.63, 16.70],
          [98.64, 16.85],
          [98.65, 17.00],
          [98.66, 17.15],
          [98.67, 17.30],
          [98.68, 17.40],
          [98.70, 17.50]
        ]
      },
      properties: {
        fault_id: 11,
        name_th: "รอยเลื่อนเมย",
        name_en: "Moei Fault",
        length_km: 150,
        strike: "N-S",
        type: "strike-slip",
        type_th: "รอยเลื่อนด้านข้าง",
        max_magnitude: 7.0,
        provinces_th: ["ตาก"],
        provinces_en: ["Tak"],
        description_th: "รอยเลื่อนวางตัวตามแนวแม่น้ำเมย ซึ่งเป็นเส้นพรมแดนไทย-เมียนมา ในจังหวัดตาก ต่อเนื่องจากรอยเลื่อนสะแกง (Sagaing) ในเมียนมา เป็นส่วนหนึ่งของระบบรอยเลื่อนขนาดใหญ่ที่เกิดจากการเคลื่อนตัวไปทางเหนือของแผ่นอินเดีย มีความเสี่ยงต่ออำเภอแม่สอดและชุมชนชายแดน",
        description_en: "Fault aligned along the Moei River, which forms the Thailand-Myanmar border in Tak province. Connects to the Sagaing Fault system in Myanmar, one of Southeast Asia's most active fault zones. Part of the large-scale fault system driven by the northward movement of the Indian plate. Poses risk to Mae Sot district and border communities.",
        last_event: null
      }
    },

    // ────────────────────────────────────────────────────────────────
    // 12. Phetchabun Fault (รอยเลื่อนเพชรบูรณ์)
    // ────────────────────────────────────────────────────────────────
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [101.00, 15.70],
          [101.02, 15.82],
          [101.04, 15.95],
          [101.06, 16.08],
          [101.08, 16.20],
          [101.10, 16.33],
          [101.12, 16.45],
          [101.14, 16.55],
          [101.16, 16.67],
          [101.18, 16.80],
          [101.20, 16.90],
          [101.20, 17.00]
        ]
      },
      properties: {
        fault_id: 12,
        name_th: "รอยเลื่อนเพชรบูรณ์",
        name_en: "Phetchabun Fault",
        length_km: 150,
        strike: "N-S",
        type: "normal",
        type_th: "รอยเลื่อนแนวดิ่ง (ปกติ)",
        max_magnitude: 6.5,
        provinces_th: ["เพชรบูรณ์"],
        provinces_en: ["Phetchabun"],
        description_th: "รอยเลื่อนแนวเหนือ-ใต้ตามแนวเทือกเขาเพชรบูรณ์ ควบคุมภูมิประเทศของหุบเขาและที่ราบลุ่มในจังหวัดเพชรบูรณ์ เกี่ยวข้องกับการยืดตัวของเปลือกโลกในส่วนตะวันออกของเขตรอยตะเข็บชานบุรี-อินโดจีน เป็นอันตรายต่อตัวเมืองเพชรบูรณ์และเขื่อนป่าสักชลสิทธิ์ทางตอนใต้",
        description_en: "North-south fault along the Phetchabun mountain range, controlling the topography of valleys and basins in Phetchabun province. Related to crustal extension in the eastern part of the Sibumasu-Indochina suture zone. Poses risk to Phetchabun city and the Pa Sak Jolasid Dam to the south.",
        last_event: null
      }
    },

    // ────────────────────────────────────────────────────────────────
    // 13. Si Sawat Fault (รอยเลื่อนศรีสวัสดิ์)
    // ────────────────────────────────────────────────────────────────
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [98.50, 16.00],
          [98.60, 15.90],
          [98.72, 15.82],
          [98.85, 15.73],
          [98.97, 15.65],
          [99.08, 15.57],
          [99.20, 15.48],
          [99.30, 15.40],
          [99.42, 15.32],
          [99.55, 15.22],
          [99.68, 15.15],
          [99.80, 15.08],
          [99.90, 15.03],
          [100.00, 15.00]
        ]
      },
      properties: {
        fault_id: 13,
        name_th: "รอยเลื่อนศรีสวัสดิ์",
        name_en: "Si Sawat Fault",
        length_km: 200,
        strike: "NW-SE",
        type: "strike-slip",
        type_th: "รอยเลื่อนด้านข้าง",
        max_magnitude: 7.5,
        provinces_th: ["ตาก", "กาญจนบุรี", "อุทัยธานี", "สุพรรณบุรี"],
        provinces_en: ["Tak", "Kanchanaburi", "Uthai Thani", "Suphan Buri"],
        description_th: "รอยเลื่อนขนาดใหญ่ที่พาดผ่านสี่จังหวัด จากชายแดนตะวันตกถึงภาคกลาง ผ่านเขื่อนศรีนครินทร์ เป็นส่วนหนึ่งของระบบรอยเลื่อนตะวันตกที่ต่อเนื่องจากเมียนมา เกิดจากแรงเฉือนของแผ่นเปลือกโลกในเขตชนชานบุรี-อินโดจีน มีความเสี่ยงสูงเนื่องจากผ่านใกล้เขื่อนขนาดใหญ่หลายแห่ง",
        description_en: "A major fault crossing four provinces from the western border to central Thailand, passing through the Srinagarind Dam area. Part of the western fault system extending from Myanmar, generated by shear forces in the Sibumasu-Indochina collision zone. High risk due to proximity to several large dams, including Srinagarind and Vajiralongkorn (Khao Laem).",
        last_event: null
      }
    },

    // ────────────────────────────────────────────────────────────────
    // 14. Three Pagodas Fault (รอยเลื่อนด่านเจดีย์สามองค์)
    // ────────────────────────────────────────────────────────────────
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [98.20, 15.30],
          [98.33, 15.22],
          [98.47, 15.13],
          [98.60, 15.05],
          [98.72, 14.97],
          [98.85, 14.88],
          [98.97, 14.78],
          [99.08, 14.70],
          [99.20, 14.60],
          [99.33, 14.50],
          [99.45, 14.40],
          [99.58, 14.30],
          [99.70, 14.20],
          [99.85, 14.10],
          [100.00, 14.00]
        ]
      },
      properties: {
        fault_id: 14,
        name_th: "รอยเลื่อนด่านเจดีย์สามองค์",
        name_en: "Three Pagodas Fault",
        length_km: 250,
        strike: "NW-SE",
        type: "strike-slip",
        type_th: "รอยเลื่อนด้านข้าง",
        max_magnitude: 7.5,
        provinces_th: ["กาญจนบุรี"],
        provinces_en: ["Kanchanaburi"],
        description_th: "รอยเลื่อนที่ยาวที่สุดในภาคตะวันตก เริ่มจากด่านเจดีย์สามองค์ที่ชายแดนเมียนมา พาดผ่านจังหวัดกาญจนบุรี ต่อเนื่องจากรอยเลื่อนสะแกงของเมียนมา มีศักยภาพสูงในการเกิดแผ่นดินไหวขนาดใหญ่ เป็นอันตรายต่อกรุงเทพมหานครซึ่งอยู่ห่างออกไปเพียง 200 กม. โดยเฉพาะอาคารสูงบนดินเหนียวอ่อน",
        description_en: "The longest fault in western Thailand, extending from the Three Pagodas Pass on the Myanmar border across Kanchanaburi province. Continuation of Myanmar's Sagaing Fault system. Has high potential for large earthquakes. Poses risk to Bangkok, only ~200 km away, particularly for tall buildings on soft clay foundations. A defining structure of the Sibumasu-Indochina collision boundary.",
        last_event: null
      }
    },

    // ────────────────────────────────────────────────────────────────
    // 15. Ranong Fault (รอยเลื่อนระนอง)
    // ────────────────────────────────────────────────────────────────
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [98.50, 9.50],
          [98.55, 9.65],
          [98.62, 9.80],
          [98.70, 9.95],
          [98.78, 10.10],
          [98.85, 10.25],
          [98.92, 10.40],
          [99.00, 10.55],
          [99.08, 10.70],
          [99.15, 10.85],
          [99.22, 11.00],
          [99.30, 11.15],
          [99.38, 11.30],
          [99.45, 11.42],
          [99.50, 11.50]
        ]
      },
      properties: {
        fault_id: 15,
        name_th: "รอยเลื่อนระนอง",
        name_en: "Ranong Fault",
        length_km: 270,
        strike: "NE-SW",
        type: "strike-slip",
        type_th: "รอยเลื่อนด้านข้าง",
        max_magnitude: 7.0,
        provinces_th: ["ระนอง", "ชุมพร", "สุราษฎร์ธานี", "ประจวบคีรีขันธ์"],
        provinces_en: ["Ranong", "Chumphon", "Surat Thani", "Prachuap Khiri Khan"],
        description_th: "รอยเลื่อนที่ยาวที่สุดในภาคใต้ พาดผ่านคอคอดกระ จากชายฝั่งอันดามันถึงอ่าวไทย ตัดผ่านแหล่งน้ำพุร้อน Ranong Hot Spring แสดงถึงความเคลื่อนไหวของเปลือกโลก เป็นส่วนหนึ่งของระบบรอยเลื่อนที่เกิดจากการยืดตัวของคาบสมุทรมลายูหลังการชนกันของแผ่นอินเดีย-ยูเรเซีย มีความเสี่ยงต่อเมืองระนอง ชุมพร และแหล่งท่องเที่ยวชายฝั่ง",
        description_en: "The longest fault in southern Thailand, crossing the Kra Isthmus from the Andaman coast to the Gulf of Thailand. Passes through the Ranong Hot Spring, indicating ongoing crustal activity. Part of the fault system caused by extension of the Malay Peninsula following the India-Eurasia collision. Poses risk to Ranong city, Chumphon, and coastal tourist destinations on both coasts.",
        last_event: null
      }
    },

    // ────────────────────────────────────────────────────────────────
    // 16. Khlong Marui Fault (รอยเลื่อนคลองมะรุ่ย)
    // ────────────────────────────────────────────────────────────────
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [98.30, 8.40],
          [98.37, 8.50],
          [98.44, 8.60],
          [98.52, 8.70],
          [98.60, 8.80],
          [98.67, 8.90],
          [98.75, 9.00],
          [98.82, 9.08],
          [98.90, 9.17],
          [98.97, 9.25],
          [99.05, 9.33],
          [99.12, 9.42],
          [99.20, 9.50]
        ]
      },
      properties: {
        fault_id: 16,
        name_th: "รอยเลื่อนคลองมะรุ่ย",
        name_en: "Khlong Marui Fault",
        length_km: 150,
        strike: "NE-SW",
        type: "strike-slip",
        type_th: "รอยเลื่อนด้านข้าง",
        max_magnitude: 7.0,
        provinces_th: ["พังงา", "สุราษฎร์ธานี", "กระบี่"],
        provinces_en: ["Phang Nga", "Surat Thani", "Krabi"],
        description_th: "รอยเลื่อนวางตัวขนานกับรอยเลื่อนระนองทางทิศใต้ พาดผ่านจังหวัดพังงา กระบี่ และสุราษฎร์ธานี ตัดผ่านแหล่งท่องเที่ยวสำคัญ เช่น อ่าวพังงาและเขาสก เป็นส่วนหนึ่งของระบบรอยเลื่อนคู่ (conjugate fault) ที่เกิดจากการยืดตัวของคาบสมุทรมลายูในเขตชนอินเดีย-ยูเรเซีย มีความเสี่ยงต่อภูเก็ต กระบี่ และแหล่งท่องเที่ยวอันดามัน",
        description_en: "Fault running parallel to the Ranong Fault to the south, crossing Phang Nga, Krabi, and Surat Thani provinces. Passes through major tourist areas including Phang Nga Bay and Khao Sok. Part of the conjugate fault system caused by Malay Peninsula extension in the India-Eurasia collision zone. Poses risk to Phuket, Krabi, and the Andaman coast tourism region.",
        last_event: null
      }
    }
  ]
};
