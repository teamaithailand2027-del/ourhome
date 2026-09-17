import Types "../types/common";

module {
  public type Review = {
    id : Nat;
    agentId : Nat;
    reviewerId : Types.UserId;
    rating : Nat;
    categories : Types.RatingCategory;
    comment : Text;
    createdAt : Types.Timestamp;
    reported : Bool;
  };
};
