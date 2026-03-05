import { CalendarCheck, FileText, MapIcon, MapPin, Phone } from "lucide-react";
import React from "react";
import HoverEditWrapper from "../components/HoverEditWrapper";
import { useGetAllContent } from "../hooks/useQueries";

export default function Clinics() {
  const { data: content } = useGetAllContent();
  const clinics = content?.clinics ?? [];

  if (clinics.length === 0) return null;

  return (
    <section
      id="clinics"
      className="py-16 sm:py-24 relative"
      style={{ background: "oklch(0.10 0.018 240)" }}
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
              Locations
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
            Our Clinics
          </h2>
        </div>

        {/* Clinics grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {clinics.map(([id, clinic], index) => (
            <HoverEditWrapper
              key={id.toString()}
              onEdit={() => {
                window.location.href = "/admin";
              }}
              label="Clinic"
            >
              {/* Gradient border wrapper */}
              <div
                data-ocid={`clinics.item.${index + 1}`}
                className="group p-[1px] rounded-2xl h-full transition-all duration-300 hover:scale-[1.01]"
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
                    background: "oklch(0.13 0.018 240 / 0.95)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                  }}
                >
                  {/* Top highlight */}
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, oklch(0.72 0.18 195), oklch(0.60 0.22 280), transparent)",
                    }}
                  />

                  {/* Header area: Name + Address */}
                  <div className="space-y-2">
                    <h3
                      className="font-heading font-bold text-xl leading-tight"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.92 0.10 195), oklch(0.82 0.16 265))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {clinic.name}
                    </h3>

                    {clinic.address && (
                      <div className="flex items-start gap-2">
                        <MapPin
                          className="w-4 h-4 mt-0.5 shrink-0"
                          style={{ color: "oklch(0.72 0.18 195)" }}
                        />
                        <span
                          className="text-sm leading-relaxed"
                          style={{ color: "oklch(0.78 0.012 220)" }}
                        >
                          {clinic.address}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Divider */}
                  <div
                    className="h-px"
                    style={{ background: "oklch(0.28 0.018 240)" }}
                  />

                  {/* Info rows */}
                  <div className="space-y-3 flex-1">
                    {clinic.phone && (
                      <div className="flex items-center gap-2">
                        <Phone
                          className="w-4 h-4 shrink-0"
                          style={{ color: "oklch(0.60 0.22 280)" }}
                        />
                        <span
                          className="text-sm"
                          style={{ color: "oklch(0.80 0.010 220)" }}
                        >
                          {clinic.phone}
                        </span>
                      </div>
                    )}

                    {clinic.description && (
                      <div className="flex items-start gap-2">
                        <FileText
                          className="w-4 h-4 mt-0.5 shrink-0"
                          style={{ color: "oklch(0.65 0.18 220)" }}
                        />
                        <span
                          className="text-sm leading-relaxed"
                          style={{ color: "oklch(0.80 0.010 220)" }}
                        >
                          {clinic.description}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons */}
                  {(clinic.mapUrl || clinic.bookingUrl) && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {clinic.mapUrl && (
                        <a
                          href={clinic.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 min-h-[40px]"
                          style={{
                            background: "oklch(0.72 0.18 195 / 0.12)",
                            border: "1px solid oklch(0.72 0.18 195 / 0.35)",
                            color: "oklch(0.78 0.18 195)",
                          }}
                          onMouseEnter={(e) => {
                            (
                              e.currentTarget as HTMLAnchorElement
                            ).style.background = "oklch(0.72 0.18 195 / 0.22)";
                            (
                              e.currentTarget as HTMLAnchorElement
                            ).style.borderColor = "oklch(0.72 0.18 195 / 0.60)";
                          }}
                          onMouseLeave={(e) => {
                            (
                              e.currentTarget as HTMLAnchorElement
                            ).style.background = "oklch(0.72 0.18 195 / 0.12)";
                            (
                              e.currentTarget as HTMLAnchorElement
                            ).style.borderColor = "oklch(0.72 0.18 195 / 0.35)";
                          }}
                        >
                          <MapIcon className="w-3.5 h-3.5 shrink-0" />
                          Open Map
                        </a>
                      )}

                      {clinic.bookingUrl && (
                        <a
                          href={clinic.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 min-h-[40px]"
                          style={{
                            background:
                              "linear-gradient(135deg, oklch(0.65 0.185 195), oklch(0.58 0.175 260))",
                            color: "oklch(0.98 0.005 220)",
                            boxShadow:
                              "0 2px 12px oklch(0.65 0.185 195 / 0.25)",
                          }}
                        >
                          <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
                          Book Appointment
                        </a>
                      )}
                    </div>
                  )}

                  {/* Bottom accent */}
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
          ))}
        </div>
      </div>
    </section>
  );
}
