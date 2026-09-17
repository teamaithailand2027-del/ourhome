import Map "mo:core/Map";
import ReviewTypes "../types/reviews";
import AgentTypes "../types/agents";
import ReviewsLib "../lib/reviews";

mixin (
  reviews : Map.Map<Nat, ReviewTypes.Review>,
  agents : Map.Map<Nat, AgentTypes.Agent>,
  state : { var nextReviewId : Nat },
) {
  public query func listReviews(agentId : Nat) : async [ReviewTypes.Review] {
    ReviewsLib.listReviews(reviews, agentId);
  };

  public shared ({ caller }) func addReview(review : ReviewTypes.Review) : async Nat {
    ignore caller;
    ReviewsLib.addReview(reviews, agents, state, review);
  };

  public shared ({ caller }) func reportReview(id : Nat) : async () {
    ignore caller;
    ReviewsLib.reportReview(reviews, id);
  };
};
