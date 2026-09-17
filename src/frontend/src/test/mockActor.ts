import type { Backend } from "@/backend";
import {
  AppointmentStatus,
  HouseStatus,
  ProjectStatus,
  UnitStatus,
  VerificationStatus,
} from "@/backend";
import { vi } from "vitest";

export const projectFixture = {
  id: 0n,
  name: "บ้านพฤกษา กาญจนบุรี",
  location: {
    province: "กาญจนบุรี",
    district: "เมืองกาญจนบุรี",
    subDistrict: "บ้านใต้",
  },
  startingPrice: 2500000n,
  houseTypes: ["บ้านเดี่ยว", "บ้านสองชั้น"],
  promotions: ["โปรโมชั่นฟรีค่าโอน"],
  images: ["project-0-1.jpg"],
  video: undefined,
  coordinates: { lat: 14.0206, lng: 99.5313 },
  unitCount: 120n,
  unitStatus: UnitStatus.available,
  projectStatus: ProjectStatus.ongoing,
  reviewRating: 4.8,
  verificationStatus: VerificationStatus.verified,
  createdAt: 1720000000000000000n,
};

export const townhomeProjectFixture = {
  ...projectFixture,
  id: 1n,
  name: "เดอะทรี ทาวน์โฮม",
  startingPrice: 1890000n,
  houseTypes: ["ทาวน์โฮม"],
  projectStatus: ProjectStatus.new_,
};

export const agentFixture = {
  id: 0n,
  userId: "aaaaa-aa" as unknown as never,
  photo: "agent-0.jpg",
  name: "สมชาย ใจดี",
  agentCode: "OH-0001",
  serviceArea: "กาญจนบุรี",
  experience: 8n,
  managedProjects: [0n],
  listedHomes: [0n, 1n],
  portfolio: ["บ้านพฤกษา กาญจนบุรี"],
  customerCount: 45n,
  rating: 4.9,
  reviewCount: 12n,
  verified: true,
  ratingCategories: {
    trust: 5n,
    info: 5n,
    service: 5n,
    followUp: 5n,
    politeness: 5n,
    speed: 4n,
  },
};

export const postFixture = {
  id: 0n,
  authorId: "aaaaa-aa" as unknown as never,
  image: "https://images.example.com/garden-home-cover.jpg",
  projectId: 0n,
  location: {
    province: "กาญจนบุรี",
    district: "เมืองกาญจนบุรี",
    subDistrict: "ปากแพรก",
  },
  price: 2900000n,
  agentId: 0n,
  interestedCount: 24n,
  likeCount: 128n,
  commentCount: 15n,
  shareCount: 32n,
  saveCount: 41n,
  createdAt: 1750000000000000000n,
};

export const houseFixture = {
  id: 0n,
  projectId: 0n,
  houseType: "บ้านเดี่ยว",
  usableArea: 120n,
  bedrooms: 3n,
  bathrooms: 2n,
  parking: 2n,
  price: 2500000n,
  floorPlan: "floorplan-0-1.jpg",
  gallery: ["house-0-1.jpg"],
  video: undefined,
  status: HouseStatus.readyToMove,
};

export const reviewFixture = {
  id: 0n,
  agentId: 0n,
  reviewerId: "aaaaa-aa" as unknown as never,
  rating: 5n,
  categories: {
    trust: 5n,
    info: 5n,
    service: 5n,
    followUp: 5n,
    politeness: 5n,
    speed: 5n,
  },
  comment: "ให้ข้อมูลละเอียดมาก พาเข้าชมโครงการอย่างมืออาชีพ",
  createdAt: 1750000000000000000n,
  reported: false,
};

export const notificationFixture = {
  id: 0n,
  userId: "aaaaa-aa" as unknown as never,
  message: "มีการนัดหมายใหม่",
  createdAt: 1750000000000000000n,
  read: false,
};

export const appointmentFixture = {
  id: 0n,
  userId: "aaaaa-aa" as unknown as never,
  projectId: 0n,
  houseType: undefined,
  date: 1750000000000000000n,
  time: 1750000000000000000n,
  visitors: 2n,
  agentId: 0n,
  houseId: undefined,
  status: AppointmentStatus.pending,
};

export const favoriteFixture = {
  userId: "aaaaa-aa" as unknown as never,
  projects: [0n],
  houses: [],
  houseTypes: [],
  agents: [],
  savedPosts: [],
};

export const adminMetricsFixture = {
  members: 10n,
  projects: 3n,
  agents: 3n,
  leads: 1n,
  liveViewers: 0n,
  appointments: 1n,
  conversions: 0n,
  posts: 3n,
  houses: 4n,
  customers: 5n,
};

export function createMockActor(overrides: Partial<Backend> = {}): Backend {
  const actor: Partial<Backend> = {
    listProjects: vi
      .fn()
      .mockResolvedValue([projectFixture, townhomeProjectFixture]),
    listAgents: vi.fn().mockResolvedValue([agentFixture]),
    listPosts: vi.fn().mockResolvedValue([postFixture]),
    listHouses: vi.fn().mockResolvedValue([houseFixture]),
    getFavorites: vi.fn().mockResolvedValue(favoriteFixture),
    listAppointments: vi.fn().mockResolvedValue([appointmentFixture]),
    listNotifications: vi.fn().mockResolvedValue([notificationFixture]),
    getAdminMetrics: vi.fn().mockResolvedValue(adminMetricsFixture),
    getAgent: vi.fn().mockResolvedValue(agentFixture),
    getProject: vi.fn().mockResolvedValue(projectFixture),
    getPost: vi.fn().mockResolvedValue(postFixture),
    getHouse: vi.fn().mockResolvedValue(houseFixture),
    listReviews: vi.fn().mockResolvedValue([reviewFixture]),
    smartSearch: vi.fn().mockResolvedValue([projectFixture]),
    bookAppointment: vi.fn().mockResolvedValue(1n),
    addFavoriteProject: vi.fn().mockResolvedValue(undefined),
    removeFavoriteProject: vi.fn().mockResolvedValue(undefined),
    addFavoriteHouse: vi.fn().mockResolvedValue(undefined),
    removeFavoriteHouse: vi.fn().mockResolvedValue(undefined),
    addFavoriteHouseType: vi.fn().mockResolvedValue(undefined),
    removeFavoriteHouseType: vi.fn().mockResolvedValue(undefined),
    addFavoriteAgent: vi.fn().mockResolvedValue(undefined),
    removeFavoriteAgent: vi.fn().mockResolvedValue(undefined),
    addSavedPost: vi.fn().mockResolvedValue(undefined),
    removeSavedPost: vi.fn().mockResolvedValue(undefined),
    markNotificationRead: vi.fn().mockResolvedValue(undefined),
    addReview: vi.fn().mockResolvedValue(1n),
    likePost: vi.fn().mockResolvedValue(undefined),
    sharePost: vi.fn().mockResolvedValue(undefined),
    savePost: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
  return actor as unknown as Backend;
}
