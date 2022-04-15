'''
该文件调用百度API进行实时语音转写，并使用pyautogui实现语音控制功能
'''
import websocket

import threading
import time
import uuid
import json
import sys
import pyaudio #可以在https://github.com/intxcc/pyaudio_portaudio/releases 下载wheel再进行pip安装
import keyboard
import wave
import pyautogui

import react_native.src.core.voice_const as voice_const

pcm_file = "16k-0.pcm"

hotword = ["百度网盘", "账号", "密码"]

"""
1. 连接 ws_app.run_forever()
2. 连接成功后发送数据 on_open()
2.1 发送开始参数帧 send_start_params()
2.2 发送音频数据帧 send_audio()
2.3 库接收识别结果 on_message()
2.4 发送结束帧 send_finish()
3. 关闭连接 on_close()
库的报错 on_error()
"""

#通过图片找到对应位置并点击
def mouseClick(image, xoffset=0, clicks = 1):
    try:
        x, y = pyautogui.locateCenterOnScreen(image)
    except:
        print("未找到该图标")
    pyautogui.click(x+xoffset, y, clicks = clicks)
    time.sleep(1)

#从获取到的语音中找到关键词
def find_command(key):
    for word in hotword:
        if key.find(word) != -1:
            command = word
            return command
    return None

#发送开始帧
def send_start_params(ws):
    """
    开始参数帧
    :param websocket.WebSocket ws:
    :return:
    """
    req = {
        "type": "START",
        "data": {
            "appid": voice_const.APPID,  # 网页上的appid
            "appkey": voice_const.APPKEY,  # 网页上的appid对应的appkey
            "dev_pid": voice_const.DEV_PID,  # 识别模型
            "cuid": "python",  # 随便填不影响使用。机器的mac或者其它唯一id，百度计算UV用。
            "sample": 16000,  # 固定参数
            "format": "pcm"  # 固定参数
        }
    }
    body = json.dumps(req)
    ws.send(body, websocket.ABNF.OPCODE_TEXT)


def send_audio(ws):
    """
    发送二进制音频数据，注意每个帧之间需要有间隔时间
    :param  websocket.WebSocket ws:
    :return:
    """
    #音频流参数
    CHUNK = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    RATE = 16000
    #开启音频流
    p = pyaudio.PyAudio()
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

    print("开始录音,请说话......")
    frames = []
    while True:
        #读取音频流
        chunk = stream.read(CHUNK)
        frames.append(chunk)
        if keyboard.is_pressed(' '):
            break
        #发送音频帧
        ws.send(chunk, websocket.ABNF.OPCODE_BINARY)
        time.sleep(0.04)
    print("录音结束!")
    #关闭音频流
    stream.stop_stream()
    stream.close()
    p.terminate()
    #将读取到的音频保存至pcm_file
    wf = wave.open(pcm_file, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(p.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()
    ws_app.close()


def on_open(ws):
    """
    连接后发送数据帧
    :param  websocket.WebSocket ws:
    :return:
    """

    def run(*args):
        """
        发送数据帧
        :param args:
        :return:
        """
        send_start_params(ws)
        send_audio(ws)

    threading.Thread(target=run).start()


def on_message(ws, message):
    """
    接收服务端返回的消息
    :param ws:
    :param message: json格式，自行解析
    :return:
    """
    # res = str(message)
    res_dict = json.loads(message)
    if (res_dict["err_msg"] == 'OK'):
        if (res_dict["type"] != 'HEARTBREAT'):
            print(res_dict["result"])
            if (res_dict["type"] == "FIN_TEXT"):
                result = res_dict["result"]
                handle_voice_input(result)
    else:
        print(res_dict["err_msg"])

#处理语音转写结果并调用pyautogui进行对应的操作
def handle_voice_input(res):
    size = len(res)
    key_ls = []
    key_sec = False
    key_get = False
    i = 0
    key_cmd = ""
    cmd_ls = ["开始", "发送", "打开", "关闭", "输入"]

    while i < size:
        if res[i:i+4] == "小爱同学":
            i = i+4
            key_sec = True
            continue
        if (res[i:i+2] in cmd_ls) and key_sec:
            key_cmd = res[i:i+2]
            i = i+2
            key_get = True
            continue
        if key_get:
            key_ls.append(res[i])
            if (res[i:i+2] == "截图"):
                pyautogui.screenshot("image.png")
        i = i+1
    key = "".join(key_ls)
    command = find_command(key)
    # print(command)
    # print(key_cmd)
    if command == "百度网盘":
        if key_cmd == "打开":
            pyautogui.click(1745, 20)
            time.sleep(0.04)
            mouseClick("baidunet.png", clicks=2)
            
        elif key_cmd == "关闭":
            mouseClick("close.png")
        command = " "
        # x, y = pyautogui.locateCenterOnScreen(R"baidunet.png")
        # pyautogui.doubleClick(x, y)
    if command == "账号":
        # try:
        mouseClick("account.png")
        # except:
        #     mouseClick("account.png")
        num = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        text_ls = []
        for k in key_ls:
            if k in num:
                text_ls.append(k)
        text = "".join(text_ls)
        print(text)
        pyautogui.typewrite(text, interval=0.2)

    # if command == "密码":

    return key


if __name__ == "__main__":
    # websocket.enableTrace(True)
    uri = voice_const.URI + "?sn=" + str(uuid.uuid1())
    ws_app = websocket.WebSocketApp(uri,
                                    on_open=on_open,  # 连接建立后的回调
                                    on_message=on_message)  # 接收消息的回调
    ws_app.run_forever()