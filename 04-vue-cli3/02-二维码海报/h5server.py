import socket
import threading
import queue
import json

number_path = "/rest/getnumber"
create_path = "/rest/create"
number = 3000
data_source = "data.txt"
ajax_json = {"success": True, "data": number, "msg": "请求成功"}


class HttpRequest(object):

    def __init__(self):
        self.method = None
        self.url = None
        self.protocol = None
        self.head = dict()
        self.request_data = dict()
        self.response_line = ''
        self.response_head = dict()
        self.response_body = ''

    def passRequestLine(self, request_line):
        header_list = request_line.split(' ')
        self.method = header_list[0].upper()
        self.url = header_list[1]
        self.protocol = header_list[2]

    def passRequestHead(self, request_head):
        head_options = request_head.split('\r\n')
        for option in head_options:
            key, val = option.split(': ', 1)
            self.head[key] = val

    def passRequest(self, request):
        try:
            request = request.decode('utf-8')
            if len(request.split('\r\n', 1)) != 2:
                return
            request_line, body = request.split('\r\n', 1)
            request_head = body.split('\r\n\r\n', 1)[0]  # 头部信息
            self.passRequestLine(request_line)
            self.passRequestHead(request_head)

            if self.method == 'GET':
                if self.url.find('?') != -1:  # 含有参数的get
                    self.request_data = {}
                    request_temp = self.url.split('?', 1)
                    request_path = request_temp[0]
                    req = request_temp[1]
                    if (number_path == request_path or create_path == request_path):
                        parameters = req.split('&')
                        for i in parameters:
                            key, val = i.split('=', 1)
                            self.request_data[key] = val
                        self.doRequest(request_path)
                    else:
                        self.response_head['Content-Type'] = 'application/json; charset=UTF-8'
                        self.response_line = ErrorCode.OK
                        ajax_json["success"] = False
                        ajax_json["msg"] = "请求非法，404"
                        self.response_body = json.dumps(ajax_json)
                else:
                    if (number_path == self.url or create_path == self.url):
                        self.doRequest(self.url)
                    else:
                        self.response_head['Content-Type'] = 'application/json; charset=UTF-8'
                        self.response_line = ErrorCode.OK
                        ajax_json["success"] = False
                        ajax_json["msg"] = "请求非法，404"
                        self.response_body = json.dumps(ajax_json)
            else:
                self.response_head['Content-Type'] = 'application/json; charset=UTF-8'
                self.response_line = ErrorCode.OK
                ajax_json["success"] = False
                ajax_json["msg"] = "请求非法，请使用GET请求"
                self.response_body = json.dumps(ajax_json)
        except(Exception):
            self.response_head['Content-Type'] = 'application/json; charset=UTF-8'
            self.response_line = ErrorCode.OK
            ajax_json["success"] = False
            ajax_json["msg"] = "后台发生异常"
            self.response_body = json.dumps(ajax_json)

    def doRequest(self, url):
        self.response_head['Content-Type'] = 'application/json; charset=UTF-8'
        self.response_line = ErrorCode.OK

        global number
        if (number_path == url):
            ajax_json["data"] = number
            self.response_body = json.dumps(ajax_json)
            ajax_json["success"] = True
            ajax_json["msg"] = "请求成功"
        elif (create_path == url):
            number = number+1
            with open(data_source, 'r+') as fb:
                old = fb.readline().strip()
                fb.seek(0)
                fb.write(str(number)+"\n")
                fb.write(old)
                ajax_json["data"] = number
                self.response_body = json.dumps(ajax_json)
                ajax_json["success"] = True
                ajax_json["msg"] = "请求成功"
        else:
            pass

    def getResponse(self):
        print(self.response_line + dict2str(self.response_head) + '\r\n' + self.response_body+'\n')
        return self.response_line + dict2str(self.response_head) + '\r\n' + self.response_body


# 每个任务线程
class WorkThread(threading.Thread):
    def __init__(self, work_queue):
        super().__init__()
        self.work_queue = work_queue
        self.daemon = True

    def run(self):
        while True:
            func, args = self.work_queue.get()
            func(*args)
            self.work_queue.task_done()


# 线程池
class ThreadPoolManger():
    def __init__(self, thread_number):
        self.thread_number = thread_number
        self.work_queue = queue.Queue()
        for i in range(self.thread_number):  # 生成一些线程来执行任务
            thread = WorkThread(self.work_queue)
            thread.start()

    def add_work(self, func, *args):
        self.work_queue.put((func, args))


def tcp_link(sock, addr):
    print('Accept new connection from %s:%s...' % addr)
    request = sock.recv(1024)
    http_req = HttpRequest()
    http_req.passRequest(request)
    sock.send(http_req.getResponse().encode('utf-8'))
    sock.close()


def start_server():
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(('0.0.0.0', 9999))
    s.listen(10)
    thread_pool = ThreadPoolManger(5)
    print('listen in %s:%d' % ('10.139.199.133', 9999))
    while True:
        sock, addr = s.accept()
        thread_pool.add_work(tcp_link, *(sock, addr))


# 返回码
class ErrorCode(object):
    OK = "HTTP/1.1 200 OK\r\n"
    NOT_FOUND = "HTTP/1.1 404 Not Found\r\n"


# 将字典转成字符串
def dict2str(d):
    s = ''
    for i in d:
        s = s + i + ': ' + d[i] + '\r\n'
    return s

if __name__ == '__main__':
    with open(data_source, 'r+') as fb:
        old = fb.readline().strip()
        number = int(old)
    start_server()
    pass
