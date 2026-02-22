import requests
import sys
import time
import json

BASE_URL = "http://127.0.0.1:3000"

print("------------------------------------------------")
print("   🕵️‍♂️ IOT DIAGNOSTIC TOOL")
print("------------------------------------------------")

def test_connection():
    print(f"1. Attempting to connect to: {BASE_URL}/api/bins")
    
    try:
        response = requests.get(f"{BASE_URL}/api/bins", timeout=5)
        
        # Check Status Code
        print(f"2. Server responded with Status Code: {response.status_code}")
        
        # Check if response is JSON
        try:
            data = response.json()
            print(f"3. ✅ SUCCESS! Received valid JSON data.")
            print(f"   Found {len(data)} bins in the database.")
            return data
        except json.JSONDecodeError:
            print("\n❌ CRITICAL ERROR: Server returned HTML instead of JSON.")
            print("   This usually means the Server crashed or the Route is wrong.")
            print("   Here is the message from the server:\n")
            print("   " + "-"*40)
            # Print the first 300 characters of the HTML to see the error message
            print(response.text[:300]) 
            print("   " + "-"*40)
            sys.exit(1)
            
    except requests.exceptions.ConnectionError:
        print("\n❌ CONNECTION REFUSED.")
        print("   The script cannot find the server at http://127.0.0.1:3000")
        print("   👉 Did you forget to run 'node src/server.js'?")
        sys.exit(1)

# Run the test
bins = test_connection()

# If test passes, start simulation
print("\n✅ Diagnostics passed. Starting Simulation...")
import random

while True:
    try:
        target_bin = random.choice(bins)
        # Use _id for the update URL
        bin_id = target_bin.get('_id')
        
        if not bin_id:
            print("⚠️ Skipping bin with no ID...")
            continue

        new_fill = random.randint(0, 100)
        
        # Send Update
        res = requests.put(f"{BASE_URL}/api/bins/{bin_id}", json={'fillLevel': new_fill})
        
        if res.status_code == 200:
            print(f"📡 Updated {target_bin.get('serialNumber')}: {new_fill}%")
        else:
            print(f"⚠️ Server rejected update: {res.status_code}")
            
        time.sleep(2)
        
    except KeyboardInterrupt:
        print("Stopped.")
        break
    except Exception as e:
        print(f"Error: {e}")
        time.sleep(2)