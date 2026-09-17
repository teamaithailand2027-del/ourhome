import Map "mo:core/Map";
import ProjectTypes "../types/projects";
import HouseTypes "../types/houses";
import ProjectsLib "../lib/projects";

mixin (
  projects : Map.Map<Nat, ProjectTypes.Project>,
  houses : Map.Map<Nat, HouseTypes.House>,
  state : { var nextProjectId : Nat },
) {
  public query func listProjects(filter : ProjectTypes.ProjectFilter) : async [ProjectTypes.Project] {
    ProjectsLib.listProjects(projects, houses, filter);
  };

  public query func getProject(id : Nat) : async ?ProjectTypes.Project {
    ProjectsLib.getProject(projects, id);
  };

  public query func smartSearch(q : Text) : async [ProjectTypes.Project] {
    ProjectsLib.smartSearch(projects, q);
  };

  public shared ({ caller }) func addProject(project : ProjectTypes.Project) : async Nat {
    ignore caller;
    ProjectsLib.addProject(projects, state, project);
  };

  public shared ({ caller }) func updateProject(project : ProjectTypes.Project) : async () {
    ignore caller;
    ProjectsLib.updateProject(projects, project);
  };

  public shared ({ caller }) func deleteProject(id : Nat) : async () {
    ignore caller;
    ProjectsLib.deleteProject(projects, id);
  };
};
