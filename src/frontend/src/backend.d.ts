import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Location {
    province: string;
    district: string;
    subDistrict: string;
}
export type Timestamp = bigint;
export interface Coordinates {
    lat: number;
    lng: number;
}
export type Result__1 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: Error_;
};
export interface RatingCategory {
    service: bigint;
    trust: bigint;
    info: bigint;
    followUp: bigint;
    speed: bigint;
    politeness: bigint;
}
export interface Favorite {
    projects: Array<bigint>;
    userId: UserId;
    agents: Array<bigint>;
    savedPosts: Array<bigint>;
    houseTypes: Array<string>;
    houses: Array<bigint>;
}
export type Error_ = {
    __kind__: "FrontendOriginsNotConfigured";
    FrontendOriginsNotConfigured: null;
} | {
    __kind__: "MixedSsoSources";
    MixedSsoSources: {
        otherKeys: Array<string>;
        ssoKeys: Array<string>;
    };
} | {
    __kind__: "Stale";
    Stale: {
        ageNs: bigint;
    };
} | {
    __kind__: "MalformedCandid";
    MalformedCandid: null;
} | {
    __kind__: "AmbiguousAttribute";
    AmbiguousAttribute: {
        field: string;
        sources: Array<string>;
    };
} | {
    __kind__: "NoAttributes";
    NoAttributes: null;
} | {
    __kind__: "UnknownNonce";
    UnknownNonce: null;
} | {
    __kind__: "UntrustedSsoSource";
    UntrustedSsoSource: {
        domain: string;
    };
} | {
    __kind__: "MissingField";
    MissingField: string;
} | {
    __kind__: "FrontendOriginMismatch";
    FrontendOriginMismatch: {
        got: string;
        expected: Array<string>;
    };
};
export interface Agent {
    id: bigint;
    portfolio: Array<string>;
    serviceArea: string;
    ratingCategories: RatingCategory;
    listedHomes: Array<bigint>;
    verified: boolean;
    userId: UserId;
    managedProjects: Array<bigint>;
    name: string;
    agentCode: string;
    experience: bigint;
    customerCount: bigint;
    rating: number;
    photo?: string;
    reviewCount: bigint;
}
export type UserId = Principal;
export interface Result {
    hasMore: boolean;
    rows: Array<Array<Cell>>;
}
export interface AdminMetrics {
    members: bigint;
    projects: bigint;
    agents: bigint;
    leads: bigint;
    liveViewers: bigint;
    appointments: bigint;
    conversions: bigint;
    posts: bigint;
    houses: bigint;
    customers: bigint;
}
export interface Post {
    id: bigint;
    likeCount: bigint;
    authorId: UserId;
    createdAt: Timestamp;
    agentId?: bigint;
    interestedCount: bigint;
    shareCount: bigint;
    projectId?: bigint;
    commentCount: bigint;
    image?: string;
    price?: bigint;
    saveCount: bigint;
    location?: Location;
}
export interface ProjectFilter {
    province?: string;
    newProject?: boolean;
    bedrooms?: bigint;
    name?: string;
    maxPrice?: bigint;
    district?: string;
    promotion?: boolean;
    usableArea?: bigint;
    minPrice?: bigint;
    houseType?: string;
    readyToMove?: boolean;
    location?: string;
}
export interface Notification {
    id: bigint;
    userId: UserId;
    createdAt: Timestamp;
    read: boolean;
    message: string;
}
export interface Cell {
    value: Value;
    name: string;
}
export interface House {
    id: bigint;
    status: HouseStatus;
    bedrooms: bigint;
    video?: string;
    floorPlan?: string;
    projectId: bigint;
    usableArea: bigint;
    bathrooms: bigint;
    price: bigint;
    houseType: string;
    parking: bigint;
    gallery: Array<string>;
}
export type Value = {
    __kind__: "int";
    int: bigint;
} | {
    __kind__: "nat";
    nat: bigint;
} | {
    __kind__: "float";
    float: number;
} | {
    __kind__: "bool";
    bool: boolean;
} | {
    __kind__: "null";
    null: null;
} | {
    __kind__: "text";
    text: string;
};
export interface Project {
    id: bigint;
    promotions: Array<string>;
    startingPrice: bigint;
    unitStatus: UnitStatus;
    reviewRating: number;
    video?: string;
    name: string;
    unitCount: bigint;
    createdAt: Timestamp;
    houseTypes: Array<string>;
    projectStatus: ProjectStatus;
    location: Location;
    verificationStatus: VerificationStatus;
    coordinates: Coordinates;
    images: Array<string>;
}
export interface Review {
    id: bigint;
    categories: RatingCategory;
    createdAt: Timestamp;
    agentId: bigint;
    reviewerId: UserId;
    comment: string;
    rating: bigint;
    reported: boolean;
}
export interface Appointment {
    id: bigint;
    status: AppointmentStatus;
    visitors: bigint;
    userId: UserId;
    date: Timestamp;
    name: string;
    time: Timestamp;
    agentId?: bigint;
    projectId: bigint;
    phone: string;
    houseType?: string;
    houseId?: bigint;
}
export enum AppointmentStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum HouseStatus {
    underConstruction = "underConstruction",
    readyToMove = "readyToMove"
}
export enum ProjectStatus {
    new_ = "new",
    completed = "completed",
    ongoing = "ongoing"
}
export enum UnitStatus {
    sold = "sold",
    reserved = "reserved",
    available = "available"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VerificationStatus {
    verified = "verified",
    none = "none",
    official = "official"
}
export interface backendInterface {
    addAgent(agent: Agent): Promise<bigint>;
    addFavoriteAgent(agentId: bigint): Promise<void>;
    addFavoriteHouse(houseId: bigint): Promise<void>;
    addFavoriteHouseType(houseType: string): Promise<void>;
    addFavoriteProject(projectId: bigint): Promise<void>;
    addHouse(house: House): Promise<bigint>;
    addPost(post: Post): Promise<bigint>;
    addProject(project: Project): Promise<bigint>;
    addReview(review: Review): Promise<bigint>;
    addSavedPost(postId: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookAppointment(appointment: Appointment): Promise<bigint>;
    cancelAppointment(id: bigint): Promise<void>;
    commentPost(id: bigint): Promise<void>;
    confirmAppointment(id: bigint): Promise<void>;
    deleteAgent(id: bigint): Promise<void>;
    deleteHouse(id: bigint): Promise<void>;
    deleteProject(id: bigint): Promise<void>;
    execute(qJson: string): Promise<Result>;
    getAdminMetrics(): Promise<AdminMetrics>;
    getAgent(id: bigint): Promise<Agent | null>;
    getApiDoc(): Promise<string>;
    getAppointment(id: bigint): Promise<Appointment | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFavorites(): Promise<Favorite>;
    getHouse(id: bigint): Promise<House | null>;
    getPost(id: bigint): Promise<Post | null>;
    getProject(id: bigint): Promise<Project | null>;
    isCallerAdmin(): Promise<boolean>;
    likePost(id: bigint): Promise<void>;
    listAgents(): Promise<Array<Agent>>;
    listAppointments(): Promise<Array<Appointment>>;
    listHouses(projectId: bigint | null): Promise<Array<House>>;
    listNotifications(): Promise<Array<Notification>>;
    listPosts(): Promise<Array<Post>>;
    listProjects(filter: ProjectFilter): Promise<Array<Project>>;
    listReviews(agentId: bigint): Promise<Array<Review>>;
    markNotificationRead(id: bigint): Promise<void>;
    removeFavoriteAgent(agentId: bigint): Promise<void>;
    removeFavoriteHouse(houseId: bigint): Promise<void>;
    removeFavoriteHouseType(houseType: string): Promise<void>;
    removeFavoriteProject(projectId: bigint): Promise<void>;
    removeSavedPost(postId: bigint): Promise<void>;
    reportReview(id: bigint): Promise<void>;
    savePost(id: bigint): Promise<void>;
    schema(): Promise<string>;
    sharePost(id: bigint): Promise<void>;
    smartSearch(q: string): Promise<Array<Project>>;
    updateAgent(agent: Agent): Promise<void>;
    updateHouse(house: House): Promise<void>;
    updateProject(project: Project): Promise<void>;
}
