# for email configs
EMAIL_USE_TLS = True # 是否使用TLS安全传输协议(用于在两个通信应用程序之间提供保密性和数据完整性。)
# EMAIL_USE_SSL = False  # 是否使用SSL加密，qq企业邮箱要求使用
EMAIL_HOST = 'smtp.qq.com'
EMAIL_HOST_USER = "1043752141@qq.com"
EMAIL_HOST_PASSWORD = "luxljazwcewsbeeh" # Cautious! Real sending is ok but DON'T LEAK IT OUT!!!
EMAIL_PORT = 25
EMAIL_FROM = "Monager Team" # 看到的发件人
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'


# 163邮箱
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_USE_TLS = True  # 是否使用TLS安全传输协议(用于在两个通信应用程序之间提供保密性和数据完整性。)
# EMAIL_USE_SSL = False  # 是否使用SSL加密，qq企业邮箱要求使用
# EMAIL_HOST = 'smtp.163.com'  # 发送邮件的邮箱 的 SMTP服务器，这里用了163邮箱
# EMAIL_PORT = 25  # 发件箱的SMTP服务器端口
# EMAIL_HOST_USER = 'tingyuweilou@163.com'  # 发送邮件的邮箱地址
# EMAIL_HOST_PASSWORD = 'xxxxxx'  # 发送邮件的邮箱密码(这里使用的是授权码)
# EMAIL_TO_USER_LIST = ['xxxx@foxmail.com', 'xxx@qq.com']   # 此字段是可选的，用来配置收件人列表

# qq邮箱
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.qq.com'
# EMAIL_PORT = 25  # 端口默认都是25不需要修改
# EMAIL_HOST_USER = '760xxx146@qq.com'
# EMAIL_HOST_PASSWORD = 'xxxxxxxxxxxxxxxxxxxxxx'
# EMAIL_FROM = '152xxxx7756@sina.cn'