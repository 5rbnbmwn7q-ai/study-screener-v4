export const config = {
  problemOptions: [
    // Cardiovasculair
    { value: "hypertension", label: "Hypertensie" },
    { value: "vkf", label: "Voorkamerfibrillatie (VKF)" },
    { value: "acs", label: "Recent myocardinfarct / ACS" },
    { value: "pad", label: "Perifeer arterieel vaatlijden" },

    // Lipiden
    { value: "dyslipidemia", label: "Dyslipidemie" },
    { value: "ascvd_obesity", label: "ASCVD + overgewicht/obesitas" },

    // Bloedingsziekten
    { value: "vwd", label: "Von Willebrandziekte" },
    { value: "hemophilia", label: "Hemofilie A/B" },
    { value: "hht", label: "HHT / vasculaire malformatie" },
    { value: "other_bleeding", label: "Andere bloedingsziekte" },

    // Zeldzaam
    { value: "fmd", label: "FMD / SCAD-FMD" }
  ],

  questions: [
    // --- GENERIEK CV ---
    { id: "cvd", label: "Gekend cardiovasculair lijden?" },
    { id: "mi_history", label: "Eerder myocardinfarct?" },
    { id: "stroke_history", label: "Eerdere ischemische stroke?" },
    { id: "pad_history", label: "PAD of perifere revascularisatie?" },
    { id: "diabetes", label: "Diabetes?" },
    { id: "ckd", label: "Chronisch nierlijden (eGFR <60)?" },
    { id: "egfr_lt30", label: "eGFR <30?" },
    { id: "dialysis", label: "Dialyse?" },

    // --- HYPERTENSIE ---
    { id: "ht_uncontrolled", label: "Onvoldoende gecontroleerde hypertensie?" },
    { id: "ht_2meds", label: "≥2 antihypertensiva?" },
    { id: "ht_diuretic", label: "Thiazide of lisdiureticum?" },
    { id: "ht_recent_change", label: "Therapie gewijzigd <30 dagen?" },

    // BACKBEAT
    { id: "pm_medtronic_dual", label: "Dual-chamber pacemaker van Medtronic?" },
    { id: "bp_in_range", label: "Bloeddruk in inclusierange?" },
    { id: "persistent_af", label: "Persisterende/permanente VKF?" },
    { id: "advanced_hf", label: "Gevorderd hartfalen (NYHA III+ of LVEF <50%)?" },

    // --- VKF ---
    { id: "recent_af", label: "Recente start VKF (<35 dagen)?" },
    { id: "af_acute", label: "Na acute ziekte?" },
    { id: "af_surgery", label: "Na niet-cardiale heelkunde?" },
    { id: "sinus", label: "Nu sinusritme?" },

    // --- PAD ---
    { id: "pad_symptoms", label: "Symptomatisch PAD?" },
    { id: "pad_procedure", label: "Eerdere revascularisatie of amputatie?" },

    // --- ACS ---
    { id: "recent_mi", label: "(N)STEMI in afgelopen maand?" },
    { id: "multivessel", label: "Multivessel coronair lijden?" },

    { id: "ich", label: "Voorgeschiedenis intracraniële bloeding?" },
    { id: "gi_bleed", label: "GI bleed <1 jaar?" },
    { id: "recent_stroke", label: "Recente stroke?" },

    // --- LIPIDEN ---
    { id: "triconos_secondary", label: "Secundaire preventie?" },
    { id: "triconos_primary_high", label: "Hoog risico primaire preventie?" },
    { id: "bempedoic", label: "Start of plan bempedoic acid?" },
    { id: "bempedoic_4w", label: "Binnen 4 weken?" },
    { id: "statin", label: "Statine?" },
    { id: "ezetimibe", label: "Ezetimibe?" },
    { id: "pcsk9", label: "PCSK9 laatste 3 maanden?" },
    { id: "inclisiran", label: "Inclisiran ooit?" },

    { id: "age45", label: "Leeftijd ≥45?" },
    { id: "bmi27", label: "BMI ≥27?" },

    // --- BLOEDING ---
    { id: "vwd_confirmed", label: "VWD bevestigd?" },
    { id: "hemophilia_confirmed", label: "Hemofilie A/B?" },
    { id: "hht_present", label: "HHT / ROW?" },
    { id: "systemic_tx", label: "Systemische therapie nodig?" },
    { id: "other_bleeding_confirmed", label: "Andere bloedingsstoornis?" },
    { id: "reference_center", label: "Follow-up referentiecentrum?" },

    // --- FMD ---
    { id: "fmd_confirmed", label: "FMD bevestigd (CTA/MRA/angio)?" },
    { id: "scad_fmd", label: "SCAD + extracoronaire FMD?" },
    { id: "fmd_atypical", label: "Atypische FMD presentatie?" }
  ],

  studies: [
    // =====================
    // BESTAANDE
    // =====================

    {
      id: "zenith",
      title: "ZENITH",
      problemTags: ["hypertension"],
      requires_all: ["ht_uncontrolled", "ht_2meds", "ht_diuretic"],
      hard_exclusions: ["ht_recent_change", "egfr_lt30"],
      synopsis: "Hypertensie + CV risico",
      contact: "vte@uzleuven.be"
    },

    {
      id: "aspire",
      title: "ASPIRE-AF",
      problemTags: ["vkf"],
      requires_all: ["recent_af", "sinus"],
      requires_any: ["af_acute", "af_surgery"],
      synopsis: "Recente VKF",
      contact: "vte@uzleuven.be"
    },

    {
      id: "pad",
      title: "LEADER-PAD",
      problemTags: ["pad"],
      requires_any: ["pad_symptoms", "pad_procedure"],
      hard_exclusions: ["egfr_lt30"],
      synopsis: "PAD studie",
      contact: "vte@uzleuven.be"
    },

    {
      id: "triconos",
      title: "TRICONOS",
      problemTags: ["dyslipidemia"],
      requires_all: ["bempedoic", "statin", "ezetimibe"],
      requires_any: ["triconos_secondary", "triconos_primary_high"],
      hard_exclusions: ["pcsk9", "inclisiran"],
      synopsis: "Triple lipidentherapie",
      contact: "vte@uzleuven.be"
    },

    // =====================
    // NIEUWE STUDIES
    // =====================

    {
      id: "backbeat",
      title: "BACKBEAT",
      problemTags: ["hypertension"],
      requires_all: ["ht_uncontrolled", "pm_medtronic_dual", "bp_in_range"],
      hard_exclusions: ["persistent_af", "advanced_hf", "dialysis"],
      synopsis: "Pacemaker-gebaseerde hypertensiebehandeling",
      contact: "vte@uzleuven.be"
    },

    {
      id: "sosami",
      title: "SOS-AMI",
      problemTags: ["acs"],
      requires_all: ["recent_mi", "multivessel"],
      requires_any: ["diabetes", "ckd", "pad_history", "mi_history"],
      hard_exclusions: ["ich", "gi_bleed", "dialysis", "recent_stroke"],
      synopsis: "Post-AMI risicoreductie",
      contact: "vte@uzleuven.be"
    },

    {
      id: "oasis",
      title: "OASIS-VM",
      problemTags: ["hht"],
      requires_any: ["hht_present", "systemic_tx"],
      synopsis: "Vasculaire malformaties",
      contact: "vte@uzleuven.be"
    },

    {
      id: "maritime",
      title: "MARITIME-CV",
      problemTags: ["ascvd_obesity"],
      requires_all: ["cvd", "age45", "bmi27"],
      synopsis: "ASCVD + obesitas",
      contact: "vte@uzleuven.be"
    },

    {
      id: "brbdr",
      title: "BRBDR",
      problemTags: ["hemophilia", "other_bleeding"],
      requires_all: ["reference_center"],
      synopsis: "Rare bleeding registry",
      contact: "vte@uzleuven.be"
    },

    {
      id: "feiri",
      title: "FEIRI",
      problemTags: ["fmd"],
      requires_any: ["fmd_confirmed", "scad_fmd", "fmd_atypical"],
      synopsis: "FMD studie",
      contact: "vte@uzleuven.be"
    }
  ]
};