"use client";

import { useMemo, useState } from "react";
import { config } from "./config";

type AnswerValue = "yes" | "no" | "unknown";
type Step = 1 | 2 | 3;
type ProblemValue =
  | "hypertension"
  | "vkf"
  | "acs"
  | "pad"
  | "dyslipidemia"
  | "ascvd_obesity"
  | "vwd"
  | "hemophilia"
  | "hht"
  | "other_bleeding"
  | "fmd";

const COLORS = {
  primary: "#37C5F3",
  primaryDark: "#0EA5E9",
  primarySoft: "#E6F7FD",
  text: "#0F172A",
  textSoft: "#475569",
  border: "#D7E3EA",
  surface: "#FFFFFF",
  surfaceSoft: "#F8FBFD",
  yes: "#16A34A",
  no: "#DC2626",
  unknown: "#D97706",
  black: "#111111",
  gray: "#94A3B8"
};

const answerOptions: { value: AnswerValue; label: string; bg: string }[] = [
  { value: "yes", label: "Ja", bg: COLORS.yes },
  { value: "no", label: "Nee", bg: COLORS.no },
  { value: "unknown", label: "Onbekend", bg: COLORS.unknown }
];

const questionIdsByProblem = (problems: ProblemValue[]): string[] => {
  const ids = new Set<string>();

  if (problems.includes("hypertension")) {
    ids.add("ht_uncontrolled");
    ids.add("ht_2meds");
    ids.add("ht_diuretic");
    ids.add("ht_recent_change");
    ids.add("pm_medtronic_dual");
    ids.add("bp_in_range");
    ids.add("persistent_af");
    ids.add("advanced_hf");
    ids.add("egfr_lt30");
  }

  if (problems.includes("vkf")) {
    ids.add("recent_af");
    ids.add("af_acute");
    ids.add("af_surgery");
    ids.add("sinus");
  }

  if (problems.includes("acs")) {
    ids.add("recent_mi");
    ids.add("multivessel");
    ids.add("diabetes");
    ids.add("ckd");
    ids.add("pad_history");
    ids.add("mi_history");
    ids.add("ich");
    ids.add("gi_bleed");
    ids.add("dialysis");
    ids.add("recent_stroke");
  }

  if (problems.includes("pad")) {
    ids.add("pad_symptoms");
    ids.add("pad_procedure");
    ids.add("egfr_lt30");
  }

  if (problems.includes("dyslipidemia")) {
    ids.add("triconos_secondary");
    ids.add("triconos_primary_high");
    ids.add("bempedoic");
    ids.add("bempedoic_4w");
    ids.add("statin");
    ids.add("ezetimibe");
    ids.add("pcsk9");
    ids.add("inclisiran");
  }

  if (problems.includes("ascvd_obesity")) {
    ids.add("cvd");
    ids.add("age45");
    ids.add("bmi27");
  }

  if (problems.includes("vwd")) {
    ids.add("vwd_confirmed");
  }

  if (problems.includes("hemophilia")) {
    ids.add("hemophilia_confirmed");
    ids.add("reference_center");
  }

  if (problems.includes("hht")) {
    ids.add("hht_present");
    ids.add("systemic_tx");
  }

  if (problems.includes("other_bleeding")) {
    ids.add("other_bleeding_confirmed");
    ids.add("reference_center");
  }

  if (problems.includes("fmd")) {
    ids.add("fmd_confirmed");
    ids.add("scad_fmd");
    ids.add("fmd_atypical");
  }

  return Array.from(ids);
};

export default function Home() {
  const [step, setStep] = useState<Step>(1);
  const [problems, setProblems] = useState<ProblemValue[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  const toggleProblem = (value: ProblemValue) => {
    setProblems((prev) =>
      prev.includes(value)
        ? prev.filter((p) => p !== value)
        : [...prev, value]
    );
  };

  const visibleQuestions = useMemo(() => {
    const ids = questionIdsByProblem(problems);
    return config.questions.filter((q) => ids.includes(q.id));
  }, [problems]);

  const visibleStudies = useMemo(() => {
    return config.studies.filter((study) =>
      (study.problemTags || []).some((tag: string) =>
        problems.includes(tag as ProblemValue)
      )
    );
  }, [problems]);

  const setAnswer = (id: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const resetAll = () => {
    setStep(1);
    setProblems([]);
    setAnswers({});
  };

  const evaluate = (study: any) => {
    const hardExclusions = study.hard_exclusions || [];
    const requiresAll = study.requires_all || [];
    const requiresAny = study.requires_any || [];

    for (const ex of hardExclusions) {
      if (answers[ex] === "yes") {
        return {
          symbol: "❌",
          label: "Waarschijnlijk niet passend",
          reason: "Harde exclusie aanwezig",
          tone: "red"
        };
      }
    }

    let missing = false;

    for (const req of requiresAll) {
      if (answers[req] === "no") {
        return {
          symbol: "❌",
          label: "Waarschijnlijk niet passend",
          reason: "Essentieel criterium niet aanwezig",
          tone: "red"
        };
      }
      if (!answers[req] || answers[req] === "unknown") {
        missing = true;
      }
    }

    if (requiresAny.length > 0) {
      const anyYes = requiresAny.some((r: string) => answers[r] === "yes");
      const anyUnknown = requiresAny.some(
        (r: string) => !answers[r] || answers[r] === "unknown"
      );

      if (!anyYes && !anyUnknown) {
        return {
          symbol: "❌",
          label: "Waarschijnlijk niet passend",
          reason: "Geen passend richtinggevend criterium",
          tone: "red"
        };
      }

      if (!anyYes && anyUnknown) {
        missing = true;
      }
    }

    if (missing) {
      return {
        symbol: "⚠️",
        label: "Mogelijke match",
        reason: "Nog te verifiëren criteria",
        tone: "orange"
      };
    }

    return {
      symbol: "✅",
      label: "Sterke match",
      reason: "Kerncriteria aanwezig, geen harde exclusie gevonden",
      tone: "green"
    };
  };

  const toneStyles = (tone: string) => {
    if (tone === "green") {
      return {
        border: "1px solid #BBF7D0",
        bg: "#F0FDF4",
        badgeBg: "#16A34A"
      };
    }
    if (tone === "orange") {
      return {
        border: "1px solid #FED7AA",
        bg: "#FFF7ED",
        badgeBg: "#D97706"
      };
    }
    return {
      border: "1px solid #FECACA",
      bg: "#FEF2F2",
      badgeBg: "#DC2626"
    };
  };

  const canGoFromStep1 = problems.length > 0;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #f5fbfe 0%, #f8fafc 100%)",
        padding: "24px 16px",
        fontFamily: "Arial, sans-serif",
        color: COLORS.text
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          background: COLORS.surface,
          borderRadius: 24,
          padding: 24,
          boxShadow: "0 10px 35px rgba(15, 23, 42, 0.08)",
          border: `1px solid ${COLORS.border}`
        }}
      >
        <div
          style={{
            marginBottom: 24,
            padding: 20,
            borderRadius: 20,
            background: `linear-gradient(135deg, ${COLORS.primarySoft} 0%, white 100%)`,
            border: `1px solid ${COLORS.border}`
          }}
        >
          <div style={{ fontSize: 13, color: COLORS.textSoft, marginBottom: 8, fontWeight: 700 }}>
            UZ Leuven – interne pre-screening tool
          </div>
          <h1 style={{ margin: 0, fontSize: 30 }}>Study Pre-Screener V3</h1>
          <div style={{ marginTop: 10, color: COLORS.textSoft, fontSize: 16 }}>
            Snelle pre-screening met focus op hoge sensitiviteit
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                padding: "9px 14px",
                borderRadius: 999,
                background: step === s ? COLORS.primary : "#E2E8F0",
                color: step === s ? "white" : "#334155",
                fontWeight: 700,
                fontSize: 14
              }}
            >
              Stap {s}
            </div>
          ))}
        </div>

        {step === 1 && (
          <section>
            <h2 style={{ marginBottom: 8 }}>1. Wat zijn de hoofddiagnose(s) of kernproblemen?</h2>
            <p style={{ color: COLORS.textSoft, marginTop: 0 }}>
              Je kan één of meerdere opties aanduiden.
            </p>

            <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
              {config.problemOptions.map((opt: any) => {
                const selected = problems.includes(opt.value as ProblemValue);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleProblem(opt.value as ProblemValue)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "18px 20px",
                      borderRadius: 18,
                      border: selected ? `2px solid ${COLORS.primaryDark}` : `1px solid ${COLORS.border}`,
                      background: selected ? COLORS.primarySoft : "white",
                      color: COLORS.text,
                      fontSize: 18,
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    <div>{selected ? "✓ " : ""}{opt.label}</div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2 style={{ marginBottom: 8 }}>2. Snelle verfijning</h2>
            <p style={{ color: COLORS.textSoft, marginTop: 0 }}>
              Alleen relevante vragen worden getoond.
            </p>

            <div style={{ display: "grid", gap: 18, marginTop: 18 }}>
              {visibleQuestions.map((q: any) => (
                <div
                  key={q.id}
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 18,
                    padding: 18,
                    background: COLORS.surfaceSoft
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 14 }}>
                    {q.label}
                  </div>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {answerOptions.map((opt) => {
                      const selected = answers[q.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setAnswer(q.id, opt.value)}
                          style={{
                            minWidth: 110,
                            padding: "12px 16px",
                            borderRadius: 14,
                            border: selected ? `2px solid ${opt.bg}` : `1px solid ${COLORS.border}`,
                            background: selected ? opt.bg : "white",
                            color: selected ? "white" : COLORS.text,
                            fontSize: 16,
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h2 style={{ marginBottom: 8 }}>3. Resultaten</h2>
            <p style={{ color: COLORS.textSoft, marginTop: 0 }}>
              Suggesties voor verdere beoordeling door het studieteam.
            </p>

            <div style={{ display: "grid", gap: 16, marginTop: 18 }}>
              {visibleStudies.map((study: any) => {
                const result = evaluate(study);
                const tone = toneStyles(result.tone);

                return (
                  <div
                    key={study.id}
                    style={{
                      border: tone.border,
                      background: tone.bg,
                      borderRadius: 20,
                      padding: 20
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: tone.badgeBg,
                        color: "white",
                        fontWeight: 700,
                        fontSize: 13,
                        marginBottom: 12
                      }}
                    >
                      {result.symbol} {result.label}
                    </div>

                    <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
                      {study.title}
                    </div>

                    <div style={{ fontSize: 15, color: COLORS.textSoft, fontWeight: 600, marginBottom: 12 }}>
                      {study.synopsis || ""}
                    </div>

                    <div style={{ fontSize: 15, marginBottom: 10 }}>
                      <strong>Waarom:</strong> {result.reason}
                    </div>

                    <div style={{ fontSize: 15 }}>
                      <strong>Contact:</strong> {study.contact || "vte@uzleuven.be"}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap" }}>
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep((step - 1) as Step)}
              style={{
                padding: "12px 18px",
                borderRadius: 14,
                border: `1px solid ${COLORS.border}`,
                background: "white",
                cursor: "pointer",
                fontWeight: 700
              }}
            >
              Vorige
            </button>
          )}

          {step === 1 && (
            <button
              type="button"
              disabled={!canGoFromStep1}
              onClick={() => setStep(2)}
              style={{
                padding: "12px 18px",
                borderRadius: 14,
                border: "none",
                background: canGoFromStep1 ? COLORS.primaryDark : COLORS.gray,
                color: "white",
                cursor: canGoFromStep1 ? "pointer" : "not-allowed",
                fontWeight: 700
              }}
            >
              Verder
            </button>
          )}

          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(3)}
              style={{
                padding: "12px 18px",
                borderRadius: 14,
                border: "none",
                background: COLORS.primaryDark,
                color: "white",
                cursor: "pointer",
                fontWeight: 700
              }}
            >
              Toon resultaten
            </button>
          )}

          {step === 3 && (
            <button
              type="button"
              onClick={resetAll}
              style={{
                padding: "12px 18px",
                borderRadius: 14,
                border: "none",
                background: COLORS.black,
                color: "white",
                cursor: "pointer",
                fontWeight: 700
              }}
            >
              Nieuwe screening
            </button>
          )}
        </div>
      </div>
    </main>
  );
}