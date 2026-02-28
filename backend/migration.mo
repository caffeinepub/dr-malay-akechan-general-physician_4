import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";
import Float "mo:core/Float";

module {
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

  type Images = {
    heroBackgroundUrl : Text;
    heroBackgroundBase64 : Text;
  };

  type IdleHeroSettings = {
    _version : Nat;
    bgGradientStart : Text;
    bgGradientEnd : Text;
    overlayOpacity : Float;
    textColor : Text;
    backgroundBlur : Bool;
    glassmorphismIntensity : Float;
    heroHeight : { #normal };
    animationSpeed : Float;
    mouseParallaxEnabled : Bool;
    particlePreset : Text;
    particleCount : Nat;
    particleMinSize : Float;
    particleMaxSize : Float;
    particleSpeed : Float;
    particleColor : Text;
    particleOpacity : Float;
  };

  type OldActor = {
    clinics : Map.Map<Nat, Clinic>;
    services : Map.Map<Nat, Service>;
    socialLinks : Map.Map<Nat, SocialLink>;
    sessionTokens : Map.Map<Text, ()>;
    siteTitle : Text;
    aboutSection : Text;
    aboutImageUrl : Text;
    aboutImageBase64 : Text;
    headerImageUrl : Text;
    headerImageBase64 : Text;
    footerContent : Text;
    heroSettings : HeroSettings;
    images : Images;
    adminUsername : Text;
    adminPassword : Text;
    nextClinicId : Nat;
    nextServiceId : Nat;
    nextSocialLinkId : Nat;
  };

  type NewActor = {
    clinics : Map.Map<Nat, Clinic>;
    services : Map.Map<Nat, Service>;
    socialLinks : Map.Map<Nat, SocialLink>;
    sessionTokens : Map.Map<Text, ()>;
    siteTitle : Text;
    aboutSection : Text;
    aboutImageUrl : Text;
    aboutImageBase64 : Text;
    headerImageUrl : Text;
    headerImageBase64 : Text;
    footerContent : Text;
    heroSettings : IdleHeroSettings;
    images : Images;
    adminUsername : Text;
    adminPassword : Text;
    nextClinicId : Nat;
    nextServiceId : Nat;
    nextSocialLinkId : Nat;
  };

  func migrateHeroSettings(oldSettings : HeroSettings) : IdleHeroSettings {
    {
      _version = 1;
      bgGradientStart = oldSettings.heroGradientStart;
      bgGradientEnd = oldSettings.heroGradientEnd;
      overlayOpacity = 0.95;
      textColor = "#ffffff";
      backgroundBlur = true;
      glassmorphismIntensity = 0.7;
      heroHeight = #normal;
      animationSpeed = 1.0;
      mouseParallaxEnabled = true;
      particlePreset = "Floating Dots";
      particleCount = oldSettings.particleCount;
      particleMinSize = 0.15;
      particleMaxSize = if (oldSettings.particleSize != 0) { oldSettings.particleSize } else { 2.8 };
      particleSpeed = oldSettings.particleSpeed;
      particleColor = oldSettings.particleColor;
      particleOpacity = 0.85;
    };
  };

  public func run(old : OldActor) : NewActor {
    let newHeroSettings = migrateHeroSettings(old.heroSettings);
    { old with heroSettings = newHeroSettings };
  };
};
