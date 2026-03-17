export interface Milestone {
  date: string;
  location: string;
  shortLocation: string;
  description: string;
  load: string;
  mass?: string;
  personnel: number;
  photo: string;
  gallery?: string[];
  alt: string;
}

export const MILESTONES: Milestone[] = [
  {
    date: "2 Feb 2026",
    location: "Escarpment Water Catchment — Kamebur Viewpoint",
    shortLocation: "Kamebur Viewpoint",
    description:
      "First structured clean-up of 2026. Focused on the escarpment water catchment zone at the iconic Kamebur Viewpoint, establishing protocols that would guide all subsequent operations.",
    load: "3 Units",
    personnel: 3,
    photo: "/milestones/kamebur/kamebur-6.jpg",
    gallery: [
      "/milestones/kamebur/kamebur-1.jpg",
      "/milestones/kamebur/kamebur-2.jpg",
      "/milestones/kamebur/kamebur-3.jpg",
      "/milestones/kamebur/kamebur-4.jpg",
      "/milestones/kamebur/kamebur-5.jpg",
      "/milestones/kamebur/kamebur-6.jpg",
      "/milestones/kamebur/kamebur-7.jpg"
    ],
    alt: "Kamebur Viewpoint escarpment clean-up, 2 February 2026, Elgeyo Marakwet",
  },
  {
    date: "9 Feb 2026",
    location: "Iten Town — Water Reserve",
    shortLocation: "Iten Water Reserve",
    description:
      "Removed 15 kg of plastic and glass waste from the Iten Water Reserve. A critical intervention protecting the primary water supply for Iten town residents.",
    load: "5 Units",
    mass: "15 kg",
    personnel: 5,
    photo: "/milestones/iten-water-reserve/water-reserve-1.jpg",
    gallery: [
      "/milestones/iten-water-reserve/water-reserve-1.jpg",
      "/milestones/iten-water-reserve/water-reserve-2.jpg",
      "/milestones/iten-water-reserve/water-reserve-3.jpg",
      "/milestones/iten-water-reserve/water-reserve-4.jpg",
      "/milestones/iten-water-reserve/water-reserve-5.jpg",
      "/milestones/iten-water-reserve/water-reserve-6.jpg",
      "/milestones/iten-water-reserve/water-reserve-7.jpg",
      "/milestones/iten-water-reserve/water-reserve-8.jpg",
      "/milestones/iten-water-reserve/water-reserve-9.jpg"
    ],
    alt: "Iten Water Reserve clean-up team, 9 February 2026",
  },
  {
    date: "20 Feb 2026",
    location: "Iten Town — Public Park",
    shortLocation: "Iten Public Park",
    description:
      "Operational milestone: 45 kg of urban waste recovered from the Iten Public Park. This mission demonstrated our capacity for large-scale urban cleanup, utilizing a systematic sweep of the central recreation zone.",
    load: "6 Units",
    mass: "45 kg",
    personnel: 8,
    photo: "/milestones/iten-park/iten-park-group.jpg",
    gallery: [
      "/milestones/iten-park/iten-park-group.jpg",
      "/milestones/iten-park/iten-park-bags.jpg",
      "/milestones/iten-park/iten-park-founder.jpg",
      "/milestones/iten-park/iten-park-bottles.jpg",
      "/milestones/iten-park/iten-park-pile.jpg",
      "/milestones/iten-park/iten-park-6.jpg",
      "/milestones/iten-park/iten-park-7.jpg"
    ],
    alt: "Iten Public Park clean-up, 20 February 2026",
  },
  {
    date: "23 Feb 2026",
    location: "Escarpment Operations",
    shortLocation: "Escarpment",
    description:
      "Highest volunteer turnout to date at 11 participants — a clear sign of rapid community momentum growing around CHI's mission. The team covered a broad section of the escarpment.",
    load: "6 Units",
    personnel: 11,
    photo: "/milestones/escarpment/escarpment-1.jpg",
    gallery: [
      "/milestones/escarpment/escarpment-1.jpg",
      "/milestones/escarpment/escarpment-2.jpg",
      "/milestones/escarpment/escarpment-3.jpg",
      "/milestones/escarpment/escarpment-4.jpg",
      "/milestones/escarpment/escarpment-5.jpg",
      "/milestones/escarpment/escarpment-6.jpg",
      "/milestones/escarpment/escarpment-7.jpg"
    ],
    alt: "Escarpment clean-up with 11 volunteers, 23 February 2026",
  },
  {
    date: "12 Mar 2026",
    location: "Kipgorgotich Water Point — Restoration",
    shortLocation: "Kipgorgotich",
    description:
      "Watershed protection and trough restoration at Kipgorgotich. The team successfully cleared legacy waste and restored the cleanliness of the community water supply, ensuring safe access for both residents and livestock.",
    load: "8 Units",
    mass: "52 kg",
    personnel: 5,
    photo: "/milestones/kipkorgotich/before-after.jpg",
    gallery: [
      "/milestones/kipkorgotich/before-after.jpg",
      "/milestones/kipkorgotich/cows-water.jpg",
      "/milestones/kipkorgotich/clean-flow.jpg",
      "/milestones/kipkorgotich/clean-trough.jpg",
      "/milestones/kipkorgotich/cleanup-team.jpg",
      "/milestones/kipkorgotich/cleanup-pile.jpg",
      "/milestones/kipkorgotich/kipkorgotich-7.jpg",
      "/milestones/kipkorgotich/kipkorgotich-8.jpg"
    ],
    alt: "Kipgorgotich Water Point restoration, 12 March 2026",
  },
];
