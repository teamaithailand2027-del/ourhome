import Types "../types/common";

module {
  public type Post = {
    id : Nat;
    authorId : Types.UserId;
    image : ?Text;
    projectId : ?Nat;
    location : ?Types.Location;
    price : ?Nat;
    agentId : ?Nat;
    interestedCount : Nat;
    likeCount : Nat;
    commentCount : Nat;
    shareCount : Nat;
    saveCount : Nat;
    createdAt : Types.Timestamp;
  };
};
