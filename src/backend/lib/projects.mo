import Array "mo:core/Array";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import ProjectTypes "../types/projects";
import HouseTypes "../types/houses";

module {
  let houseTypeKeywords = ["บ้านเดี่ยว", "บ้านแฝด", "ทาวน์โฮม", "ทาวน์เฮาส์", "บ้านชั้นเดียว", "บ้านสองชั้น"];

  func parseHouseType(q : Text) : ?Text {
    for (kw in houseTypeKeywords.values()) {
      if (q.contains(#text kw)) { return ?kw };
    };
    null;
  };

  func parseBudget(q : Text) : ?Nat {
    let chars = q.toArray();
    let n = chars.size();
    var i = 0;
    while (i < n) {
      if (chars[i].isDigit()) {
        var j = i;
        var num = 0;
        while (j < n and chars[j].isDigit()) {
          num := num * 10 + (chars[j].toNat32() - 48).toNat();
          j += 1;
        };
        let rest = Text.fromArray(chars.sliceToArray(j.toInt(), n.toInt())).trimStart(#text " ");
        if (rest.startsWith(#text "ล้าน")) { return ?(num * 1000000) };
        if (rest.startsWith(#text "แสน")) { return ?(num * 100000) };
        i := j;
      } else {
        i += 1;
      };
    };
    null;
  };

  func locationMatches(p : ProjectTypes.Project, q : Text) : Bool {
    q.contains(#text (p.location.province.toLower()))
    or q.contains(#text (p.location.district.toLower()))
    or q.contains(#text (p.location.subDistrict.toLower()));
  };
  func hasHouse(
    houses : Map.Map<Nat, HouseTypes.House>,
    projectId : Nat,
    pred : HouseTypes.House -> Bool,
  ) : Bool {
    houses.values().toArray().any(func h = h.projectId == projectId and pred(h));
  };

  func matches(
    houses : Map.Map<Nat, HouseTypes.House>,
    p : ProjectTypes.Project,
    f : ProjectTypes.ProjectFilter,
  ) : Bool {
    switch (f.name) {
      case (?name) {
        if (not p.name.toLower().contains(#text (name.toLower()))) { return false };
      };
      case null {};
    };
    switch (f.province) {
      case (?prov) {
        if (p.location.province.toLower() != prov.toLower()) { return false };
      };
      case null {};
    };
    switch (f.district) {
      case (?dist) {
        if (p.location.district.toLower() != dist.toLower()) { return false };
      };
      case null {};
    };
    switch (f.location) {
      case (?loc) {
        let q = loc.toLower();
        let inProv = p.location.province.toLower().contains(#text q);
        let inDist = p.location.district.toLower().contains(#text q);
        let inSub = p.location.subDistrict.toLower().contains(#text q);
        if (not (inProv or inDist or inSub)) { return false };
      };
      case null {};
    };
    switch (f.minPrice) {
      case (?min) { if (p.startingPrice < min) { return false } };
      case null {};
    };
    switch (f.maxPrice) {
      case (?max) { if (p.startingPrice > max) { return false } };
      case null {};
    };
    switch (f.houseType) {
      case (?ht) {
        if (not p.houseTypes.any(func t = t.toLower() == ht.toLower())) { return false };
      };
      case null {};
    };
    switch (f.bedrooms) {
      case (?b) {
        if (not hasHouse(houses, p.id, func h = h.bedrooms == b)) { return false };
      };
      case null {};
    };
    switch (f.usableArea) {
      case (?ua) {
        if (not hasHouse(houses, p.id, func h = h.usableArea >= ua)) { return false };
      };
      case null {};
    };
    switch (f.readyToMove) {
      case (?rtm) {
        if (rtm and not hasHouse(houses, p.id, func h = h.status == #readyToMove)) { return false };
      };
      case null {};
    };
    switch (f.newProject) {
      case (?np) {
        if (np and p.projectStatus != #new) { return false };
      };
      case null {};
    };
    switch (f.promotion) {
      case (?promo) {
        if (promo and p.promotions.size() == 0) { return false };
      };
      case null {};
    };
    true;
  };

  public func listProjects(
    projects : Map.Map<Nat, ProjectTypes.Project>,
    houses : Map.Map<Nat, HouseTypes.House>,
    filter : ProjectTypes.ProjectFilter,
  ) : [ProjectTypes.Project] {
    projects.values().toArray().filter(func p = matches(houses, p, filter));
  };

  public func getProject(projects : Map.Map<Nat, ProjectTypes.Project>, id : Nat) : ?ProjectTypes.Project {
    projects.get(id);
  };

  public func addProject(
    projects : Map.Map<Nat, ProjectTypes.Project>,
    state : { var nextProjectId : Nat },
    project : ProjectTypes.Project,
  ) : Nat {
    let id = state.nextProjectId;
    state.nextProjectId += 1;
    projects.add(id, { project with id = id; createdAt = Time.now() });
    id;
  };

  public func updateProject(
    projects : Map.Map<Nat, ProjectTypes.Project>,
    project : ProjectTypes.Project,
  ) : () {
    projects.add(project.id, project);
  };

  public func deleteProject(projects : Map.Map<Nat, ProjectTypes.Project>, id : Nat) : () {
    projects.remove(id);
  };

  public func smartSearch(
    projects : Map.Map<Nat, ProjectTypes.Project>,
    q : Text,
  ) : [ProjectTypes.Project] {
    let ql = q.toLower();
    let budget = parseBudget(ql);
    let houseType = parseHouseType(ql);
    let all = projects.values().toArray();
    let hasLocation = all.any(func p = locationMatches(p, ql));
    all.filter(func(p) {
      let locOk = not hasLocation or locationMatches(p, ql);
      let typeOk = switch (houseType) {
        case (?ht) p.houseTypes.any(func t = t.toLower() == ht);
        case null true;
      };
      let priceOk = switch (budget) {
        case (?max) p.startingPrice <= max;
        case null true;
      };
      locOk and typeOk and priceOk
    });
  };
};
