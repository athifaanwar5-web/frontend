import subprocess
import os
import sys
import time

def run_backend():
    print(">>> Initializing AI Recruitment Backend...")
    server_dir = os.path.join(os.getcwd(), 'server')
    # Use powershell to run multiple commands in one session
    cmd = f'cd {server_dir} && ..\\.venv\\Scripts\\activate && python manage.py runserver'
    return subprocess.Popen(['powershell', '-Command', cmd], creationflags=subprocess.CREATE_NEW_CONSOLE)

def run_frontend():
    print(">>> Igniting AI Recruitment Frontend...")
    client_dir = os.path.join(os.getcwd(), 'client')
    cmd = f'cd {client_dir} && npm run dev'
    return subprocess.Popen(['powershell', '-Command', cmd], creationflags=subprocess.CREATE_NEW_CONSOLE)

if __name__ == "__main__":
    print("="*60)
    print("         AI RECRUITMENT SYSTEM - ONE-CLICK LAUNCHER")
    print("="*60)
    
    try:
        # Start Backend
        back_proc = run_backend()
        time.sleep(3) # Wait for backend to initialize
        
        # Start Frontend
        front_proc = run_frontend()
        
        print("\n[SUCCESS] Systems are now online.")
        print(" -> Candidate Portal: http://localhost:3000")
        print(" -> Recruiter Admin:  http://localhost:3000/recruiter")
        print(" -> Backend API:      http://localhost:8000/api")
        print("\nKeep this window open to monitor system heartbeats.")
        print("Both servers are running in separate consoles. Close those consoles or this one to stop.")
        
        while True:
            time.sleep(1)
            
    except KeyboardInterrupt:
        print("\n>>> System shutdown initiated...")
        sys.exit(0)
    except Exception as e:
        print(f"\n[ERROR] Failed to launch: {e}")
        input("Press Enter to exit...")
