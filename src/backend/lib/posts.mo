import Map "mo:core/Map";
import PostTypes "../types/posts";

module {
  public func listPosts(posts : Map.Map<Nat, PostTypes.Post>) : [PostTypes.Post] {
    posts.values().toArray()
  };

  public func getPost(posts : Map.Map<Nat, PostTypes.Post>, id : Nat) : ?PostTypes.Post {
    posts.get(id)
  };

  public func addPost(posts : Map.Map<Nat, PostTypes.Post>, state : { var nextPostId : Nat }, post : PostTypes.Post) : Nat {
    let id = state.nextPostId;
    state.nextPostId += 1;
    posts.add(id, { post with id = id });
    id
  };

  public func likePost(posts : Map.Map<Nat, PostTypes.Post>, id : Nat) : () {
    switch (posts.get(id)) {
      case (?post) {
        posts.add(id, { post with likeCount = post.likeCount + 1 });
      };
      case null {};
    };
  };

  public func commentPost(posts : Map.Map<Nat, PostTypes.Post>, id : Nat) : () {
    switch (posts.get(id)) {
      case (?post) {
        posts.add(id, { post with commentCount = post.commentCount + 1 });
      };
      case null {};
    };
  };

  public func sharePost(posts : Map.Map<Nat, PostTypes.Post>, id : Nat) : () {
    switch (posts.get(id)) {
      case (?post) {
        posts.add(id, { post with shareCount = post.shareCount + 1 });
      };
      case null {};
    };
  };

  public func savePost(posts : Map.Map<Nat, PostTypes.Post>, id : Nat) : () {
    switch (posts.get(id)) {
      case (?post) {
        posts.add(id, { post with saveCount = post.saveCount + 1 });
      };
      case null {};
    };
  };
};
