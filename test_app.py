import sys
import traceback
import py_compile
import os

project_dir = r"c:\Users\Matvey\Documents\Projects\patient_accounting_system"

print("1. Checking syntax of Python files in app/blueprints/admin...")
admin_dir = os.path.join(project_dir, "app", "blueprints", "admin")
has_syntax_errors = False
for filename in os.listdir(admin_dir):
    if filename.endswith(".py"):
        filepath = os.path.join(admin_dir, filename)
        try:
            py_compile.compile(filepath, doraise=True)
            print(f"[OK] syntax {filename}")
        except py_compile.PyCompileError as e:
            print(f"[ERROR] Syntax error in {filename}:")
            print(e)
            has_syntax_errors = True

print("\n2. Trying to initialize the Flask application...")
sys.path.insert(0, project_dir)

try:
    from app import create_app
    app = create_app()
    with app.app_context():
        # Try to print some routes to confirm they loaded
        routes = [str(rule) for rule in app.url_map.iter_rules() if str(rule).startswith('/admin/')]
        print(f"[OK] App initialized successfully. Found {len(routes)} admin routes.")
except Exception as e:
    print(f"[ERROR] Failed to initialize the app:")
    traceback.print_exc()
