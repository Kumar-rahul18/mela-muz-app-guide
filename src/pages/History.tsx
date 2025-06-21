
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const History = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

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
          <h1 className="text-lg font-semibold">{t('history')}</h1>
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
              {t('language') === 'hi' ? 'बाबा गरीब नाथ धाम' : 'Baba Garib Nath Dham'}
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              {t('language') === 'hi' 
                ? 'बाबा गरीब नाथ धाम मुजफ्फरपुर, बिहार में स्थित एक प्रसिद्ध शिव मंदिर है। यह मंदिर भगवान शिव को समर्पित है और विशेष रूप से श्रावण मास में यहाँ लाखों श्रद्धालु दर्शन के लिए आते हैं।'
                : 'Baba Garib Nath Dham is a renowned Shiva temple located in Muzaffarpur, Bihar. This temple is dedicated to Lord Shiva and attracts millions of devotees, especially during the month of Shravan.'
              }
            </p>
            
            <p className="leading-relaxed">
              {t('language') === 'hi'
                ? 'यह मंदिर अपनी चमत्कारिक शक्तियों के लिए प्रसिद्ध है। कहा जाता है कि यहाँ सच्चे मन से मांगी गई हर मनोकामना पूरी होती है। मंदिर का इतिहास कई सदियों पुराना है और यह स्थानीय लोकगीतों और किंवदंतियों में भी महत्वपूर्ण स्थान रखता है।'
                : 'This temple is famous for its miraculous powers. It is believed that every sincere wish made here gets fulfilled. The temple has a history spanning several centuries and holds an important place in local folklore and legends.'
              }
            </p>

            <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-400">
              <h3 className="font-semibold text-orange-800 mb-2">
                {t('language') === 'hi' ? 'विशेषताएं:' : 'Special Features:'}
              </h3>
              <ul className="space-y-1 text-sm text-orange-700">
                <li>• {t('language') === 'hi' ? 'प्राचीन शिवलिंग की उपस्थिति' : 'Presence of ancient Shivling'}</li>
                <li>• {t('language') === 'hi' ? 'नित्य आरती और भजन' : 'Daily aarti and bhajans'}</li>
                <li>• {t('language') === 'hi' ? 'श्रद्धालुओं के लिए निःशुल्क भोजन' : 'Free meals for devotees'}</li>
                <li>• {t('language') === 'hi' ? 'पवित्र जल की व्यवस्था' : 'Arrangement of holy water'}</li>
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
              {t('language') === 'hi' ? 'श्रावणी मेला का महत्व' : 'Importance of Shravani Mela'}
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="leading-relaxed">
              {t('language') === 'hi'
                ? 'श्रावणी मेला हिंदू पंचांग के अनुसार श्रावण मास में मनाया जाने वाला एक महत्वपूर्ण धार्मिक उत्सव है। यह मेला भगवान शिव की आराधना और कांवर यात्रा के साथ जुड़ा हुआ है।'
                : 'Shravani Mela is an important religious festival celebrated during the month of Shravan according to the Hindu calendar. This fair is associated with the worship of Lord Shiva and the Kanwar Yatra.'
              }
            </p>

            <p className="leading-relaxed">
              {t('language') === 'hi'
                ? 'इस दौरान लाखों कांवरिया गंगा नदी से पवित्र जल लेकर पैदल यात्रा करते हुए बाबा गरीब नाथ धाम पहुंचते हैं। यह यात्रा भक्ति, श्रद्धा और त्याग का प्रतीक है।'
                : 'During this time, millions of Kanwariyas carry holy water from the Ganges river and undertake a walking pilgrimage to reach Baba Garib Nath Dham. This journey symbolizes devotion, faith, and sacrifice.'
              }
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  {t('language') === 'hi' ? 'धार्मिक महत्व' : 'Religious Significance'}
                </h4>
                <p className="text-sm text-blue-700">
                  {t('language') === 'hi'
                    ? 'श्रावण मास को भगवान शिव का प्रिय महीना माना जाता है। इस माह में किया गया जप, तप और दान विशेष फलदायी होता है।'
                    : 'The month of Shravan is considered dear to Lord Shiva. Prayers, meditation, and charity performed during this month yield special benefits.'
                  }
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">
                  {t('language') === 'hi' ? 'सामाजिक एकता' : 'Social Unity'}
                </h4>
                <p className="text-sm text-green-700">
                  {t('language') === 'hi'
                    ? 'यह मेला विभिन्न जाति, धर्म और वर्ग के लोगों को एक साथ लाता है, सामाजिक एकता और भाईचारे को बढ़ावा देता है।'
                    : 'This fair brings together people from different castes, religions, and classes, promoting social unity and brotherhood.'
                  }
                </p>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
              <h3 className="font-semibold text-purple-800 mb-2">
                {t('language') === 'hi' ? 'मेले की गतिविधियां:' : 'Mela Activities:'}
              </h3>
              <ul className="space-y-1 text-sm text-purple-700">
                <li>• {t('language') === 'hi' ? 'सुबह-शाम की आरती' : 'Morning and evening aarti'}</li>
                <li>• {t('language') === 'hi' ? 'सांस्कृतिक कार्यक्रम' : 'Cultural programs'}</li>
                <li>• {t('language') === 'hi' ? 'धार्मिक प्रवचन' : 'Religious discourses'}</li>
                <li>• {t('language') === 'hi' ? 'भंडारा और प्रसाद वितरण' : 'Community feasts and prasad distribution'}</li>
                <li>• {t('language') === 'hi' ? 'फोटो प्रतियोगिता' : 'Photo contests'}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-orange-100 to-pink-100 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            {t('language') === 'hi' ? 'मेले में भाग लें' : 'Participate in the Mela'}
          </h3>
          <p className="text-gray-600 mb-4">
            {t('language') === 'hi'
              ? 'इस पवित्र मेले का हिस्सा बनें और भगवान शिव का आशीर्वाद प्राप्त करें'
              : 'Be a part of this sacred mela and receive the blessings of Lord Shiva'
            }
          </p>
          <button 
            onClick={() => navigate('/events')}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-6 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-pink-600 transition-colors"
          >
            {t('language') === 'hi' ? 'कार्यक्रम देखें' : 'View Events'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default History;
