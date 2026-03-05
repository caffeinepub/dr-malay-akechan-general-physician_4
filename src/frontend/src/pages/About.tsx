import { useQuery } from "@tanstack/react-query";
import type { AboutImage } from "../backend";
import HoverEditWrapper from "../components/HoverEditWrapper";
import { useActor } from "../hooks/useActor";

function getImageSrc(aboutImage: AboutImage | undefined): string | null {
  if (!aboutImage) return null;
  if (aboutImage.imageType === "base64" && aboutImage.imageBase64) {
    const base64 = aboutImage.imageBase64;
    if (base64.startsWith("data:")) return base64;
    return `data:image/jpeg;base64,${base64}`;
  }
  if (aboutImage.imageType === "url" && aboutImage.imageUrl) {
    return aboutImage.imageUrl;
  }
  if (aboutImage.imageBase64) {
    const base64 = aboutImage.imageBase64;
    if (base64.startsWith("data:")) return base64;
    return `data:image/jpeg;base64,${base64}`;
  }
  if (aboutImage.imageUrl) return aboutImage.imageUrl;
  return null;
}

export default function About() {
  const { actor, isFetching } = useActor();

  const { data: content } = useQuery({
    queryKey: ["allContent"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAllContent();
    },
    enabled: !!actor && !isFetching,
  });

  const aboutText = content?.aboutSection ?? "";
  const aboutImage = content?.aboutImage;
  const imageSrc = getImageSrc(aboutImage);

  // Section invisible if no content
  if (!aboutText && !imageSrc) return null;

  return (
    <section
      id="about"
      className="py-16 sm:py-24 relative"
      style={{ background: "oklch(0.11 0.018 240)" }}
    >
      {/* Top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.72 0.18 195 / 0.40), transparent)",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-10 sm:mb-16">
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.72 0.18 195 / 0.50))",
            }}
          />
          <h2
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.80 0.18 195), oklch(0.70 0.22 270))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            About the Doctor
          </h2>
          <div
            className="h-px flex-1"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.72 0.18 195 / 0.50), transparent)",
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-start">
          {/* Profile image panel */}
          {imageSrc && (
            <div className="flex justify-center">
              <HoverEditWrapper
                onEdit={() => {
                  window.location.href = "/admin";
                }}
                label="Photo"
              >
                <div className="relative">
                  {/* Gradient border wrapper */}
                  <div
                    className="p-[2px] rounded-2xl"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.72 0.18 195), oklch(0.60 0.22 280), oklch(0.72 0.18 195))",
                      backgroundSize: "200% 200%",
                      animation: "borderGlow 3s ease-in-out infinite",
                    }}
                  >
                    <div
                      className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-2xl overflow-hidden relative"
                      style={{ background: "oklch(0.14 0.018 240)" }}
                    >
                      <img
                        src={imageSrc}
                        alt="Doctor profile"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                      {/* Inner shimmer overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(1 0 0 / 0.04) 0%, transparent 50%, oklch(1 0 0 / 0.02) 100%)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Corner accent brackets */}
                  <div
                    className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 rounded-tl-md pointer-events-none"
                    style={{ borderColor: "oklch(0.72 0.18 195 / 0.7)" }}
                  />
                  <div
                    className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 rounded-br-md pointer-events-none"
                    style={{ borderColor: "oklch(0.60 0.22 280 / 0.7)" }}
                  />
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 rounded-tr-md pointer-events-none"
                    style={{ borderColor: "oklch(0.60 0.22 280 / 0.4)" }}
                  />
                  <div
                    className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 rounded-bl-md pointer-events-none"
                    style={{ borderColor: "oklch(0.72 0.18 195 / 0.4)" }}
                  />

                  {/* Status badge */}
                  <div
                    className="absolute -bottom-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase whitespace-nowrap"
                    style={{
                      background: "oklch(0.14 0.022 240)",
                      border: "1px solid oklch(0.72 0.18 195 / 0.35)",
                      color: "oklch(0.72 0.18 195)",
                      boxShadow: "0 2px 12px oklch(0.72 0.18 195 / 0.15)",
                    }}
                  >
                    General Physician
                  </div>
                </div>
              </HoverEditWrapper>
            </div>
          )}

          {/* Bio panel */}
          {aboutText && (
            <div
              className={
                !imageSrc ? "md:col-span-2 max-w-3xl mx-auto w-full" : ""
              }
            >
              <HoverEditWrapper
                onEdit={() => {
                  window.location.href = "/admin";
                }}
                label="Bio"
              >
                <div
                  className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
                  style={{
                    background: "oklch(0.15 0.018 240 / 0.80)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid oklch(0.72 0.18 195 / 0.20)",
                    boxShadow:
                      "0 8px 32px oklch(0.08 0.018 240 / 0.50), inset 0 1px 0 oklch(1 0 0 / 0.05)",
                  }}
                >
                  {/* Inner top shimmer */}
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, oklch(0.72 0.18 195 / 0.45), transparent)",
                    }}
                  />

                  {/* Badge */}
                  <div className="flex items-center gap-2 mb-5">
                    <div
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
                      style={{
                        background: "oklch(0.72 0.18 195 / 0.10)",
                        border: "1px solid oklch(0.72 0.18 195 / 0.25)",
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: "oklch(0.72 0.18 195)" }}
                      />
                      <span
                        className="text-xs font-semibold tracking-widest uppercase"
                        style={{ color: "oklch(0.72 0.18 195)" }}
                      >
                        Biography
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-heading font-bold text-xl sm:text-2xl mb-5"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.88 0.12 195), oklch(0.78 0.18 270))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    About the Doctor
                  </h3>

                  {/* Bio paragraphs */}
                  <div className="space-y-4">
                    {aboutText
                      .split("\n")
                      .filter((p) => p.trim())
                      .map((para) => (
                        <p
                          key={para.slice(0, 40)}
                          className="text-base leading-[1.85]"
                          style={{ color: "oklch(0.84 0.010 220)" }}
                        >
                          {para}
                        </p>
                      ))}
                  </div>

                  {/* Bottom accent */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, oklch(0.60 0.22 280 / 0.30), transparent)",
                    }}
                  />
                </div>
              </HoverEditWrapper>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
