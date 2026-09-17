import FavoriteTypes "../types/favorites";
import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";

module {
  public func getFavorites(favorites : Map.Map<Principal, FavoriteTypes.Favorite>, userId : Principal) : FavoriteTypes.Favorite {
    switch (favorites.get(userId)) {
      case (?f) f;
      case null {
        { userId; projects = []; houses = []; houseTypes = []; agents = []; savedPosts = [] };
      };
    };
  };

  public func addProject(favorites : Map.Map<Principal, FavoriteTypes.Favorite>, userId : Principal, projectId : Nat) : () {
    let fav = getFavorites(favorites, userId);
    if (not fav.projects.contains(projectId)) {
      favorites.add(userId, { fav with projects = fav.projects.concat([projectId]) });
    };
  };

  public func removeProject(favorites : Map.Map<Principal, FavoriteTypes.Favorite>, userId : Principal, projectId : Nat) : () {
    let fav = getFavorites(favorites, userId);
    favorites.add(userId, { fav with projects = fav.projects.filter(func p = p != projectId) });
  };

  public func addHouse(favorites : Map.Map<Principal, FavoriteTypes.Favorite>, userId : Principal, houseId : Nat) : () {
    let fav = getFavorites(favorites, userId);
    if (not fav.houses.contains(houseId)) {
      favorites.add(userId, { fav with houses = fav.houses.concat([houseId]) });
    };
  };

  public func removeHouse(favorites : Map.Map<Principal, FavoriteTypes.Favorite>, userId : Principal, houseId : Nat) : () {
    let fav = getFavorites(favorites, userId);
    favorites.add(userId, { fav with houses = fav.houses.filter(func h = h != houseId) });
  };

  public func addHouseType(favorites : Map.Map<Principal, FavoriteTypes.Favorite>, userId : Principal, houseType : Text) : () {
    let fav = getFavorites(favorites, userId);
    if (not fav.houseTypes.contains(houseType)) {
      favorites.add(userId, { fav with houseTypes = fav.houseTypes.concat([houseType]) });
    };
  };

  public func removeHouseType(favorites : Map.Map<Principal, FavoriteTypes.Favorite>, userId : Principal, houseType : Text) : () {
    let fav = getFavorites(favorites, userId);
    favorites.add(userId, { fav with houseTypes = fav.houseTypes.filter(func t = t != houseType) });
  };

  public func addAgent(favorites : Map.Map<Principal, FavoriteTypes.Favorite>, userId : Principal, agentId : Nat) : () {
    let fav = getFavorites(favorites, userId);
    if (not fav.agents.contains(agentId)) {
      favorites.add(userId, { fav with agents = fav.agents.concat([agentId]) });
    };
  };

  public func removeAgent(favorites : Map.Map<Principal, FavoriteTypes.Favorite>, userId : Principal, agentId : Nat) : () {
    let fav = getFavorites(favorites, userId);
    favorites.add(userId, { fav with agents = fav.agents.filter(func a = a != agentId) });
  };

  public func addSavedPost(favorites : Map.Map<Principal, FavoriteTypes.Favorite>, userId : Principal, postId : Nat) : () {
    let fav = getFavorites(favorites, userId);
    if (not fav.savedPosts.contains(postId)) {
      favorites.add(userId, { fav with savedPosts = fav.savedPosts.concat([postId]) });
    };
  };

  public func removeSavedPost(favorites : Map.Map<Principal, FavoriteTypes.Favorite>, userId : Principal, postId : Nat) : () {
    let fav = getFavorites(favorites, userId);
    favorites.add(userId, { fav with savedPosts = fav.savedPosts.filter(func p = p != postId) });
  };
};
