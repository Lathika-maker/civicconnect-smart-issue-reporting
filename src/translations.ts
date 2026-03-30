export type Language = 'en' | 'hi' | 'ta';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      report: 'Report Issue',
      track: 'Track Complaint',
      map: 'Map',
      howItWorks: 'How It Works',
      dashboard: 'Dashboard',
      about: 'About',
      contact: 'Contact',
      simpleMode: 'Simple Mode'
    },
    home: {
      heroTitle: 'Report Civic Issues Faster and Smarter',
      heroSubtitle: 'A digital bridge between citizens and municipal authorities. Report potholes, sanitation issues, and more in seconds.',
      reportBtn: 'Report an Issue',
      trackBtn: 'Track Complaint',
      problemsTitle: 'Common Civic Problems',
      problemsSubtitle: 'Traditional reporting methods are slow and lack transparency. We address these critical issues:'
    },
    report: {
      title: 'Report a Civic Issue',
      subtitle: 'Fill out the form below to report a problem in your area. Provide as much detail as possible for faster resolution.',
      fullName: 'Full Name',
      phone: 'Phone Number',
      email: 'Email Address',
      category: 'Issue Category',
      description: 'Description of Issue',
      upload: 'Upload Photo',
      location: 'Location',
      detect: 'Detect',
      submit: 'Submit Complaint',
      reset: 'Reset'
    },
    howItWorks: {
      title: 'How It Works',
      subtitle: 'CivicConnect makes reporting civic issues simple, transparent, and effective. Follow these steps to make your city better.',
      steps: [
        {
          title: 'Identify & Capture',
          desc: 'Spot a civic issue like a pothole or garbage. Take a clear photo using your smartphone.'
        },
        {
          title: 'Submit Report',
          desc: 'Fill in the details. Our app automatically captures your GPS location for precision.'
        },
        {
          title: 'Community Verification',
          desc: 'Other citizens in your area can upvote and confirm the issue to increase its priority.'
        },
        {
          title: 'Authority Action',
          desc: 'Municipal authorities receive the report and assign it to the relevant department.'
        },
        {
          title: 'Issue Resolved',
          desc: 'Once fixed, you receive a notification and the status is updated on the public map.'
        }
      ],
      voiceTitle: 'No Smartphone? No Problem.',
      voiceDesc: 'We believe in inclusive technology. Citizens without smartphones can call our dedicated IVR number. Our AI converts voice calls into text complaints automatically.'
    },
    about: {
      mission: 'Our Mission',
      title: 'Building Smarter Cities Together.',
      subtitle: 'CivicConnect was founded on the belief that every citizen should have a direct, transparent, and efficient way to contribute to their city\'s infrastructure. We leverage technology to bridge the gap between people and government.',
      resolved: 'Issues Resolved',
      cities: 'Cities Covered',
      valuesTitle: 'Our Core Values',
      valuesSubtitle: 'These principles guide everything we do at CivicConnect.',
      values: [
        { title: 'Transparency', desc: 'Every report is public and trackable. No more black-hole complaints.' },
        { title: 'Efficiency', desc: 'Direct routing to municipal departments ensures faster response times.' },
        { title: 'Participation', desc: 'Empowering citizens to take ownership of their local environment.' }
      ],
      visionTitle: 'Our Vision for 2030',
      visionDesc: '"To create a world where civic infrastructure is self-healing through the power of collective citizen intelligence and automated governance."'
    },
    contact: {
      title: 'Get in Touch',
      subtitle: 'Have questions or feedback about CivicConnect? We\'re here to help you make your city better.',
      infoTitle: 'Contact Information',
      email: 'Email Us',
      phone: 'Call Us',
      visit: 'Visit Us',
      formName: 'Full Name',
      formEmail: 'Email Address',
      formSubject: 'Subject',
      formMessage: 'Message',
      formSubmit: 'Send Message'
    },
    common: {
      loading: 'Loading...',
      success: 'Success',
      error: 'Error'
    }
  },
  hi: {
    nav: {
      home: 'होम',
      report: 'शिकायत दर्ज करें',
      track: 'ट्रैक करें',
      map: 'मैप',
      howItWorks: 'कैसे काम करता है',
      dashboard: 'डैशबोर्ड',
      about: 'हमारे बारे में',
      contact: 'संपर्क',
      simpleMode: 'सरल मोड'
    },
    home: {
      heroTitle: 'नागरिक समस्याओं की रिपोर्ट तेजी से और स्मार्ट तरीके से करें',
      heroSubtitle: 'नागरिकों और नगर निगम अधिकारियों के बीच एक डिजिटल सेतु। गड्ढों, स्वच्छता के मुद्दों और बहुत कुछ की रिपोर्ट सेकंडों में करें।',
      reportBtn: 'समस्या की रिपोर्ट करें',
      trackBtn: 'शिकायत ट्रैक करें',
      problemsTitle: 'सामान्य नागरिक समस्याएं',
      problemsSubtitle: 'पारंपरिक रिपोर्टिंग विधियां धीमी हैं और पारदर्शिता की कमी है। हम इन महत्वपूर्ण मुद्दों का समाधान करते हैं:'
    },
    report: {
      title: 'नागरिक समस्या की रिपोर्ट करें',
      subtitle: 'अपने क्षेत्र में किसी समस्या की रिपोर्ट करने के लिए नीचे दिया गया फॉर्म भरें। तेजी से समाधान के लिए अधिक से अधिक विवरण प्रदान करें।',
      fullName: 'पूरा नाम',
      phone: 'फ़ोन नंबर',
      email: 'ईमेल पता',
      category: 'समस्या की श्रेणी',
      description: 'समस्या का विवरण',
      upload: 'फोटो अपलोड करें',
      location: 'स्थान',
      detect: 'पता लगाएं',
      submit: 'शिकायत सबमिट करें',
      reset: 'रीसेट करें'
    },
    howItWorks: {
      title: 'यह कैसे काम करता है',
      subtitle: 'CivicConnect नागरिक समस्याओं की रिपोर्टिंग को सरल, पारदर्शी और प्रभावी बनाता है। अपने शहर को बेहतर बनाने के लिए इन चरणों का पालन करें।',
      steps: [
        {
          title: 'पहचानें और कैप्चर करें',
          desc: 'गड्ढे या कचरे जैसी नागरिक समस्या को पहचानें। अपने स्मार्टफोन का उपयोग करके एक स्पष्ट फोटो लें।'
        },
        {
          title: 'रिपोर्ट जमा करें',
          desc: 'विवरण भरें। हमारा ऐप सटीकता के लिए स्वचालित रूप से आपके जीपीएस स्थान को कैप्चर करता है।'
        },
        {
          title: 'सामुदायिक सत्यापन',
          desc: 'आपके क्षेत्र के अन्य नागरिक समस्या को प्राथमिकता देने के लिए अपवोट और पुष्टि कर सकते हैं।'
        },
        {
          title: 'प्राधिकरण कार्रवाई',
          desc: 'नगरपालिका अधिकारियों को रिपोर्ट प्राप्त होती है और वे इसे संबंधित विभाग को सौंप देते हैं।'
        },
        {
          title: 'समस्या का समाधान',
          desc: 'एक बार ठीक हो जाने पर, आपको एक सूचना प्राप्त होती है और सार्वजनिक मानचित्र पर स्थिति अपडेट कर दी जाती है।'
        }
      ],
      voiceTitle: 'स्मार्टफोन नहीं है? कोई बात नहीं।',
      voiceDesc: 'हम समावेशी तकनीक में विश्वास करते हैं। बिना स्मार्टफोन वाले नागरिक हमारे समर्पित आईवीआर नंबर पर कॉल कर सकते हैं। हमारा एआई वॉयस कॉल को स्वचालित रूप से टेक्स्ट शिकायतों में बदल देता है।'
    },
    about: {
      mission: 'हमारा मिशन',
      title: 'मिलकर स्मार्ट शहरों का निर्माण।',
      subtitle: 'CivicConnect की स्थापना इस विश्वास पर की गई थी कि प्रत्येक नागरिक के पास अपने शहर के बुनियादी ढांचे में योगदान करने का एक सीधा, पारदर्शी और कुशल तरीका होना चाहिए। हम लोगों और सरकार के बीच की खाई को पाटने के लिए तकनीक का लाभ उठाते हैं।',
      resolved: 'समाधान किए गए मुद्दे',
      cities: 'कवर किए गए शहर',
      valuesTitle: 'हमारे मुख्य मूल्य',
      valuesSubtitle: 'ये सिद्धांत CivicConnect में हमारे द्वारा किए जाने वाले हर काम का मार्गदर्शन करते हैं।',
      values: [
        { title: 'पारदर्शिता', desc: 'हर रिपोर्ट सार्वजनिक और ट्रैक करने योग्य है। अब कोई ब्लैक-होल शिकायत नहीं।' },
        { title: 'दक्षता', desc: 'नगरपालिका विभागों को सीधी रूटिंग तेजी से प्रतिक्रिया समय सुनिश्चित करती है।' },
        { title: 'भागीदारी', desc: 'नागरिकों को उनके स्थानीय पर्यावरण का स्वामित्व लेने के लिए सशक्त बनाना।' }
      ],
      visionTitle: '2030 के लिए हमारा विजन',
      visionDesc: '"एक ऐसी दुनिया बनाना जहां नागरिक बुनियादी ढांचा सामूहिक नागरिक बुद्धिमत्ता और स्वचालित शासन की शक्ति के माध्यम से स्वयं ठीक हो जाए।"'
    },
    contact: {
      title: 'संपर्क करें',
      subtitle: 'CivicConnect के बारे में प्रश्न या प्रतिक्रिया है? हम आपके शहर को बेहतर बनाने में आपकी मदद करने के लिए यहां हैं।',
      infoTitle: 'संपर्क जानकारी',
      email: 'हमें ईमेल करें',
      phone: 'हमें कॉल करें',
      visit: 'हमसे मिलें',
      formName: 'पूरा नाम',
      formEmail: 'ईमेल पता',
      formSubject: 'विषय',
      formMessage: 'संदेश',
      formSubmit: 'संदेश भेजें'
    },
    common: {
      loading: 'लोड हो रहा है...',
      success: 'सफलता',
      error: 'त्रुटि'
    }
  },
  ta: {
    nav: {
      home: 'முகப்பு',
      report: 'புகார் அளிக்கவும்',
      track: 'புகாரைக் கண்காணிக்கவும்',
      map: 'வரைபடம்',
      howItWorks: 'எப்படி செயல்படுகிறது',
      dashboard: 'டாஷ்போர்டு',
      about: 'எங்களைப் பற்றி',
      contact: 'தொடர்பு',
      simpleMode: 'எளிய முறை'
    },
    home: {
      heroTitle: 'குடிமைப் பிரச்சனைகளை விரைவாகவும் புத்திசாலித்தனமாகவும் புகாரளிக்கவும்',
      heroSubtitle: 'குடிமக்கள் மற்றும் நகராட்சி அதிகாரிகளுக்கு இடையிலான டிஜிட்டல் பாலம். சாலை பள்ளங்கள், சுகாதாரப் பிரச்சினைகள் மற்றும் பலவற்றை நொடிகளில் புகாரளிக்கவும்.',
      reportBtn: 'புகார் அளிக்கவும்',
      trackBtn: 'புகாரைக் கண்காணிக்கவும்',
      problemsTitle: 'பொதுவான குடிமைப் பிரச்சனைகள்',
      problemsSubtitle: 'பாரம்பரிய புகார் முறைகள் மெதுவானவை மற்றும் வெளிப்படைத்தன்மை இல்லாதவை. இந்த முக்கியமான பிரச்சனைகளை நாங்கள் தீர்க்கிறோம்:'
    },
    report: {
      title: 'குடிமைப் பிரச்சனையைப் புகாரளிக்கவும்',
      subtitle: 'உங்கள் பகுதியில் உள்ள ஒரு பிரச்சனையைப் புகாரளிக்க கீழே உள்ள படிவத்தை நிரப்பவும். விரைவான தீர்வுக்கு முடிந்தவரை விரிவான தகவல்களை வழங்கவும்.',
      fullName: 'முழு பெயர்',
      phone: 'தொலைபேசி எண்',
      email: 'மின்னஞ்சல் முகவரி',
      category: 'பிரச்சனை வகை',
      description: 'பிரச்சனை பற்றிய விவரம்',
      upload: 'புகைப்படத்தைப் பதிவேற்றவும்',
      location: 'இருப்பிடம்',
      detect: 'கண்டறி',
      submit: 'புகாரைச் சமர்ப்பிக்கவும்',
      reset: 'மீட்டமை'
    },
    howItWorks: {
      title: 'எப்படி செயல்படுகிறது',
      subtitle: 'CivicConnect குடிமைப் பிரச்சனைகளைப் புகாரளிப்பதை எளிமையாகவும், வெளிப்படையாகவும், பயனுள்ளதாகவும் ஆக்குகிறது. உங்கள் நகரத்தை சிறப்பாக்க இந்த படிகளைப் பின்பற்றவும்.',
      steps: [
        {
          title: 'அடையாளம் கண்டு படம் பிடிக்கவும்',
          desc: 'குழி அல்லது குப்பை போன்ற குடிமைப் பிரச்சினையைக் கண்டறியவும். உங்கள் ஸ்மார்ட்போனைப் பயன்படுத்தி தெளிவான புகைப்படத்தை எடுக்கவும்.'
        },
        {
          title: 'புகாரைச் சமர்ப்பிக்கவும்',
          desc: 'விவரங்களை நிரப்பவும். துல்லியத்திற்காக எங்கள் ஆப் தானாகவே உங்கள் ஜிபிஎஸ் இருப்பிடத்தைப் பிடிக்கும்.'
        },
        {
          title: 'சமூக சரிபார்ப்பு',
          desc: 'உங்கள் பகுதியில் உள்ள மற்ற குடிமக்கள் பிரச்சினையின் முன்னுரிமையை அதிகரிக்க வாக்களிக்கலாம் மற்றும் உறுதிப்படுத்தலாம்.'
        },
        {
          title: 'அதிகாரிகளின் நடவடிக்கை',
          desc: 'நகராட்சி அதிகாரிகள் புகாரைப் பெற்று சம்பந்தப்பட்ட துறைக்கு ஒதுக்குகிறார்கள்.'
        },
        {
          title: 'பிரச்சினை தீர்க்கப்பட்டது',
          desc: 'சரிசெய்யப்பட்டதும், உங்களுக்கு அறிவிப்பு வரும் மற்றும் பொது வரைபடத்தில் நிலை புதுப்பிக்கப்படும்.'
        }
      ],
      voiceTitle: 'ஸ்மார்ட்போன் இல்லையா? கவலை வேண்டாம்.',
      voiceDesc: 'உள்ளடக்கிய தொழில்நுட்பத்தை நாங்கள் நம்புகிறோம். ஸ்மார்ட்போன் இல்லாத குடிமக்கள் எங்கள் பிரத்யேக ஐவிஆர் எண்ணை அழைக்கலாம். எங்கள் AI குரல் அழைப்புகளை தானாகவே உரை புகார்களாக மாற்றுகிறது.'
    },
    about: {
      mission: 'எங்கள் நோக்கம்',
      title: 'ஸ்மார்ட் நகரங்களை இணைந்து உருவாக்குவோம்.',
      subtitle: 'ஒவ்வொரு குடிமகனுக்கும் தங்கள் நகரத்தின் உள்கட்டமைப்பில் பங்களிக்க நேரடி, வெளிப்படையான மற்றும் திறமையான வழி இருக்க வேண்டும் என்ற நம்பிக்கையில் CivicConnect நிறுவப்பட்டது. மக்களுக்கும் அரசாங்கத்திற்கும் இடையிலான இடைவெளியைக் குறைக்க நாங்கள் தொழில்நுட்பத்தைப் பயன்படுத்துகிறோம்.',
      resolved: 'தீர்க்கப்பட்ட சிக்கல்கள்',
      cities: 'உள்ளடக்கப்பட்ட நகரங்கள்',
      valuesTitle: 'எங்கள் முக்கிய மதிப்புகள்',
      valuesSubtitle: 'இந்தக் கொள்கைகள் CivicConnect இல் நாங்கள் செய்யும் அனைத்தையும் வழிநடத்துகின்றன.',
      values: [
        { title: 'வெளிப்படைத்தன்மை', desc: 'ஒவ்வொரு புகாரும் பொதுவானது மற்றும் கண்காணிக்கக்கூடியது. இனி மர்மமான புகார்கள் இல்லை.' },
        { title: 'திறன்', desc: 'நகராட்சித் துறைகளுக்கு நேரடி வழித்தடம் விரைவான பதில் நேரத்தை உறுதி செய்கிறது.' },
        { title: 'பங்கேற்பு', desc: 'குடிமக்கள் தங்கள் உள்ளூர் சூழலின் உரிமையைப் பெற அதிகாரம் அளித்தல்.' }
      ],
      visionTitle: '2030-க்கான எங்கள் பார்வை',
      visionDesc: '"கூட்டு குடிமக்கள் நுண்ணறிவு மற்றும் தானியங்கி நிர்வாகத்தின் மூலம் குடிமை உள்கட்டமைப்பு தானாகவே சீரமைக்கப்படும் உலகத்தை உருவாக்குவது."'
    },
    contact: {
      title: 'தொடர்பு கொள்ளவும்',
      subtitle: 'CivicConnect பற்றிய கேள்விகள் அல்லது கருத்துகள் உள்ளதா? உங்கள் நகரத்தை சிறப்பாக்க உங்களுக்கு உதவ நாங்கள் இங்கே இருக்கிறோம்.',
      infoTitle: 'தொடர்பு தகவல்',
      email: 'மின்னஞ்சல் அனுப்பவும்',
      phone: 'அழைக்கவும்',
      visit: 'நேரில் வரவும்',
      formName: 'முழு பெயர்',
      formEmail: 'மின்னஞ்சல் முகவரி',
      formSubject: 'பொருள்',
      formMessage: 'செய்தி',
      formSubmit: 'செய்தி அனுப்பவும்'
    },
    common: {
      loading: 'ஏற்றப்படுகிறது...',
      success: 'வெற்றி',
      error: 'பிழை'
    }
  }
};
