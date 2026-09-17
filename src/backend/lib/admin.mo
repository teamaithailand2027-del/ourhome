import Map "mo:core/Map";
import AccessControl "mo:caffeineai-authorization/access-control";

import AdminTypes "../types/admin";
import ProjectTypes "../types/projects";
import HouseTypes "../types/houses";
import AgentTypes "../types/agents";
import PostTypes "../types/posts";
import AppointmentTypes "../types/appointments";

module {
  public func getAdminMetrics(
    accessControlState : AccessControl.AccessControlState,
    projects : Map.Map<Nat, ProjectTypes.Project>,
    houses : Map.Map<Nat, HouseTypes.House>,
    agents : Map.Map<Nat, AgentTypes.Agent>,
    posts : Map.Map<Nat, PostTypes.Post>,
    appointments : Map.Map<Nat, AppointmentTypes.Appointment>,
  ) : AdminTypes.AdminMetrics {
    var customers = 0;
    for ((_, role) in accessControlState.userRoles.entries()) {
      if (role == #user) { customers += 1 };
    };
    {
      members = accessControlState.userRoles.size();
      customers;
      agents = agents.size();
      projects = projects.size();
      houses = houses.size();
      leads = 0;
      appointments = appointments.size();
      posts = posts.size();
      liveViewers = 0;
      conversions = 0;
    };
  };
};
