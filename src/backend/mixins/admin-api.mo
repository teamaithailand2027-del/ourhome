import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";

import AdminTypes "../types/admin";
import ProjectTypes "../types/projects";
import HouseTypes "../types/houses";
import AgentTypes "../types/agents";
import PostTypes "../types/posts";
import AppointmentTypes "../types/appointments";
import AdminLib "../lib/admin";

mixin (
  accessControlState : AccessControl.AccessControlState,
  projects : Map.Map<Nat, ProjectTypes.Project>,
  houses : Map.Map<Nat, HouseTypes.House>,
  agents : Map.Map<Nat, AgentTypes.Agent>,
  posts : Map.Map<Nat, PostTypes.Post>,
  appointments : Map.Map<Nat, AppointmentTypes.Appointment>,
) {
  public query func getAdminMetrics() : async AdminTypes.AdminMetrics {
    AdminLib.getAdminMetrics(accessControlState, projects, houses, agents, posts, appointments);
  };
};
