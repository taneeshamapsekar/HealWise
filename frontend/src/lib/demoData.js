export const CLINICAL_PRESETS = [
  {
    id: "preset-infection",
    title: "1. Acute Sinus Infection (Antibiotic + Analgesic)",
    shortDesc: "Augmentin 625mg + Paracetamol + Pantoprazole",
    patientName: "Ramesh Patil (Age 58)",
    lang: "Marathi",
    text: `Rx:
1. Tab Augmentin 625mg (Amoxicillin + Clavulanic Acid) - 1 tab BD pc x 5 days
2. Tab Paracetamol 650mg - 1 tab TDS pc x 3 days (SOS for fever)
3. Cap Pantoprazole 40mg - 1 cap OD ac x 5 days (before breakfast)
Diagnosis: Acute bacterial rhinosinusitis with severe headache and fever
Precautions: Drink plenty of warm fluids. Complete the full 5-day antibiotic course even if feeling better.`,
    analysis: {
      original_text: "Tab Augmentin 625mg BD pc x 5d\nTab Paracetamol 650mg TDS pc x 3d\nCap Pantoprazole 40mg OD ac x 5d",
      diagnosis: "सायनसचा तीव्र जिवाणू संसर्ग आणि डोकेदुखी (Acute Sinus Infection)",
      summary: "ही औषधे तुमच्या नाकातील सायनसचा संसर्ग, सूज, ताप आणि डोकेदुखी पूर्णपणे बरी करण्यासाठी दिली आहेत. अँटीबायोटिकचा ५ दिवसांचा पूर्ण कोर्स न चुकता पूर्ण करा.",
      medicines: [
        {
          name: "Augmentin 625mg",
          generic_name: "Amoxicillin + Clavulanic Acid",
          dose: "१ गोळी",
          times: ["morning", "night"],
          with_food: "after",
          duration_days: 5,
          purpose: "संसर्ग निर्माण करणाऱ्या जीवाणूंना (बॅक्टेरिया) नष्ट करण्यासाठी"
        },
        {
          name: "Paracetamol 650mg",
          generic_name: "Paracetamol",
          dose: "१ गोळी",
          times: ["morning", "afternoon", "night"],
          with_food: "after",
          duration_days: 3,
          purpose: "ताप आणि तीव्र डोकेदुखीपासून तातडीने आराम मिळण्यासाठी"
        },
        {
          name: "Pantoprazole 40mg",
          generic_name: "Pantoprazole",
          dose: "१ कॅप्सूल",
          times: ["morning"],
          with_food: "before",
          duration_days: 5,
          purpose: "अँटीबायोटिक गोळ्यांमुळे पोटात जळजळ किंवा ॲसिडिटी होऊ नये म्हणून"
        }
      ],
      interactions: [
        "ऑगमेंटिन गोळी रिकाम्या पोटी घेतल्यास मळमळ होऊ शकते, म्हणून ती नेहमी जेवणानंतरच घ्या."
      ],
      warnings: [
        "बरे वाटले तरी ५ दिवसांचा कोर्स मधेच सोडू नका.",
        "पॅरासिटामॉल २४ तासांत ३ पेक्षा जास्त वेळा घेऊ नका."
      ],
      disclaimer: "हे मार्गदर्शन फक्त माहितीसाठी आहे. औषधांच्या बदलांसाठी तुमच्या डॉक्टरांचा सल्ला घ्या."
    },
    questions: [
      { id: "q1", text: "३ दिवसांनंतर तुमच्या डोकेदुखीत आणि चेहऱ्यावरील वेदनांमध्ये फरक पडला आहे का?", options: ["Better", "Same", "Worse"] },
      { id: "q2", text: "अँटीबायोटिक सुरू केल्यावर पोट बिघडणे किंवा मळमळ जाणवत आहे का?", options: ["Yes", "No"] },
      { id: "q3", text: "तुमचा ताप पूर्णपणे उतरला आहे का?", options: ["Better", "Same", "Worse"] }
    ]
  },
  {
    id: "preset-chronic",
    title: "2. Type-2 Diabetes & Hypertension Regimen",
    shortDesc: "Metformin 500mg + Telmisartan 40mg + Atorvastatin",
    patientName: "Kamala Devi (Age 64)",
    lang: "Hindi",
    text: `Rx:
1. Tab Metformin 500mg - 1 tab BD pc (after breakfast & dinner)
2. Tab Telmisartan 40mg - 1 tab OD ac (morning empty stomach)
3. Tab Atorvastatin 10mg - 1 tab OD HS (at bedtime)
Diagnosis: Type 2 Diabetes Mellitus with Primary Essential Hypertension
Advise: Low salt diet, regular blood sugar monitoring, daily 30-min walk.`,
    analysis: {
      original_text: "Tab Metformin 500mg BD pc\nTab Telmisartan 40mg OD ac\nTab Atorvastatin 10mg OD HS",
      diagnosis: "टाइप-२ शुगर (डायबिटीज) और उच्च रक्तचाप (हाई बीपी)",
      summary: "यह दवाएं आपके ब्लड शुगर को नियंत्रित रखने, बीपी सामान्य रखने और दिल की नसों को सुरक्षित रखने के लिए हैं। इन्हें बिना नागा रोजाना लें।",
      medicines: [
        {
          name: "Metformin 500mg",
          generic_name: "Metformin Hydrochloride",
          dose: "१ गोली",
          times: ["morning", "night"],
          with_food: "after",
          duration_days: 30,
          purpose: "खून में शुगर का स्तर सामान्य और नियंत्रित रखने के लिए"
        },
        {
          name: "Telmisartan 40mg",
          generic_name: "Telmisartan",
          dose: "१ गोली",
          times: ["morning"],
          with_food: "before",
          duration_days: 30,
          purpose: "हाई ब्लड प्रेशर को सुरक्षित स्तर पर बनाए रखने के लिए"
        },
        {
          name: "Atorvastatin 10mg",
          generic_name: "Atorvastatin Calcium",
          dose: "१ गोली",
          times: ["night"],
          with_food: "after",
          duration_days: 30,
          purpose: "खराब कोलेस्ट्रॉल कम करके हृदय को सुरक्षित रखने के लिए"
        }
      ],
      interactions: [
        "मेटफॉर्मिन खाली पेट लेने से पेट में मरोड़ हो सकती है, इसे हमेशा भोजन के तुरंत बाद लें।"
      ],
      warnings: [
        "यदि चक्कर आए तो तुरंत बीपी और शुगर की जांच कराएं।",
        "अचानक दवा बंद न करें, यह आजीवन नियंत्रण वाली दवाएं हैं।"
      ],
      disclaimer: "यह मार्गदर्शन केवल सूचनात्मक उद्देश्य के लिए है। किसी भी बदलाव के लिए अपने डॉक्टर से परामर्श लें।"
    },
    questions: [
      { id: "q1", text: "क्या सुबह उठने पर आपको चक्कर या अत्यधिक कमजोरी महसूस होती है?", options: ["Yes", "No"] },
      { id: "q2", text: "पिछले कुछ दिनों में आपकी भूख और ऊर्जा का स्तर कैसा है?", options: ["Better", "Same", "Worse"] },
      { id: "q3", text: "क्या आप रोजाना नियमित समय पर अपनी गोलियां ले रहे हैं?", options: ["Yes", "No"] }
    ]
  },
  {
    id: "preset-allergy",
    title: "3. Seasonal Respiratory Allergy & Cough",
    shortDesc: "Montelukast-Levocetirizine + Steam + Cough Syrup",
    patientName: "Anita Sharma (Age 32)",
    lang: "English",
    text: `Rx:
1. Tab Montelukast 10mg + Levocetirizine 5mg - 1 tab OD HS x 7 days
2. Syp Ascoril-D - 5ml TDS pc x 5 days
3. Steam inhalation with saline twice daily
Diagnosis: Allergic Bronchitis with nocturnal dry cough
Note: May cause mild drowsiness, avoid driving at night.`,
    analysis: {
      original_text: "Tab Montelukast + Levocetirizine OD HS x 7d\nSyp Ascoril-D 5ml TDS pc x 5d",
      diagnosis: "Allergic Bronchitis with Dry Night Cough",
      summary: "These medicines relieve chest congestion, throat irritation, and nighttime coughing caused by seasonal allergies.",
      medicines: [
        {
          name: "Montelukast + Levocetirizine",
          generic_name: "Montelukast + Levocetirizine",
          dose: "1 tablet",
          times: ["night"],
          with_food: "any",
          duration_days: 7,
          purpose: "To block allergic triggers and calm airways for restful sleep"
        },
        {
          name: "Ascoril-D Cough Syrup",
          generic_name: "Dextromethorphan + Chlorpheniramine",
          dose: "5 ml",
          times: ["morning", "afternoon", "night"],
          with_food: "after",
          duration_days: 5,
          purpose: "To suppress persistent dry cough and soothe throat spasms"
        }
      ],
      interactions: [
        "Taking allergy medication with alcohol can increase sedation significantly."
      ],
      warnings: [
        "This allergy medication may cause mild drowsiness; avoid driving or operating heavy machinery at night.",
        "Do not exceed the measured 5ml syrup dose."
      ],
      disclaimer: "This guidance is for informational purposes only. Consult your doctor or pharmacist for any medication adjustments."
    },
    questions: [
      { id: "q1", text: "How is your nighttime coughing and chest tightness?", options: ["Better", "Same", "Worse"] },
      { id: "q2", text: "Are you feeling excessive drowsiness or sluggishness during daytime?", options: ["Yes", "No"] }
    ]
  }
];

export const INITIAL_DOCTOR_PATIENTS = [
  {
    id: "p1",
    name: "Ramesh Patil",
    age: 58,
    gender: "Male",
    phone: "+91 98231 44510",
    diagnosis: "Acute Sinus Infection",
    lastVisit: "2 days ago",
    status: "amber",
    statusText: "Wants reassurance on stomach cramps",
    checkinAnswers: [
      { question: "३ दिवसांनंतर तुमच्या डोकेदुखीत फरक पडला आहे का?", answer: "Same" },
      { question: "अँटीबायोटिक सुरू केल्यावर पोट बिघडणे जाणवत आहे का?", answer: "Yes" },
      { question: "ताप पूर्णपणे उतरला आहे का?", answer: "Better" }
    ],
    summary: "Patient reports headache persists ('Same') and mild stomach burning with antibiotic. Fever resolved.",
    action: "Call patient to advise taking antibiotic with curd/food or prescribe antacid."
  },
  {
    id: "p2",
    name: "Kamala Devi",
    age: 64,
    gender: "Female",
    phone: "+91 94220 88219",
    diagnosis: "T2DM + Hypertension",
    lastVisit: "5 days ago",
    status: "green",
    statusText: "Smooth adherence & steady sugars",
    checkinAnswers: [
      { question: "सुबह चक्कर या कमजोरी महसूस होती है?", answer: "No" },
      { question: "भूख और ऊर्जा का स्तर कैसा है?", answer: "Better" },
      { question: "दवाएं रोजाना नियमित समय पर ले रहे हैं?", answer: "Yes" }
    ],
    summary: "Patient demonstrates excellent compliance and feels more energetic. Blood pressure is stable.",
    action: "Schedule routine fasting glucose review in 3 months."
  },
  {
    id: "p3",
    name: "Sunita Gawas",
    age: 42,
    gender: "Female",
    phone: "+91 83200 12890",
    diagnosis: "Urinary Tract Infection",
    lastVisit: "Yesterday",
    status: "red",
    statusText: "Severe chills & medication intolerance",
    checkinAnswers: [
      { question: "Is burning sensation reducing?", answer: "Worse" },
      { question: "Able to retain oral fluids?", answer: "No" }
    ],
    summary: "Urgent: Patient reports worsening chills and nausea with inability to retain liquids on Day 2.",
    action: "URGENT: Request patient to report to clinic emergency room for clinical assessment."
  }
];
