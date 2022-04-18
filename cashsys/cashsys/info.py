# for email configs
EMAIL_USE_TLS = True # 是否使用TLS安全传输协议(用于在两个通信应用程序之间提供保密性和数据完整性。)
# EMAIL_USE_SSL = False  # 是否使用SSL加密，qq企业邮箱要求使用
EMAIL_HOST = 'smtp.qq.com'
EMAIL_HOST_USER = "1043752141@qq.com"
EMAIL_HOST_PASSWORD = "luxljazwcewsbeeh" # Cautious! Real sending is ok but DON'T LEAK IT OUT!!!
EMAIL_PORT = 25
EMAIL_FROM = "Monager Team" # 看到的发件人
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
DEFAULT_FROM_EMAIL = 'Monager Team <1043752141@qq.com>'
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

