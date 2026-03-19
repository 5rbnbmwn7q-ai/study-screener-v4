export const DEFAULT_CONTACT =
  "vte@uzleuven.be | DECT 42057 (Kristine) | DECT 45320 (Katrien)";

export const config = {
  problemOptions: [
    { value: "hypertension", label: "Hypertensie", group: "Cardiovasculair" },
    { value: "vkf", label: "Voorkamerfibrillatie (VKF)", group: "Cardiovasculair" },
    { value: "acs", label: "Recent myocardinfarct / ACS", group: "Cardiovasculair" },
    { value: "pad", label: "Perifeer arterieel vaatlijden", group: "Cardiovasculair" },

    { value: "dyslipidemia", label: "Dyslipidemie / hypercholesterolemie", group: "Lipiden / metabool" },
    { value: "ascvd_obesity", label: "ASCVD + overgewicht/obesitas", group: "Lipiden / metabool" },

    { value: "vwd", label: "Von Willebrandziekte", group: "Bloedings- en vaatziekten" },
    { value: "hemophilia", label: "Hemofilie A/B", group: "Bloedings- en vaatziekten" },
    { value: "hht", label: "HHT / ROW / vasculaire malformatie", group: "Bloedings- en vaatziekten" },
    { value: "other_bleeding", label: "Andere bloedingsziekte", group: "Bloedings- en vaatziekten" },

    { value: "fmd", label: "FMD / SCAD-FMD", group: "Zeldzame vasculaire aandoeningen" }
  ],

  questions: [
    // ===== GENERIEKE CV / RISICO =====
    { id: "cvd", label: "Gekend cardiovasculair lijden / vroeger cardiovasculair event?" },
    { id: "mi_history", label: "Eerder myocardinfarct?" },
    { id: "stroke_history", label: "Eerdere ischemische stroke?" },
    { id: "pad_history", label: "PAD of perifere revascularisatie in de voorgeschiedenis?" },
    { id: "diabetes", label: "Diabetes?" },
    { id: "ckd", label: "Chronisch nierlijden (eGFR <60)?" },
    { id: "egfr_lt30", label: "eGFR <30?" },
    { id: "dialysis", label: "Dialyse?" },

    // ===== HYPERTENSIE =====
    { id: "ht_uncontrolled", label: "Onvoldoende gecontroleerde hypertensie?" },
    { id: "ht_2meds", label: "≥2 antihypertensiva?" },
    { id: "ht_diuretic", label: "Thiazide of lisdiureticum aanwezig?" },
    { id: "ht_recent_change", label: "Antihypertensieve therapie gewijzigd in de laatste 30 dagen?" },

    // ===== ZENITH VERFIJNING =====
    { id: "established_cvd", label: "Gekend cardiovasculair lijden?" },
    { id: "zenith_age55", label: "Leeftijd ≥55 jaar?" },
    { id: "zenith_risk_age70", label: "Leeftijd ≥70 jaar?" },
    { id: "zenith_risk_ckd", label: "Chronisch nierlijden (eGFR <60)?" },
    { id: "zenith_risk_smoker", label: "Actieve roker?" },
    { id: "zenith_risk_vkf", label: "Voorkamerfibrillatie (VKF)?" },
    { id: "zenith_risk_ntprobnp", label: "NT-proBNP >125 pg/mL?" },
    { id: "zenith_risk_diabetes_obesity", label: "Diabetes en/of obesitas?" },

    // ===== BACKBEAT =====
    { id: "pm_medtronic_dual", label: "Dual-chamber pacemaker van Medtronic?" },
    { id: "bp_in_range", label: "Bloeddruk in inclusierange (office + ambulant gecombineerd)?" },
    { id: "persistent_af", label: "Persisterende of permanente VKF?" },
    { id: "advanced_hf", label: "Gevorderd hartfalen (NYHA III+ of LVEF <50%)?" },

    // ===== ASPIRE =====
    { id: "recent_af", label: "Recente start van VKF (<35 dagen)?" },
    { id: "af_acute", label: "In context van acute medische ziekte?" },
    { id: "af_surgery", label: "In context van niet-cardiale heelkunde?" },
    { id: "sinus", label: "Nu sinusritme?" },

    // ===== PAD =====
    { id: "pad_symptoms", label: "Symptomatisch PAD (claudicatio, rustpijn of ischemische wonden)?" },
    { id: "pad_procedure", label: "Eerdere revascularisatie of amputatie wegens PAD?" },

    // ===== SOS-AMI =====
    { id: "recent_mi", label: "(N)STEMI in de afgelopen maand?" },
    { id: "multivessel", label: "Multivessel coronair lijden?" },
    { id: "ich", label: "Voorgeschiedenis intracraniële bloeding?" },
    { id: "gi_bleed", label: "GI bleed <1 jaar?" },
    { id: "recent_stroke", label: "Recente stroke?" },

    // ===== TRICONOS =====
    { id: "triconos_secondary", label: "Secundaire preventie (gekend cardiovasculair lijden / vroeger event)?" },
    { id: "triconos_primary_high", label: "Hoog / zeer hoog cardiovasculair risico in primaire preventie?" },
    { id: "bempedoic", label: "Recente start van bempedoic acid of plan om dit te starten?" },
    { id: "bempedoic_4w", label: "Binnen 4 weken van start bempedoic acid?" },
    { id: "statin", label: "Gebruik of geplande start van statine?" },
    { id: "ezetimibe", label: "Gebruik of geplande start van ezetimibe?" },
    { id: "pcsk9", label: "PCSK9 monoclonal antibody in de laatste 3 maanden?" },
    { id: "inclisiran", label: "Ooit inclisiran gekregen?" },

    // ===== MARITIME =====
    { id: "age45", label: "Leeftijd ≥45 jaar?" },
    { id: "bmi27", label: "BMI ≥27?" },

    // ===== BLOEDINGSZIEKTEN =====
    { id: "vwd_confirmed", label: "Von Willebrandziekte bevestigd of sterk vermoed?" },
    { id: "hemophilia_confirmed", label: "Hemofilie A of B?" },
    { id: "hht_present", label: "HHT / ROW / relevante vasculaire malformatie?" },
    { id: "systemic_tx", label: "Nood aan systemische therapie, ijzer of tranexaminezuur?" },
    { id: "other_bleeding_confirmed", label: "Andere congenitale bloedingsstoornis?" },
    { id: "reference_center", label: "Follow-up in referentiecentrum?" },

    // ===== FMD =====
    { id: "fmd_confirmed", label: "FMD bevestigd op CTA / MRA / angiografie?" },
    { id: "scad_fmd", label: "SCAD met extracoronaire FMD?" },
    { id: "fmd_atypical", label: "Atypische FMD / FMD-like presentatie?" }
  ],

  studies: [
    {
      id: "zenith",
      title: "ZENITH",
      subtitle: "Onvoldoende gecontroleerde hypertensie + established CVD of hoog CV-risico",
      problemTags: ["hypertension"],
      gate: {
        all: ["ht_uncontrolled", "ht_2meds", "ht_diuretic"]
      },
      hard_exclusions: ["ht_recent_change", "egfr_lt30"],
      refinement: {
        all: [],
        any: [],
        optional: [
          "established_cvd",
          "zenith_age55",
          "zenith_risk_age70",
          "zenith_risk_ckd",
          "zenith_risk_smoker",
          "zenith_risk_vkf",
          "zenith_risk_ntprobnp",
          "zenith_risk_diabetes_obesity"
        ]
      },
      synopsis:
        "Studie voor patiënten met onvoldoende gecontroleerde hypertensie en gekend cardiovasculair lijden of een hoog cardiovasculair risicoprofiel.",
      pitch:
        "Er loopt een studie voor patiënten met moeilijk controleerbare hypertensie en verhoogd cardiovasculair risico.",
      contact: DEFAULT_CONTACT
    },

    {
      id: "backbeat",
      title: "BACKBEAT",
      subtitle: "Hypertensie + dual-chamber Medtronic pacemaker",
      problemTags: ["hypertension"],
      gate: {
        all: ["ht_uncontrolled", "pm_medtronic_dual", "bp_in_range"]
      },
      hard_exclusions: ["persistent_af", "advanced_hf", "dialysis"],
      refinement: {
        all: [],
        any: [],
        optional: []
      },
      synopsis:
        "Studie bij patiënten met onvoldoende gecontroleerde hypertensie en een dual-chamber Medtronic pacemaker.",
      pitch:
        "Er loopt een studie voor patiënten met hypertensie en een compatibele pacemaker.",
      contact: DEFAULT_CONTACT
    },

    {
      id: "aspire",
      title: "ASPIRE-AF",
      subtitle: "Recente start van VKF in stress-context",
      problemTags: ["vkf"],
      gate: {
        all: ["recent_af"]
      },
      hard_exclusions: [],
      refinement: {
        all: ["sinus"],
        any: ["af_acute", "af_surgery"],
        optional: []
      },
      synopsis:
        "Studie voor patiënten met recente start van voorkamerfibrillatie in het kader van acute ziekte of niet-cardiale heelkunde.",
      pitch:
        "Er loopt een studie voor patiënten die recent VKF ontwikkelden in een acute stress-context.",
      contact: DEFAULT_CONTACT
    },

    {
      id: "leader_pad",
      title: "LEADER-PAD",
      subtitle: "Symptomatisch PAD of eerdere procedure",
      problemTags: ["pad"],
      gate: {
        all: [],
        any: ["pad_symptoms", "pad_procedure"]
      },
      hard_exclusions: ["egfr_lt30"],
      refinement: {
        all: [],
        any: [],
        optional: []
      },
      synopsis:
        "Studie voor patiënten met symptomatisch perifeer arterieel vaatlijden of eerdere revascularisatie/amputatie wegens PAD.",
      pitch:
        "Er loopt een studie voor patiënten met perifeer vaatlijden, ook na eerdere interventie.",
      contact: DEFAULT_CONTACT
    },

    {
      id: "sos_ami",
      title: "SOS-AMI",
      subtitle: "Recent (N)STEMI + multivessel coronair lijden",
      problemTags: ["acs"],
      gate: {
        all: ["recent_mi", "multivessel"]
      },
      hard_exclusions: ["ich", "gi_bleed", "dialysis", "recent_stroke"],
      refinement: {
        all: [],
        any: ["diabetes", "ckd", "pad_history", "mi_history"],
        optional: []
      },
      synopsis:
        "Studie na recent myocardinfarct bij patiënten met multivessel coronair lijden en bijkomend risicoprofiel.",
      pitch:
        "Er loopt een studie voor patiënten na recent myocardinfarct met verhoogd recidiefrisico.",
      contact: DEFAULT_CONTACT
    },

    {
      id: "triconos",
      title: "TRICONOS",
      subtitle: "Triple lipidenverlagende therapie met bempedoic acid",
      problemTags: ["dyslipidemia"],
      gate: {
        all: ["bempedoic"]
      },
      hard_exclusions: ["pcsk9", "inclisiran"],
      refinement: {
        all: ["statin", "ezetimibe", "bempedoic_4w"],
        any: ["triconos_secondary", "triconos_primary_high"],
        optional: []
      },
      synopsis:
        "Studie bij patiënten die starten of gepland zijn voor bempedoic acid binnen een 3-ledig lipidenverlagend schema.",
      pitch:
        "Er loopt een studie voor patiënten die op bempedoic acid-gebaseerde triple therapie uitkomen.",
      contact: DEFAULT_CONTACT
    },

    {
      id: "maritime_cv",
      title: "MARITIME-CV",
      subtitle: "Established ASCVD + overgewicht/obesitas",
      problemTags: ["ascvd_obesity"],
      gate: {
        all: ["cvd", "bmi27"]
      },
      hard_exclusions: [],
      refinement: {
        all: ["age45"],
        any: [],
        optional: []
      },
      synopsis:
        "Studie voor patiënten met established ASCVD en overgewicht/obesitas.",
      pitch:
        "Er loopt een studie voor patiënten in secundaire preventie met overgewicht of obesitas.",
      contact: DEFAULT_CONTACT
    },

    {
      id: "caribou",
      title: "CARIBou",
      subtitle: "Cardiovasculair risico bij bloedingsziekten",
      problemTags: ["vwd", "hemophilia", "hht", "other_bleeding"],
      gate: {
        all: [],
        any: [
          "vwd_confirmed",
          "hemophilia_confirmed",
          "hht_present",
          "other_bleeding_confirmed"
        ]
      },
      hard_exclusions: [],
      refinement: {
        all: [],
        any: [],
        optional: []
      },
      synopsis:
        "Prospectieve studie naar cardiovasculaire risicofactoren en events bij patiënten met bloedingsziekten.",
      pitch:
        "Er loopt een observationele studie die cardiovasculair risico bij bloedingsziekten beter in kaart brengt.",
      contact: DEFAULT_CONTACT
    },

    {
      id: "b_will",
      title: "B-WILL",
      subtitle: "Nationale survey van von Willebrandziekte",
      problemTags: ["vwd"],
      gate: {
        all: ["vwd_confirmed"]
      },
      hard_exclusions: [],
      refinement: {
        all: [],
        any: [],
        optional: []
      },
      synopsis:
        "Nationale studie naar fenotype, genotype, behandeling en kwaliteit van leven bij von Willebrandziekte.",
      pitch:
        "Er loopt een Belgische studie die von Willebrandziekte beter in kaart brengt.",
      contact: DEFAULT_CONTACT
    },

    {
      id: "brbdr",
      title: "BRBDR",
      subtitle: "Belgian Rare Bleeding Disorders Registry",
      problemTags: ["hemophilia", "other_bleeding"],
      gate: {
        all: [],
        any: ["hemophilia_confirmed", "other_bleeding_confirmed"]
      },
      hard_exclusions: [],
      refinement: {
        all: ["reference_center"],
        any: [],
        optional: []
      },
      synopsis:
        "Registry voor patiënten met zeldzame bloedingsstoornissen in follow-up in een referentiecentrum.",
      pitch:
        "Er loopt een registry voor patiënten met zeldzame bloedingsstoornissen.",
      contact: DEFAULT_CONTACT
    },

    {
      id: "oasis_vm",
      title: "OASIS-VM",
      subtitle: "HHT / vasculaire malformatie",
      problemTags: ["hht"],
      gate: {
        all: [],
        any: ["hht_present", "systemic_tx"]
      },
      hard_exclusions: [],
      refinement: {
        all: [],
        any: [],
        optional: []
      },
      synopsis:
        "Studie bij patiënten met HHT of relevante vasculaire malformaties.",
      pitch:
        "Er loopt een studie voor patiënten met HHT of andere vasculaire malformaties.",
      contact: DEFAULT_CONTACT
    },

    {
      id: "feiri",
      title: "FEIRI",
      subtitle: "FMD / SCAD-FMD",
      problemTags: ["fmd"],
      gate: {
        all: [],
        any: ["fmd_confirmed", "scad_fmd", "fmd_atypical"]
      },
      hard_exclusions: [],
      refinement: {
        all: [],
        any: [],
        optional: []
      },
      synopsis:
        "Studie bij patiënten met FMD, SCAD met extracoronaire FMD of atypische FMD-presentatie.",
      pitch:
        "Bij bevestigde of vermoedelijke FMD-gerelateerde ziekte kan verdere evaluatie door het studieteam zinvol zijn.",
      contact: DEFAULT_CONTACT
    }
  ]
};