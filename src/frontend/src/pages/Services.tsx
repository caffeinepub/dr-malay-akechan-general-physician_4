import React from "react";
import HoverEditWrapper from "../components/HoverEditWrapper";
import { useGetAllContent } from "../hooks/useQueries";

export default function Services() {
  const { data: content } = useGetAllContent();
  const services = content?.services ?? [];

  // Section invisible if no services
  if (services.length === 0) return null;

  return (
    <section
      id="services"
      className="py-16 sm:py-24 relative"
      style={{ background: "oklch(0.12 0.020 240)" }}
    >
      {/* Top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.72 0.18 195 / 0.40), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="h-px w-12"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.72 0.18 195))",
              }}
            />
            <span
              className="text-sm font-semibold tracking-widest uppercase"
              style={{ color: "oklch(0.72 0.18 195)" }}
            >
              What We Offer
            </span>
            <div
              className="h-px w-12"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.72 0.18 195), transparent)",
              }}
            />
          </div>
          <h2
            className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.80 0.18 195), oklch(0.70 0.22 270))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Our Services
          </h2>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {services.map(([id, service], index) => {
            const iconSrc = service.iconBase64
              ? `data:image/png;base64,${service.iconBase64}`
              : service.iconUrl || null;

            return (
              <HoverEditWrapper
                key={id.toString()}
                onEdit={() => {
                  window.location.href = "/admin";
                }}
                label="Service"
              >
                {/* Gradient border wrapper */}
                <div
                  data-ocid={`services.item.${index + 1}`}
                  className="group p-[1px] rounded-2xl h-full transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.72 0.18 195 / 0.25), oklch(0.28 0.018 240), oklch(0.60 0.22 280 / 0.25))",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "linear-gradient(135deg, oklch(0.72 0.18 195 / 0.60), oklch(0.30 0.022 240), oklch(0.60 0.22 280 / 0.60))";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.background =
                      "linear-gradient(135deg, oklch(0.72 0.18 195 / 0.25), oklch(0.28 0.018 240), oklch(0.60 0.22 280 / 0.25))";
                  }}
                >
                  <div
                    className="relative h-full p-5 sm:p-6 flex flex-col gap-4 rounded-2xl overflow-hidden"
                    style={{
                      background: "oklch(0.14 0.018 240 / 0.90)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                    }}
                  >
                    {/* Animated top highlight line */}
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, oklch(0.72 0.18 195), oklch(0.60 0.22 280), transparent)",
                      }}
                    />

                    {/* Icon area */}
                    {iconSrc ? (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.72 0.18 195 / 0.18), oklch(0.60 0.22 280 / 0.18))",
                          border: "1px solid oklch(0.72 0.18 195 / 0.30)",
                        }}
                      >
                        <img
                          src={iconSrc}
                          alt={service.title}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
                        style={{
                          background:
                            "linear-gradient(135deg, oklch(0.72 0.18 195 / 0.18), oklch(0.60 0.22 280 / 0.18))",
                          border: "1px solid oklch(0.72 0.18 195 / 0.30)",
                          color: "oklch(0.72 0.18 195)",
                        }}
                      >
                        ✦
                      </div>
                    )}

                    {/* Title */}
                    <h3
                      className="font-heading font-bold text-lg leading-snug"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.92 0.10 195), oklch(0.82 0.16 265))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {service.title}
                    </h3>

                    {/* Description */}
                    {service.description && (
                      <p
                        className="text-base leading-relaxed flex-1"
                        style={{ color: "oklch(0.80 0.010 220)" }}
                      >
                        {service.description}
                      </p>
                    )}

                    {/* Bottom shimmer line on hover */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                      style={{
                        background:
                          "linear-gradient(90deg, oklch(0.72 0.18 195), oklch(0.60 0.22 280))",
                      }}
                    />
                  </div>
                </div>
              </HoverEditWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
