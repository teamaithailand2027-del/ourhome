import Map "mo:core/Map";
import PostTypes "../types/posts";
import PostsLib "../lib/posts";

mixin (
  posts : Map.Map<Nat, PostTypes.Post>,
  state : { var nextPostId : Nat },
) {
  public query func listPosts() : async [PostTypes.Post] {
    PostsLib.listPosts(posts)
  };

  public query func getPost(id : Nat) : async ?PostTypes.Post {
    PostsLib.getPost(posts, id)
  };

  public shared ({ caller }) func addPost(post : PostTypes.Post) : async Nat {
    ignore caller;
    PostsLib.addPost(posts, state, post)
  };

  public shared ({ caller }) func likePost(id : Nat) : async () {
    ignore caller;
    PostsLib.likePost(posts, id)
  };

  public shared ({ caller }) func commentPost(id : Nat) : async () {
    ignore caller;
    PostsLib.commentPost(posts, id)
  };

  public shared ({ caller }) func sharePost(id : Nat) : async () {
    ignore caller;
    PostsLib.sharePost(posts, id)
  };

  public shared ({ caller }) func savePost(id : Nat) : async () {
    ignore caller;
    PostsLib.savePost(posts, id)
  };
};
