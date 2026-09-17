import Types "../types/common";

module {
  public type Agent = {
    id : Nat;
    userId : Types.UserId;
    photo : ?Text;
    name : Text;
    agentCode : Text;
    serviceArea : Text;
    experience : Nat;
    managedProjects : [Nat];
    listedHomes : [Nat];
    portfolio : [Text];
    customerCount : Nat;
    rating : Float;
    reviewCount : Nat;
    verified : Bool;
    ratingCategories : Types.RatingCategory;
  };
};
