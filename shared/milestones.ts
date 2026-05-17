export interface Milestone {
  id?: string;
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

const MILESTONES_DATA: Milestone[] = [
  {
    date: "2 Feb 2026",
    location: "Escarpment Water Catchment — Kamebur Viewpoint",
    shortLocation: "Kamebur Viewpoint",
    description:
      "First strategic restoration effort of 2026. Focused on the escarpment water catchment zone at Kamebur Viewpoint, removing legacy plastic waste to reduce microplastic emissions and establishing protocols for long-term environmental resilience.",
    load: "3 Units",
    personnel: 3,
    photo: "/milestones/kamebur/kamebur-1.jpg",
    gallery: [
      "/milestones/kamebur/kamebur-1.jpg",
      "/milestones/kamebur/kamebur-2.jpg",
      "/milestones/kamebur/kamebur-3.jpg",
      "/milestones/kamebur/kamebur-4.jpg",
      "/milestones/kamebur/kamebur-5.jpg",
      "/milestones/kamebur/kamebur-7.jpg"
    ],
    alt: "Kamebur Viewpoint escarpment clean-up, 2 February 2026, Elgeyo Marakwet",
  },
  {
    date: "9 Feb 2026",
    location: "Iten Town — Water Reserve",
    shortLocation: "Iten Water Reserve",
    description:
      "Removed 15 kg of polythene and glass waste from the Iten Water Reserve. This critical intervention prevents microplastic drainage into the primary water supply for Iten residents, securing the town's water resilience.",
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
      "Operational milestone: 45 kg of urban waste, including glass bottles and polythene materials, recovered from the Iten Public Park. This mission targeted the removal of materials that break down into microplastics, contributing to a cleaner, more resilient urban environment.",
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
      "The team covered a broad section of the escarpment, executing targeted plastic and waste removal operations across a wide area of the Keiyo Escarpment zone.",
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
      "Watershed protection and trough restoration at Kipgorgotich. The team cleared heavy mud, removed overgrown aquatic plants near the water source, and thoroughly washed the livestock water trough to ensure clean, safe water access for the community and their animals.",
    load: "Vegetation & Mud",
    personnel: 10,
    photo: "/milestones/kipkorgotich/before-after.jpg",
    gallery: [
      "/milestones/kipkorgotich/before-after.jpg",
      "/milestones/kipkorgotich/clean-flow.jpg",
      "/milestones/kipkorgotich/clean-trough.jpg",
      "/milestones/kipkorgotich/cleanup-team.jpg",
      "/milestones/kipkorgotich/cleanup-pile.jpg",
      "/milestones/kipkorgotich/kipkorgotich-7.jpg",
      "/milestones/kipkorgotich/kipkorgotich-8.jpg"
    ],
    alt: "Kipgorgotich Water Point restoration, 12 March 2026",
  },
  {
    date: "18 Mar 2026",
    location: "Oldoldol Water Catchment — Algae & Aquatic Vegetation Clearance",
    shortLocation: "Oldoldol",
    description:
      "Strategic restoration of the Oldoldol community water catchment. This vital highland source, which supplies irrigation and livestock water via the escarpment, was cleared of heavy algal bloom and overgrowth in a 3.5-hour manual operation. The intervention restored oxygen levels and water quality for the surrounding communities.",
    load: "10 Units",
    mass: "70 kg",
    personnel: 18,
    photo: "/milestones/oldoldol/oldoldol-1.jpg",
    gallery: [
      "/milestones/oldoldol/oldoldol-1.jpg",
      "/milestones/oldoldol/oldoldol-4.jpg",
      "/milestones/oldoldol/oldoldol-5.jpg",
      "/milestones/oldoldol/oldoldol-6.jpg",
      "/milestones/oldoldol/oldoldol-7.jpg",
      "/milestones/oldoldol/oldoldol-8.jpg"
    ],
    alt: "Oldoldol Water Catchment restoration team and clearance activity, 18 March 2026",
  },
  {
    date: "25 Mar 2026",
    location: "Oldoldol Community — Simba Women's Group Tree Planting",
    shortLocation: "Simba Oldoldol",
    description:
      "Strategic restoration in collaboration with the Simba Oldoldol women's group. This dedicated community group focuses on indigenous tree planting. We had the opportunity to interact with the members, sharing knowledge on nursery management and establishing new planting zones to enhance the local ecosystem's resilience.",
    load: "10 Units",
    mass: "70 kg",
    personnel: 18,
    photo: "/milestones/simba-oldoldol/simba-oldoldol-1.png",
    gallery: [
      "/milestones/simba-oldoldol/simba-oldoldol-1.png",
      "/milestones/simba-oldoldol/simba-oldoldol-2.png",
      "/milestones/simba-oldoldol/simba-oldoldol-4.png",
      "/milestones/simba-oldoldol/simba-oldoldol-5.png"
    ],
    alt: "Simba Oldoldol women's group tree planting and community interaction, 25 March 2026",
  },
];

export const MILESTONES = [...MILESTONES_DATA].reverse();
