import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";


import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";

// Apply migration on upgrade

actor {
  // Mix in storage functionality
  include MixinStorage();

  // ── Access Control ──────────────────────────────────────────────────────────
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // ── User Profile ─────────────────────────────────────────────────────────────
  type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // ── Domain Types ─────────────────────────────────────────────────────────────
  type Service = {
    title : Text;
    description : Text;
    iconUrl : Text;
    iconBase64 : Text;
  };

  type Clinic = {
    name : Text;
    address : Text;
    phone : Text;
    description : Text;
    mapUrl : Text;
    bookingUrl : Text;
  };

  type SocialLink = {
    platform : Text;
    url : Text;
  };

  type ServiceId = Nat;
  type ClinicId = Nat;
  type SocialLinkId = Nat;

  type ServiceInput = {
    title : Text;
    description : Text;
    iconUrl : Text;
    iconBase64 : Text;
  };

  type ClinicInput = {
    name : Text;
    address : Text;
    phone : Text;
    description : Text;
    mapUrl : Text;
    bookingUrl : Text;
  };

  type SocialLinkInput = {
    platform : Text;
    url : Text;
  };

  type Images = {
    heroBackgroundUrl : Text;
    heroBackgroundBase64 : Text;
  };

  type HeroSettings = {
    particleCount : Nat;
    particleSpeed : Float;
    particleSize : Float;
    particleColor : Text;
    showConnectionLines : Bool;
    mouseInteraction : Bool;
    backgroundEffect : Text;
    glassmorphismEnabled : Bool;
    heroGradientStart : Text;
    heroGradientEnd : Text;
  };

  // ── Stable State ─────────────────────────────────────────────────────────────
  var clinics = Map.empty<Nat, Clinic>();
  var services = Map.empty<Nat, Service>();
  let socialLinks = Map.empty<Nat, SocialLink>();
  let sessionTokens = Map.empty<Text, ()>();

  var siteTitle : Text = "";
  var aboutSection : Text = "";
  var aboutImageUrl : Text = "";
  var aboutImageBase64 : Text = "";
  var headerImageUrl : Text = "";
  var headerImageBase64 : Text = "";
  var footerContent : Text = "";
  var heroSettings : HeroSettings = {
    particleCount = 70;
    particleSpeed = 1.5;
    particleSize = 2.5;
    particleColor = "#90EE90";
    showConnectionLines = true;
    mouseInteraction = true;
    backgroundEffect = "gradient";
    glassmorphismEnabled = true;
    heroGradientStart = "#40A1FF";
    heroGradientEnd = "#A993FF";
  };

  var images : Images = {
    heroBackgroundUrl = "";
    heroBackgroundBase64 = "";
  };

  let adminUsername = "malay";
  let adminPassword = "duke46";

  var nextClinicId = 0;
  var nextServiceId = 0;
  var nextSocialLinkId = 0;

  // ── Session Token Helpers ────────────────────────────────────────────────────

  /// Validates a session token; traps if invalid.
  func requireValidSession(sessionToken : Text) {
    if (not sessionTokens.containsKey(sessionToken)) {
      Runtime.trap("Unauthorized: Invalid session token");
    };
  };

  // ── Authentication ───────────────────────────────────────────────────────────

  /// Login with username/password; returns a session token on success.
  public shared ({ caller }) func login(username : Text, password : Text) : async Text {
    if (username == adminUsername and password == adminPassword) {
      let sessionToken = caller.toText();
      sessionTokens.add(sessionToken, ());
      sessionToken;
    } else {
      Runtime.trap("Invalid credentials");
    };
  };

  /// Validates a session token (public, read-only check).
  public shared ({ caller }) func validateSessionToken(sessionToken : Text) : async () {
    requireValidSession(sessionToken);
  };

  // ── Hero Settings Endpoints ──────────────────────────────────────────────────

  public query ({ caller }) func getHeroSettings() : async HeroSettings {
    heroSettings;
  };

  public shared ({ caller }) func updateHeroSettings(newSettings : HeroSettings, sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    heroSettings := newSettings;
  };

  // ── Clinic Content Update by Upgrade ─────────────────────────────────────────

  public shared ({ caller }) func upgradePersistentContent(
    heroBgUrl : Text,
    heroBgBase64 : Text,
    siteTitleValue : Text,
    aboutSectionText : Text,
    aboutImgUrl : Text,
    aboutImgBase64 : Text,
    headerImgUrl : Text,
    headerImgBase64 : Text,
    footerContentText : Text,
    clinicEntries : [(Nat, ClinicInput)],
    serviceEntries : [(Nat, ServiceInput)],
    sessionToken : Text,
  ) : async () {
    requireValidSession(sessionToken);

    images := {
      images with
      heroBackgroundUrl = heroBgUrl;
      heroBackgroundBase64 = heroBgBase64;
    };
    siteTitle := siteTitleValue;
    aboutSection := aboutSectionText;
    aboutImageUrl := aboutImgUrl;
    aboutImageBase64 := aboutImgBase64;
    headerImageUrl := headerImgUrl;
    headerImageBase64 := headerImgBase64;
    footerContent := footerContentText;

    filteredClinicEntries(
      clinicEntries,
      serviceEntries,
    );
  };

  func filteredClinicEntries(clinicEntries : [(Nat, ClinicInput)], serviceEntries : [(Nat, ServiceInput)]) {
    let filteredClinicEntries = clinicEntries.filter(func((id, input)) { id >= nextClinicId });

    let filteredServiceEntries = serviceEntries.filter(func((id, input)) { id >= nextServiceId });

    nextServiceId += filteredServiceEntries.size();
    nextClinicId += filteredClinicEntries.size();

    for ((id, input) in filteredClinicEntries.values()) {
      let newClinic = {
        name = input.name;
        address = input.address;
        phone = input.phone;
        description = input.description;
        mapUrl = input.mapUrl;
        bookingUrl = input.bookingUrl;
      };
      clinics.add(id, newClinic);
    };

    for ((id, input) in filteredServiceEntries.values()) {
      let newService = {
        title = input.title;
        description = input.description;
        iconUrl = input.iconUrl;
        iconBase64 = input.iconBase64;
      };
      services.add(id, newService);
    };
  };

  // ── Public Read Endpoints ────────────────────────────────────────────────────

  public query ({ caller }) func getAllContent() : async {
    siteTitle : Text;
    aboutSection : Text;
    aboutImageUrl : Text;
    aboutImageBase64 : Text;
    headerImageUrl : Text;
    headerImageBase64 : Text;
    heroSettings : HeroSettings;
    footerContent : Text;
    clinics : [(Nat, Clinic)];
    services : [(Nat, Service)];
    socialLinks : [(Nat, SocialLink)];
    images : Images;
  } {
    {
      siteTitle;
      aboutSection;
      aboutImageUrl;
      aboutImageBase64;
      headerImageUrl;
      headerImageBase64;
      heroSettings;
      footerContent;
      clinics = clinics.toArray();
      services = services.toArray();
      socialLinks = socialLinks.toArray();
      images = images;
    };
  };

  public query ({ caller }) func getSiteTitle() : async Text {
    siteTitle;
  };

  public query ({ caller }) func getAboutSection() : async (Text, Text) {
    (aboutSection, aboutImageUrl);
  };

  public query ({ caller }) func getAllClinics() : async [(Nat, Clinic)] {
    clinics.toArray();
  };

  public query ({ caller }) func getAllServices() : async [(Nat, Service)] {
    services.toArray();
  };

  public query ({ caller }) func getAllSocialLinks() : async [(Nat, SocialLink)] {
    socialLinks.toArray();
  };

  public query ({ caller }) func getFooterContent() : async Text {
    footerContent;
  };

  public query ({ caller }) func getAboutImageBase64() : async Text {
    aboutImageBase64;
  };

  public query ({ caller }) func getHeaderImageBase64() : async Text {
    headerImageBase64;
  };

  public query ({ caller }) func getServiceIconBase64(serviceId : Nat) : async Text {
    switch (services.get(serviceId)) {
      case (null) { "" };
      case (?service) { service.iconBase64 };
    };
  };

  // ── Admin Write Endpoints — Site Title ───────────────────────────────────────

  public shared ({ caller }) func updateSiteTitle(title : Text, sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    siteTitle := title;
  };

  // ── Admin Write Endpoints — About Section ────────────────────────────────────

  public shared ({ caller }) func updateAboutSection(text : Text, imageUrl : Text, sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    aboutSection := text;
    aboutImageUrl := imageUrl;
  };

  public shared ({ caller }) func updateAboutImageBase64(imageBase64 : Text, sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    aboutImageBase64 := imageBase64;
  };

  public shared ({ caller }) func deleteAboutImage(sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    aboutImageBase64 := "";
    aboutImageUrl := "";
  };

  // ── Admin Write Endpoints — Header Image ─────────────────────────────────────

  public shared ({ caller }) func updateHeaderImageBase64(imageBase64 : Text, sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    headerImageBase64 := imageBase64;
  };

  public shared ({ caller }) func deleteHeaderImage(sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    headerImageBase64 := "";
    headerImageUrl := "";
  };

  // ── Images Endpoints ─────────────────────────────────────────────────────────

  public query ({ caller }) func getImages() : async Images {
    images;
  };

  public shared ({ caller }) func updateHeroBackgroundImage(
    imageUrl : Text,
    imageBase64 : Text,
    sessionToken : Text,
  ) : async () {
    requireValidSession(sessionToken);
    images := {
      images with
      heroBackgroundUrl = imageUrl;
      heroBackgroundBase64 = imageBase64;
    };
  };

  public shared ({ caller }) func deleteHeroBackgroundImage(sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    images := {
      images with
      heroBackgroundUrl = "";
      heroBackgroundBase64 = "";
    };
  };

  // ── Admin Write Endpoints — Clinics ──────────────────────────────────────────

  public shared ({ caller }) func addClinic(clinic : ClinicInput, sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    let newClinic = {
      name = clinic.name;
      address = clinic.address;
      phone = clinic.phone;
      description = clinic.description;
      mapUrl = clinic.mapUrl;
      bookingUrl = clinic.bookingUrl;
    };
    clinics.add(nextClinicId, newClinic);
    nextClinicId += 1;
  };

  public shared ({ caller }) func updateClinic(id : Nat, newClinicInput : ClinicInput, sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    switch (clinics.get(id)) {
      case (null) { Runtime.trap("Clinic not found") };
      case (?_) {
        let updatedClinic = {
          name = newClinicInput.name;
          address = newClinicInput.address;
          phone = newClinicInput.phone;
          description = newClinicInput.description;
          mapUrl = newClinicInput.mapUrl;
          bookingUrl = newClinicInput.bookingUrl;
        };
        clinics.add(id, updatedClinic);
      };
    };
  };

  public shared ({ caller }) func deleteClinic(id : Nat, sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    if (not clinics.containsKey(id)) {
      Runtime.trap("Clinic not found");
    };
    clinics.remove(id);
  };

  // ── Admin Write Endpoints — Services ─────────────────────────────────────────

  public shared ({ caller }) func addService(service : ServiceInput, sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    let newService = {
      title = service.title;
      description = service.description;
      iconUrl = service.iconUrl;
      iconBase64 = service.iconBase64;
    };
    services.add(nextServiceId, newService);
    nextServiceId += 1;
  };

  public shared ({ caller }) func updateService(id : Nat, newServiceInput : ServiceInput, sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    switch (services.get(id)) {
      case (null) { Runtime.trap("Service not found") };
      case (?_) {
        let updatedService = {
          title = newServiceInput.title;
          description = newServiceInput.description;
          iconUrl = newServiceInput.iconUrl;
          iconBase64 = newServiceInput.iconBase64;
        };
        services.add(id, updatedService);
      };
    };
  };

  public shared ({ caller }) func deleteService(id : Nat, sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    if (not services.containsKey(id)) {
      Runtime.trap("Service not found");
    };
    services.remove(id);
  };

  public shared ({ caller }) func updateServiceIconBase64(serviceId : Nat, imageBase64 : Text, sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    switch (services.get(serviceId)) {
      case (null) { Runtime.trap("Service not found") };
      case (?service) {
        let updatedService = { service with iconBase64 = imageBase64 };
        services.add(serviceId, updatedService);
      };
    };
  };

  public shared ({ caller }) func deleteServiceIcon(serviceId : Nat, sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    switch (services.get(serviceId)) {
      case (null) { Runtime.trap("Service not found") };
      case (?service) {
        let updatedService = { service with iconBase64 = ""; iconUrl = "" };
        services.add(serviceId, updatedService);
      };
    };
  };

  // ── Admin Write Endpoints — Social Links ─────────────────────────────────────

  public shared ({ caller }) func addSocialLink(link : SocialLinkInput, sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    let newLink = {
      platform = link.platform;
      url = link.url;
    };
    socialLinks.add(nextSocialLinkId, newLink);
    nextSocialLinkId += 1;
  };

  public shared ({ caller }) func updateSocialLink(id : Nat, newLinkInput : SocialLinkInput, sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    switch (socialLinks.get(id)) {
      case (null) { Runtime.trap("Social link not found") };
      case (?_) {
        let updatedLink = {
          platform = newLinkInput.platform;
          url = newLinkInput.url;
        };
        socialLinks.add(id, updatedLink);
      };
    };
  };

  public shared ({ caller }) func deleteSocialLink(id : Nat, sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    if (not socialLinks.containsKey(id)) {
      Runtime.trap("Social link not found");
    };
    socialLinks.remove(id);
  };

  // ── Admin Write Endpoints — Footer ───────────────────────────────────────────

  public shared ({ caller }) func updateFooterContent(content : Text, sessionToken : Text) : async () {
    requireValidSession(sessionToken);
    footerContent := content;
  };
};
