import subprocess
import time
import requests
import threading
import sys

def read_stream(stream, name):
    while True:
        line = stream.readline()
        if not line:
            break
        print(f"[{name}] {line.rstrip()}", flush=True)

print("Starting server...")
server = subprocess.Popen(["python", "server.py"], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, bufsize=1)

t1 = threading.Thread(target=read_stream, args=(server.stdout, "SERVER_OUT"), daemon=True)
t2 = threading.Thread(target=read_stream, args=(server.stderr, "SERVER_ERR"), daemon=True)
t1.start()
t2.start()

time.sleep(3)

base_url = "http://localhost:5000"

print("\n=== MAKING API REQUESTS ===\n")

try:
    print("1. POST /create_vector")
    r = requests.post(f"{base_url}/create_vector", json={"value": 5, "position": {"x": 100, "y": 100}})
    print(f"   Status: {r.status_code}")
    print(f"   Response: {r.text}\n")
    
    requests_list = [(0, 3), (1, 9), (2, 13), (3, 14), (4, 15)]
    for idx, (node_id, value) in enumerate(requests_list, 2):
        print(f"{idx}. POST /insert_vector (node_id={node_id}, value={value})")
        r = requests.post(f"{base_url}/insert_vector", json={"node_id": node_id, "value": value})
        print(f"   Status: {r.status_code}")
        print(f"   Response: {r.text}\n")
    
    print("7. POST /insertion-sort")
    r = requests.post(f"{base_url}/insertion-sort", json={})
    print(f"   Status: {r.status_code}")
    print(f"   Response: {r.text}\n")
    
except Exception as e:
    print(f"ERROR: {e}")
    import traceback
    traceback.print_exc()

time.sleep(3)
server.terminate()
server.wait(timeout=5)
print("Server stopped.")
