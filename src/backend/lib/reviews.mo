import Map "mo:core/Map";
import Time "mo:core/Time";
import ReviewTypes "../types/reviews";
import AgentTypes "../types/agents";

module {
  func updateAgentRating(
    reviews : Map.Map<Nat, ReviewTypes.Review>,
    agents : Map.Map<Nat, AgentTypes.Agent>,
    agentId : Nat,
  ) {
    let agentReviews = reviews.values().toArray().filter(func r = r.agentId == agentId);
    let count = agentReviews.size();
    switch (agents.get(agentId)) {
      case (?agent) {
        if (count == 0) {
          agents.add(
            agentId,
            {
              agent with
              rating = 0.0;
              reviewCount = 0;
              ratingCategories = { trust = 0; info = 0; service = 0; followUp = 0; politeness = 0; speed = 0 };
            },
          );
        } else {
          var sumRating = 0;
          var sumTrust = 0;
          var sumInfo = 0;
          var sumService = 0;
          var sumFollowUp = 0;
          var sumPoliteness = 0;
          var sumSpeed = 0;
          for (r in agentReviews.values()) {
            sumRating += r.rating;
            sumTrust += r.categories.trust;
            sumInfo += r.categories.info;
            sumService += r.categories.service;
            sumFollowUp += r.categories.followUp;
            sumPoliteness += r.categories.politeness;
            sumSpeed += r.categories.speed;
          };
          let n = count.toFloat();
          agents.add(
            agentId,
            {
              agent with
              rating = sumRating.toFloat() / n;
              reviewCount = count;
              ratingCategories = {
                trust = sumTrust / count;
                info = sumInfo / count;
                service = sumService / count;
                followUp = sumFollowUp / count;
                politeness = sumPoliteness / count;
                speed = sumSpeed / count;
              };
            },
          );
        };
      };
      case null {};
    };
  };

  public func listReviews(reviews : Map.Map<Nat, ReviewTypes.Review>, agentId : Nat) : [ReviewTypes.Review] {
    reviews.values().toArray().filter(func r = r.agentId == agentId);
  };

  public func addReview(
    reviews : Map.Map<Nat, ReviewTypes.Review>,
    agents : Map.Map<Nat, AgentTypes.Agent>,
    state : { var nextReviewId : Nat },
    review : ReviewTypes.Review,
  ) : Nat {
    // Prevent duplicate reviews: one review per reviewer per agent.
    let existing = reviews.values().toArray().find(
      func r = r.agentId == review.agentId and r.reviewerId == review.reviewerId
    );
    switch (existing) {
      case (?r) { return r.id };
      case null {};
    };
    let id = state.nextReviewId;
    state.nextReviewId += 1;
    reviews.add(id, { review with id = id; createdAt = Time.now() });
    updateAgentRating(reviews, agents, review.agentId);
    id;
  };

  public func reportReview(reviews : Map.Map<Nat, ReviewTypes.Review>, id : Nat) : () {
    switch (reviews.get(id)) {
      case (?r) { reviews.add(id, { r with reported = true }) };
      case null {};
    };
  };
};
