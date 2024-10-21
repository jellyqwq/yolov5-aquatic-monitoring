import json
from re import DEBUG, sub
from flask import Flask, render_template, request, redirect, send_file, url_for, make_response
from werkzeug.utils import secure_filename, send_from_directory
import os
import subprocess
import logging


log = logger = logging
log.basicConfig(level=log.INFO,
                format='%(levelname)s-%(funcName)s-%(lineno)s-%(message)s')
app = Flask(__name__)


uploads_dir = os.path.join(app.instance_path, 'uploads')
processes_dir = os.path.join(app.instance_path, 'processes')
os.makedirs(uploads_dir, exist_ok=True)
os.makedirs(processes_dir, exist_ok=True)

@app.route("/")
def hello_world():
    return render_template('index.html')


@app.route("/detect", methods=['POST'])
def detect():
    if not request.method == "POST":
        return
    # log.info(request.content_type)
    log.info(request.files)
    if request.files.get('image', None):
        file = request.files['image']
    elif request.files.get('video', None):
        file = request.files['video']
    else:
        return json.dumps({"msg": "表单类型错误"}, ensure_ascii=False)
    
    file.save(os.path.join(uploads_dir, secure_filename(file.filename)))
    log.info(file.mimetype)
    subprocess.call(['python', 'detect.py',
                        '--source', os.path.join(uploads_dir, secure_filename(file.filename)),
                        '--project', processes_dir,
                        '--name', ''])
    return redirect(f'/src/{file.filename}')
    
def get_file_type(file_path):
    _, extension = os.path.splitext(file_path)
    if extension == '.jpg' or extension == '.jpeg' or extension == '.png':
        return 'image/' + extension.replace('.', '')
    elif extension == '.mp4' or extension == '.webm':
        return 'video/' +  extension.replace('.', '')
    else:
        return 0
        
@app.route('/src/<filename>')
def src(filename):
    if filename.find('/') > 0:
        return json.dumps({"msg": "路由错误"}, ensure_ascii=False)
    
    file_path = f'instance/processes/{filename}'
    if not os.path.exists(file_path):
        return json.dumps({"msg": "文件路径不存在"}, ensure_ascii=False)
    
    file_type = get_file_type(file_path)
    if not file_type:
        return json.dumps({"msg": "文件类型错误"}, ensure_ascii=False)
    
    data = open(file_path, 'rb').read()
    res = make_response(data)
    
    res.headers['Content-Type'] = file_type
    return res

if __name__ == '__main__':
    app.run(debug=True)

    # ffmpeg -i instance\processes\2023-06-16_00-21-50_2.mp4 instance\processes\2023-06-16_00-21-50_2.webm