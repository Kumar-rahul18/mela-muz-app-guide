
import React from 'react';
import { useNavigate } from 'react-router-dom';

const History = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="app-gradient text-white px-4 py-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/')} 
            className="text-white font-bold text-xl bg-white/20 rounded-lg px-3 py-1 hover:bg-white/30 transition-colors"
          >
            ← 
          </button>
          <h1 className="text-lg font-semibold">इतिहास</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Baba Garib Nath Temple */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
              <span className="text-3xl text-white">🛕</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              बाबा गरीब नाथ धाम
            </h2>
          </div>

          {/* Temple Image */}
          <div className="mb-6 rounded-2xl overflow-hidden shadow-lg">
            <img
              src="https://jrnlegccgugofvnovqey.supabase.co/storage/v1/object/public/gallary-mages//Garibnath.jpg"
              alt="बाबा गरीब नाथ मंदिर"
              className="w-full h-64 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
              }}
            />
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              बाबा गरीब नाथ धाम मुजफ्फरपुर, बिहार में स्थित एक प्रसिद्ध शिव मंदिर है। यह मंदिर भगवान शिव को समर्पित है और विशेष रूप से श्रावण मास में यहाँ लाखों श्रद्धालु दर्शन के लिए आते हैं।
            </p>
            
            <p className="leading-relaxed">
              यह मंदिर अपनी चमत्कारिक शक्तियों के लिए प्रसिद्ध है। कहा जाता है कि यहाँ सच्चे मन से मांगी गई हर मनोकामना पूरी होती है। मंदिर का इतिहास कई सदियों पुराना है और यह स्थानीय लोकगीतों और किंवदंतियों में भी महत्वपूर्ण स्थान रखता है।
            </p>

            <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-400">
              <h3 className="font-semibold text-orange-800 mb-2">
                विशेषताएं:
              </h3>
              <ul className="space-y-1 text-sm text-orange-700">
                <li>• प्राचीन शिवलिंग की उपस्थिति</li>
                <li>• नित्य आरती और भजन</li>
                <li>• श्रद्धालुओं के लिए निःशुल्क भोजन</li>
                <li>• पवित्र जल की व्यवस्था</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Shravani Mela */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-3xl text-white">🎪</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              श्रावणी मेला का महत्व
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              श्रावणी मेला हिंदू पंचांग के अनुसार श्रावण मास में मनाया जाने वाला एक महत्वपूर्ण धार्मिक उत्सव है। यह मेला भगवान शिव की आराधना और कांवर यात्रा के साथ जुड़ा हुआ है।
            </p>

            <p className="leading-relaxed">
              इस दौरान लाखों कांवरिया गंगा नदी से पवित्र जल लेकर पैदल यात्रा करते हुए बाबा गरीब नाथ धाम पहुंचते हैं। यह यात्रा भक्ति, श्रद्धा और त्याग का प्रतीक है।
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  धार्मिक महत्व
                </h4>
                <p className="text-sm text-blue-700">
                  श्रावण मास को भगवान शिव का प्रिय महीना माना जाता है। इस माह में किया गया जप, तप और दान विशेष फलदायी होता है।
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">
                  सामाजिक एकता
                </h4>
                <p className="text-sm text-green-700">
                  यह मेला विभिन्न जाति, धर्म और वर्ग के लोगों को एक साथ लाता है, सामाजिक एकता और भाईचारे को बढ़ावा देता है।
                </p>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
              <h3 className="font-semibold text-purple-800 mb-2">
                मेले की गतिविधियां:
              </h3>
              <ul className="space-y-1 text-sm text-purple-700">
                <li>• सुबह-शाम की आरती</li>
                <li>• सांस्कृतिक कार्यक्रम</li>
                <li>• धार्मिक प्रवचन</li>
                <li>• भंडारा और प्रसाद वितरण</li>
                <li>• फोटो प्रतियोगिता</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            मेले में भाग लें
          </h3>
          <p className="text-gray-600 mb-4">
            इस पवित्र मेले का हिस्सा बनें और भगवान शिव का आशीर्वाद प्राप्त करें
          </p>
          <button 
            onClick={() => navigate('/events')}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-pink-600 transition-colors"
          >
            कार्यक्रम देखें
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;
