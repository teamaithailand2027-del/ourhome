import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  type OldActor = {};

  type Location = {
    province : Text;
    district : Text;
    subDistrict : Text;
  };

  type Coordinates = {
    lat : Float;
    lng : Float;
  };

  type RatingCategory = {
    trust : Nat;
    info : Nat;
    service : Nat;
    followUp : Nat;
    politeness : Nat;
    speed : Nat;
  };

  type VerificationStatus = {
    #none;
    #verified;
    #official;
  };

  type ProjectStatus = {
    #new;
    #ongoing;
    #completed;
  };

  type UnitStatus = {
    #available;
    #reserved;
    #sold;
  };

  type HouseStatus = {
    #readyToMove;
    #underConstruction;
  };

  type AppointmentStatus = {
    #pending;
    #confirmed;
    #cancelled;
    #completed;
  };

  type Project = {
    id : Nat;
    name : Text;
    location : Location;
    startingPrice : Nat;
    houseTypes : [Text];
    promotions : [Text];
    images : [Text];
    video : ?Text;
    coordinates : Coordinates;
    unitCount : Nat;
    unitStatus : UnitStatus;
    projectStatus : ProjectStatus;
    reviewRating : Float;
    verificationStatus : VerificationStatus;
    createdAt : Int;
  };

  type House = {
    id : Nat;
    projectId : Nat;
    houseType : Text;
    usableArea : Nat;
    bedrooms : Nat;
    bathrooms : Nat;
    parking : Nat;
    price : Nat;
    floorPlan : ?Text;
    gallery : [Text];
    video : ?Text;
    status : HouseStatus;
  };

  type Agent = {
    id : Nat;
    userId : Principal;
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
    ratingCategories : RatingCategory;
  };

  type Review = {
    id : Nat;
    agentId : Nat;
    reviewerId : Principal;
    rating : Nat;
    categories : RatingCategory;
    comment : Text;
    createdAt : Int;
    reported : Bool;
  };

  type Post = {
    id : Nat;
    authorId : Principal;
    image : ?Text;
    projectId : ?Nat;
    location : ?Location;
    price : ?Nat;
    agentId : ?Nat;
    interestedCount : Nat;
    likeCount : Nat;
    commentCount : Nat;
    shareCount : Nat;
    saveCount : Nat;
    createdAt : Int;
  };

  type Favorite = {
    userId : Principal;
    projects : [Nat];
    houses : [Nat];
    houseTypes : [Text];
    agents : [Nat];
    savedPosts : [Nat];
  };

  type Appointment = {
    id : Nat;
    userId : Principal;
    projectId : Nat;
    houseId : ?Nat;
    houseType : ?Text;
    date : Int;
    time : Int;
    visitors : Nat;
    agentId : ?Nat;
    name : Text;
    phone : Text;
    status : AppointmentStatus;
  };

  type Notification = {
    id : Nat;
    userId : Principal;
    message : Text;
    createdAt : Int;
    read : Bool;
  };

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    projects : Map.Map<Nat, Project>;
    houses : Map.Map<Nat, House>;
    agents : Map.Map<Nat, Agent>;
    reviews : Map.Map<Nat, Review>;
    posts : Map.Map<Nat, Post>;
    favorites : Map.Map<Principal, Favorite>;
    appointments : Map.Map<Nat, Appointment>;
    notifications : Map.Map<Nat, Notification>;
    state : {
      var nextProjectId : Nat;
      var nextHouseId : Nat;
      var nextAgentId : Nat;
      var nextReviewId : Nat;
      var nextPostId : Nat;
      var nextAppointmentId : Nat;
      var nextNotificationId : Nat;
    };
  };

  public func migration(_old : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      projects = Map.fromArray(
        [
          (
            0,
            {
              id = 0;
              name = "บ้านพฤกษา กาญจนบุรี";
              location = { province = "กาญจนบุรี"; district = "เมืองกาญจนบุรี"; subDistrict = "บ้านใต้" };
              startingPrice = 2500000;
              houseTypes = ["บ้านเดี่ยว", "บ้านสองชั้น"];
              promotions = ["โปรโมชั่นฟรีค่าโอน", "แถมเครื่องใช้ไฟฟ้า"];
              images = ["project-0-1.jpg", "project-0-2.jpg", "project-0-3.jpg"];
              video = null;
              coordinates = { lat = 14.0206; lng = 99.5313 };
              unitCount = 120;
              unitStatus = #available;
              projectStatus = #ongoing;
              reviewRating = 4.8;
              verificationStatus = #verified;
              createdAt = 1720000000000000000;
            },
          ),
          (
            1,
            {
              id = 1;
              name = "เดอะทรี ทาวน์โฮม";
              location = { province = "กาญจนบุรี"; district = "ท่ามะกา"; subDistrict = "ท่าไม้" };
              startingPrice = 1890000;
              houseTypes = ["ทาวน์โฮม"];
              promotions = [];
              images = ["project-1-1.jpg", "project-1-2.jpg"];
              video = null;
              coordinates = { lat = 13.9322; lng = 99.7667 };
              unitCount = 80;
              unitStatus = #available;
              projectStatus = #new;
              reviewRating = 4.5;
              verificationStatus = #verified;
              createdAt = 1725000000000000000;
            },
          ),
          (
            2,
            {
              id = 2;
              name = "บ้านกลางเมือง ราชบุรี";
              location = { province = "ราชบุรี"; district = "เมืองราชบุรี"; subDistrict = "หน้าเมือง" };
              startingPrice = 3200000;
              houseTypes = ["บ้านเดี่ยว", "บ้านชั้นเดียว"];
              promotions = ["โปรโมชั่นลด 5%"];
              images = ["project-2-1.jpg", "project-2-2.jpg", "project-2-3.jpg", "project-2-4.jpg"];
              video = null;
              coordinates = { lat = 13.5283; lng = 99.8141 };
              unitCount = 60;
              unitStatus = #available;
              projectStatus = #ongoing;
              reviewRating = 4.9;
              verificationStatus = #official;
              createdAt = 1715000000000000000;
            },
          ),
        ],
      );
      houses = Map.fromArray(
        [
          (
            0,
            {
              id = 0;
              projectId = 0;
              houseType = "บ้านเดี่ยว";
              usableArea = 120;
              bedrooms = 3;
              bathrooms = 2;
              parking = 2;
              price = 2500000;
              floorPlan = ?"floorplan-0-1.jpg";
              gallery = ["house-0-1.jpg", "house-0-2.jpg"];
              video = null;
              status = #readyToMove;
            },
          ),
          (
            1,
            {
              id = 1;
              projectId = 0;
              houseType = "บ้านสองชั้น";
              usableArea = 180;
              bedrooms = 4;
              bathrooms = 3;
              parking = 2;
              price = 3500000;
              floorPlan = ?"floorplan-0-2.jpg";
              gallery = ["house-1-1.jpg", "house-1-2.jpg", "house-1-3.jpg"];
              video = null;
              status = #underConstruction;
            },
          ),
          (
            2,
            {
              id = 2;
              projectId = 1;
              houseType = "ทาวน์โฮม";
              usableArea = 90;
              bedrooms = 3;
              bathrooms = 2;
              parking = 1;
              price = 1890000;
              floorPlan = ?"floorplan-1-1.jpg";
              gallery = ["house-2-1.jpg"];
              video = null;
              status = #readyToMove;
            },
          ),
          (
            3,
            {
              id = 3;
              projectId = 2;
              houseType = "บ้านเดี่ยว";
              usableArea = 150;
              bedrooms = 4;
              bathrooms = 3;
              parking = 2;
              price = 3200000;
              floorPlan = ?"floorplan-2-1.jpg";
              gallery = ["house-3-1.jpg", "house-3-2.jpg"];
              video = null;
              status = #readyToMove;
            },
          ),
        ],
      );
      agents = Map.fromArray(
        [
          (
            0,
            {
              id = 0;
              userId = Principal.fromText("aaaaa-aa");
              photo = ?"agent-0.jpg";
              name = "สมชาย ใจดี";
              agentCode = "OH-0001";
              serviceArea = "กาญจนบุรี";
              experience = 8;
              managedProjects = [0];
              listedHomes = [0, 1];
              portfolio = ["บ้านพฤกษา กาญจนบุรี", "บ้านกลางเมือง ราชบุรี"];
              customerCount = 45;
              rating = 4.9;
              reviewCount = 12;
              verified = true;
              ratingCategories = { trust = 5; info = 5; service = 5; followUp = 5; politeness = 5; speed = 4 };
            },
          ),
          (
            1,
            {
              id = 1;
              userId = Principal.fromText("aaaaa-aa");
              photo = ?"agent-1.jpg";
              name = "วิภา รักบ้าน";
              agentCode = "OH-0002";
              serviceArea = "กาญจนบุรี";
              experience = 5;
              managedProjects = [1];
              listedHomes = [2];
              portfolio = ["เดอะทรี ทาวน์โฮม"];
              customerCount = 30;
              rating = 4.7;
              reviewCount = 8;
              verified = true;
              ratingCategories = { trust = 5; info = 5; service = 4; followUp = 5; politeness = 5; speed = 4 };
            },
          ),
          (
            2,
            {
              id = 2;
              userId = Principal.fromText("aaaaa-aa");
              photo = ?"agent-2.jpg";
              name = "ณัฐพล ทรัพย์เจริญ";
              agentCode = "OH-0003";
              serviceArea = "ราชบุรี";
              experience = 10;
              managedProjects = [2];
              listedHomes = [3];
              portfolio = ["บ้านกลางเมือง ราชบุรี", "บ้านพฤกษา กาญจนบุรี"];
              customerCount = 60;
              rating = 5.0;
              reviewCount = 15;
              verified = true;
              ratingCategories = { trust = 5; info = 5; service = 5; followUp = 5; politeness = 5; speed = 5 };
            },
          ),
        ],
      );
      reviews = Map.fromArray(
        [
          (
            0,
            {
              id = 0;
              agentId = 0;
              reviewerId = Principal.fromText("aaaaa-aa");
              rating = 5;
              categories = { trust = 5; info = 5; service = 5; followUp = 5; politeness = 5; speed = 5 };
              comment = "ให้ข้อมูลละเอียดมาก พาเข้าชมโครงการอย่างมืออาชีพ";
              createdAt = 1750000000000000000;
              reported = false;
            },
          ),
          (
            1,
            {
              id = 1;
              agentId = 0;
              reviewerId = Principal.fromText("aaaaa-aa");
              rating = 5;
              categories = { trust = 5; info = 5; service = 5; followUp = 5; politeness = 5; speed = 4 };
              comment = "ติดตามผลตลอด ดูแลดีมาก";
              createdAt = 1750086400000000000;
              reported = false;
            },
          ),
          (
            2,
            {
              id = 2;
              agentId = 1;
              reviewerId = Principal.fromText("aaaaa-aa");
              rating = 5;
              categories = { trust = 5; info = 5; service = 4; followUp = 5; politeness = 5; speed = 4 };
              comment = "สุภาพและตอบไวมาก";
              createdAt = 1750172800000000000;
              reported = false;
            },
          ),
          (
            3,
            {
              id = 3;
              agentId = 2;
              reviewerId = Principal.fromText("aaaaa-aa");
              rating = 5;
              categories = { trust = 5; info = 5; service = 5; followUp = 5; politeness = 5; speed = 5 };
              comment = "มืออาชีพมาก แนะนำบ้านที่ตรงกับงบประมาณ";
              createdAt = 1750259200000000000;
              reported = false;
            },
          ),
        ],
      );
      posts = Map.fromArray(
        [
          (
            0,
            {
              id = 0;
              authorId = Principal.fromText("aaaaa-aa");
              image = ?"https://images.example.com/garden-home-cover.jpg";
              projectId = ?0;
              location = ?{ province = "กาญจนบุรี"; district = "เมืองกาญจนบุรี"; subDistrict = "ปากแพรก" };
              price = ?2900000;
              agentId = ?0;
              interestedCount = 24;
              likeCount = 128;
              commentCount = 15;
              shareCount = 32;
              saveCount = 41;
              createdAt = 1750000000000000000;
            },
          ),
          (
            1,
            {
              id = 1;
              authorId = Principal.fromText("aaaaa-aa");
              image = ?"https://images.example.com/townhome-cover.jpg";
              projectId = ?1;
              location = ?{ province = "กาญจนบุรี"; district = "ท่ามะกา"; subDistrict = "ท่าไม้" };
              price = ?1890000;
              agentId = ?1;
              interestedCount = 18;
              likeCount = 96;
              commentCount = 11;
              shareCount = 20;
              saveCount = 27;
              createdAt = 1750086400000000000;
            },
          ),
          (
            2,
            {
              id = 2;
              authorId = Principal.fromText("aaaaa-aa");
              image = ?"https://images.example.com/luxury-home-cover.jpg";
              projectId = ?2;
              location = ?{ province = "กาญจนบุรี"; district = "ด่านมะขามเตี้ย"; subDistrict = "จรเข้เผือก" };
              price = ?6500000;
              agentId = ?0;
              interestedCount = 35;
              likeCount = 210;
              commentCount = 28;
              shareCount = 55;
              saveCount = 63;
              createdAt = 1750172800000000000;
            },
          ),
        ],
      );
      favorites = Map.empty();
      appointments = Map.empty();
      notifications = Map.empty();
      state = {
        var nextProjectId = 3;
        var nextHouseId = 4;
        var nextAgentId = 3;
        var nextReviewId = 4;
        var nextPostId = 3;
        var nextAppointmentId = 0;
        var nextNotificationId = 0;
      };
    };
  };
};
