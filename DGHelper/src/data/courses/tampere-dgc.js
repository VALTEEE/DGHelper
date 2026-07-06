/**
 * Tampere Disc Golf Center
 * Mapped from user-provided GPS coordinates.
 * fairwayPath includes: [TeePad, ...Waypoints, Basket]
 */
export const tampereDGC = {
  id: "tampere-dgc",
  name: "Tampere Disc Golf Center",
  location: { city: "Tampere", country: "Finland" },
  totalHoles: 18,
  
  // Bounding box for map viewport (auto-calculated + 0.001 padding)
  bounds: {
    north: 61.5115,
    south: 61.5035,
    east: 23.8685,
    west: 23.8600
  },

  holes: [
    {
      number: 1, par: 3, distanceMeters: 95,
      teePad: { lat: 61.504354, lng: 23.860956 },
      basket: { lat: 61.505113, lng: 23.861309 },
      imageCalibration: {
        teePixel: { x: 133, y: 264 },
        basketPixel: { x: 136, y: 94 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_1.jpg",
      imageDimensions: { width: 212, height: 300 },
      fairwayPath: [
        { lat: 61.504354, lng: 23.860956 },
        { lat: 61.504851, lng: 23.861228 },
        { lat: 61.505113, lng: 23.861309 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: [
        {
          id: "h1-treeline",
          type: "trees",
          shape: "line",
          points: [
            { lat: 61.504719, lng: 23.861063 },
            { lat: 61.505013, lng: 23.861181 }
          ],
          severity: "moderate",
          note: "Treeline along fairway"
        }
      ]
    },
    {
      number: 2, par: 3, distanceMeters: 141,
      teePad: { lat: 61.505159, lng: 23.860961 },
      basket: { lat: 61.506353, lng: 23.861415 },
      imageCalibration: {
        teePixel: { x: 141, y: 267 },
        basketPixel: { x: 124, y: 92 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_2.jpg",
      imageDimensions: { width: 211, height: 300 },
      fairwayPath: [
        { lat: 61.505159, lng: 23.860961 },
        { lat: 61.505892, lng: 23.861261 },
        { lat: 61.506353, lng: 23.861415 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: [
        { id: "h2-tree-1", type: "trees", shape: "point", points: [{ lat: 61.505611, lng: 23.861116 }], severity: "light", note: "Tree mid fairway" },
        { id: "h2-tree-2", type: "trees", shape: "point", points: [{ lat: 61.505909, lng: 23.861199 }], severity: "light", note: "More trees mid fairway" }
      ]
    },
    {
      number: 3, par: 3, distanceMeters: 124,
      teePad: { lat: 61.506522, lng: 23.861261 },
      basket: { lat: 61.506801, lng: 23.863129 },
      imageCalibration: {
        teePixel: { x: 353, y: 562 },
        basketPixel: { x: 211, y: 198 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_3.jpg",
      imageDimensions: { width: 450, height: 637 },
      fairwayPath: [
        { lat: 61.506522, lng: 23.861261 },
        { lat: 61.506435, lng: 23.862301 },
        { lat: 61.506563, lng: 23.862956 },
        { lat: 61.506801, lng: 23.863129 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: [
        { id: "h3-guardian", type: "trees", shape: "point", points: [{ lat: 61.506654, lng: 23.863096 }], severity: "heavy", note: "Guardian trees blocking hyzer line from approach shots" }
      ]
    },
    {
      number: 4, par: 3, distanceMeters: 94,
      teePad: { lat: 61.507497, lng: 23.863125 },
      basket: { lat: 61.507424, lng: 23.861508 },
      imageCalibration: {
        teePixel: { x: 116, y: 265 },
        basketPixel: { x: 168, y: 98 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_4.jpg",
      imageDimensions: { width: 211, height: 300 },
      fairwayPath: [
        { lat: 61.507497, lng: 23.863125 },
        { lat: 61.507349, lng: 23.862205 },
        { lat: 61.507415, lng: 23.861730 },
        { lat: 61.507424, lng: 23.861508 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: [
        { id: "h4-tree-1", type: "trees", shape: "point", points: [{ lat: 61.507321, lng: 23.861813 }], severity: "light", note: "Tree mid fairway" },
        { id: "h4-tree-2", type: "trees", shape: "point", points: [{ lat: 61.507408, lng: 23.861804 }], severity: "light", note: "Tree mid fairway" },
        { id: "h4-guardian", type: "trees", shape: "point", points: [{ lat: 61.507454, lng: 23.861637 }], severity: "heavy", note: "Guardian trees near basket" }
      ]
    },
    {
      number: 5, par: 3, distanceMeters: 118,
      teePad: { lat: 61.507678, lng: 23.862109 },
      basket: { lat: 61.508470, lng: 23.861881 },
      imageCalibration: {
        teePixel: { x: 114, y: 265 },
        basketPixel: { x: 157, y: 95 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_5.jpg",
      imageDimensions: { width: 212, height: 300 },
      fairwayPath: [
        { lat: 61.507678, lng: 23.862109 },
        { lat: 61.508038, lng: 23.861974 },
        { lat: 61.508334, lng: 23.861883 },
        { lat: 61.508470, lng: 23.861881 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: [
        { id: "h5-forest-line-1", type: "trees", shape: "line", points: [{ lat: 61.508138, lng: 23.862009 }, { lat: 61.508447, lng: 23.861950 }], severity: "heavy", note: "Dense forest line" },
        { id: "h5-tree-line-2", type: "trees", shape: "line", points: [{ lat: 61.508155, lng: 23.861766 }, { lat: 61.508404, lng: 23.861811 }], severity: "heavy", note: "Dense tree line" }
      ]
    },
    {
      number: 6, par: 3, distanceMeters: 262,
      teePad: { lat: 61.508275, lng: 23.862904 },
      basket: { lat: 61.510387, lng: 23.862819 },
      imageCalibration: {
        teePixel: { x: 153, y: 265 },
        basketPixel: { x: 137, y: 85 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_6.jpg",
      imageDimensions: { width: 214, height: 300 },
      fairwayPath: [
        { lat: 61.508275, lng: 23.862904 },
        { lat: 61.508755, lng: 23.863095 },
        { lat: 61.509562, lng: 23.862674 },
        { lat: 61.510235, lng: 23.862610 },
        { lat: 61.510387, lng: 23.862819 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: [
        { id: "h6-tree-1", type: "trees", shape: "point", points: [{ lat: 61.508682, lng: 23.862981 }], severity: "moderate", note: "Patch of trees blocking early releases" },
        { id: "h6-tree-2", type: "trees", shape: "point", points: [{ lat: 61.509122, lng: 23.862943 }], severity: "light", note: "Tree mid fairway" },
        { id: "h6-tree-3", type: "trees", shape: "point", points: [{ lat: 61.509418, lng: 23.862637 }], severity: "light", note: "Tree mid fairway" },
        { id: "h6-tree-4", type: "trees", shape: "point", points: [{ lat: 61.509600, lng: 23.862630 }], severity: "light", note: "Tree mid fairway" },
        { id: "h6-patch", type: "trees", shape: "line", points: [{ lat: 61.509522, lng: 23.862456 }, { lat: 61.509718, lng: 23.862567 }], severity: "moderate", note: "Patch of trees" },
        { id: "h6-line", type: "trees", shape: "line", points: [{ lat: 61.509472, lng: 23.862867 }, { lat: 61.509845, lng: 23.862828 }], severity: "moderate", note: "Line of trees" },
        { id: "h6-tree-5", type: "trees", shape: "point", points: [{ lat: 61.510062, lng: 23.862744 }], severity: "light", note: "2 trees left of fairway" },
        { id: "h6-tree-6", type: "trees", shape: "point", points: [{ lat: 61.510207, lng: 23.862693 }], severity: "light", note: "Tree mid fairway" },
        { id: "h6-tree-7", type: "trees", shape: "point", points: [{ lat: 61.510242, lng: 23.862552 }], severity: "light", note: "Tree mid fairway" }
      ]
    },
    {
      number: 7, par: 3, distanceMeters: 110,
      teePad: { lat: 61.510487, lng: 23.863195 },
      basket: { lat: 61.509870, lng: 23.863981 },
      imageCalibration: {
        teePixel: { x: 117, y: 270 },
        basketPixel: { x: 173, y: 94 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_7.jpg",
      imageDimensions: { width: 213, height: 300 },
      fairwayPath: [
        { lat: 61.510487, lng: 23.863195 },
        { lat: 61.510102, lng: 23.863929 },
        { lat: 61.509870, lng: 23.863981 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: [
        { id: "h7-gap-1", type: "fairway", shape: "line", points: [{ lat: 61.510519, lng: 23.863315 }, { lat: 61.510373, lng: 23.863583 }], severity: "light", note: "Start of gap line" },
        { id: "h7-gap-2", type: "fairway", shape: "line", points: [{ lat: 61.510411, lng: 23.863694 }, { lat: 61.510520, lng: 23.863575 }], severity: "light", note: "End of gap line" }
      ]
    },
    {
      number: 8, par: 3, distanceMeters: 122,
      teePad: { lat: 61.509806, lng: 23.864783 },
      basket: { lat: 61.508917, lng: 23.863643 },
      imageCalibration: {
        teePixel: { x: 135, y: 262 },
        basketPixel: { x: 147, y: 92 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_8.jpg",
      imageDimensions: { width: 212, height: 300 },
      fairwayPath: [
        { lat: 61.509806, lng: 23.864783 },
        { lat: 61.509455, lng: 23.864267 },
        { lat: 61.509016, lng: 23.863849 },
        { lat: 61.508917, lng: 23.863643 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: [
        { id: "h8-tree-1", type: "trees", shape: "point", points: [{ lat: 61.509507, lng: 23.864385 }], severity: "light", note: "Tree mid fairway" },
        { id: "h8-patch", type: "trees", shape: "point", points: [{ lat: 61.509071, lng: 23.864098 }], severity: "moderate", note: "Patch of trees end of fairway" },
        { id: "h8-guardian", type: "trees", shape: "zone", points: [{ lat: 61.508963, lng: 23.863646 }], severity: "heavy", note: "Guardian tree circle around basket" }
      ]
    },
    {
      number: 9, par: 3, distanceMeters: 97,
      teePad: { lat: 61.508756, lng: 23.863672 },
      basket: { lat: 61.508134, lng: 23.864134 },
      imageCalibration: {
        teePixel: { x: 131, y: 260 },
        basketPixel: { x: 118, y: 97 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_9.jpg",
      imageDimensions: { width: 213, height: 300 },
      fairwayPath: [
        { lat: 61.508756, lng: 23.863672 },
        { lat: 61.508402, lng: 23.863854 },
        { lat: 61.508134, lng: 23.864134 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: [
        { id: "h9-hill", type: "terrain", shape: "zone", points: [{ lat: 61.508119, lng: 23.864162 }], severity: "moderate", note: "3m high hill, basket on top" },
        { id: "h9-tree-1", type: "trees", shape: "point", points: [{ lat: 61.508282, lng: 23.864121 }], severity: "light", note: "Tree mid fairway" },
        { id: "h9-tree-bunch", type: "trees", shape: "point", points: [{ lat: 61.508149, lng: 23.863926 }], severity: "moderate", note: "Bunch of trees mid fairway" }
      ]
    },
    {
      number: 10, par: 3, distanceMeters: 225,
      teePad: { lat: 61.507651, lng: 23.864525 },
      basket: { lat: 61.509171, lng: 23.865987 },
      imageCalibration: {
        teePixel: { x: 167, y: 267 },
        basketPixel: { x: 115, y: 90 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_10.jpg",
      imageDimensions: { width: 212, height: 300 },
      fairwayPath: [
        { lat: 61.507651, lng: 23.864525 },
        { lat: 61.507977, lng: 23.864761 },
        { lat: 61.508613, lng: 23.864935 },
        { lat: 61.508906, lng: 23.865772 },
        { lat: 61.509171, lng: 23.865987 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: [
        { id: "h10-trees", type: "trees", shape: "point", points: [{ lat: 61.507906, lng: 23.864556 }], severity: "moderate", note: "Bunch of trees mid fairway" },
        { id: "h10-pond", type: "water", shape: "polygon", points: [
          { lat: 61.508930, lng: 23.865814 },
          { lat: 61.509023, lng: 23.865817 },
          { lat: 61.509157, lng: 23.866055 },
          { lat: 61.509081, lng: 23.866248 },
          { lat: 61.508928, lng: 23.865956 }
        ], severity: "heavy", note: "OB Pond area" }
      ]
    },
    {
      number: 11, par: 3, distanceMeters: 76,
      teePad: { lat: 61.508962, lng: 23.866564 },
      basket: { lat: 61.508526, lng: 23.865754 },
      imageCalibration: {
        teePixel: { x: 135, y: 262 },
        basketPixel: { x: 131, y: 100 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_11.jpg",
      imageDimensions: { width: 213, height: 300 },
      fairwayPath: [
        { lat: 61.508962, lng: 23.866564 },
        { lat: 61.508687, lng: 23.866110 },
        { lat: 61.508526, lng: 23.865754 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: [
        { id: "h11-corridor", type: "trees", shape: "zone", points: [], severity: "heavy", note: "Tree lines both sides until basket. ~5m wide fairway." }
      ]
    },
    {
      number: 12, par: 3, distanceMeters: 78,
      teePad: { lat: 61.508069, lng: 23.865276 },
      basket: { lat: 61.507305, lng: 23.865451 },
      imageCalibration: {
        teePixel: { x: 158, y: 265 },
        basketPixel: { x: 114, y: 95 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_12.jpg",
      imageDimensions: { width: 211, height: 300 },
      fairwayPath: [
        { lat: 61.508069, lng: 23.865276 },
        { lat: 61.507421, lng: 23.865094 },
        { lat: 61.507305, lng: 23.865451 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: [
        { id: "h12-gap", type: "fairway", shape: "zone", points: [], severity: "moderate", note: "5m wide gap, turns right to basket at end." }
      ]
    },
    {
      number: 13, par: 3, distanceMeters: 199,
      teePad: { lat: 61.507354, lng: 23.865671 },
      basket: { lat: 61.508656, lng: 23.867167 },
      imageCalibration: {
        teePixel: { x: 116, y: 256 },
        basketPixel: { x: 152, y: 102 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_13.jpg",
      imageDimensions: { width: 210, height: 300 },
      fairwayPath: [
        { lat: 61.507354, lng: 23.865671 },
        { lat: 61.507618, lng: 23.865783 },
        { lat: 61.508089, lng: 23.866255 },
        { lat: 61.508704, lng: 23.866942 },
        { lat: 61.508656, lng: 23.867167 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: [
        { id: "h13-gap", type: "fairway", shape: "zone", points: [], severity: "moderate", note: "3m wide gap for left-turning shot into open area." }
      ]
    },
    {
      number: 14, par: 3, distanceMeters: 184,
      teePad: { lat: 61.507693, lng: 23.866976 },
      basket: { lat: 61.506646, lng: 23.866287 },
      imageCalibration: {
        teePixel: { x: 137, y: 250 },
        basketPixel: { x: 184, y: 103 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_14.jpg",
      imageDimensions: { width: 212, height: 300 },
      fairwayPath: [
        { lat: 61.507693, lng: 23.866976 },
        { lat: 61.507381, lng: 23.867669 },
        { lat: 61.507175, lng: 23.867430 },
        { lat: 61.506765, lng: 23.866607 },
        { lat: 61.506646, lng: 23.866287 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: []
    },
    {
      number: 15, par: 3, distanceMeters: 135,
      teePad: { lat: 61.506789, lng: 23.865651 },
      basket: { lat: 61.505649, lng: 23.865887 },
      imageCalibration: {
        teePixel: { x: 109, y: 266 },
        basketPixel: { x: 154, y: 93 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_15.jpg",
      imageDimensions: { width: 211, height: 300 },
      fairwayPath: [
        { lat: 61.506789, lng: 23.865651 },
        { lat: 61.506380, lng: 23.865976 },
        { lat: 61.505979, lng: 23.866067 },
        { lat: 61.505649, lng: 23.865887 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: [
        { id: "h15-tree-1", type: "trees", shape: "point", points: [{ lat: 61.506256, lng: 23.865919 }], severity: "light", note: "Tree mid fairway" }
      ]
    },
    {
      number: 16, par: 3, distanceMeters: 192,
      teePad: { lat: 61.505808, lng: 23.865576 },
      basket: { lat: 61.507102, lng: 23.864817 },
      imageCalibration: {
        teePixel: { x: 161, y: 273 },
        basketPixel: { x: 163, y: 98 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_16.jpg",
      imageDimensions: { width: 211, height: 300 },
      fairwayPath: [
        { lat: 61.505808, lng: 23.865576 },
        { lat: 61.506000, lng: 23.864370 },
        { lat: 61.506786, lng: 23.864488 },
        { lat: 61.507102, lng: 23.864817 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: [
        { id: "h16-tunnel", type: "fairway", shape: "zone", points: [], severity: "moderate", note: "Starts with 2m wide tunnel shot into open area." },
        { id: "h16-trees", type: "trees", shape: "point", points: [{ lat: 61.506681, lng: 23.864522 }], severity: "light", note: "Trees mid fairway" },
        { id: "h16-uphill", type: "terrain", shape: "zone", points: [{ lat: 61.506672, lng: 23.864490 }], severity: "moderate", note: "Uphill to basket (~8m elevation gain)" }
      ]
    },
    {
      number: 17, par: 3, distanceMeters: 107,
      teePad: { lat: 61.506906, lng: 23.863991 },
      basket: { lat: 61.505960, lng: 23.863763 },
      imageCalibration: {
        teePixel: { x: 135, y: 264 },
        basketPixel: { x: 134, y: 96 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_17.jpg",
      imageDimensions: { width: 213, height: 300 },
      fairwayPath: [
        { lat: 61.506906, lng: 23.863991 },
        { lat: 61.506400, lng: 23.863919 },
        { lat: 61.505960, lng: 23.863763 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: []
    },
    {
      number: 18, par: 3, distanceMeters: 98,
      teePad: { lat: 61.505342, lng: 23.862682 },
      basket: { lat: 61.504623, lng: 23.861810 },
      imageCalibration: {
        teePixel: { x: 123, y: 263 },
        basketPixel: { x: 158, y: 93 },
      },
      mapImage: "/images/courses/Tampere_discgolf_center/TDGC_HOLE_18.jpg",
      imageDimensions: { width: 211, height: 300 },
      fairwayPath: [
        { lat: 61.505342, lng: 23.862682 },
        { lat: 61.504931, lng: 23.862350 },
        { lat: 61.504672, lng: 23.862117 },
        { lat: 61.504623, lng: 23.861810 }
      ],
      idealThrow: { shape: "unknown", reason: "Add shape based on path" },
      obstacles: [
        { id: "h18-river-trees", type: "trees", shape: "point", points: [{ lat: 61.505067, lng: 23.862439 }], severity: "moderate", note: "2 trees mid fairway over small river" },
        { id: "h18-tree-1", type: "trees", shape: "point", points: [{ lat: 61.504769, lng: 23.862078 }], severity: "light", note: "Tree mid fairway" },
        { id: "h18-tree-2", type: "trees", shape: "point", points: [{ lat: 61.504738, lng: 23.862074 }], severity: "light", note: "Tree mid fairway" },
        { id: "h18-tree-3", type: "trees", shape: "point", points: [{ lat: 61.504719, lng: 23.862337 }], severity: "light", note: "Tree mid fairway" }
      ]
    }
  ]
};