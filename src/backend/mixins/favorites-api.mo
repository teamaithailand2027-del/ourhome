import Map "mo:core/Map";
import Principal "mo:core/Principal";
import FavoriteTypes "../types/favorites";
import FavoriteLib "../lib/favorites";

mixin (favorites : Map.Map<Principal, FavoriteTypes.Favorite>) {
  public query ({ caller }) func getFavorites() : async FavoriteTypes.Favorite {
    FavoriteLib.getFavorites(favorites, caller);
  };

  public shared ({ caller }) func addFavoriteProject(projectId : Nat) : async () {
    FavoriteLib.addProject(favorites, caller, projectId);
  };

  public shared ({ caller }) func removeFavoriteProject(projectId : Nat) : async () {
    FavoriteLib.removeProject(favorites, caller, projectId);
  };

  public shared ({ caller }) func addFavoriteHouse(houseId : Nat) : async () {
    FavoriteLib.addHouse(favorites, caller, houseId);
  };

  public shared ({ caller }) func removeFavoriteHouse(houseId : Nat) : async () {
    FavoriteLib.removeHouse(favorites, caller, houseId);
  };

  public shared ({ caller }) func addFavoriteHouseType(houseType : Text) : async () {
    FavoriteLib.addHouseType(favorites, caller, houseType);
  };

  public shared ({ caller }) func removeFavoriteHouseType(houseType : Text) : async () {
    FavoriteLib.removeHouseType(favorites, caller, houseType);
  };

  public shared ({ caller }) func addFavoriteAgent(agentId : Nat) : async () {
    FavoriteLib.addAgent(favorites, caller, agentId);
  };

  public shared ({ caller }) func removeFavoriteAgent(agentId : Nat) : async () {
    FavoriteLib.removeAgent(favorites, caller, agentId);
  };

  public shared ({ caller }) func addSavedPost(postId : Nat) : async () {
    FavoriteLib.addSavedPost(favorites, caller, postId);
  };

  public shared ({ caller }) func removeSavedPost(postId : Nat) : async () {
    FavoriteLib.removeSavedPost(favorites, caller, postId);
  };
};
