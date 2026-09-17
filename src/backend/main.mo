import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import PrincipalValue "mo:caffeineai-oql/PrincipalValue";
import BoolValue "mo:caffeineai-oql/BoolValue";
import IntValue "mo:caffeineai-oql/IntValue";
import FloatValue "mo:caffeineai-oql/FloatValue";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

import ProjectTypes "types/projects";
import HouseTypes "types/houses";
import AgentTypes "types/agents";
import ReviewTypes "types/reviews";
import PostTypes "types/posts";
import FavoriteTypes "types/favorites";
import AppointmentTypes "types/appointments";
import NotificationTypes "types/notifications";

import ProjectsApi "mixins/projects-api";
import HousesApi "mixins/houses-api";
import AgentsApi "mixins/agents-api";
import ReviewsApi "mixins/reviews-api";
import PostsApi "mixins/posts-api";
import FavoritesApi "mixins/favorites-api";
import AppointmentsApi "mixins/appointments-api";
import NotificationsApi "mixins/notifications-api";
import AdminApi "mixins/admin-api";
import ApiDocMixin "mixins/api-doc";

actor {
  let accessControlState : AccessControl.AccessControlState;

  let projects : Map.Map<Nat, ProjectTypes.Project>;
  let houses : Map.Map<Nat, HouseTypes.House>;
  let agents : Map.Map<Nat, AgentTypes.Agent>;
  let reviews : Map.Map<Nat, ReviewTypes.Review>;
  let posts : Map.Map<Nat, PostTypes.Post>;
  let favorites : Map.Map<Principal, FavoriteTypes.Favorite>;
  let appointments : Map.Map<Nat, AppointmentTypes.Appointment>;
  let notifications : Map.Map<Nat, NotificationTypes.Notification>;

  let state : {
    var nextProjectId : Nat;
    var nextHouseId : Nat;
    var nextAgentId : Nat;
    var nextReviewId : Nat;
    var nextPostId : Nat;
    var nextAppointmentId : Nat;
    var nextNotificationId : Nat;
  };

  // Sample owner principal used only to seed OQL schema discovery; the value
  // is ignored at query time.
  transient let anyP = Principal.fromText("aaaaa-aa");

  include MixinAuthorization(accessControlState, null);
  include Expose({
    entities = [
      // project — public catalogue
      Entity.manual<(Nat, ProjectTypes.Project)>(
        "project",
        func () = projects.entries(),
        "Project",
        "id",
      )
      .sample((
        0,
        {
          id = 0;
          name = "";
          location = { province = ""; district = ""; subDistrict = "" };
          startingPrice = 0;
          houseTypes = [];
          promotions = [];
          images = [];
          video = null;
          coordinates = { lat = 0.0; lng = 0.0 };
          unitCount = 0;
          unitStatus = #available;
          projectStatus = #new;
          reviewRating = 0.0;
          verificationStatus = #none;
          createdAt = 0;
        },
      ))
      .payload("id", func ((_, p)) = p.id)
      .payload("name", func ((_, p)) = p.name)
      .payload("province", func ((_, p)) = p.location.province)
      .payload("district", func ((_, p)) = p.location.district)
      .payload("startingPrice", func ((_, p)) = p.startingPrice)
      .payload("unitCount", func ((_, p)) = p.unitCount)
      .payload("reviewRating", func ((_, p)) = p.reviewRating)
      .payload(
        "projectStatus",
        func ((_, p)) = switch (p.projectStatus) {
          case (#new) "new";
          case (#ongoing) "ongoing";
          case (#completed) "completed";
        },
      )
      .payload(
        "verificationStatus",
        func ((_, p)) = switch (p.verificationStatus) {
          case (#none) "none";
          case (#verified) "verified";
          case (#official) "official";
        },
      )
      .public_()
      .build(),

      // house — public catalogue
      Entity.manual<(Nat, HouseTypes.House)>(
        "house",
        func () = houses.entries(),
        "House",
        "id",
      )
      .sample((
        0,
        {
          id = 0;
          projectId = 0;
          houseType = "";
          usableArea = 0;
          bedrooms = 0;
          bathrooms = 0;
          parking = 0;
          price = 0;
          floorPlan = null;
          gallery = [];
          video = null;
          status = #readyToMove;
        },
      ))
      .payload("id", func ((_, h)) = h.id)
      .payload("projectId", func ((_, h)) = h.projectId).edge("projectId", "project")
      .payload("houseType", func ((_, h)) = h.houseType)
      .payload("usableArea", func ((_, h)) = h.usableArea)
      .payload("bedrooms", func ((_, h)) = h.bedrooms)
      .payload("bathrooms", func ((_, h)) = h.bathrooms)
      .payload("parking", func ((_, h)) = h.parking)
      .payload("price", func ((_, h)) = h.price)
      .payload(
        "status",
        func ((_, h)) = switch (h.status) {
          case (#readyToMove) "readyToMove";
          case (#underConstruction) "underConstruction";
        },
      )
      .public_()
      .build(),

      // agent — public directory
      Entity.manual<(Nat, AgentTypes.Agent)>(
        "agent",
        func () = agents.entries(),
        "Agent",
        "id",
      )
      .sample((
        0,
        {
          id = 0;
          userId = anyP;
          photo = null;
          name = "";
          agentCode = "";
          serviceArea = "";
          experience = 0;
          managedProjects = [];
          listedHomes = [];
          portfolio = [];
          customerCount = 0;
          rating = 0.0;
          reviewCount = 0;
          verified = false;
          ratingCategories = { trust = 0; info = 0; service = 0; followUp = 0; politeness = 0; speed = 0 };
        },
      ))
      .payload("id", func ((_, a)) = a.id)
      .payload("name", func ((_, a)) = a.name)
      .payload("agentCode", func ((_, a)) = a.agentCode)
      .payload("serviceArea", func ((_, a)) = a.serviceArea)
      .payload("experience", func ((_, a)) = a.experience)
      .payload("customerCount", func ((_, a)) = a.customerCount)
      .payload("rating", func ((_, a)) = a.rating)
      .payload("reviewCount", func ((_, a)) = a.reviewCount)
      .payload("verified", func ((_, a)) = a.verified)
      .public_()
      .build(),

      // review — public
      Entity.manual<(Nat, ReviewTypes.Review)>(
        "review",
        func () = reviews.entries(),
        "Review",
        "id",
      )
      .sample((
        0,
        {
          id = 0;
          agentId = 0;
          reviewerId = anyP;
          rating = 0;
          categories = { trust = 0; info = 0; service = 0; followUp = 0; politeness = 0; speed = 0 };
          comment = "";
          createdAt = 0;
          reported = false;
        },
      ))
      .payload("id", func ((_, r)) = r.id)
      .payload("agentId", func ((_, r)) = r.agentId).edge("agentId", "agent")
      .payload("rating", func ((_, r)) = r.rating)
      .payload("comment", func ((_, r)) = r.comment)
      .payload("createdAt", func ((_, r)) = r.createdAt)
      .payload("reported", func ((_, r)) = r.reported)
      .public_()
      .build(),

      // post — public feed
      Entity.manual<(Nat, PostTypes.Post)>(
        "post",
        func () = posts.entries(),
        "Post",
        "id",
      )
      .sample((
        0,
        {
          id = 0;
          authorId = anyP;
          image = null;
          projectId = null;
          location = null;
          price = null;
          agentId = null;
          interestedCount = 0;
          likeCount = 0;
          commentCount = 0;
          shareCount = 0;
          saveCount = 0;
          createdAt = 0;
        },
      ))
      .payload("id", func ((_, p)) = p.id)
      .payload("projectId", func ((_, p)) = p.projectId ?? 0).edge("projectId", "project")
      .payload("price", func ((_, p)) = p.price ?? 0)
      .payload("interestedCount", func ((_, p)) = p.interestedCount)
      .payload("likeCount", func ((_, p)) = p.likeCount)
      .payload("commentCount", func ((_, p)) = p.commentCount)
      .payload("shareCount", func ((_, p)) = p.shareCount)
      .payload("saveCount", func ((_, p)) = p.saveCount)
      .payload("createdAt", func ((_, p)) = p.createdAt)
      .public_()
      .build(),

      // favorite — per-user; each signed-in caller sees only their own rows
      Entity.manual<(Principal, FavoriteTypes.Favorite)>(
        "favorite",
        func () = favorites.entries(),
        "Favorite",
        "userId",
      )
      .sample((
        anyP,
        { userId = anyP; projects = []; houses = []; houseTypes = []; agents = []; savedPosts = [] },
      ))
      .payload("userId", func ((_, f)) = f.userId)
      .payload("projectCount", func ((_, f)) = f.projects.size())
      .payload("houseCount", func ((_, f)) = f.houses.size())
      .payload("agentCount", func ((_, f)) = f.agents.size())
      .payload("savedPostCount", func ((_, f)) = f.savedPosts.size())
      .ownedBy("userId")
      .controllerOrScoped()
      .build(),

      // appointment — per-user; each signed-in caller sees only their own rows
      Entity.manual<(Nat, AppointmentTypes.Appointment)>(
        "appointment",
        func () = appointments.entries(),
        "Appointment",
        "id",
      )
      .sample((
        0,
        {
          id = 0;
          userId = anyP;
          projectId = 0;
          houseId = null;
          houseType = null;
          date = 0;
          time = 0;
          visitors = 0;
          agentId = null;
          name = "";
          phone = "";
          status = #pending;
        },
      ))
      .payload("id", func ((_, a)) = a.id)
      .payload("userId", func ((_, a)) = a.userId)
      .payload("projectId", func ((_, a)) = a.projectId).edge("projectId", "project")
      .payload("date", func ((_, a)) = a.date)
      .payload("visitors", func ((_, a)) = a.visitors)
      .payload(
        "status",
        func ((_, a)) = switch (a.status) {
          case (#pending) "pending";
          case (#confirmed) "confirmed";
          case (#cancelled) "cancelled";
          case (#completed) "completed";
        },
      )
      .ownedBy("userId")
      .controllerOrScoped()
      .build(),

      // notification — per-user; each signed-in caller sees only their own rows
      Entity.manual<(Nat, NotificationTypes.Notification)>(
        "notification",
        func () = notifications.entries(),
        "Notification",
        "id",
      )
      .sample((
        0,
        { id = 0; userId = anyP; message = ""; createdAt = 0; read = false },
      ))
      .payload("id", func ((_, n)) = n.id)
      .payload("userId", func ((_, n)) = n.userId)
      .payload("message", func ((_, n)) = n.message)
      .payload("createdAt", func ((_, n)) = n.createdAt)
      .payload("read", func ((_, n)) = n.read)
      .ownedBy("userId")
      .controllerOrScoped()
      .build(),
    ];
  });
  include ProjectsApi(projects, houses, state);
  include HousesApi(houses, state);
  include AgentsApi(agents, state);
  include ReviewsApi(reviews, agents, state);
  include PostsApi(posts, state);
  include FavoritesApi(favorites);
  include AppointmentsApi(appointments, state, notifications, state);
  include NotificationsApi(notifications, state);
  include AdminApi(accessControlState, projects, houses, agents, posts, appointments);
  include ApiDocMixin();
};
