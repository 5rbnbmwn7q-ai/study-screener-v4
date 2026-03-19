"use client";

import { useMemo, useState } from "react";
import { config } from "./config";

type AnswerValue = "yes" | "no" | "unknown";
type Step = 1 | 2 | 3 | 4;

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
  gray: "#94A3B8",
  muted: "#CBD5E1"
};

const answerOptions: { value: AnswerValue; label: string; bg: string }[] = [
  { value: "yes", label: "Ja", bg: COLORS.yes },
  { value: "no", label: "Nee", bg: COLORS.no },
  { value: "unknown", label: "Onbekend", bg: COLORS.unknown }
];

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function getQuestionMap() {
  const map = new Map<string, any>();
  for (const q of config.questions) {
    map.set(q.id, q);
  }
  return map;
}

function evaluateAll(ids: string[], answers: Record<string, AnswerValue>) {
  let pending = false;

  for (const id of ids || []) {
    const answer = answers[id];
    if (answer === "no") {
      return { status: "fail" as const };
    }
    if (!answer || answer === "unknown") {
      pending = true;
    }
  }

  return { status: pending ? ("pending" as const) : ("pass" as const) };
}

function evaluateAny(ids: string[], answers: Record<string, AnswerValue>) {
  if (!ids || ids.length === 0) {
    return { status: "not_needed" as const };
  }

  let anyYes = false;
  let anyUnknown = false;

  for (const id of ids) {
    const answer = answers[id];
    if (answer === "yes") {
      anyYes = true;
    }
    if (!answer || answer === "unknown") {
      anyUnknown = true;
    }
  }

  if (anyYes) return { status: "pass" as const };
  if (anyUnknown) return { status: "pending" as const };
  return { status: "fail" as const };
}

function getGateStatus(study: any, answers: Record<string, AnswerValue>) {
  const allResult = evaluateAll(study.gate?.all || [], answers);
  if (allResult.status === "fail") {
    return {
      status: "fail" as const,
      reason: "Afgevallen op snelle selectie"
    };
  }

  const anyResult = evaluateAny(study.gate?.any || [], answers);
  if (anyResult.status === "fail") {
    return {
      status: "fail" as const,
      reason: "Afgevallen op snelle selectie"
    };
  }

  if (allResult.status === "pending" || anyResult.status === "pending") {
    return {
      status: "pending" as const,
      reason: "Nog onvolledige snelle selectie"
    };
  }

  return {
    status: "pass" as const,
    reason: "Snelle selectie positief"
  };
}

function getRefinementQuestionIds(study: any) {
  return unique([
    ...(study.hard_exclusions || []),
    ...(study.refinement?.all || []),
    ...(study.refinement?.any || []),
    ...(study.refinement?.optional || [])
  ]);
}

function evaluateZenith(study: any, answers: Record<string, AnswerValue>) {
  for (const ex of study.hard_exclusions || []) {
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

  const establishedCvd = answers["established_cvd"];

  if (establishedCvd === "yes") {
    return {
      symbol: "✅",
      label: "Sterke match",
      reason: "Established cardiovasculair lijden aanwezig, geen harde exclusie gevonden",
      tone: "green"
    };
  }

  if (!establishedCvd || establishedCvd === "unknown") {
    missing = true;
  }

  const age55 = answers["zenith_age55"];
  if (age55 === "no") {
    return {
      symbol: "❌",
      label: "Waarschijnlijk niet passend",
      reason: "Geen established CVD en leeftijd niet passend voor high-risk arm",
      tone: "red"
    };
  }
  if (!age55 || age55 === "unknown") {
    missing = true;
  }

  // Nieuwe snelle samenvattende vraag
  const twoRisk = answers["zenith_2risk"];

  if (twoRisk === "yes") {
    return {
      symbol: missing ? "⚠️" : "✅",
      label: missing ? "Mogelijke match" : "Sterke match",
      reason: missing
        ? "Hoog-risicoprofiel waarschijnlijk aanwezig, maar nog te verifiëren criteria"
        : "Minstens 2 relevante risicofactoren aanwezig, geen harde exclusie gevonden",
      tone: missing ? "orange" : "green"
    };
  }

  if (twoRisk === "unknown" || !twoRisk) {
    missing = true;
  }

  // Alleen detailcheck als snelle vraag niet positief is
  const factors = [
    "zenith_risk_age70",
    "zenith_risk_ckd",
    "zenith_risk_smoker",
    "zenith_risk_vkf",
    "zenith_risk_ntprobnp",
    "zenith_risk_diabetes_obesity"
  ];

  const yesCount = factors.filter((id) => answers[id] === "yes").length;
  const anyUnknown = factors.some((id) => !answers[id] || answers[id] === "unknown");

  if (yesCount >= 2) {
    return {
      symbol: missing ? "⚠️" : "✅",
      label: missing ? "Mogelijke match" : "Sterke match",
      reason: missing
        ? "Hoog-risicoprofiel waarschijnlijk aanwezig, maar nog te verifiëren criteria"
        : "Hoog-risicoprofiel aanwezig, geen harde exclusie gevonden",
      tone: missing ? "orange" : "green"
    };
  }

  if (anyUnknown) {
    return {
      symbol: "⚠️",
      label: "Mogelijke match",
      reason: "Nog te verifiëren of patiënt voldoet aan high-risk criteria",
      tone: "orange"
    };
  }

  return {
    symbol: "❌",
    label: "Waarschijnlijk niet passend",
    reason: "Geen established CVD en onvoldoende high-risk criteria",
    tone: "red"
  };
}

function evaluateStudy(study: any, answers: Record<string, AnswerValue>) {
  const gate = getGateStatus(study, answers);

  if (gate.status === "fail") {
    return {
      symbol: "❌",
      label: "Waarschijnlijk niet passend",
      reason: gate.reason,
      tone: "red"
    };
  }

  if (study.id === "zenith") {
    return evaluateZenith(study, answers);
  }

  for (const ex of study.hard_exclusions || []) {
    if (answers[ex] === "yes") {
      return {
        symbol: "❌",
        label: "Waarschijnlijk niet passend",
        reason: "Harde exclusie aanwezig",
        tone: "red"
      };
    }
  }

  let missing = gate.status === "pending";

  const allResult = evaluateAll(study.refinement?.all || [], answers);
  if (allResult.status === "fail") {
    return {
      symbol: "❌",
      label: "Waarschijnlijk niet passend",
      reason: "Essentieel criterium niet aanwezig",
      tone: "red"
    };
  }
  if (allResult.status === "pending") {
    missing = true;
  }

  const anyQuestions = study.refinement?.any || [];
  if (anyQuestions.length > 0) {
    const anyResult = evaluateAny(anyQuestions, answers);
    if (anyResult.status === "fail") {
      return {
        symbol: "❌",
        label: "Waarschijnlijk niet passend",
        reason: "Geen passend richtinggevend criterium",
        tone: "red"
      };
    }
    if (anyResult.status === "pending") {
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
}

function toneStyles(tone: string) {
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
}

export default function Home() {
  const [step, setStep] = useState<Step>(1);
  const [problems, setProblems] = useState<string[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});

  const questionMap = useMemo(() => getQuestionMap(), []);

  const groupedProblems = useMemo(() => {
    const groups: Record<string, any[]> = {};
    for (const option of config.problemOptions) {
      if (!groups[option.group]) groups[option.group] = [];
      groups[option.group].push(option);
    }
    return groups;
  }, []);

  const candidateStudies = useMemo(() => {
    return config.studies.filter((study) =>
      (study.problemTags || []).some((tag: string) => problems.includes(tag))
    );
  }, [problems]);

  const studiesForStep3 = useMemo(() => {
    return candidateStudies.filter((study) => getGateStatus(study, answers).status !== "fail");
  }, [candidateStudies, answers]);

const studiesWithRefinement = useMemo(() => {
  return studiesForStep3.filter((study: any) => {
    let refinementIds = getRefinementQuestionIds(study);

    if (study.id === "zenith") {
      const twoRisk = answers["zenith_2risk"];

      if (!twoRisk || twoRisk === "yes") {
        refinementIds = ["zenith_2risk"];
      }
    }

    return refinementIds.length > 0;
  });
}, [studiesForStep3, answers]);

  const toggleProblem = (value: string) => {
    setProblems((prev) =>
      prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]
    );
  };

  const setAnswer = (id: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const resetAll = () => {
    setStep(1);
    setProblems([]);
    setAnswers({});
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
          maxWidth: 980,
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
          <h1 style={{ margin: 0, fontSize: 30 }}>Study Pre-Screener V4</h1>
          <div style={{ marginTop: 10, color: COLORS.textSoft, fontSize: 16 }}>
            Snelle studie-specifieke triage met hoge sensitiviteit
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {[1, 2, 3, 4].map((s) => (
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

            <div style={{ display: "grid", gap: 22, marginTop: 18 }}>
              {Object.entries(groupedProblems).map(([groupName, options]) => (
                <div key={groupName}>
                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: 16,
                      color: COLORS.text,
                      marginBottom: 10
                    }}
                  >
                    {groupName}
                  </div>

                  <div style={{ display: "grid", gap: 12 }}>
                    {options.map((opt: any) => {
                      const selected = problems.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggleProblem(opt.value)}
                          style={{
                            width: "100%",
                            textAlign: "left",
                            padding: "16px 18px",
                            borderRadius: 18,
                            border: selected
                              ? `2px solid ${COLORS.primaryDark}`
                              : `1px solid ${COLORS.border}`,
                            background: selected ? COLORS.primarySoft : "white",
                            color: COLORS.text,
                            fontSize: 17,
                            fontWeight: 700,
                            cursor: "pointer"
                          }}
                        >
                          {selected ? "✓ " : ""}
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

        {step === 2 && (
          <section>
            <h2 style={{ marginBottom: 8 }}>2. Snelle selectie per studie</h2>
            <p style={{ color: COLORS.textSoft, marginTop: 0, marginBottom: 6 }}>
  Alleen de minimale vragen om te bepalen of een studie nog plausibel is.
</p>
<div style={{ fontSize: 13, color: COLORS.textSoft, marginBottom: 10 }}>
  Studies vallen automatisch af op basis van je antwoorden.
</div>
<div style={{ fontSize: 13, color: COLORS.textSoft, marginBottom: 6 }}>
  Onbekend = ok. Dat houdt de sensitiviteit hoog.
</div>

            <div style={{ display: "grid", gap: 16, marginTop: 18 }}>
              {candidateStudies.map((study: any) => {
                const gateStatus = getGateStatus(study, answers);
                const styles =
                  gateStatus.status === "pass"
                    ? toneStyles("green")
                    : gateStatus.status === "pending"
                    ? toneStyles("orange")
                    : toneStyles("red");

                const gateQuestionIds = unique([
                  ...(study.gate?.all || []),
                  ...(study.gate?.any || [])
                ]);

                return (
                  <div
  key={study.id}
  style={{
    border: styles.border,
    background: styles.bg,
    borderRadius: 18,
    padding: 16,
    opacity: gateStatus.status === "fail" ? 0.45 : 1,
    transition: "all 0.2s ease"
  }}
>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: styles.badgeBg,
                        color: "white",
                        fontWeight: 700,
                        fontSize: 13,
                        marginBottom: 12
                      }}
                    >
                      {gateStatus.status === "pass"
  ? "✓ Verder screenen"
  : gateStatus.status === "pending"
  ? "… Nog onvolledig"
  : "✕ Afgevallen"}
                    </div>

                    <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
                      {study.title}
                    </div>
                    <div style={{ color: COLORS.textSoft, marginBottom: 14 }}>
                      {study.subtitle}
                    </div>

                    <div style={{ display: "grid", gap: 14 }}>
                      {gateQuestionIds.map((questionId: string) => {
                        const q = questionMap.get(questionId);
                        if (!q) return null;

                        return (
                          <div
                            key={questionId}
                            style={{
                              border: `1px solid ${COLORS.border}`,
                              borderRadius: 14,
                              padding: 12,
                              background: "white"
                            }}
                          >
                            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>
                              {q.label}
                            </div>

                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                              {answerOptions.map((opt) => {
                                const selected = answers[questionId] === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setAnswer(questionId, opt.value)}
                                    style={{
                                      minWidth: 105,
                                      padding: "10px 14px",
                                      borderRadius: 12,
                                      border: selected
                                        ? `2px solid ${opt.bg}`
                                        : `1px solid ${COLORS.border}`,
                                      background: selected ? opt.bg : "white",
                                      color: selected ? "white" : COLORS.text,
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
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h2 style={{ marginBottom: 8 }}>3. Verfijning voor overblijvende studies</h2>
            <p style={{ color: COLORS.textSoft, marginTop: 0, marginBottom: 6 }}>
  Alleen studies die de snelle selectie overleven, worden verder uitgediept.
</p>
<div style={{ fontSize: 13, color: COLORS.textSoft, marginBottom: 10 }}>
  De status van elke studie wordt live aangepast tijdens het beantwoorden.
</div>
<div style={{ fontSize: 13, color: COLORS.textSoft, marginBottom: 6 }}>
  Studies kunnen hier nog versterken, onzeker blijven of afvallen.
</div>

            <div style={{ display: "grid", gap: 16, marginTop: 18 }}>
  {studiesForStep3.length === 0 ? (
    <div
      style={{
        border: `1px solid ${COLORS.border}`,
        background: "white",
        borderRadius: 16,
        padding: 18,
        color: COLORS.textSoft,
        fontWeight: 600
      }}
    >
      Er blijven geen studies over na de snelle selectie.
    </div>
  ) : (
    studiesForStep3.map((study: any) => {
      let refinementIds = getRefinementQuestionIds(study);

      if (study.id === "zenith") {
        const twoRisk = answers["zenith_2risk"];
        if (!twoRisk || twoRisk === "yes") {
          refinementIds = ["zenith_2risk"];
        }
      }

      const liveResult = evaluateStudy(study, answers);
const liveStyles = toneStyles(liveResult.tone);

return (
  <div
    key={study.id}
    style={{
      border: liveStyles.border,
      background: liveStyles.bg,
      borderRadius: 18,
      padding: 16,
      opacity: liveResult.tone === "red" ? 0.65 : 1,
      transition: "all 0.2s ease"
    }}
  >
    <div
      style={{
        display: "inline-block",
        padding: "6px 10px",
        borderRadius: 999,
        background: liveStyles.badgeBg,
        color: "white",
        fontWeight: 700,
        fontSize: 13,
        marginBottom: 12
      }}
    >
      {liveResult.symbol} {liveResult.label}
    </div>

    <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
      {study.title}
    </div>
    <div style={{ color: COLORS.textSoft, marginBottom: 10 }}>
      {study.subtitle}
    </div>

    <div
      style={{
        fontSize: 14,
        marginBottom: 14,
        padding: "8px 10px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.55)"
      }}
    >
      <strong>Status:</strong> {liveResult.reason}
    </div>

          {refinementIds.length === 0 ? (
            <div
  style={{
    padding: 14,
    borderRadius: 12,
    background: "white",
    border: `1px solid ${COLORS.border}`,
    color: COLORS.textSoft,
    fontWeight: 600
  }}
>
  Geen verdere verfijning nodig voor deze studie. De live status hierboven blijft wel actief.
</div>
          ) : (
            <div style={{ display: "grid", gap: 14 }}>
              {refinementIds.map((questionId: string) => {
                const q = questionMap.get(questionId);
                if (!q) return null;

                return (
                  <div
                    key={questionId}
                    style={{
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 14,
                      padding: 12,
                      background: "white"
                    }}
                  >
                    <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>
                      {q.label}
                    </div>

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {answerOptions.map((opt) => {
                        const selected = answers[questionId] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setAnswer(questionId, opt.value)}
                            style={{
                              minWidth: 105,
                              padding: "10px 14px",
                              borderRadius: 12,
                              border: selected
                                ? `2px solid ${opt.bg}`
                                : `1px solid ${COLORS.border}`,
                              background: selected ? opt.bg : "white",
                              color: selected ? "white" : COLORS.text,
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
                );
              })}
            </div>
          )}
        </div>
      );
    })
  )}
</div>
          </section>
        )}

        {step === 4 && (
          <section>
            <h2 style={{ marginBottom: 8 }}>4. Resultaten</h2>
            <p style={{ color: COLORS.textSoft, marginTop: 0 }}>
              Suggesties voor verdere beoordeling door het studieteam.
            </p>

            <div style={{ display: "grid", gap: 16, marginTop: 18 }}>
              {[...candidateStudies]
  .sort((a: any, b: any) => {
    const order: Record<string, number> = { green: 0, orange: 1, red: 2 };
    return (
      order[evaluateStudy(a, answers).tone] -
      order[evaluateStudy(b, answers).tone]
    );
  })
  .map((study: any) => {
                const result = evaluateStudy(study, answers);
                const styles = toneStyles(result.tone);

                return (
                  <div
                    key={study.id}
                    style={{
                      border: styles.border,
                      background: styles.bg,
                      borderRadius: 20,
                      padding: 20
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        padding: "6px 10px",
                        borderRadius: 999,
                        background: styles.badgeBg,
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

                    <div
                      style={{
                        fontSize: 15,
                        color: COLORS.textSoft,
                        fontWeight: 600,
                        marginBottom: 12
                      }}
                    >
                      {study.subtitle}
                    </div>

                    <div
  style={{
    fontSize: 15,
    marginBottom: 10,
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.6)"
  }}
>
  <strong>Waarom:</strong> {result.reason}
</div>

                    <div style={{ fontSize: 15, marginBottom: 10 }}>
                      <strong>Studie:</strong> {study.synopsis}
                    </div>

                    <div style={{ fontSize: 15, marginBottom: 10 }}>
                      <strong>Pitch naar patiënt:</strong> {study.pitch}
                    </div>

                    <div
  style={{
    fontSize: 15,
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.7)",
    border: `1px solid ${COLORS.border}`,
    fontWeight: 700
  }}
>
  👉 Contacteer studieteam: {study.contact}
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
              Verder naar snelle selectie
            </button>
          )}

          {step === 2 && (
  <button
    type="button"
    onClick={() => {
      if (studiesForStep3.length === 0 || studiesWithRefinement.length === 0) {
        setStep(4);
      } else {
        setStep(3);
      }
    }}
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
    {studiesForStep3.length === 0 || studiesWithRefinement.length === 0
      ? "Toon resultaten"
      : "Verder naar verfijning"}
  </button>
)}

          {step === 3 && (
            <button
              type="button"
              onClick={() => setStep(4)}
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

          {step === 4 && (
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