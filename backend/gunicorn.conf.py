import os
bind = f"0.0.0.0:{os.environ.get('PORT', '5000')}"
workers = 1
threads = 2
worker_class = "sync"
timeout = 300
keepalive = 5
accesslog = "-"
errorlog = "-"
loglevel = "info"
preload_app = True
raw_env = ["PYTHONUNBUFFERED=1"]  # Force real-time logs
